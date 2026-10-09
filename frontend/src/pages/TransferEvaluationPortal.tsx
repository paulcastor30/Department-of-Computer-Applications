import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, FileCheck2, Upload } from "lucide-react";
import { evaluationRequest } from "@/lib/api";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";

interface CourseRow {
  record_id: number; code: string; title: string; units: string | null; grade: string;
  original_grade: string; completion_grade: string; semester: string; source_page: number;
  requires_review: boolean; source_note: string;
}
interface Course { code: string; title: string; units: string; year: number }
interface Configuration { curricula: { id: number; name: string }[]; campuses: { id: number; name: string }[] }
interface Draft { curriculum: string; rows: (CourseRow & { result: string; reason: string })[]; remaining: Course[]; elective_note: string }
interface Extraction {
  format: string; complete: boolean; pages: number; rows: CourseRow[];
  metadata: { full_name: string; current_program: string; school: string };
  issues: { message: string; severity: string; record_id?: number; page?: number }[];
}
interface Review { extraction: Extraction; draft: Draft; campus_id: number | null }
interface Receipt { reference: string; access_key: string; status: string; draft: Draft }
interface Status {
  reference: string; status: string; feedback: string; year_level: number | null;
  subjects: { code: string; title: string; decision: string }[]; remaining: Course[];
}
const inputClass = "mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";
const resultLabels: Record<string, string> = {
  proposed_credit: "Proposed credit", manual_review: "Adviser review", not_eligible: "No credit proposed",
};

function DraftSummary({ draft }: { draft: Draft }) {
  const count = draft.rows.filter(row => row.result === "proposed_credit").length;
  const reviewCount = draft.rows.filter(row => row.result === "manual_review").length;
  return <section aria-label="Draft evaluation" className="mt-6">
    <div className="grid gap-3 sm:grid-cols-3">
      {[[draft.rows.length, "Subject attempts read"], [count, "Proposed credits"], [reviewCount, "For adviser review"]].map(([value, label]) =>
        <div key={label} className="rounded-md bg-muted/50 p-4"><p className="text-2xl font-semibold text-primary">{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></div>)}
    </div>
    <p className="mt-4 text-sm leading-6 text-muted-foreground">The adviser checks the record and proposed credits. The chairperson makes the final decision, including available slots.</p>
    <details className="mt-4 border-t border-border pt-2">
      <summary className="min-h-11 cursor-pointer py-2 font-semibold">View extracted subjects</summary>
      <div className="mt-2 space-y-3">{draft.rows.map(row => <article key={row.record_id} className="rounded-md border border-border p-4">
        <div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold">{row.code} · {row.title}</h3><span className="text-sm text-primary">{resultLabels[row.result]}</span></div>
        <p className="mt-2 text-sm">Grade: {row.original_grade || "Not recorded"}{row.completion_grade && ` · Completion: ${row.completion_grade}`}{row.units !== null && ` · Earned units: ${row.units}`}</p>
        <p className="mt-1 text-xs text-muted-foreground">Page {row.source_page} · {row.semester}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{row.reason}</p>
      </article>)}</div>
    </details>
    <details className="border-t border-border pt-2"><summary className="min-h-11 cursor-pointer py-2 font-semibold">View remaining BSCA requirements</summary>
      <ul className="my-3 space-y-2">{draft.remaining.map(course => <li key={course.code} className="text-sm">{course.code} — {course.title}</li>)}</ul>
      <p className="mb-3 text-sm text-muted-foreground">{draft.elective_note}</p>
    </details>
  </section>;
}

export default function TransferEvaluationPortal() {
  const [config, setConfig] = useState<Configuration | null>(null);
  const [loadError, setLoadError] = useState("");
  const [mode, setMode] = useState<"apply" | "track">("apply");
  const [curriculum, setCurriculum] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [rows, setRows] = useState<CourseRow[]>([]);
  const [dirty, setDirty] = useState(false);
  const [editing, setEditing] = useState(false);
  const [person, setPerson] = useState({ full_name: "", current_program: "", school: "MSU-IIT", email: "", applicant_type: "shiftee", intended_term: "" });
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [reference, setReference] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let cancelled = false;
    evaluationRequest<Configuration>("configuration").then(data => {
      if (!cancelled) { setConfig(data); setCurriculum(String(data.curricula[0]?.id || "")); }
    }).catch(() => { if (!cancelled) setLoadError("The evaluation service is unavailable. Please try again later."); });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => { if (review) heading.current?.focus(); }, [review]);

  const run = async (operation: () => Promise<void>) => {
    setBusy(true); setError("");
    try { await operation(); } catch (err) { setError(err instanceof Error ? err.message : "Please try again."); }
    finally { setBusy(false); }
  };
  const readFile = async (selected: File, curriculumId = curriculum, corrections?: CourseRow[]) => {
    setConfirmed(false);
    await run(async () => {
      if (selected.size > 5 * 1024 * 1024) throw new Error("Choose a PDF no larger than 5 MB.");
      const body = new FormData(); body.append("document", selected); body.append("curriculum_id", curriculumId);
      if (corrections) body.append("rows", JSON.stringify(corrections));
      const result = await evaluationRequest<Review>("extract", body);
      setReview(result); setRows(result.draft.rows); setDirty(false);
      if (!corrections) setPerson(previous => ({ ...previous, ...result.extraction.metadata }));
    });
  };
  const selectFile = (selected: File | null) => {
    setFile(selected); setReview(null); setRows([]); setEditing(false); setConfirmed(false); setDirty(false);
    if (selected) void readFile(selected);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    void run(async () => {
      if (!file || !review || !confirmed || dirty) throw new Error("Review the record and confirm your details first.");
      const body = new FormData(); body.append("document", file);
      body.append("payload", JSON.stringify({ ...person, curriculum_id: Number(curriculum), campus_id: review.campus_id, within_msu: true, rows, confirmed }));
      const result = await evaluationRequest<Receipt>("submit", body);
      setReceipt(result); setReference(result.reference); setAccessKey(result.access_key);
      setFile(null); setReview(null); setRows([]);
    });
  };
  const saveReceipt = () => {
    if (!receipt) return;
    const url = URL.createObjectURL(new Blob([`BSCA evaluation\nReference: ${receipt.reference}\nAccess key: ${receipt.access_key}\nKeep these private. Check status at /admissions/transfer-evaluation.\n`], { type: "text/plain" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "bsca-evaluation-access.txt"; anchor.click(); URL.revokeObjectURL(url);
  };

  return <>
    <Seo title="BSCA shifting and transfer evaluation" description="Upload your evaluation of grades, review the draft, and follow department review." />
    <PageHero title="BSCA evaluation" subtitle="Upload your grades. Review the summary. Submit for department approval." />
    <Section><div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/admissions" className="text-link">Back to admissions</Link>
        <button type="button" className="text-link min-h-11" onClick={() => { setMode(mode === "apply" ? "track" : "apply"); setError(""); }}>
          {mode === "apply" ? "Check an existing request" : "Start an evaluation"}
        </button>
      </div>
      {error && <p role="alert" className="notice mb-5">{error}</p>}
      {mode === "track" ? <>
        <form onSubmit={event => { event.preventDefault(); void run(async () => { setStatus(null); setStatus(await evaluationRequest<Status>("status", { reference, access_key: accessKey })); }); }} className="rounded-md border border-border p-5 sm:p-7">
          <h2 className="text-2xl font-semibold text-primary">Check your evaluation</h2>
          <fieldset disabled={busy} className="mt-5 space-y-4">
            <label className="block">Reference number<input required className={inputClass} value={reference} onChange={e => { setReference(e.target.value); setStatus(null); }} autoComplete="off" /></label>
            <label className="block">Private access key<input required type="password" className={inputClass} value={accessKey} onChange={e => { setAccessKey(e.target.value); setStatus(null); }} autoComplete="off" /></label>
            <button className="action-link" type="submit">{busy ? "Checking…" : "Check status"}</button>
          </fieldset>
        </form>
        {status && <section className="mt-6 rounded-md border border-border p-5" aria-live="polite"><h2 className="text-2xl font-semibold text-primary">{status.status}</h2>
          {status.feedback ? <><p className="mt-4 whitespace-pre-line leading-7">{status.feedback}</p>{status.year_level && <p className="mt-3">Approved placement: Year {status.year_level}</p>}
            <details className="mt-4"><summary className="min-h-11 cursor-pointer py-2 font-semibold">View subject decisions</summary><ul className="space-y-3">{status.subjects.map((subject, n) => <li key={n}>{subject.code} · {subject.title}: {subject.decision}</li>)}</ul></details>
            <details className="mt-4"><summary className="min-h-11 cursor-pointer py-2 font-semibold">View remaining requirements</summary><ul className="space-y-2">{status.remaining.map(course => <li key={course.code}>{course.code} — {course.title}</li>)}</ul></details>
          </> : <p className="mt-4 leading-7">Feedback will appear here after the chairperson finalizes the decision.</p>}
        </section>}
      </> : receipt ? <section className="rounded-md border border-primary/30 bg-primary/5 p-5 sm:p-7" aria-live="polite">
        <FileCheck2 className="text-primary" aria-hidden="true" /><h2 className="mt-3 text-2xl font-semibold text-primary">Your request has been received</h2>
        <p className="mt-3 leading-7">Next: adviser review, then chairperson review. Save your access details to check the outcome.</p>
        <dl className="mt-5 space-y-4"><div><dt className="font-semibold">Reference number</dt><dd className="mt-1 break-all">{receipt.reference}</dd></div><div><dt className="font-semibold">Private access key</dt><dd className="mt-1 break-all font-mono text-sm">{receipt.access_key}</dd></div></dl>
        <button type="button" className="action-link mt-5" onClick={saveReceipt}><Download size={18} aria-hidden="true" />Save access details</button>
        <p className="mt-4 text-sm text-muted-foreground">Keep these private. Submission does not guarantee admission.</p>
      </section> : loadError ? <p className="notice" role="alert">{loadError} <Link to="/about/contact" className="text-link">Contact the department</Link>.</p> : !config ? <p role="status">Loading evaluation service…</p> : !config.curricula.length ? <p className="notice">The department has not configured an active prospectus yet.</p> : <>
        <section className="rounded-md border border-border p-5 sm:p-7">
          <div className="flex items-center gap-3"><Upload className="text-primary" aria-hidden="true" /><h2 className="text-xl font-semibold text-primary">1. Upload your evaluation of grades</h2></div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Use the original department or My.IIT PDF. Up to 5 MB and 25 pages. Your record is private.</p>
          <label className="mt-4 block">Evaluation PDF<input type="file" disabled={busy} accept="application/pdf,.pdf" className={`${inputClass} py-3`} onChange={e => selectFile(e.target.files?.[0] || null)} /></label>
          {config.curricula.length > 1 && <label className="mt-4 block">BSCA prospectus<select disabled={busy} className={inputClass} value={curriculum} onChange={e => { const id = e.target.value; setCurriculum(id); setReview(null); if (file) void readFile(file, id); }}>{config.curricula.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>}
          {busy && <p role="status" className="mt-4 text-sm">Reading and checking your record…</p>}
        </section>
        {review && <form onSubmit={submit} className="mt-6 rounded-md border border-border p-5 sm:p-7">
          <fieldset disabled={busy}>
            <h2 ref={heading} tabIndex={-1} className="text-xl font-semibold text-primary focus-visible:outline focus-visible:outline-primary">2. Review and submit</h2>
            <p className="mt-3 font-semibold">{person.full_name || "Name needs confirmation"}</p>
            <p className="mt-1 text-sm text-muted-foreground">{person.current_program} · {person.school}</p>
            <p className="mt-2 text-xs text-muted-foreground">{review.extraction.pages} pages checked · {review.extraction.format}</p>
            <DraftSummary draft={review.draft} />
            {review.extraction.issues.length > 0 && <p className="notice mt-4 text-sm">{review.extraction.issues.length} record note{review.extraction.issues.length === 1 ? "" : "s"} will be highlighted for the adviser, including completion grades or unclear entries. You can submit for review.</p>}
            <details className="mt-4"><summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold">Edit detected personal details</summary>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <label>Full name<input maxLength={150} className={inputClass} value={person.full_name} onChange={e => { setPerson({ ...person, full_name: e.target.value }); setConfirmed(false); }} /></label>
                <label>Current program<input maxLength={150} className={inputClass} value={person.current_program} onChange={e => { setPerson({ ...person, current_program: e.target.value }); setConfirmed(false); }} /></label>
              </div>
            </details>
            <button type="button" className="text-link min-h-11 text-sm" onClick={() => setEditing(!editing)}>{editing ? "Close corrections" : "Something was read incorrectly?"}</button>
            {editing && <section className="mt-3 space-y-4"><p className="text-sm leading-6">Correct only extraction errors. Original entries remain available to the adviser. Keep blank grades blank if none is recorded.</p>
              {rows.map((row, n) => <fieldset key={row.record_id} className="rounded-md bg-muted/50 p-4"><legend className="px-1 text-sm font-semibold">{row.code} · Page {row.source_page}</legend><p className="mb-3 text-xs">Original grade: {row.original_grade || "Not recorded"}{row.completion_grade && ` · Completion: ${row.completion_grade}`}</p>
                <div className="grid gap-3 sm:grid-cols-2">{([['code', 'Course number'], ['title', 'Course title'], ['grade', 'Grade']] as const).map(([field, label]) => <label key={field}>{label}<input aria-label={`${label} for entry ${n+1}`} maxLength={field === 'title' ? 200 : 30} className={inputClass} value={row[field]} onChange={e => { setRows(rows.map((item, index) => index === n ? { ...item, [field]: e.target.value } : item)); setDirty(true); setConfirmed(false); }} /></label>)}</div>
              </fieldset>)}
              <button type="button" className="action-link" disabled={!dirty || !file} onClick={() => { if (file) void readFile(file, curriculum, rows); }}>Update review</button>
            </section>}
            <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
              <label>Applicant type<select className={inputClass} value={person.applicant_type} onChange={e => setPerson({ ...person, applicant_type: e.target.value })}><option value="shiftee">Shiftee</option><option value="transferee">Transferee</option></select></label>
              <label>Email address<input required type="email" autoComplete="email" className={inputClass} value={person.email} onChange={e => setPerson({ ...person, email: e.target.value })} /></label>
              <label className="sm:col-span-2">Intended semester and academic year<input required maxLength={100} placeholder="e.g. First semester, AY 2027–2028" className={inputClass} value={person.intended_term} onChange={e => setPerson({ ...person, intended_term: e.target.value })} /></label>
            </div>
            <label className="mt-5 flex items-start gap-3 text-sm leading-6"><input type="checkbox" required className="mt-1 h-5 w-5 shrink-0" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} /><span>These are my records and my details are correct. I authorize the department to evaluate them.</span></label>
            {dirty && <p role="status" className="mt-3 text-sm">Update the review after correcting an entry before submitting.</p>}
            <button type="submit" className="action-link mt-5" disabled={!confirmed || busy || dirty || !person.full_name.trim() || !person.current_program.trim()}>{busy ? "Please wait…" : "Submit for evaluation"}<ArrowRight size={18} aria-hidden="true" /></button>
          </fieldset>
        </form>}
      </>}
    </div></Section>
  </>;
}

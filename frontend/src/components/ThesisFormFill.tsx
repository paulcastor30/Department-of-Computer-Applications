import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { fetchJSON, FormDownloadError, prepareFormPDF } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { useFormVisit, type FormCollection } from "./formVisitContext";

type FormField = { key: string; label: string; max_length: number; multiline: boolean; section?: string; choices?: { value: string; label: string }[] };
type FormSchema = { id: string; title: string; paper_size: string; filename: string; note?: string; fields: FormField[] };

export function DocumentFormFill({ programCode, formId, label }: { programCode: FormCollection; formId: string; label: string }) {
  const id = useId();
  const visit = useFormVisit();
  const draftKey = `${programCode}:${formId}`;
  const [restored, setRestored] = useState(() => Boolean(visit.drafts[draftKey]));
  const [open, setOpen] = useState(false);
  const [schema, setSchema] = useState<FormSchema>();
  const [loading, setLoading] = useState(false);
  const [retry, setRetry] = useState(0);
  const [values, setValues] = useState<Record<string, string>>(() => visit.drafts[draftKey] || {});
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [reused, setReused] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const visitRef = useRef(visit);
  visitRef.current = visit;
  const saved = visit.collections[programCode];
  const endpoint = `/api/academics/forms/${programCode.toLowerCase()}/${formId}/`;

  useEffect(() => {
    if (!open || schema) return;
    let ignore = false;
    setLoading(true);
    setError("");
    fetchJSON<FormSchema>(endpoint).then(data => {
      if (ignore) return;
      setSchema(data);
      const saved = visitRef.current.collections[programCode];
      if (saved?.enabled) {
        const common = Object.fromEntries(data.fields.filter(field => saved.values[field.key]).map(field => [field.key, saved.values[field.key]]));
        setValues(current => ({ ...common, ...current }));
        setReused(Object.keys(common).length > 0);
      }
    }).catch(() => { if (!ignore) setError("This form could not be loaded. Try again, or download the blank Word form."); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [endpoint, open, schema, programCode, retry]);

  useEffect(() => { if (open) headingRef.current?.focus(); }, [open]);
  useEffect(() => () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); }, [pdfUrl]);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
  useEffect(() => { if (pdfUrl) readyRef.current?.focus(); }, [pdfUrl]);

  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setFieldErrors({}); setPdfUrl(""); setBusy(true);
    try {
      const pdf = await prepareFormPDF(endpoint, values);
      if (mounted.current) setPdfUrl(URL.createObjectURL(pdf));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The PDF could not be prepared. Please try again.");
      if (cause instanceof FormDownloadError) setFieldErrors(cause.fields);
    } finally { setBusy(false); }
  }

  function change(key: string, value: string) {
    const next = { ...values, [key]: value };
    setValues(next);
    visit.saveDraft(draftKey, next);
    if (saved?.enabled) visit.remember(programCode, next);
    setPdfUrl("");
    setFieldErrors(current => { const next = { ...current }; delete next[key]; return next; });
  }

  function goToSection(section: string) {
    const target = document.getElementById(`${id}-${section}`);
    target?.focus();
    target?.scrollIntoView({ block: "start" });
  }

  function renderField(field: FormField) {
    const fieldId = `${id}-${field.key}`;
    const props = {
      id: fieldId, name: field.key, value: values[field.key] || "", maxLength: field.max_length,
      "aria-invalid": Boolean(fieldErrors[field.key]), "aria-describedby": `${fieldId}-help`,
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => change(field.key, event.target.value),
    };
    return <div key={field.key}>
      <label className="mb-2 block text-base font-semibold text-primary" htmlFor={fieldId}>{field.label}</label>
      {field.choices ? <select {...props} className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{field.choices.map(choice => <option key={choice.value} value={choice.value}>{choice.label}</option>)}</select> : field.multiline ? <textarea {...props} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" /> : <Input {...props} className="min-h-11 text-base md:text-base" inputMode={/email/i.test(field.label) ? "email" : /contact|phone/i.test(field.label) ? "tel" : "text"} />}
      <p id={`${fieldId}-help`} className={`mt-1 text-sm leading-6 ${fieldErrors[field.key] ? "font-semibold text-destructive" : "text-muted-foreground"}`}>{fieldErrors[field.key] || (field.choices ? "Choose an option, or leave unmarked." : `Up to ${field.max_length} characters; your entry must fit the printed blank.`)}</p>
    </div>;
  }
  const signatories = schema?.fields.filter(field => field.section === "Signatory names") || [];
  const details = schema?.fields.filter(field => field.section !== "Signatory names") || [];

  return <div className="mt-3">
    <button type="button" className="outline-link text-left" aria-expanded={open} aria-controls={`${id}-editor`} onClick={() => setOpen(current => !current)}>
      {open ? "Close online form" : "Fill out online"}<span className="sr-only"> — {label}</span>
    </button>
    {open && <section id={`${id}-editor`} aria-labelledby={`${id}-title`} className="mt-4 rounded-md border border-border bg-background p-4 sm:p-6">
      <h4 ref={headingRef} tabIndex={-1} id={`${id}-title`} className="text-lg font-semibold text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Fill out {schema?.title || label}</h4>
      <p className="mt-3 leading-7">Enter details → Review PDF → Download and print.</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">The original wording and layout stay fixed. You may enter the officials’ printed names. The named officials sign and make approval decisions after printing.</p>
      <details className="mt-3 text-sm leading-6 text-muted-foreground"><summary className="min-h-11 cursor-pointer py-2 font-semibold text-primary">Privacy and printing information</summary><p className="mt-2">Your entries are sent to the website only to prepare the PDF and are not saved by the server. Downloading does not submit the form. {schema ? `Print on ${schema.paper_size} at actual size (100%).` : "The paper size will appear when the form loads."} Existing images retain the quality of the original file. Your form entries stay in this tab while you browse the website; refreshing or closing the tab clears them.</p></details>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Your entries stay in this tab while you browse. Refreshing or closing the tab clears them.</p>
      {schema?.note && <p className="notice mt-4">{schema.note}</p>}
      {loading && <p className="mt-4" role="status">Loading form fields…</p>}
      {error && <div ref={errorRef} tabIndex={-1} role="alert" className="notice mt-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <p>{error}{fieldErrors._form && ` ${fieldErrors._form}`}</p>
        {Object.keys(fieldErrors).some(key => schema?.fields.some(field => field.key === key)) && <ul className="mt-2 space-y-1">{schema?.fields.filter(field => fieldErrors[field.key]).map(field => <li key={field.key}><button type="button" className="text-link min-h-11 py-2 text-left" onClick={() => document.getElementById(`${id}-${field.key}`)?.focus()}>Fix {field.label}</button></li>)}</ul>}
        {!schema && !loading && <button type="button" className="outline-link mt-3" onClick={() => setRetry(current => current + 1)}>Try loading the form again</button>}
      </div>}
      {schema && <form onSubmit={prepare} className="mt-5" aria-busy={busy}>
        <nav aria-label="Sections in this form" className="mb-5 flex flex-wrap gap-2">
          <button type="button" className="outline-link" onClick={() => goToSection("details")}>Form details</button>
          {signatories.length > 0 && <button type="button" className="outline-link" onClick={() => goToSection("names")}>Officials’ names</button>}
          <button type="button" className="outline-link" onClick={() => goToSection("review")}>Review and print</button>
        </nav>
        {restored && <p role="status" className="notice mb-4">Your entries in this form were kept while you browsed this tab. Check them and prepare a new PDF when ready.</p>}
        <p className="mb-4 text-sm leading-6 text-muted-foreground">All fields are optional. Leave unknown details blank. Enter at least one detail to prepare a filled PDF, or download the blank form.</p>
        <label className="mb-2 flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-border p-3 text-sm leading-6">
          <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-primary" checked={saved?.enabled || false} disabled={busy} onChange={event => visit.remember(programCode, values, event.target.checked)} />
          <span>Reuse common details in other {programCode === "REGISTRAR" ? "registrar" : programCode} forms during this visit.</span>
        </label>
        <p className="mb-5 text-sm leading-6 text-muted-foreground">Optional. Only names, student ID, degree and thesis details are reused in this tab. Turn this off to forget the reusable details. Refreshing or closing the tab clears them.</p>
        {reused && <p role="status" className="notice mb-5">Common details from this visit have been filled in. Check them before preparing your PDF.</p>}
        <fieldset disabled={busy} className="space-y-6">
          <legend id={`${id}-details`} tabIndex={-1} className="mb-4 scroll-mt-6 text-lg font-semibold text-primary">1. Form details</legend>
          {details.map(renderField)}
        </fieldset>
        {signatories.length > 0 && <fieldset disabled={busy} className="mt-8 space-y-6 border-t border-border pt-5">
          <legend id={`${id}-names`} tabIndex={-1} className="scroll-mt-6 px-1 text-lg font-semibold text-primary">2. Officials’ names (optional)</legend>
          <p className="text-sm leading-6 text-muted-foreground">Enter the names you know, including titles if needed. Typing a name is not a signature or approval. Leave signing dates, decisions, grades and fee assessments for the responsible people.</p>
          {signatories.map(renderField)}
        </fieldset>}
        <div className="mt-8 border-t border-border pt-5">
          <h5 id={`${id}-review`} tabIndex={-1} className="scroll-mt-6 text-lg font-semibold text-primary">{signatories.length ? "3" : "2"}. Review and print</h5>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Prepare your PDF, open it to check every page, then download or print from your PDF viewer.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="action-link" type="submit" disabled={busy || !Object.values(values).some(value => value.trim())}>{busy ? "Preparing PDF…" : "Prepare filled PDF"}</button>
            <button className="outline-link" type="button" disabled={busy} onClick={() => { setValues({}); setFieldErrors({}); setError(""); setPdfUrl(""); setReused(false); setRestored(false); visit.saveDraft(draftKey, {}); visit.remember(programCode, {}, false); }}>Clear entries</button>
          </div>
        </div>
        {pdfUrl && <div className="mt-5 border-t border-border pt-5">
          <h5 ref={readyRef} tabIndex={-1} className="font-semibold text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Your filled PDF is ready</h5>
          <p role="status" className="mt-2 leading-7">Review every page and the printed names. Print at actual size, then obtain the required signatures before submitting.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a className="outline-link" href={pdfUrl} target="_blank" rel="noopener noreferrer">Review filled PDF<span className="sr-only"> (opens in a new tab; print from the PDF viewer)</span></a>
            <a className="action-link" href={pdfUrl} download={schema.filename}>Download filled PDF</a>
          </div>
        </div>}
      </form>}
    </section>}
  </div>;
}

export const ThesisFormFill = DocumentFormFill;

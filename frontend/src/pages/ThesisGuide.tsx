import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { usePrograms } from "@/hooks/useAcademics";
import { DocumentFormFill } from "@/components/ThesisFormFill";
import { useFormVisit } from "@/components/formVisitContext";
import type { ProgramDocument } from "@/types/api";
import { DocumentAccessHelp } from "@/components/DocumentAccessHelp";
import { formUrl, thesisDisclaimer, thesisClearance, thesisForms, getThesisForm, getThesisFormSource, getThesisSourceNotes, thesisStages, thesisStartingPoints, type ThesisForm, type ThesisProgram } from "@/content/thesisProcess";

function PreparationChecklist({ items, title }: { items: string[]; title: string }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  return <fieldset className="mt-5">
    <legend className="mb-2 font-semibold">{title}</legend>
    <div className="space-y-1">{items.map(item => <label key={item} className="flex min-h-11 cursor-pointer items-start gap-3 rounded px-1 py-2 leading-7">
      <input type="checkbox" className="mt-1.5 h-5 w-5 shrink-0 accent-current" checked={checked.has(item)} onChange={event => setChecked(previous => {
        const next = new Set(previous);
        if (event.target.checked) next.add(item); else next.delete(item);
        return next;
      })} />
      <span>{item}</span>
    </label>)}</div>
  </fieldset>;
}

function FormCard({ form, program, documents }: { form: ThesisForm; program: ThesisProgram; documents: ProgramDocument[] }) {
  const source = getThesisFormSource(program, form.id);
  const path = (url: string) => { try { return decodeURIComponent(new URL(url, "https://msuiit-comapps.vercel.app").pathname); } catch { return ""; } };
  const document = source && documents.find(item => item.fillable_form_id && path(item.href) === path(formUrl(source)));
  return <article className="rounded-md border border-border bg-background p-4 sm:p-6">
    <p className="mb-2 font-semibold text-accent">{form.id === "submission" ? `Final submission · ${program}` : `Form ${form.id} · ${program}`}</p>
    <h3 className="text-xl font-semibold leading-7 text-primary">{form.title}</h3>
    <p className="mt-3 leading-7">{form.purpose}</p>
    <p className="mt-3 leading-7"><strong>When to use it:</strong> {form.when}</p>
      {document?.fillable_form_id && <DocumentFormFill key={`${program}-${document.fillable_form_id}`} programCode={program} formId={document.fillable_form_id} label={form.title} />}
    <PreparationChecklist items={form.requirements} title="Preparation checklist" />
    {form.roomBooking && <aside className="mt-5 rounded-md border-l-4 border-accent bg-muted p-4">
      <PreparationChecklist items={form.roomBooking.items} title={form.roomBooking.title} />
      <p className="mt-3 leading-7"><strong>Room-request deadline:</strong> {form.roomBooking.deadline}</p>
      <a className="outline-link mt-3" href={form.roomBooking.url}>Request a CCS room (official booking website)</a>
      {form.roomBooking.notes.map(note => <p key={note} className="mt-3 leading-7">{note}</p>)}
      <p className="mt-3 leading-7 text-muted-foreground">{form.roomBooking.source}</p>
    </aside>}
    {form.departmentRequirements && <aside className="mt-5 rounded-md border-l-4 border-accent bg-muted p-4">
      <PreparationChecklist items={form.departmentRequirements.items} title={form.departmentRequirements.title} />
      {form.departmentRequirements.notes.map(note => <p key={note} className="mt-3 leading-7">{note}</p>)}
      <p className="mt-3 leading-7 text-muted-foreground">{form.departmentRequirements.source}</p>
    </aside>}
    <h4 className="mt-5 font-semibold">Who signs / approves?</h4>
    <ul className="mt-2 list-disc space-y-2 pl-5 leading-7">{(form.approvals[program] || ["Confirm the current MSCA submission form and signatories with the graduate coordinator."]).map(approval => <li key={approval}>{approval}</li>)}</ul>
    {form.notes?.map(note => <p key={note} className="mt-4 leading-7 text-muted-foreground">{note}</p>)}
    {!source && form.id === "submission" && <aside className="mt-4 rounded-md border border-border bg-muted p-4 leading-7"><strong>Current form version</strong><p className="mt-2">The department confirms this checklist applies to MSCA too. The supplied MSCA submission document is an older OGS Form 14. Ask the graduate coordinator for the current form and signatories.</p><a className="text-link mt-3 inline-flex min-h-11 items-center" href="mailto:ccs.gs@g.msuiit.edu.ph?subject=MSCA%20thesis%20submission%20form">Request the current MSCA submission form</a><p><a className="text-link inline-flex min-h-11 items-center" href="https://sites.google.com/g.msuiit.edu.ph/ccsg/resources">Official CCS graduate resources</a></p></aside>}
    {source && <>
      <a className="outline-link mt-5" href={formUrl(source)}>Download {form.id === "submission" ? "Final requirements submission" : `Form ${form.id}`} ({program}, Word)</a>
      <details className="mt-4 border-t border-border pt-2">
        <summary className="min-h-11 cursor-pointer py-2 font-medium text-primary">Document information</summary>
        <dl className="mt-2 grid gap-2 leading-7"><div><dt className="font-semibold">Document code</dt><dd>{source.code}</dd></div><div><dt className="font-semibold">Revision / effective date</dt><dd>{source.revision} / {source.effectiveDate}</dd></div><div><dt className="font-semibold">Source status</dt><dd>{source.status}</dd></div></dl>
        {source.verificationNote && <p className="mt-3 leading-7">This document shares a code with Approval for Binding. Identify it by its title and confirm the current reference with the department.</p>}
      </details>
    </>}
  </article>;
}

export default function ThesisGuide() {
  const [params, setParams] = useSearchParams();
  const { program: visitProgram, chooseProgram } = useFormVisit();
  const program: ThesisProgram = params.get("program") === "MSCA" ? "MSCA" : params.get("program") === "BSCA" ? "BSCA" : visitProgram || "BSCA";
  const { data: programs, isError: formError } = usePrograms();
  const documents = programs?.find(item => item.code === program)?.documents || [];
  useEffect(() => { chooseProgram(program); }, [program, chooseProgram]);
  const [destination, setDestination] = useState("panel-formation");
  const initialStage = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
  const [current, setCurrent] = useState(thesisStages.some(stage => stage.id === initialStage) ? initialStage : "panel-formation");
  const [openStages, setOpenStages] = useState(new Set(thesisStages.some(stage => stage.id === initialStage) ? [initialStage] : []));
  const [query, setQuery] = useState("");
  const headingRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
  const detailsRefs = useRef<Record<string, HTMLDetailsElement | null>>({});
  // Jumping never marks a step complete. The guide records no approvals or personal data.
  function goToStage(id: string) {
    setCurrent(id);
    setOpenStages(previous => new Set([...previous, id]));
    if (detailsRefs.current[id]) detailsRefs.current[id]!.open = true;
    const heading = headingRefs.current[id];
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ block: "start", behavior: "instant" });
  }
  useEffect(() => {
    const onHash = () => { const id = window.location.hash.slice(1); if (thesisStages.some(stage => stage.id === id)) goToStage(id); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const search = query.trim().toLowerCase().replace(/^form\s+/, "");
  const graduateMatch = program === "MSCA" && !!search && ["027", "written examination", "comprehensive exam", "preliminary exam", "written examination committee"].some(term => term.includes(search));
  const results = search ? thesisStages.filter(stage => [stage.title, stage.description, ...stage.forms.flatMap(id => [id, thesisForms[id].title, thesisForms[id].purpose]), ...(stage.conditional ? [stage.conditional, thesisForms[stage.conditional].title] : []), ...(stage.clearance ? [stage.clearance.title, stage.clearance.message, stage.clearance.action] : [])].join(" ").toLowerCase().includes(search)) : [];
  return <>
    <Seo title="Thesis Process Guide" description="Follow BSCA and MSCA thesis steps, find the right forms, prepare requirements and understand proposal, defense and submission deadlines." />
    <PageHero title="Thesis Process Guide" subtitle="From panel formation to final submission. Know where you are, which form you need and what comes next." />
    <div className="container max-w-5xl py-8 md:py-12">
      <section aria-labelledby="choose-step" className="rounded-md border border-border bg-card p-5 sm:p-7">
        <fieldset><legend className="font-semibold text-primary">Choose your program</legend><div className="mt-2 flex flex-wrap gap-3">{(["BSCA", "MSCA"] as const).map(code => <label key={code} className="flex min-h-11 cursor-pointer items-center gap-3 rounded border border-border px-4 py-2 font-medium"><input type="radio" name="thesis-program" value={code} checked={program === code} onChange={() => { const next = new URLSearchParams(params); next.set("program", code); setParams(next, { replace: true, preventScrollReset: true }); }} className="h-5 w-5 accent-current" />{code} · {code === "BSCA" ? "Undergraduate" : "Graduate"}</label>)}</div></fieldset>
        <p className="mt-4 leading-7"><strong>{program} forms only.</strong> Fill supported forms here, or download the blank Word version. Matching form numbers do not make BSCA and MSCA documents interchangeable.</p>
        {formError && <p className="notice mt-4" role="status">Online forms could not be loaded. The original Word downloads and process instructions remain available.</p>}
        <h2 id="choose-step" className="mt-6 text-xl font-semibold text-primary">Where are you in the process?</h2>
        <form className="mt-3 flex flex-col gap-3 sm:flex-row" onSubmit={event => { event.preventDefault(); goToStage(destination); }}>
          <label className="sr-only" htmlFor="starting-point">Your current thesis situation</label>
          <select id="starting-point" value={destination} onChange={event => setDestination(event.target.value)} className="min-h-12 min-w-0 flex-1 rounded-md border border-input bg-background p-3 text-base">{thesisStartingPoints.map(([label, id]) => <option key={id} value={id}>{label}</option>)}</select>
          <button type="submit" className="action-link justify-center">Go to this step</button>
        </form>
        <p className="mt-4 leading-7 text-muted-foreground">Start with your current task. Expand a step for its checklist and signatures. Checkboxes are personal reminders for this visit; they do not submit forms or record official approval.</p>
        <details className="mt-3 border-t border-border pt-2"><summary className="min-h-11 cursor-pointer py-3 font-semibold">See all eight steps</summary><nav aria-label="Thesis steps"><ol className="grid gap-2 sm:grid-cols-2">{thesisStages.map((stage, index) => <li key={stage.id}><button type="button" onClick={() => goToStage(stage.id)} className="min-h-11 w-full rounded px-2 py-2 text-left text-link">{String(index + 1).padStart(2, "0")} · {stage.title}</button></li>)}</ol></nav></details>
        <div className="mt-5"><label htmlFor="form-search" className="font-semibold">Find a form or step</label><input id="form-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try 019, proposal, binding or panel" className="mt-2 block min-h-12 w-full rounded-md border border-input bg-background p-3 text-base" aria-describedby="search-help" /><p id="search-help" className="mt-2 leading-7 text-muted-foreground">Search the guide without hiding the main sequence.</p>
          {search && <><p role="status" className="mt-3">{results.length + (graduateMatch ? 1 : 0)} matching {results.length + (graduateMatch ? 1 : 0) === 1 ? "result" : "results"}.</p><ul className="mt-2">{results.map(stage => <li key={stage.id}><button type="button" className="text-link min-h-11 py-2 text-left" onClick={() => goToStage(stage.id)}>{stage.title}{stage.forms.length ? ` · ${[...stage.forms, ...(stage.conditional ? [stage.conditional] : [])].map(id => id === "submission" ? "Final submission" : `Form ${id}`).join(", ")}` : ""}</button></li>)}{graduateMatch && <li><a className="text-link inline-flex min-h-11 items-center" href="#graduate-examinations" onClick={() => { const disclosure = document.getElementById("graduate-examination-details") as HTMLDetailsElement | null; if (disclosure) disclosure.open = true; }}>Form 027 · Other graduate academic processes</a></li>}</ul></>}
        </div>
      </section>
      <p className="my-6 leading-7" role="status">Showing <strong>{program}</strong> guidance. <strong>Selected step:</strong> {thesisStages.find(stage => stage.id === current)?.title}. Your place is a navigation aid, not an official progress record.</p>
      <ol aria-label={`${program} thesis process`} className="thesis-timeline space-y-6">
        {thesisStages.map((stage, index) => <li key={stage.id} className={`relative rounded-md border bg-card p-5 sm:p-7 ${current === stage.id ? "border-primary" : "border-border"}`}>
          <div className="flex items-start gap-3"><span aria-hidden="true" className="thesis-stage-number flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-semibold">{String(index + 1).padStart(2, "0")}</span><div className="min-w-0"><p className="mb-1 text-sm font-semibold text-muted-foreground">Step {index + 1} of 8{current === stage.id ? " · Selected step" : ""}</p><h2 id={stage.id} ref={element => { headingRefs.current[stage.id] = element; }} tabIndex={-1} className="scroll-mt-28 text-xl font-semibold leading-7 text-primary sm:text-2xl">{stage.title}</h2></div></div>
          <p className="mt-4 leading-7">{stage.description}</p>
          <p className="mt-3 font-medium">{stage.forms.length ? stage.forms.map(id => id === "submission" ? "Final requirements submission" : `Form ${id}`).join(" · ") : "If revisions are required · no separate form"}</p>
          {stage.clearance && <aside aria-label={stage.clearance.title} className="mt-4 rounded-md border-l-4 border-accent bg-muted p-4 leading-7"><h3 className="font-semibold">{stage.clearance.title}</h3><p className="mt-2">{stage.clearance.message}</p><p className="mt-3 text-muted-foreground">{stage.clearance.source}</p></aside>}
          {stage.deadline && <aside aria-label="Deadline" className="mt-4 rounded-md border-l-4 border-accent bg-muted p-4 leading-7"><strong className="block">Deadline</strong>{stage.deadline}</aside>}
          <details ref={element => { detailsRefs.current[stage.id] = element; }} open={openStages.has(stage.id)} onToggle={event => { const isOpen = event.currentTarget.open; setOpenStages(previous => { if (previous.has(stage.id) === isOpen) return previous; const next = new Set(previous); if (isOpen) next.add(stage.id); else next.delete(stage.id); return next; }); }} className="mt-4 border-t border-border pt-2">
            <summary className="min-h-12 cursor-pointer py-3 font-semibold text-primary">View requirements <span className="sr-only">for {stage.title}</span></summary>
            <div className="mt-3 space-y-5">
              {stage.forms.map(id => <FormCard key={`${program}-${id}`} form={getThesisForm(program, id)} program={program} documents={documents} />)}
              {stage.notes?.map(note => <p key={note} className="leading-7">{note}</p>)}
              {stage.conditional && <details className="rounded-md border border-border p-4"><summary className="min-h-12 cursor-pointer py-3 font-semibold">Need to change your Adviser or a Panel Member? <span className="block font-normal">Only if a replacement is needed · Form 018</span></summary><div className="mt-4"><FormCard key={`${program}-018`} form={getThesisForm(program, stage.conditional)} program={program} documents={documents} /></div></details>}
            </div>
          </details>
          <p className="mt-5 border-t border-border pt-4 leading-7"><strong>What happens next?</strong> {stage.next}</p>
          {index < thesisStages.length - 1 && <button type="button" className="text-link mt-2 min-h-11 py-2 text-left" onClick={() => goToStage(thesisStages[index + 1].id)}>Go to step {index + 2}: {thesisStages[index + 1].title}</button>}
        </li>)}
      </ol>
      <aside className="mt-6 rounded-md border border-border bg-muted p-5 leading-7"><h2 className="text-xl font-semibold">Completion: {thesisClearance.completion}</h2><p className="mt-2">The department or graduate coordinator confirms completion through the applicable clearance process. This guide and its checkboxes do not record submission, approval or clearance.</p></aside>
      {program === "MSCA" && <section id="graduate-examinations" aria-labelledby="graduate-processes" className="mt-10 border-t border-border pt-8"><p className="font-semibold text-accent">For graduate students · Separate process</p><h2 id="graduate-processes" className="mt-2 text-2xl font-semibold">Other graduate academic processes</h2><p className="my-4 leading-7">Written / Comprehensive Examination is outside the thesis timeline. Follow your coordinator’s instructions about its applicability and schedule.</p><details id="graduate-examination-details" className="rounded-md border border-border bg-card p-5"><summary className="min-h-12 cursor-pointer py-3 font-semibold">Form 027 · Written Examination Committee</summary><div className="mt-4"><FormCard key="MSCA-027" form={getThesisForm("MSCA", "027")} program="MSCA" documents={documents} /></div></details></section>}
      <section aria-labelledby="guide-help" className="mt-10 border-t border-border pt-8"><h2 id="guide-help" className="text-2xl font-semibold">Need help with a form?</h2><p className="mt-3 leading-7">Ask your adviser or coordinator when an instruction or signature is unclear.</p><a className="text-link inline-flex min-h-11 items-center" href="mailto:ccs.ca@g.msuiit.edu.ph?subject=Thesis%20process%20guidance">Contact the department: ccs.ca@g.msuiit.edu.ph</a><DocumentAccessHelp context={`${program} thesis process forms`} /><nav aria-label="Related thesis resources" className="mt-5 flex flex-wrap gap-x-6 gap-y-2"><Link className="text-link min-h-11 py-2" to={`/programs/${program.toLowerCase()}#current-students`}>{program} program and form collection</Link><Link className="text-link min-h-11 py-2" to={`/resources?program=${program}#${program.toLowerCase()}-forms`}>Student &amp; faculty resources</Link></nav>
        <details className="mt-5 rounded-md border border-border p-4"><summary className="min-h-11 cursor-pointer py-2 font-semibold">Source notes and items requiring verification</summary><ul className="mt-3 list-disc space-y-3 pl-5 leading-7">{getThesisSourceNotes(program).map(note => <li key={note}>{note}</li>)}</ul></details>
        <p className="mt-6 leading-7 text-muted-foreground">{thesisDisclaimer}</p>
        <a className="text-link mt-5 inline-flex min-h-11 items-center" href="#choose-step">Back to step chooser</a>
      </section>
    </div>
  </>;
}

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { useSOJTGuide } from "@/hooks/useSOJTGuide";
import { sojtStepIds, sojtStatuses, type Requirement, type SOJTResponse } from "@/content/sojtProcess";

function RequirementList({ items }: { items: Requirement[] }) {
  return <ul className="mt-2 list-disc space-y-3 pl-5 leading-7">{items.map(item => <li key={item.text} data-policy-sources={item.sources.join(" ")}>{item.text}</li>)}</ul>;
}

function DeploymentChecklist({ items }: { items: Requirement[] }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  return <fieldset className="mt-6"><legend className="text-lg font-semibold">Pre-Deployment Checklist</legend>
    <p className="my-3 leading-7">CHED national safeguards below must be reconciled with current MSU-IIT/CCS instructions. Checkboxes are reminders for this visit; they do not verify documents or authorize training.</p>
    {items.map(item => <label key={item.text} data-policy-sources={item.sources.join(" ")} className="flex min-h-11 cursor-pointer items-start gap-3 py-3 leading-7"><input type="checkbox" className="mt-1.5 h-5 w-5 shrink-0 accent-current" checked={checked.has(item.text)} onChange={event => { const isChecked = event.target.checked; setChecked(previous => { const next = new Set(previous); if (isChecked) next.add(item.text); else next.delete(item.text); return next; }); }} /><span>{item.text}</span></label>)}
    <p className="mt-4 leading-7" data-policy-sources="Local">Request current endorsement, identification and other required document templates from the coordinator.</p>
  </fieldset>;
}

export default function SOJTGuide() {
  const { data, isPending } = useSOJTGuide();
  if (!data) return <>
    <Seo title="SOJT Process Guide" description="BSCA internship guidance and department contact information." />
    <PageHero title="SOJT Process Guide" subtitle="BSCA student internship" />
    <div className="container max-w-3xl py-8 md:py-12">
      {isPending ? <p role="status">Loading internship guidance…</p> : <>
        <p className="leading-7">Contact the department for current internship requirements, forms and placement guidance.</p>
        <Link className="action-link mt-5" to="/about/contact">Contact the department</Link>
      </>}
    </div>
  </>;
  return <PublishedSOJTGuide data={data} />;
}

function PublishedSOJTGuide({ data }: { data: SOJTResponse }) {
  const content = data.content;
  const [current, setCurrent] = useState("eligibility");
  const [status, setStatus] = useState("Not yet assessed");
  const [query, setQuery] = useState("");
  const headings = useRef<Record<string, HTMLHeadingElement | null>>({});
  const disclosures = useRef<Record<string, HTMLDetailsElement | null>>({});
  const goToStep = useCallback((id: string) => {
    if (!sojtStepIds.includes(id)) return;
    setCurrent(id);
    if (disclosures.current[id]) disclosures.current[id]!.open = true;
    headings.current[id]?.focus({ preventScroll: true });
    headings.current[id]?.scrollIntoView({ block: "start", behavior: "instant" });
    window.history.replaceState(window.history.state, "", `#${id}`);
  }, []);
  useEffect(() => {
    const onHash = () => { const id = window.location.hash.slice(1); if (sojtStepIds.includes(id)) goToStep(id); };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [goToStep]);
  const search = query.trim().toLowerCase();
  const results = search ? content.steps.filter(step => [step.title, step.purpose.text, step.gate.text, ...step.groups.flatMap(g => g.items.map(i => i.text)), ...step.documents.map(i => i.text), ...(step.id === "pre-deployment" ? content.checklist.map(i => i.text) : []), "SOJT OJT internship practicum"].join(" ").toLowerCase().includes(search)) : [];
  return <>
    <Seo title="SOJT Process Guide" description="Explore the ten BSCA internship stages: eligibility, orientation, HTE approval, Internship Plan, deployment safeguards, monitoring, evaluation and clearance." canonicalUrl="https://msuiit-comapps.vercel.app/sojt-guide" />
    <PageHero title="SOJT Process Guide" subtitle="BSCA student internship · Prepare, train under supervision, review and complete your academic requirement." />
    <div className="sojt-guide container max-w-5xl py-8 md:py-12">
      <section aria-labelledby="before-start" className="rounded-md border border-border bg-card p-5 sm:p-7">
        <h2 id="before-start" className="text-2xl font-semibold text-primary">Before you start</h2><p className="mt-3 leading-7" data-policy-sources="C14 DCA">{content.intro}</p>
        <p className="mt-4 leading-7"><strong>SOJT Coordinator: {content.coordinator}</strong></p>
        <p className="mt-2 leading-7" data-policy-sources="Staff"><a className="text-link inline-flex min-h-11 items-center" href="mailto:excelvan.jondonero@g.msuiit.edu.ph">Email the SOJT Coordinator: excelvan.jondonero@g.msuiit.edu.ph</a></p>
        <p className="mt-2 leading-7">Questions about requirements and placement should be coordinated with the SOJT Coordinator. <Link to="/about/contact" className="text-link">Contact the Department office for assistance</Link>.</p>
        <aside aria-label="Pre-deployment warning" className="mt-5 rounded-md border-l-4 border-accent bg-muted p-4 leading-7" data-policy-sources={content.warningSources.join(" ")}><strong>Before training begins</strong><p className="mt-2">{content.warning}</p></aside>
        <h3 className="mt-6 text-lg font-semibold">Where are you in the process?</h3>
        <form className="mt-3 flex flex-col gap-3 sm:flex-row" onSubmit={event => { event.preventDefault(); goToStep(sojtStatuses.find(s => s[0] === status)![1]); }}>
          <label htmlFor="sojt-status" className="sr-only">Your informational SOJT status</label><select id="sojt-status" className="min-h-12 min-w-0 flex-1 rounded-md border border-input bg-background p-3" value={status} onChange={event => setStatus(event.target.value)}>{sojtStatuses.map(([label]) => <option key={label}>{label}</option>)}</select>
          <button type="submit" className="action-link justify-center">Go to the relevant step</button>
        </form>
        <p className="mt-3 leading-7 text-muted-foreground">Select the status already confirmed by the responsible office to find your next task. This is a navigation aid. No student records are collected or saved, and selections do not establish eligibility, approval or clearance.</p>
        <label htmlFor="sojt-search" className="mt-5 block font-semibold">Find an SOJT topic</label><input id="sojt-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try HTE, MOA, training hours or Internship Plan" className="mt-2 min-h-12 w-full rounded-md border border-input bg-background p-3" aria-describedby="sojt-search-help" /><p id="sojt-search-help" className="mt-2 leading-7 text-muted-foreground">Search without hiding the ten-step sequence.</p>
        {search && <div className="mt-3"><p role="status">{results.length} matching steps.</p><ul>{results.map(step => <li key={step.id}><button className="text-link min-h-11 py-2 text-left" type="button" onClick={() => goToStep(step.id)}>{step.title}</button></li>)}</ul></div>}
      </section>
      <p className="my-6 leading-7" role="status"><strong>Selected step:</strong> {content.steps.find(s => s.id === current)?.title}. Expand a step for responsibilities and its completion gate.</p>
      <ol aria-label="BSCA SOJT process" className="thesis-timeline space-y-6">
        {content.steps.map((step, index) => <li key={step.id} aria-current={current === step.id ? "step" : undefined} data-policy-sources={step.sources.join(" ")} className={`relative rounded-md border bg-card p-5 sm:p-7 ${current === step.id ? "border-primary" : "border-border"}`}>
          <div className="flex items-start gap-3"><span aria-hidden="true" className="thesis-stage-number flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-semibold">{index + 1}</span><div className="min-w-0"><p className="mb-1 text-sm font-semibold text-muted-foreground">Step {index + 1} of 10{current === step.id ? " · Selected step" : ""}</p><h2 id={step.id} ref={el => { headings.current[step.id] = el; }} tabIndex={-1} className="scroll-mt-28 text-xl font-semibold leading-7 text-primary sm:text-2xl">{step.title}</h2></div></div>
          <p className="mt-4 leading-7" data-policy-sources={step.purpose.sources.join(" ")}><strong>Purpose:</strong> {step.purpose.text}</p>
          <p className="mt-3 rounded-md bg-muted p-4 leading-7" data-policy-sources={step.gate.sources.join(" ")}><strong>Completion gate:</strong> {step.gate.text}</p>
          <details ref={el => { disclosures.current[step.id] = el; }} className="mt-4 border-t border-border pt-2"><summary className="min-h-12 cursor-pointer py-3 font-semibold text-primary">View responsibilities and requirements <span className="sr-only">for step {index + 1}: {step.title}</span></summary><div className="mt-3 space-y-5">
            {step.groups.map(group => <section key={group.title}><h3 className="text-lg font-semibold">{group.title}</h3><RequirementList items={group.items} /></section>)}
            {step.documents.length > 0 && <section><h3 className="text-lg font-semibold">Documents and evidence</h3><RequirementList items={step.documents} /></section>}
            {step.id === "eligibility" && <a className="outline-link" href="/curricula/bsca-prospectus.pdf" data-policy-sources="Curriculum">Read the BSCA prospectus (PDF) · OJT entry on page 4</a>}
            {step.id === "pre-deployment" && <DeploymentChecklist items={content.checklist} />}
            <section><h3 className="text-lg font-semibold">Common risks</h3><ul className="mt-2 list-disc space-y-2 pl-5 leading-7">{step.risks.map(risk => <li key={risk}>{risk}</li>)}</ul></section>
          </div></details>
          <p className="mt-5 border-t border-border pt-4 leading-7"><strong>What happens next?</strong> {index < 9 ? "Proceed only after the responsible parties confirm the completion gate." : "The authorized office confirms academic closure and maintains restricted institutional records."}</p>
          {index < 9 && <button className="text-link mt-2 min-h-11 py-2 text-left" type="button" onClick={() => goToStep(content.steps[index + 1].id)}>Go to step {index + 2}: {content.steps[index + 1].title}</button>}
        </li>)}
      </ol>
      <section aria-labelledby="sojt-support" className="mt-10 rounded-md border border-border bg-muted p-5 sm:p-7" data-policy-sources="C16 C20 C22 DCA"><h2 id="sojt-support" className="text-2xl font-semibold">If something goes wrong</h2>
        <p className="mt-3 leading-7">Contact the SOJT Coordinator or appropriate institutional authority promptly about unsafe work, harassment, exploitation, unrelated assignments, supervisor conflict, significant plan changes, health concerns, schedule disruption, insufficient hours or HTE withdrawal/termination. In immediate danger or a health emergency, move to safety and seek emergency assistance first.</p>
        <p className="mt-3 leading-7">Ask the Department office for the appropriate confidential authority if the concern involves your coordinator or supervisor. CHED provides an HEI grievance mechanism and referral to CHEDRO where the HEI committee cannot resolve the issue or a committee member is involved; confirm the current institutional channel.</p>
        <p className="mt-3 leading-7">Describe what happened, dates and the affected learning activities through the approved private channel. Ask how attendance, plan changes, interruption or transfer will be handled before assuming hours will count. For planned early termination, section 16.2.10 requires written notice to the coordinator at least three working days before the last day; do not delay seeking urgent help.</p>
        <p className="mt-3 leading-7"><strong>Keep reports private.</strong> Do not put complaints, medical information, evaluations, student records or confidential agreements on this website. This page has no upload or complaint form.</p>
        <Link to="/about/contact" className="outline-link mt-4">Contact the Department office for SOJT support</Link>
      </section>
      <section aria-labelledby="sojt-sources" className="mt-10 border-t border-border pt-8"><h2 id="sojt-sources" className="text-2xl font-semibold">Policy and Sources</h2>
        <ul className="mt-3 space-y-3">{content.sources.filter(source => source.url).map(source => <li key={source.id} id={`source-${source.id}`}><a className="text-link inline-flex min-h-11 items-center" href={source.url}>{source.title}</a></li>)}</ul>
        <p className="mt-4 leading-7">Request current official forms from the SOJT Coordinator. CHED sample annexes are reference material.</p>
      </section>
      <nav aria-label="Related SOJT resources" className="mt-8 flex flex-wrap gap-x-6 gap-y-2"><Link to="/programs/bsca#current-students" className="text-link min-h-11 py-2">BSCA current-student guidance</Link><Link to="/resources" className="text-link min-h-11 py-2">Student &amp; faculty resources</Link><a href="#before-start" className="text-link min-h-11 py-2">Back to Before you start</a></nav>
    </div>
  </>;
}

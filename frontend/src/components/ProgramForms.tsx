import { FormSearch } from "@/components/FormSearch";
import { matchesFormQuery } from "@/lib/formSearch";
import { ThesisFormFill } from "@/components/ThesisFormFill";
import { useEffect, useState } from "react";
import { useFormVisit } from "@/components/formVisitContext";
import { thesisStepForForm } from "@/lib/formNavigation";
import { Link, useLocation } from "react-router-dom";
import type { ProgramDocumentLink, ProgramProfile } from "@/pages/programs/programData";

const groups = [
  ["PROPOSAL", "Prepare your thesis proposal"], ["DEFENSE", "Prepare for final defense"],
  ["COMPLETION", "Bind and submit your thesis"], ["EXAMINATION", "Apply for a written examination"],
  ["ADMISSION", "Apply for graduate admission"], ["READMISSION", "Return to your studies"],
  ["RECORDS", "Request academic records"], ["PAYMENT", "Prepare a payment slip"],
];

function formLabel(document: ProgramDocumentLink) {
  const parts = document.label.split(/\s+—\s+/);
  const reference = /^(?:FM-MSU-IIT-ACAD-\d+|(?:CCS )?Form \d+)$/i.test(parts[0]) ? parts.shift()! : "";
  const purpose = parts.join(" — ");
  if (/certificate of panel approval/i.test(purpose)) return { reference: /three-panel/i.test(purpose) ? "Three-panel template" : "Standard template", purpose: "Prepare your certificate of panel approval" };
  if (/graduate admission application/i.test(purpose)) return { reference: /2015/.test(purpose) ? "Supplied 2015 template" : "", purpose: "Apply for graduate admission" };
  const tasks: [RegExp, string][] = [
    [/nomination.*advisory panel/i, "Nominate your thesis advisory panel"],
    [/change of adviser/i, "Request a change of adviser or panel member"],
    [/proposal hearing/i, "Request approval for your proposal hearing"],
    [/approval of proposal/i, "Record approval of your thesis proposal"],
    [/nomination.*oral examination panel/i, "Nominate your final-defense panel"],
    [/approval for final defense/i, "Request approval for final defense"],
    [/panel oral examination report/i, "Record the panel’s final-defense decision"],
    [/oral examination report.*final defense/i, "Record an examiner’s final-defense assessment"],
    [/requirements submission/i, "Submit thesis completion requirements"],
    [/approval for binding/i, "Request approval to bind your thesis"],
    [/application for written examination/i, "Apply for a written examination"],
    [/nomination.*written examination committee/i, "Nominate your written-examination committee"],
    [/written examination report/i, "Record your written-examination results"],
    [/application for intention to graduate/i, "Apply for intention to graduate"],
    [/approval for readmission/i, "Request approval for readmission"],
    [/concept paper presentation/i, "Prepare for your concept-paper presentation"],
    [/concept paper template/i, "Prepare your concept paper"],
    [/recommendation for graduate admission/i, "Request a recommendation for graduate admission"],
    [/personal statement/i, "Prepare your personal statement"],
    [/returnees application/i, "Apply to return to the university"],
    [/transcript and Form 137-A/i, "Request your transcript or Form 137-A"],
    [/payment slip/i, "Prepare a payment slip"],
  ];
  return { reference, purpose: tasks.find(([pattern]) => pattern.test(purpose))?.[1] || purpose };
}

export function ProgramForms({ program }: { program: ProgramProfile }) {
  const [query, setQuery] = useState("");
  const matches = (document: ProgramDocumentLink) => matchesFormQuery(`Form ${document.label} ${formLabel(document).purpose}`, query);
  const forms = program.documents.filter(document => document.formGroup && document.href);
  if (!forms.length) return null;
  return <section id={`${program.code.toLowerCase()}-forms`} className="mt-8 max-w-4xl" aria-labelledby={`${program.code.toLowerCase()}-forms-title`}>
    <h3 id={`${program.code.toLowerCase()}-forms-title`} className="text-xl font-semibold text-primary">{program.code === "BSCA" ? "BSCA thesis proposal and defense forms" : "MSCA graduate forms"}</h3>
    <p className="mt-3 leading-7 text-muted-foreground">{program.code === "BSCA" ? "Use the undergraduate forms for your thesis proposal and final defense. Additional supplied completion forms are listed separately." : "This collection covers commonly used graduate forms, including thesis preparation, examinations and other student requests. It is not a complete list of requirements."}</p>
    <p className="mt-3 leading-7 text-muted-foreground">Find the task you need to complete. Official form codes appear below each name. Confirm versions, signatures and submission instructions with {program.code === "BSCA" ? "your thesis adviser or the department" : "your graduate coordinator"}. Word files need an application that opens DOC or DOCX files.</p>
    <FormSearch label={`Find a ${program.code} form`} hint="Search by task or form number, such as proposal, binding or 019." query={query} onChange={setQuery} count={forms.filter(matches).length} />
    <div className="mt-5 space-y-3">{groups.map(([key, label]) => {
      const items = forms.filter(document => document.formGroup === key);
      if (!items.length) return null;
      const tasks = Array.from(new Set(items.map(document => formLabel(document).purpose)));
      return <details key={key} hidden={!items.some(matches)} className="rounded-md border border-border p-5" open={Boolean(query) || key === "PROPOSAL" || key === "DEFENSE"}>
        <summary className="min-h-11 cursor-pointer font-semibold text-primary">{program.code === "BSCA" && key === "EXAMINATION" ? "Additional supplied examination form" : label}</summary>
        <ul className="mt-3 space-y-5">{tasks.map(purpose => {
          const variants = items.filter(document => formLabel(document).purpose === purpose);
          return <li key={purpose} hidden={!variants.some(matches)}>
            {variants.length > 1 && <><h4 className="font-semibold text-primary">{purpose}</h4><p className="mt-2 text-sm leading-6 text-muted-foreground">Alternative supplied templates. Ask your coordinator which version to use; both are not automatically required.</p></>}
            {variants.map(document => {
              const reference = formLabel(document).reference;
              const extension = document.href!.split("?")[0].split(".").pop()?.toUpperCase() || "file";
              return <div key={document.href} hidden={!matches(document)} className={variants.length > 1 ? "mt-3" : undefined}>
                <a className="text-link inline-flex min-h-11 items-center" href={document.href} download>
                  {variants.length > 1 ? "Download " : "Download form: "}{variants.length > 1 ? reference || purpose : purpose} ({extension})
                  <span className="sr-only"> — {program.code}{variants.length > 1 ? `: ${purpose}` : reference ? `, ${reference}` : ""}</span>
                </a>
                {(program.code === "BSCA" || program.code === "MSCA") && document.fillableFormId && <ThesisFormFill key={`${program.code}-${document.fillableFormId}`} programCode={program.code} formId={document.fillableFormId} label={purpose} />}
                {document.fillableFormId && thesisStepForForm(document.fillableFormId) && <Link className="text-link mt-2 inline-flex min-h-11 items-center" to={`/thesis-guide?program=${program.code}#${thesisStepForForm(document.fillableFormId)}`}>View the related thesis step<span className="sr-only"> — {purpose}</span></Link>}
                <p className="text-sm leading-6 text-muted-foreground">{program.code}{reference && variants.length === 1 ? ` · ${reference}` : ""} · {extension === "DOC" || extension === "DOCX" ? "Word document" : extension === "PDF" ? "PDF document" : "Image template"}</p>
                {document.note && document.note !== "Department-supplied form. Confirm the applicable version before use." && <p className="mt-1 text-sm leading-6 text-muted-foreground">{document.note}</p>}
              </div>;
            })}
          </li>;
        })}</ul>
      </details>;
    })}</div>
  </section>;
}

export function ProgramFormPicker({ programs }: { programs: ProgramProfile[] }) {
  const { hash, search } = useLocation();
  const visit = useFormVisit();
  const requested = new URLSearchParams(search).get("program");
  const fromHash = (value: string) => value === "#bsca-forms" ? "BSCA" : value === "#msca-forms" ? "MSCA" : "";
  const [selected, setSelected] = useState<string>(() => fromHash(hash) || (requested === "BSCA" || requested === "MSCA" ? requested : visit.program));
  useEffect(() => { const code = fromHash(hash); if (code) setSelected(code); }, [hash]);
  const program = programs.find(item => item.code === selected);
  const hasForms = Boolean(program?.documents.some(item => item.formGroup && item.href));
  useEffect(() => {
    if (hasForms && hash === `#${selected.toLowerCase()}-forms`) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash, selected, hasForms]);
  return <>
    <fieldset>
      <legend className="font-semibold text-primary">Which program are you enrolled in?</legend>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{programs.map(item => <label key={item.code} className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-md border p-4 ${selected === item.code ? "border-primary bg-background" : "border-border"}`}>
        <input className="mt-1 h-5 w-5 shrink-0 accent-primary" type="radio" name="form-program" value={item.code} checked={selected === item.code} onChange={() => { setSelected(item.code); if (item.code === "BSCA" || item.code === "MSCA") visit.chooseProgram(item.code); }} />
        <span><span className="block font-semibold text-primary">{item.code} · {item.level}</span><span className="mt-1 block text-sm leading-6 text-muted-foreground">{item.title}</span></span>
      </label>)}</div>
    </fieldset>
    <p role="status" className="mt-4 text-sm text-muted-foreground">{selected ? `Showing ${selected} forms only.` : "Choose a program to see its forms."}</p>
    {program && (hasForms ? <ProgramForms program={program} /> : <p className="notice mt-5">Forms could not be loaded. Contact the department for the applicable {selected} forms.</p>)}
  </>;
}

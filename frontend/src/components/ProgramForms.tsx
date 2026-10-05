import type { ProgramProfile } from "@/pages/programs/programData";

const groups = [
  ["PROPOSAL", "Thesis proposal"], ["DEFENSE", "Final defense"],
  ["COMPLETION", "Binding and completion"], ["EXAMINATION", "Written examination"],
  ["ADMISSION", "Graduate admission"], ["READMISSION", "Return and readmission"],
  ["RECORDS", "Academic records"], ["PAYMENT", "Payment"],
];

export function ProgramForms({ program }: { program: ProgramProfile }) {
  const forms = program.documents.filter(document => document.formGroup && document.href);
  if (!forms.length) return null;
  return <section id={`${program.code.toLowerCase()}-forms`} className="mt-8 max-w-4xl" aria-labelledby={`${program.code.toLowerCase()}-forms-title`}>
    <h3 id={`${program.code.toLowerCase()}-forms-title`} className="text-xl font-semibold text-primary">{program.code === "BSCA" ? "BSCA thesis proposal and defense forms" : "MSCA graduate forms"}</h3>
    <p className="mt-3 leading-7 text-muted-foreground">{program.code === "BSCA" ? "Use the undergraduate forms for your thesis proposal and final defense. Additional supplied completion forms are listed separately." : "This collection covers commonly used graduate forms, including thesis preparation, examinations and other student requests. It is not a complete list of requirements."}</p>
    <p className="mt-3 leading-7 text-muted-foreground">Download the form for your program. Confirm the applicable version, required signatures and submission instructions with {program.code === "BSCA" ? "your thesis adviser or the department" : "your graduate coordinator"}. Word files need an application that opens DOC or DOCX files.</p>
    <div className="mt-5 space-y-3">{groups.map(([key, label]) => {
      const items = forms.filter(document => document.formGroup === key);
      if (!items.length) return null;
      return <details key={key} className="rounded-md border border-border p-5" open={key === "PROPOSAL" || key === "DEFENSE"}>
        <summary className="min-h-11 cursor-pointer font-semibold text-primary">{label}</summary>
        <ul className="mt-3 space-y-4">{items.map(document => {
          const extension = document.href!.split("?")[0].split(".").pop()?.toUpperCase() || "file";
          return <li key={document.href}>
            <a className="text-link inline-flex min-h-11 items-center" href={document.href} download>Download {document.label} ({extension})</a>
            {document.note && <p className="mt-1 text-sm leading-6 text-muted-foreground">{document.note}</p>}
          </li>;
        })}</ul>
      </details>;
    })}</div>
  </section>;
}

import { DocumentAccessHelp } from "@/components/DocumentAccessHelp";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { usePrograms } from "@/hooks/useAcademics";
import { normalizePrograms } from "./programs/programData";
import { ProgramFormPicker } from "@/components/ProgramForms";
import { ProgramInquiry } from "./programs/ProgramInquiry";

export default function Resources() {
  const { data, isError } = usePrograms();
  const programs = normalizePrograms(data);
  return <>
    <Seo canonicalUrl="https://msuiit-comapps.vercel.app/resources" title="Student & faculty resources" description="Find program documents, thesis checklists, academic contacts and learning-support enquiries for the Department of Computer Applications." />
    <PageHero title="Student & faculty resources" subtitle="Quick access to study documents, thesis guidance and people who can help." />
    <Section id="program-documents">
      {isError && <p className="notice mb-6" role="status">The latest program documents could not be loaded. Reference links are shown; contact the department for current guidance.</p>}
      <SectionHeader title="Program documents and thesis guidance" className="mb-6" />
      <div className="grid gap-6 md:grid-cols-2">{programs.map(program => <article key={program.code} className="rounded-md border border-border p-6">
        <h3 className="text-xl font-semibold text-primary">{program.code}: {program.culminatingRequirement}</h3>
        <p className="mt-3 leading-7 text-muted-foreground">Find proposal, defense and manuscript-preparation steps. Ask your coordinator for current forms and submission dates.</p>
        <Link className="action-link mt-5" to={`/thesis-guide?program=${program.code}`}>View {program.code} Thesis Process Guide</Link>
        <ul className="mt-4 space-y-2">{program.documents.filter(document => !document.formGroup && document.href).map(document => <li key={`${document.label}-${document.href}`}><a className="text-link inline-flex min-h-11 items-center" href={document.href}>Open {document.label}</a></li>)}</ul>
      </article>)}</div>
      <p className="mt-6 max-w-prose leading-7 text-muted-foreground">University forms and graduate guides are also listed in the <a className="text-link" href="https://www.msuiit.edu.ph/offices/odgp/resources/index.php">graduate resources directory</a>. Confirm the applicable version with your coordinator.</p>
      <DocumentAccessHelp context="program documents and student forms" />
    </Section>
    <Section id="student-forms" variant="muted">
      <SectionHeader title="Download student forms" subtitle="Choose your degree: undergraduate and graduate forms are different." className="mb-5" />
      <ProgramFormPicker programs={programs} />
    </Section>
    <Section variant="muted">
      <SectionHeader title="Contacts and announcements" className="mb-5" />
      <nav aria-label="Academic contacts and updates" className="flex flex-wrap gap-x-6 gap-y-2">
        <Link className="text-link inline-flex min-h-11 items-center" to="/faculty">Faculty directory and contacts</Link>
        <Link className="text-link inline-flex min-h-11 items-center" to="/news">Department announcements</Link>
        <Link className="text-link inline-flex min-h-11 items-center" to="/about/contact">Department office</Link>
      </nav>
    </Section>
    <Section id="learning-support">
      <SectionHeader title="Advising and learning support" className="mb-5" />
      <ProgramInquiry />
    </Section>
  </>;
}

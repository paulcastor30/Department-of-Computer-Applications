import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { usePrograms } from "@/hooks/useAcademics";
import { ProgramInquiry } from "./ProgramInquiry";
import { hasProgramContent, normalizePrograms, placeholder, type ProgramProfile } from "./programData";

function ProgramCard({ program }: { program: ProgramProfile }) {
  return <article className="flex flex-col rounded-md border border-border bg-background p-6 md:p-8">
    <p className="mb-3 text-sm font-semibold text-secondary">{program.degreeLevelCode === "UNDERGRAD" ? "Bachelor’s degree (undergraduate)" : "Master’s degree (graduate)"} · {program.code}</p>
    <h2 className="mb-4 text-2xl font-semibold leading-snug text-primary">{program.title}</h2>
    <p className="mb-6 leading-7 text-muted-foreground">{hasProgramContent(program.summary) ? program.summary : `A graduate degree offered by the department. Detailed program information: ${placeholder}`}</p>
    <dl className="mb-6 border-t border-border pt-5"><dt className="font-semibold">Thesis requirement</dt><dd className="mt-1 leading-7 text-muted-foreground">{program.culminatingRequirement}</dd></dl>
    <Link className="action-link mt-auto self-start" to={program.route}>Explore {program.code}</Link>
  </article>;
}

export default function Programs() {
  const { data, isError } = usePrograms();
  const programs = normalizePrograms(data);
  const documents = programs.flatMap(program => program.documents.filter(document => document.href).map(document => ({ ...document, code: program.code })));
  return <>
    <Seo title="Academic Programs" description="Explore BSCA and MSCA at the Department of Computer Applications, MSU-IIT. Learn about each degree, thesis requirements, and how to ask about applying." />
    <PageHero title="Academic Programs" subtitle="Explore our undergraduate and graduate degrees in Computer Applications." />
    <Section>
      <p className="mb-8 max-w-3xl leading-7 text-muted-foreground">Computer Applications bridges computing and the physical world through software, firmware, and hardware. BSCA develops foundations in this field; MSCA advances it through specialized study and research.</p>
      {isError && <p className="notice mb-6" role="status">The latest program updates could not be loaded. Reference information is shown; contact the department for current details.</p>}
      <div className="grid gap-6 lg:grid-cols-2">{programs.map(program => <ProgramCard key={program.code} program={program} />)}</div>
    </Section>
    <Section id="official-documents" variant="muted">
      <SectionHeader title="Curriculum and documents" className="mb-5" />
      {documents.length ? <ul className="space-y-3">{documents.map(document => <li key={`${document.code}-${document.label}-${document.href}`}><a className="outline-link" href={document.href}>Open {document.label.startsWith(document.code) ? document.label : `${document.code}: ${document.label}`}</a></li>)}</ul> : <p className="max-w-3xl leading-7 text-muted-foreground">Official curricula, admission guides, and student handbooks: {placeholder} Contact the department for current documents.</p>}
    </Section>
    <Section id="program-inquiries">
      <SectionHeader title="Need help choosing or applying?" className="mb-5" />
      <ProgramInquiry />
    </Section>
  </>;
}

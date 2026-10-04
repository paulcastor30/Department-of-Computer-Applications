import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { ProgramInquiry } from "./ProgramInquiry";
import { availableProgramItems, hasProgramContent, placeholder, type ProgramProfile } from "./programData";

type ProgramDetailPageProps = {
  program: ProgramProfile;
  isError: boolean;
  pageSubtitle: string;
  goalsTitle: string;
  outcomesTitle: string;
  areasTitle: string;
  thesisTitle: string;
  pathwaysTitle: string;
  advisingTitle: string;
};

function ListPanel({ title, items, nested = false }: { title: string; items: string[]; nested?: boolean }) {
  const available = availableProgramItems(items);
  if (!available.length) return null;
  const Heading = nested ? "h3" : "h2";
  return <section>
    <Heading className="mb-4 text-xl font-semibold text-primary">{title}</Heading>
    <ul className="list-disc space-y-3 pl-5 leading-7 text-muted-foreground">
      {available.map(item => <li key={item}>{item}</li>)}
    </ul>
  </section>;
}

export function ProgramDetailPage({ program, isError, pageSubtitle, goalsTitle, outcomesTitle, areasTitle, thesisTitle, pathwaysTitle, advisingTitle }: ProgramDetailPageProps) {
  const areas = availableProgramItems(program.academicAreas);
  const structure = availableProgramItems(program.curriculumStructure);
  const outcomes = availableProgramItems(program.outcomes);
  const documents = program.documents.filter(document => document.href || hasProgramContent(document.note));
  const extraPanels = [
    { title: goalsTitle, items: program.goals },
    { title: "Program educational objectives", items: program.peos },
    { title: pathwaysTitle, items: program.pathways },
    { title: advisingTitle, items: program.studentSupport },
    { title: "Academic progression and advising", items: program.progression },
  ].filter(panel => availableProgramItems(panel.items).length);
  return <>
    <Seo title={program.seoTitle} description={hasProgramContent(program.summary) ? program.summary : program.seoDescription}
      ogTitle={program.ogTitle} ogDescription={program.ogDescription} canonicalUrl={program.canonicalUrl || undefined} />
    <PageHero title={program.title} subtitle={pageSubtitle} />
    <Section>
      <Link className="text-link mb-6 inline-flex min-h-11 items-center" to="/programs">All academic programs</Link>
      {isError && <p className="notice mb-6" role="status">The latest program updates could not be loaded. Reference information is shown; contact the department before applying.</p>}
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-primary">About this degree</h2>
          <p className="leading-7 text-muted-foreground">{hasProgramContent(program.summary) ? program.summary : `The department offers ${program.title} (${program.code}), a ${program.level.toLowerCase()} degree. Detailed program introduction: ${placeholder}`}</p>
          {hasProgramContent(program.intendedLearners) && <p className="mt-4 leading-7 text-muted-foreground">{program.intendedLearners}</p>}
        </div>
        <dl className="space-y-5 rounded-md border border-border bg-muted/30 p-6">
          {[["Degree level", program.level], ["Program abbreviation", program.code], ["Thesis requirement", program.culminatingRequirement]].map(([label, value]) => <div key={label}><dt className="font-semibold">{label}</dt><dd className="mt-1 leading-7 text-muted-foreground">{value}</dd></div>)}
        </dl>
      </div>
      <nav aria-label={`${program.code} page sections`} className="mt-8 flex flex-wrap gap-3">
        {(areas.length > 0 || structure.length > 0) && <a className="outline-link" href="#study">What you will study</a>}
        <a className="outline-link" href="#before-applying">Before applying</a>
        <a className="outline-link" href="#program-inquiries">Ask about {program.code}</a>
      </nav>
    </Section>
    {(areas.length > 0 || structure.length > 0) && <Section id="study" variant="muted">
      <SectionHeader title="What you will study" subtitle="An introduction to the learning areas. Refer to the official curriculum for courses and requirements." />
      <div className="grid gap-10 lg:grid-cols-2">
        <ListPanel title={areasTitle} items={areas} nested />
        <ListPanel title="How the learning develops" items={structure} nested />
      </div>
    </Section>}
    {(outcomes.length > 0 || extraPanels.length > 0) && <Section>
      {outcomes.length > 0 && <details className="max-w-4xl rounded-md border border-border p-5">
        <summary className="min-h-11 cursor-pointer text-xl font-semibold text-primary">{outcomesTitle}</summary>
        <p className="mb-5 mt-3 text-sm text-muted-foreground">The abilities students are expected to develop through this degree.</p>
        <ol className="list-decimal space-y-4 pl-6 leading-7 text-muted-foreground">{outcomes.map(item => <li key={item}>{item}</li>)}</ol>
      </details>}
      {extraPanels.length > 0 && <div className="mt-8 grid gap-10 lg:grid-cols-2">{extraPanels.map(panel => <ListPanel key={panel.title} {...panel} />)}</div>}
    </Section>}
    <Section id="before-applying" variant="muted">
      <SectionHeader title="Before applying" />
      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <h3 className="mb-3 text-xl font-semibold text-primary">{thesisTitle}</h3>
          <ul className="space-y-3 leading-7 text-muted-foreground">{availableProgramItems(program.thesisInformation).map(item => <li key={item}>{item}</li>)}</ul>
          <dl className="mt-6 space-y-4">
            {[["Duration", program.duration], ["Required units", program.units]].map(([label, value]) => <div key={label}><dt className="font-semibold">{label}</dt><dd className="mt-1 text-muted-foreground">{value || placeholder}</dd></div>)}
          </dl>
        </section>
        <section>
          <h3 className="mb-3 text-xl font-semibold text-primary">Admission information</h3>
          {availableProgramItems(program.admissions).length ? <ul className="list-disc space-y-3 pl-5 leading-7 text-muted-foreground">{availableProgramItems(program.admissions).map(item => <li key={item}>{item}</li>)}</ul> : <p className="leading-7 text-muted-foreground">Entry requirements and application instructions: {placeholder}</p>}
          <p className="mt-4 leading-7 text-muted-foreground">Contact the department to confirm current fees, application dates, and available support before applying.</p>
          {hasProgramContent(program.contactInformation) && <p className="mt-4 whitespace-pre-line leading-7">{program.contactInformation}</p>}
        </section>
      </div>
      <section className="mt-10 border-t border-border pt-8">
        <h3 className="mb-4 text-xl font-semibold text-primary">Curriculum and documents</h3>
        {documents.length ? <ul className="space-y-3">{documents.map(document => <li key={`${document.label}-${document.href}`}>
          {document.href ? <a className="outline-link" href={document.href}>Open {document.label}</a> : <p className="leading-7"><strong>{document.label}:</strong> {document.note}</p>}
        </li>)}</ul> : <p className="leading-7 text-muted-foreground">Official curriculum and program guides: {placeholder}</p>}
      </section>
    </Section>
    <Section id="program-inquiries">
      <SectionHeader title={`Questions about ${program.code}?`} />
      <ProgramInquiry code={program.code} />
    </Section>
  </>;
}

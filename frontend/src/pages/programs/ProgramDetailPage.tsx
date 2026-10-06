import { DocumentAccessHelp } from "@/components/DocumentAccessHelp";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { ProgramForms } from "@/components/ProgramForms";
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
  const reviewedDate = new Date(`${program.reviewedOn}T00:00:00Z`);
  const reviewedLabel = Number.isNaN(reviewedDate.getTime()) ? null : new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(reviewedDate);
  const areas = availableProgramItems(program.academicAreas);
  const structure = availableProgramItems(program.curriculumStructure);
  const outcomes = availableProgramItems(program.outcomes);
  const guides = program.documents.filter(document => !document.formGroup && document.documentType === "HANDBOOK" && document.href);
  const contacts = program.documents.filter(document => !document.formGroup && document.documentType === "CONTACT" && document.href);
  const documents = program.documents.filter(document => !document.formGroup && !["HANDBOOK", "CONTACT"].includes(document.documentType || "") && (document.href || hasProgramContent(document.note)));
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
          {[["Degree level", program.degreeLevelCode === "UNDERGRAD" ? "Bachelor’s degree (undergraduate)" : "Master’s degree (graduate)"], ["Program abbreviation", program.code], ["Thesis requirement", program.culminatingRequirement]].map(([label, value]) => <div key={label}><dt className="font-semibold">{label}</dt><dd className="mt-1 leading-7 text-muted-foreground">{value}</dd></div>)}
        </dl>
      </div>
      <dl aria-label="Study commitment" className="mt-8 grid gap-6 rounded-md border border-border p-6 md:grid-cols-2">
        <div><dt className="font-semibold">Study sequence</dt><dd className="mt-2 leading-7 text-muted-foreground">{program.duration}</dd></div>
        <div><dt className="font-semibold">Study load</dt><dd className="mt-2 leading-7 text-muted-foreground">{program.units.replace(" Confirm your applicable plan with the department.", "")}</dd></div>
      </dl>
      <nav aria-label={`${program.code} page sections`} className="mt-8 flex flex-wrap gap-3">
        {(areas.length > 0 || structure.length > 0) && <a className="outline-link" href="#study">What you will study</a>}
        <a className="outline-link" href="#requirements">Key requirements</a>
        <a className="outline-link" href="#before-applying">Before applying</a>
        <a className="outline-link" href="#current-students">For current students</a>
        <a className="outline-link" href="#program-inquiries">Ask about {program.code}</a>
      </nav>
    </Section>
    {(areas.length > 0 || structure.length > 0) && <Section id="study" variant="muted">
      <SectionHeader title="What you will study" subtitle="An introduction to the learning areas and study sequence in Computer Applications." />
      <div className="grid gap-10 lg:grid-cols-2">
        <ListPanel title={areasTitle} items={areas} nested />
        <ListPanel title="How the learning develops" items={structure} nested />
      </div>
    </Section>}
    <Section id="requirements">
      <SectionHeader title="Study and completion requirements" className="mb-6" />
      <p className="mb-5 max-w-3xl leading-7 text-muted-foreground">These highlights explain the study commitment. Read the full prospectus for the course sequence and ask the department which study plan applies to you.</p>
      <ul className="max-w-4xl list-disc space-y-3 pl-5 leading-7 text-muted-foreground">{availableProgramItems(program.completionRequirements).map(item => <li key={item}>{item}</li>)}</ul>
      <details className="mt-8 max-w-4xl rounded-md border border-border p-5">
        <summary className="min-h-11 cursor-pointer font-semibold text-primary">Understanding units and study plans</summary>
        <dl className="mt-4 space-y-5">{availableProgramItems(program.studyTerms).map(item => {
          const separator = item.indexOf(":");
          const term = separator >= 0 ? item.slice(0, separator) : "Study guidance";
          const definition = separator >= 0 ? item.slice(separator + 1).trim() : item;
          return <div key={item}><dt className="font-semibold">{term}</dt><dd className="mt-1 leading-7 text-muted-foreground">{definition}</dd></div>;
        })}</dl>
      </details>
    </Section>
    {(outcomes.length > 0 || extraPanels.length > 0) && <Section>
      {outcomes.length > 0 && <details className="max-w-4xl rounded-md border border-border p-5">
        <summary className="min-h-11 cursor-pointer text-xl font-semibold text-primary">{outcomesTitle}</summary>
        <p className="mb-5 mt-3 text-sm text-muted-foreground">A summary of the learning outcomes described in the supplied program materials.</p>
        <ol className="list-decimal space-y-4 pl-6 leading-7 text-muted-foreground">{outcomes.map(item => <li key={item}>{item}</li>)}</ol>
      </details>}
      {extraPanels.length > 0 && <div className="mt-8 grid gap-10 lg:grid-cols-2">{extraPanels.map(panel => <ListPanel key={panel.title} {...panel} />)}</div>}
    </Section>}
    <Section id="before-applying" variant="muted">
      <SectionHeader title="Before applying" />
      <div className="max-w-3xl">
          <h3 className="mb-3 text-xl font-semibold text-primary">Admission information</h3>
          {availableProgramItems(program.admissions).length ? <ul className="list-disc space-y-3 pl-5 leading-7 text-muted-foreground">{availableProgramItems(program.admissions).map(item => <li key={item}>{item}</li>)}</ul> : <p className="leading-7 text-muted-foreground">Entry requirements and application instructions: {placeholder}</p>}
          <div className="mt-5 flex flex-wrap gap-3">
          {program.admissionsUrl && <a className="action-link" href={program.admissionsUrl}>{program.code === "MSCA" ? "View graduate application and admission guide" : "View official admission requirements"}</a>}
          {program.admissionsPortalUrl && <a className="outline-link" href={program.admissionsPortalUrl}>Visit the MSU-IIT Admission Portal</a>}
          </div>
          <p className="mt-4 leading-7 text-muted-foreground">Contact {program.degreeLevelCode === "GRAD" ? "the graduate coordinator" : "the department"} to confirm current fees, application dates, and available support before applying.</p>
          {hasProgramContent(program.contactInformation) && <p className="mt-4 whitespace-pre-line leading-7">{program.contactInformation}</p>}
      </div>
      <section id="program-documents" className="mt-10 border-t border-border pt-8">
        <h3 className="mb-4 text-xl font-semibold text-primary">Program documents</h3>
        {documents.length ? <ul className="space-y-3">{documents.map(document => <li key={`${document.label}-${document.href}`}>
          {document.href ? <><a className="outline-link" href={document.href}>Open {document.label}</a>{hasProgramContent(document.note) && <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{document.note}</p>}</> : <p className="leading-7"><strong>{document.label}:</strong> {document.note}</p>}
        </li>)}</ul> : <p className="leading-7 text-muted-foreground">Official curriculum and program guides: {placeholder}</p>}
        <DocumentAccessHelp context={`${program.code} documents and forms`} />
        <div className="mt-6 max-w-3xl space-y-2 text-sm leading-6 text-muted-foreground">{program.curriculumNotes.map(note => <p key={note}>{note}</p>)}</div>
      </section>
    </Section>
    <Section id="current-students">
      <SectionHeader title="For current students" subtitle="Thesis preparation and submission guidance for enrolled students." className="mb-6" />
      <h3 className="mb-3 text-xl font-semibold text-primary">{thesisTitle}</h3>
      {guides.length > 0 && <div className="mb-6 max-w-4xl space-y-3">
        {guides.map(guide => <div key={guide.href}>
          <a className="action-link" href={guide.href}>View {guide.label}</a>
          {hasProgramContent(guide.note) && <p className="mt-3 leading-7 text-muted-foreground">{guide.note}</p>}
        </div>)}
        <p className="leading-7 text-muted-foreground">Use the official guide for detailed procedures. The checklist below is a summary; confirm the form version and submission requirements with your adviser or coordinator.</p>
      </div>}
      {availableProgramItems(program.thesisInformation).length > 1 && <details className="max-w-4xl rounded-md border border-border p-5">
        <summary className="min-h-11 cursor-pointer font-semibold text-primary">Thesis procedure checklist</summary>
        <ul className="mt-4 space-y-5 leading-7 text-muted-foreground">{availableProgramItems(program.thesisInformation).slice(1).map(item => <li key={item}>{item}</li>)}</ul>
      </details>}
      <ProgramForms program={program} />
      <Link className="text-link mt-5 inline-flex min-h-11 items-center" to="/resources">Student &amp; faculty resources</Link>
    </Section>
    <Section id="program-inquiries">
      <SectionHeader title={`Questions about ${program.code}?`} />
      <ProgramInquiry code={program.code} compact contactInformation={program.degreeLevelCode === "GRAD" ? program.contactInformation : undefined} />
      {contacts.map(contact => <a key={contact.href} className="text-link mt-4 inline-flex min-h-11 items-center" href={contact.href}>View {contact.label}</a>)}
      {reviewedLabel && <p className="mt-8 text-sm text-muted-foreground">Website summary reviewed: <time dateTime={program.reviewedOn}>{reviewedLabel}</time>. This date records a website content review.</p>}
    </Section>
  </>;
}

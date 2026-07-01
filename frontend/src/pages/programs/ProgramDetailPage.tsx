import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { departmentIdentity } from "@/content/siteContent";
import { ProgramProfile, placeholder } from "./programData";

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

function ListPanel({ title, items, ordered = false }: { title: string; items: string[]; ordered?: boolean }) {
  if (!items.length) return null;
  const List = ordered ? "ol" : "ul";

  return (
    <section className="rounded-md border border-border bg-background p-5">
      <h2 className="mb-4 text-lg font-semibold text-primary">{title}</h2>
      <List className="space-y-3 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item} className={ordered ? "ml-4 list-decimal" : undefined}>
            {item}
          </li>
        ))}
      </List>
    </section>
  );
}

function DocumentPanel({ program }: { program: ProgramProfile }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {program.documents.map((document) => (
        <div key={document.label} className="flex items-start gap-3 rounded-md border border-border bg-background p-4">
          <FileText className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
          <div>
            <h3 className="text-sm font-semibold text-primary">{document.label}</h3>
            {document.href ? (
              <a href={document.href} className="text-sm font-semibold text-accent hover:text-secondary" aria-label={`Download ${document.label}`}>
                Download {document.label}
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">{document.note || placeholder}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function QualityAssuranceNote() {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-5">
      <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
        The Department maintains academic program records to support curriculum review, outcomes-based education,
        regulatory compliance, stakeholder feedback, accreditation, and continuous improvement. Detailed
        quality-assurance and accreditation documentation is maintained separately by the Department and College.
      </p>
    </div>
  );
}

export function ProgramDetailPage({
  program,
  isError,
  pageSubtitle,
  goalsTitle,
  outcomesTitle,
  areasTitle,
  thesisTitle,
  pathwaysTitle,
  advisingTitle,
}: ProgramDetailPageProps) {
  return (
    <>
      <Seo
        title={program.seoTitle}
        description={program.seoDescription}
        keywords={[program.title, program.code, departmentIdentity.name, "academic program", "MSU-IIT"]}
        ogTitle={program.ogTitle}
        ogDescription={program.ogDescription}
        canonicalUrl={program.canonicalUrl || undefined}
      />

      <PageHero title={program.title} subtitle={pageSubtitle} />

      <Section>
        {isError && (
          <p className="mb-6 rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Built-in placeholder information is shown because the live Django program record could not be reached.
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionHeader title="Program Overview" align="left" className="mb-5" />
            <p className="text-base leading-7 text-muted-foreground">{program.summary}</p>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              {program.intendedLearners}
            </p>
          </div>

          <dl className="grid gap-3 text-sm">
            {[
              ["Program Code", program.code],
              ["Degree Level", program.level],
              ["Academic Orientation", program.academicOrientation],
              ["Culminating Requirement", program.culminatingRequirement],
              ["Duration / Pathway", program.duration],
              ["Curriculum Information", program.units],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-border bg-muted/30 p-4">
                <dt className="font-semibold text-primary">{label}</dt>
                <dd className="mt-1 text-muted-foreground">{value || placeholder}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section variant="muted">
        <div className="grid gap-5 lg:grid-cols-2">
          <ListPanel title={goalsTitle} items={program.goals} />
          <ListPanel title={outcomesTitle} items={program.outcomes} ordered />
        </div>
      </Section>

      <Section>
        <div className="grid gap-5 lg:grid-cols-2">
          <ListPanel title="Curriculum Structure" items={program.curriculumStructure} />
          <ListPanel title={areasTitle} items={program.academicAreas} />
        </div>
      </Section>

      <Section variant="muted">
        <div className="grid gap-5 lg:grid-cols-2">
          <ListPanel title={thesisTitle} items={program.thesisInformation} />
          <ListPanel title="Admission Information" items={program.admissions} />
        </div>
      </Section>

      <Section>
        <div className="grid gap-5 lg:grid-cols-2">
          <ListPanel title={pathwaysTitle} items={program.pathways} />
          <ListPanel
            title={advisingTitle}
            items={program.level.toLowerCase().includes("graduate") ? program.advisingInformation : program.studentSupport}
          />
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader title="Official Documents" align="left" />
        <DocumentPanel program={program} />
      </Section>

      <Section>
        <SectionHeader title="Quality Assurance" align="left" />
        <QualityAssuranceNote />
      </Section>

      <Section id="program-inquiries">
        <SectionHeader title="Contact / Inquiry" align="left" />
        <div className="rounded-md border border-border bg-background p-5">
          <dl className="grid gap-4 text-sm md:grid-cols-2">
            <div>
              <dt className="font-semibold text-primary">Department</dt>
              <dd className="mt-1 text-muted-foreground">{departmentIdentity.name}</dd>
            </div>
            <div>
              <dt className="font-semibold text-primary">College</dt>
              <dd className="mt-1 text-muted-foreground">{departmentIdentity.college}</dd>
            </div>
            <div>
              <dt className="font-semibold text-primary">University</dt>
              <dd className="mt-1 text-muted-foreground">{departmentIdentity.institution}</dd>
            </div>
            <div>
              <dt className="font-semibold text-primary">Program Contact</dt>
              <dd className="mt-1 text-muted-foreground">{program.contactInformation || placeholder}</dd>
            </div>
          </dl>
          <Link to="/about/contact" className="mt-5 inline-flex text-sm font-semibold text-accent hover:text-secondary">
            Contact the Department
          </Link>
        </div>
      </Section>
    </>
  );
}

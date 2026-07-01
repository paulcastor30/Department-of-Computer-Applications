import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Section, SectionHeader } from "@/components/ui/section";
import { departmentIdentity } from "@/content/siteContent";
import { usePrograms } from "@/hooks/useAcademics";
import { normalizePrograms, type ProgramProfile } from "./programData";

const placeholder = "To be provided by the Department.";

function ListBlock({ title, items, ordered = false }: { title: string; items: string[]; ordered?: boolean }) {
  if (!items.length) return null;

  const List = ordered ? "ol" : "ul";

  return (
    <section className="rounded-md border border-border bg-background p-5">
      <h3 className="mb-3 text-base font-semibold text-primary">{title}</h3>
      <List className="space-y-2 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item} className={ordered ? "ml-4 list-decimal" : undefined}>{item}</li>
        ))}
      </List>
    </section>
  );
}

function DocumentLink({ label, href, note }: { label: string; href?: string; note?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-background p-4">
      <FileText className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
      <div>
        <p className="text-sm font-semibold text-primary">{label}</p>
        {href ? (
          <a href={href} className="text-sm font-semibold text-accent hover:text-secondary">
            Download document
          </a>
        ) : (
          <p className="text-sm text-muted-foreground" aria-label={`${label}: ${note || placeholder}`}>
            {note || placeholder}
          </p>
        )}
      </div>
    </div>
  );
}

function ProgramCard({ program }: { program: ProgramProfile }) {
  return (
    <article className="rounded-md border border-border bg-background p-6">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-secondary">{program.level}</p>
      <h2 className="mb-3 text-2xl font-semibold text-primary">{program.title}</h2>
      <p className="mb-5 text-sm leading-6 text-muted-foreground">{program.summary}</p>
      <dl className="mb-5 grid gap-3 text-sm">
        <div>
          <dt className="font-semibold text-primary">Academic focus</dt>
          <dd className="mt-2">
            <ul className="space-y-1 text-muted-foreground">
              {program.academicFocus.slice(0, 3).map((focus) => (
                <li key={focus}>{focus}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-primary">Intended learners</dt>
          <dd className="mt-1 text-muted-foreground">{program.intendedLearners}</dd>
        </div>
        <div>
          <dt className="font-semibold text-primary">Pathways</dt>
          <dd className="mt-2">
            <ul className="space-y-1 text-muted-foreground">
              {program.careers.slice(0, 4).map((career) => (
                <li key={career}>{career}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-3">
        <Link
          to={program.route}
          className="inline-flex items-center gap-2 rounded-md border border-accent px-4 py-2 text-sm font-semibold text-accent hover:border-secondary hover:text-secondary"
        >
          View Program Details <ArrowRight className="h-4 w-4" />
        </Link>
        <span className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm text-muted-foreground">
          Curriculum document: {program.documents[0]?.href ? "Available for download" : placeholder}
        </span>
      </div>
    </article>
  );
}

function ProgramSection({ program }: { program: ProgramProfile }) {
  const isGraduate = program.level.toLowerCase().includes("graduate");

  return (
    <Section id={program.slug} variant={program.slug === "msca" ? "muted" : "default"}>
      <SectionHeader title={program.title} subtitle={program.summary} align="left" />

      <dl className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-border bg-background p-4">
          <dt className="text-sm font-semibold text-primary">Degree Level</dt>
          <dd className="mt-1 text-sm text-muted-foreground">{program.level}</dd>
        </div>
        <div className="rounded-md border border-border bg-background p-4">
          <dt className="text-sm font-semibold text-primary">Normal Duration / Pathway</dt>
          <dd className="mt-1 text-sm text-muted-foreground">{program.duration}</dd>
        </div>
        <div className="rounded-md border border-border bg-background p-4">
          <dt className="text-sm font-semibold text-primary">Curriculum Load</dt>
          <dd className="mt-1 text-sm text-muted-foreground">{program.units}</dd>
        </div>
      </dl>

      <div className="grid gap-5 lg:grid-cols-2">
        <ListBlock title={isGraduate ? "Graduate Program Goals" : "Program Goals"} items={program.goals} />
        <ListBlock title={isGraduate ? "Graduate Learning Outcomes" : "Expected Learning Outcomes"} items={program.outcomes} ordered />
        <ListBlock title="Curriculum Structure" items={program.curriculumStructure} />
        <ListBlock title={isGraduate ? "Research Areas" : "Major Academic Areas"} items={program.tracks} />
        <ListBlock title={isGraduate ? "Thesis / Research Component" : "Capstone / Project Component"} items={program.capstoneOrThesis} />
        <ListBlock title={isGraduate ? "Graduate Advising Information" : "Internship / Industry Exposure"} items={program.industryOrAdvising} />
        <ListBlock title="Admission Information" items={program.admissions} />
        <ListBlock title="Student Support and Facilities" items={program.studentSupport} />
        <ListBlock title={isGraduate ? "Graduate Pathways" : "Career Pathways"} items={program.careers} />
      </div>
    </Section>
  );
}

export default function Programs() {
  const { data, isError } = usePrograms();
  const displayedPrograms = normalizePrograms(data);

  return (
    <>
      <Seo
        title="Academic Programs"
        description="Undergraduate and graduate academic programs of the Department of Computer Applications, College of Computer Studies, MSU-Iligan Institute of Technology."
        keywords={[
          "Department of Computer Applications",
          "MSU-IIT",
          "BS Computer Applications",
          "MS Computer Applications",
          "academic programs",
          "applied computing",
        ]}
      />

      <section className="border-b border-border bg-background py-16 md:py-20">
        <div className="container max-w-5xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">{departmentIdentity.college}</p>
          <h1 className="mb-5 text-3xl font-bold leading-tight text-primary md:text-5xl">Academic Programs</h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
            The Department of Computer Applications offers undergraduate and graduate programs in applied computing,
            software development, systems development, embedded systems, Internet of Things, and related computing
            applications.
          </p>
        </div>
      </section>

      <Section>
        <nav className="mb-8 rounded-md border border-border bg-muted/30 p-4" aria-label="Academic programs page sections">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {displayedPrograms.map((program) => (
              <li key={program.slug}>
                <a href={`#${program.slug}`} className="font-semibold text-accent hover:text-secondary">
                  {program.code}
                </a>
              </li>
            ))}
            <li>
              <a href="#official-documents" className="font-semibold text-accent hover:text-secondary">
                Official Documents
              </a>
            </li>
            <li>
              <a href="#program-inquiries" className="font-semibold text-accent hover:text-secondary">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <SectionHeader
          title="Programs Overview"
          subtitle="The following programs are presented for prospective students, current students, faculty, partners, and external reviewers."
          align="left"
        />
        {isError && (
          <p className="mb-6 rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Built-in program information is shown because the live academic-program records could not be reached.
          </p>
        )}
        <div className="grid gap-6 lg:grid-cols-2">
          {displayedPrograms.map((program) => (
            <ProgramCard key={program.slug} program={program} />
          ))}
        </div>
      </Section>

      {displayedPrograms.map((program) => (
        <ProgramSection key={program.slug} program={program} />
      ))}

      <Section>
        <SectionHeader title="Quality Assurance" align="left" />
        <div className="rounded-md border border-border bg-muted/30 p-5">
          <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
            The Department maintains academic program records to support curriculum review, outcomes-based education,
            accreditation, regulatory compliance, stakeholder feedback, and continuous improvement. Detailed
            quality-assurance and accreditation documentation is maintained separately by the Department and College.
          </p>
          <Link
            to="/accreditation"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-secondary"
          >
            View Quality Assurance Information <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <Section id="official-documents" variant="muted">
        <SectionHeader title="Official Documents" align="left" />
        <div className="grid gap-4 md:grid-cols-2">
          {displayedPrograms.flatMap((program) =>
            program.documents.map((document) => (
              <DocumentLink key={`${program.slug}-${document.label}`} {...document} />
            ))
          )}
        </div>
      </Section>

      <Section id="program-inquiries">
        <SectionHeader title="Contact and Inquiries" align="left" />
        <div className="rounded-md border border-border p-5">
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
              <dt className="font-semibold text-primary">Email</dt>
              <dd className="mt-1 text-muted-foreground">{departmentIdentity.email || placeholder}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="font-semibold text-primary">Office Location</dt>
              <dd className="mt-1 text-muted-foreground">{departmentIdentity.address || placeholder}</dd>
            </div>
          </dl>
          <Link to="/about/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-secondary">
            Contact the Department <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}

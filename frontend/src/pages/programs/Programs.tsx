import { Link } from "react-router-dom";
import { ArrowRight, Award, BookOpenCheck, ClipboardCheck, GraduationCap } from "lucide-react";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { programs, qaStandards } from "./programData";

const readinessItems = [
  {
    icon: ClipboardCheck,
    title: "Compliance Evidence",
    text: "Each program page identifies the documents accreditors normally ask for: curriculum maps, syllabi, rubrics, faculty records, OJT or thesis evidence, and improvement actions.",
  },
  {
    icon: BookOpenCheck,
    title: "Outcomes-Based Curriculum",
    text: "Program outcomes, course sequencing, research preparation, and assessment points are written in a way that can be mapped to CHED, AACCUP, and AUN-QA instruments.",
  },
  {
    icon: Award,
    title: "Quality Narrative",
    text: "The presentation separates current requirements from historical linkages, so the site can support review panels without overstating active affiliations.",
  },
];

export default function Programs() {
  return (
    <>
      <PageHero
        title="Academic Programs"
        subtitle="Evidence-ready undergraduate and graduate programs in applied computing, research, embedded systems, IoT, and technology innovation."
      />

      <Section>
        <SectionHeader
          title="Programs Offered"
          subtitle="These pages are written for students, faculty, administrators, CHED evaluators, AACCUP accreditors, and AUN-QA assessors who need clear program identity and evidence trails."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {programs.map((program) => (
            <article key={program.slug} className="card-elevated flex h-full flex-col p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-accent">{program.code}</p>
                  <h2 className="mt-2 text-2xl font-bold text-primary">{program.title}</h2>
                </div>
                <GraduationCap className="h-9 w-9 shrink-0 text-secondary" />
              </div>

              <p className="mb-5 text-muted-foreground">{program.summary}</p>

              <dl className="mb-6 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-md border border-border bg-muted/30 p-3">
                  <dt className="font-semibold text-primary">Level</dt>
                  <dd className="mt-1 text-muted-foreground">{program.level}</dd>
                </div>
                <div className="rounded-md border border-border bg-muted/30 p-3">
                  <dt className="font-semibold text-primary">Duration</dt>
                  <dd className="mt-1 text-muted-foreground">{program.duration}</dd>
                </div>
                <div className="rounded-md border border-border bg-muted/30 p-3 sm:col-span-2">
                  <dt className="font-semibold text-primary">Curriculum Load</dt>
                  <dd className="mt-1 text-muted-foreground">{program.units}</dd>
                </div>
              </dl>

              <div className="mt-auto">
                <p className="mb-4 rounded-md border-l-4 border-secondary bg-secondary/10 p-4 text-sm text-primary">
                  {program.recognition}
                </p>
                <Link
                  to={program.route}
                  className="inline-flex items-center gap-2 font-semibold text-accent transition-colors hover:text-secondary"
                >
                  View program details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader
          title="Quality Assurance Readiness"
          subtitle="The Programs area should function as the public index of curriculum compliance, outcomes, assessment, student achievement, and continuous improvement evidence."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {readinessItems.map((item) => (
            <div key={item.title} className="card-elevated p-5">
              <item.icon className="mb-4 h-8 w-8 text-secondary" />
              <h3 className="mb-2 text-lg font-semibold text-primary">{item.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader title="Standards Covered" align="left" />
        <div className="grid gap-3">
          {qaStandards.map((standard) => (
            <div key={standard} className="rounded-md border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
              {standard}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

import { BookMarked, CheckCircle2, FileText, Microscope, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { historicalLinkages, mscaProgram } from "./programData";

function BulletPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card-elevated p-5">
      <h3 className="mb-4 text-lg font-semibold text-primary">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-secondary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const thesisSteps = [
  {
    title: "Graduate Coursework",
    text: "Complete core, specialization, and prescribed bridging courses where applicable.",
  },
  {
    title: "Comprehensive Examination",
    text: "Take the examination after the required core preparation and document results for quality review.",
  },
  {
    title: "Thesis Proposal",
    text: "Defend a researchable problem with method, adviser, panel, ethics, timeline, and expected output.",
  },
  {
    title: "Thesis Defense and Publication",
    text: "Complete the thesis and provide evidence of refereed or juried scholarly output required for graduation.",
  },
];

export default function MSCA() {
  return (
    <>
      <PageHero
        title={mscaProgram.title}
        subtitle="A thesis-based graduate program for advanced applied-computing research, publication, innovation, and technical leadership."
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-6 text-lg leading-8 text-muted-foreground">{mscaProgram.summary}</p>
            <div className="rounded-md border-l-4 border-secondary bg-secondary/10 p-5">
              <h2 className="mb-2 text-xl font-semibold text-primary">Graduate Program Identity</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {mscaProgram.recognition}. The department should maintain dated curriculum approvals, graduate faculty
                qualifications, thesis supervision records, comprehensive examination evidence, publication records, and
                research-utilization evidence.
              </p>
            </div>
          </div>
          <dl className="grid gap-3">
            {[
              ["Program Code", mscaProgram.code],
              ["Level", mscaProgram.level],
              ["Pathway", mscaProgram.duration],
              ["Curriculum Load", mscaProgram.units],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-border bg-muted/30 p-4">
                <dt className="text-sm font-semibold text-primary">{label}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader
          title="Graduate Outcomes"
          subtitle="These outcomes emphasize research depth, methodological discipline, scholarly output, and leadership, which are central to graduate accreditation and quality assurance."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {mscaProgram.outcomes.map((outcome, index) => (
            <div key={outcome} className="card-elevated flex gap-4 p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                {index + 1}
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{outcome}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader title="Thesis Pathway" />
        <div className="grid gap-5 lg:grid-cols-4">
          {thesisSteps.map((step, index) => (
            <div key={step.title} className="card-elevated p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-primary">{step.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader title="Curriculum and Research Evidence" align="left" />
        <div className="grid gap-5 lg:grid-cols-2">
          <BulletPanel title="Curriculum Features" items={mscaProgram.curriculumEvidence} />
          <BulletPanel title="Evidence to Keep Ready" items={mscaProgram.qualityEvidence} />
        </div>
      </Section>

      <Section>
        <SectionHeader title="Admission, Progression, and Graduate Roles" />
        <div className="grid gap-5 lg:grid-cols-3">
          <BulletPanel title="Admission and Bridging" items={mscaProgram.admissions} />
          <BulletPanel title="Progression Controls" items={mscaProgram.progression} />
          <BulletPanel title="Graduate Roles" items={mscaProgram.careers} />
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader
          title="Historical Linkages and Curriculum Notes"
          subtitle="Historical linkages should be presented as dated institutional evidence, not current scholarship advertising."
        />
        <div className="mx-auto max-w-4xl rounded-md border border-border bg-background p-6">
          <div className="mb-4 flex items-center gap-3">
            <BookMarked className="h-7 w-7 text-secondary" />
            <h3 className="text-xl font-semibold text-primary">Previous ERDT-Linked Curriculum Track</h3>
          </div>
          <p className="mb-5 text-sm leading-6 text-muted-foreground">
            Earlier MSCA curriculum documents included an ERDT scholarship-aligned 34-unit structure. The department is
            no longer presenting ERDT as a current scholarship affiliation, but the previous ERDT-linked track remains
            useful evidence of past externally supported graduate-education participation and may support future
            partnership or scholarship opportunities.
          </p>
          <ul className="space-y-3">
            {historicalLinkages.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-secondary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="card-elevated p-5">
            <Microscope className="mb-4 h-8 w-8 text-secondary" />
            <h3 className="mb-2 text-lg font-semibold text-primary">CHED COE Readiness</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              The graduate program should foreground faculty publications, thesis outputs, research agenda alignment,
              facilities, linkages, extension utilization, and graduate employability.
            </p>
          </div>
          <div className="card-elevated p-5">
            <FileText className="mb-4 h-8 w-8 text-secondary" />
            <h3 className="mb-2 text-lg font-semibold text-primary">AACCUP Level III Readiness</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Keep evidence of research productivity, community engagement, instruction quality, faculty development,
              stakeholder feedback, and action taken from previous evaluations.
            </p>
          </div>
          <div className="card-elevated p-5">
            <ShieldCheck className="mb-4 h-8 w-8 text-secondary" />
            <h3 className="mb-2 text-lg font-semibold text-primary">AUN-QA Readiness</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Make expected learning outcomes, curriculum design, assessment methods, academic staff quality, student
              services, facilities, and output indicators easy to verify.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

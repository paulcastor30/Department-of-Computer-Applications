import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { useProgram } from "@/hooks/useAcademics";
import { evidenceMatrix, historicalLinkages, mscaProgram, normalizeProgram } from "./programData";

function EvidenceList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;

  return (
    <div className="rounded-md border border-border bg-background p-5">
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

const thesisPathway = [
  "Completion of required graduate coursework and prescribed bridging courses, where applicable.",
  "Comprehensive examination after required core preparation.",
  "Thesis proposal defense with method, adviser, panel, ethics documentation, timeline, and expected output.",
  "Thesis implementation, final defense, and submission of required publication or juried scholarly-output evidence.",
];

export default function MSCA() {
  const { data, isError } = useProgram("msca");
  const program = normalizeProgram(data, mscaProgram);
  const notes = data?.historical_notes_list?.length ? data.historical_notes_list : historicalLinkages;

  return (
    <>
      <PageHero
        title={program.title}
        subtitle="Formal graduate program information for curriculum review, accreditation, and quality-assurance documentation."
      />

      <Section>
        {isError && (
          <p className="mb-6 rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Built-in MSCA information is shown because the live Django program record could not be reached.
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionHeader title="Program Identity" align="left" className="mb-5" />
            <p className="text-base leading-7 text-muted-foreground">{program.summary}</p>
            <p className="mt-5 rounded-md border-l-4 border-secondary bg-secondary/10 p-4 text-sm leading-6 text-muted-foreground">
              {program.recognition}
            </p>
          </div>

          <dl className="grid gap-3 text-sm">
            {[
              ["Program Code", program.code],
              ["Degree Level", program.level],
              ["Academic Pathway", program.duration],
              ["Curriculum Load", program.units],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-border bg-muted/30 p-4">
                <dt className="font-semibold text-primary">{label}</dt>
                <dd className="mt-1 text-muted-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader
          title="Graduate Learning Outcomes"
          subtitle="Graduate outcomes should be supported by course requirements, research supervision records, assessment rubrics, thesis documentation, and publication evidence."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <EvidenceList title="Expected Graduate Outcomes" items={program.outcomes} />
          <EvidenceList title="Specialization Courses and Focus Areas" items={program.tracks} />
        </div>
      </Section>

      <Section>
        <SectionHeader title="Curriculum and Thesis Pathway" />
        <div className="grid gap-5 lg:grid-cols-2">
          <EvidenceList title="Curricular Components" items={program.curriculumStructure} />
          <EvidenceList title="Thesis and Publication Controls" items={thesisPathway} />
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader title="Admission, Progression, and Completion Controls" />
        <div className="grid gap-5 lg:grid-cols-3">
          <EvidenceList title="Admission and Bridging" items={program.admissions} />
          <EvidenceList title="Progression Requirements" items={program.progression} />
          <EvidenceList title="Graduate Pathways" items={program.careers} />
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Required Program Evidence"
          subtitle="These evidence areas should be supported by dated graduate-school, department, college, and university records."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <EvidenceList title="Curriculum and Research Evidence" items={program.curriculumEvidence} />
          <EvidenceList title="Quality-Assurance Evidence" items={program.qualityEvidence} />
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader
          title="Historical Curriculum Notes"
          subtitle="Historical notes are retained as dated institutional record and should not be interpreted as current scholarship or funding offers."
        />
        <EvidenceList title="Previous ERDT-Linked Curriculum Record" items={notes} />
      </Section>

      <Section>
        <SectionHeader title="Framework Alignment" align="left" />
        <div className="overflow-hidden rounded-md border border-border bg-background">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-primary">
              <tr>
                <th className="border-b border-border p-4 font-semibold">Framework</th>
                <th className="border-b border-border p-4 font-semibold">Evidence Expected from MSCA</th>
              </tr>
            </thead>
            <tbody>
              {evidenceMatrix.map((item) => (
                <tr key={item.framework} className="align-top">
                  <td className="border-b border-border p-4 font-semibold text-primary">{item.framework}</td>
                  <td className="border-b border-border p-4 leading-6 text-muted-foreground">{item.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}

import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { useProgram } from "@/hooks/useAcademics";
import { bscaProgram, evidenceMatrix, normalizeProgram } from "./programData";

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

export default function BSCA() {
  const { data, isError } = useProgram("bsca");
  const program = normalizeProgram(data, bscaProgram);

  return (
    <>
      <PageHero
        title={program.title}
        subtitle="Formal undergraduate program information for curriculum review, accreditation, and quality-assurance documentation."
      />

      <Section>
        {isError && (
          <p className="mb-6 rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Built-in BSCA information is shown because the live Django program record could not be reached.
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
              ["Normal Duration", program.duration],
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
          title="Educational Objectives and Learning Outcomes"
          subtitle="The objectives and outcomes should be mapped to course outcomes, learning activities, assessments, rubrics, and documented improvement actions."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <EvidenceList title="Program Educational Objectives" items={program.peos} />
          <EvidenceList title="Program Learning Outcomes" items={program.outcomes} />
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Curriculum Structure"
          subtitle="The curriculum is presented by academic component rather than promotional theme, so it can support CHED, AACCUP, and AUN-QA review."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <EvidenceList title="Curricular Components" items={program.curriculumStructure} />
          <EvidenceList title="Specialization and Focus Areas" items={program.tracks} />
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader title="Admission, Progression, and Completion Controls" />
        <div className="grid gap-5 lg:grid-cols-3">
          <EvidenceList title="Admission and Advising" items={program.admissions} />
          <EvidenceList title="Progression Requirements" items={program.progression} />
          <EvidenceList title="Graduate Pathways" items={program.careers} />
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Required Program Evidence"
          subtitle="These evidence areas should be supported by dated documents in the department, college, university, and quality-assurance repositories."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <EvidenceList title="Curriculum and Assessment Evidence" items={program.curriculumEvidence} />
          <EvidenceList title="Quality-Assurance Evidence" items={program.qualityEvidence} />
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader title="Framework Alignment" align="left" />
        <div className="overflow-hidden rounded-md border border-border bg-background">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-primary">
              <tr>
                <th className="border-b border-border p-4 font-semibold">Framework</th>
                <th className="border-b border-border p-4 font-semibold">Evidence Expected from BSCA</th>
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

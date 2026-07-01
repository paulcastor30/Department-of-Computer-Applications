import { Seo } from "@/components/Seo";
import { Section, SectionHeader } from "@/components/ui/section";
import { placeholder } from "@/content/siteContent";

const qaStandards = [
  "CHED COPC: curriculum authority, regulatory compliance records, faculty qualifications, facilities, library and laboratory resources, admission and retention policies, and student-support evidence.",
  "AACCUP Level III: outcomes-based instruction, faculty development, student achievement, research, extension, linkages, stakeholder feedback, and documented continuous improvement.",
  "CHED COE: evidence categories may include faculty profile, research productivity, graduate outcomes, extension leadership, institutional linkages, facilities, specialization strength, and documented distinction, subject to official validation.",
  "AUN-QA: expected learning outcomes, curriculum structure and content, teaching-learning approach, student assessment, academic staff quality, student support, facilities, output indicators, and stakeholder feedback.",
];

const evidenceMatrix = [
  {
    framework: "CHED COPC",
    evidence: "Curriculum authority, regulatory compliance records, faculty credentials, facilities, laboratory and library holdings, admission-retention rules, and student services.",
  },
  {
    framework: "AACCUP Level III",
    evidence: "Instructional quality, research and extension outputs, faculty development, student performance, linkages, stakeholder evaluation, and documented actions taken.",
  },
  {
    framework: "CHED COE",
    evidence: "Evidence categories may include faculty profile, research, graduate outcomes, extension utilization, external linkages, facilities, and specialization strength, subject to official validation.",
  },
  {
    framework: "AUN-QA",
    evidence: "Outcome-curriculum-assessment alignment, academic staff quality, student support, facilities, quality enhancement, stakeholder feedback, and output measures.",
  },
];

const qaProcesses = [
  "Program outcomes, curriculum maps, syllabi, assessment rubrics, and improvement actions.",
  "Faculty profile, faculty development, research and extension outputs, and workload documentation.",
  "Student admission, progression, retention, completion, thesis records, supervised industry exposure where applicable, and graduate outcomes.",
  "Facilities, library resources, laboratories, software, equipment, and student support services.",
  "Stakeholder feedback, advisory input, tracer studies, employer feedback, and actions taken.",
];

export default function Accreditation() {
  return (
    <>
      <Seo title="Quality Assurance and Accreditation" description="Quality assurance processes and evidence categories for program review and accreditation." />

      <Section>
        <SectionHeader
          title="Quality Assurance and Accreditation"
          subtitle="This page consolidates quality-assurance and accreditation-related information. Public claims should be supported by official documents and dated evidence."
          align="left"
        />
        <div className="rounded-md border border-border bg-muted/30 p-5 text-sm leading-6 text-muted-foreground">
          Current accreditation certificates, CHED compliance documents, AUN-QA self-assessment materials, and official
          quality-assurance reports are {placeholder.toLowerCase()}.
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader title="Framework Reference Areas" align="left" />
        <div className="grid gap-4">
          {qaStandards.map((standard) => (
            <div key={standard} className="rounded-md border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
              {standard}
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader title="Evidence Categories" align="left" />
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-primary">
              <tr>
                <th className="border-b border-border p-4 font-semibold">Framework</th>
                <th className="border-b border-border p-4 font-semibold">Evidence Category</th>
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

      <Section variant="muted">
        <SectionHeader title="Quality-Assurance Process Records" align="left" />
        <ul className="grid gap-3 md:grid-cols-2">
          {qaProcesses.map((item) => (
            <li key={item} className="rounded-md border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
              {item}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

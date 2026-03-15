import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Timeline } from "@/components/ui/timeline";
import { EvidenceBlock, EvidenceBadge } from "@/components/ui/evidence-block";

const milestones = [
  { year: "1998", title: "Department Established", description: "The Department of Computer Applications was established to address the growing demand for IT professionals in the region." },
  { year: "2003", title: "First AACCUP Accreditation", description: "The BSCA program received its first AACCUP accreditation, marking a milestone in quality assurance." },
  { year: "2008", title: "Graduate Program Launch", description: "Introduction of the Master of Science in Computer Applications (MSCA) program." },
  { year: "2012", title: "AACCUP Level II Achieved", description: "Successful re-accreditation with Level II status, recognizing continuous improvement in program quality." },
  { year: "2015", title: "Research Center Established", description: "Opening of the Computer Applications Research Center (CARC) to advance research initiatives." },
  { year: "2018", title: "International Partnerships", description: "Formal MOUs signed with international partner universities for academic exchange." },
  { year: "2020", title: "AACCUP Level III Status", description: "Achievement of Level III accreditation, positioning the program among the best in the region." },
  { year: "2023", title: "CHED COPC Application", description: "Application submitted for CHED Center of Program Compliance recognition." },
  { year: "2024", title: "25th Anniversary", description: "Celebration of 25 years of excellence in computer applications education." },
];

export default function History() {
  return (
    <>
      <PageHero
        title="History & Milestones"
        subtitle="Tracing our journey of growth, achievement, and continuous improvement in computing education."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeader title="Our Journey" align="left" />
            <Timeline items={milestones} />
          </div>
          <div>
            <SectionHeader title="Key Achievements" align="left" />
            <div className="space-y-4">
              <div className="card-elevated p-5">
                <EvidenceBadge type="aaccup" />
                <h3 className="font-semibold mt-3 mb-2">AACCUP Level III</h3>
                <p className="text-sm text-muted-foreground">Highest accreditation level achieved in 2020</p>
              </div>
              <div className="card-elevated p-5">
                <EvidenceBadge type="ched" />
                <h3 className="font-semibold mt-3 mb-2">CHED Recognition</h3>
                <p className="text-sm text-muted-foreground">COPC application under review</p>
              </div>
              <div className="card-elevated p-5">
                <EvidenceBadge type="verified" />
                <h3 className="font-semibold mt-3 mb-2">2,500+ Graduates</h3>
                <p className="text-sm text-muted-foreground">Successful alumni contributing globally</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section variant="muted">
        <EvidenceBlock
          title="Historical Documentation"
          description="Comprehensive records of departmental growth and achievements maintained for accreditation purposes."
          accreditation={["aaccup"]}
        >
          <p className="text-sm text-muted-foreground">
            [Placeholder: Downloadable historical documents, photographs, and archival materials]
          </p>
        </EvidenceBlock>
      </Section>
    </>
  );
}

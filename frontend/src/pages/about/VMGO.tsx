import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { EvidenceBlock, EvidenceBadge, MetricPlaceholder } from "@/components/ui/evidence-block";
import { Target, Eye, Compass, CheckCircle2 } from "lucide-react";

export default function VMGO() {
  return (
    <>
      <PageHero
        title="Vision, Mission, Goals & Objectives"
        subtitle="Our guiding principles that drive excellence in computing education and research."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Vision */}
          <div className="card-elevated p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-2xl font-bold">Vision</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To be a nationally recognized and internationally linked department of excellence 
              in computer applications education, research, and community service, producing 
              globally competitive and socially responsible IT professionals.
            </p>
            <div className="mt-4">
              <EvidenceBadge type="aaccup" />
            </div>
          </div>

          {/* Mission */}
          <div className="card-elevated p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-2xl font-bold">Mission</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Department of Computer Applications is committed to providing quality education, 
              conducting relevant research, and engaging in meaningful community extension services 
              in the field of computing and information technology that contribute to national 
              development and global competitiveness.
            </p>
            <div className="mt-4">
              <EvidenceBadge type="aaccup" />
            </div>
          </div>
        </div>
      </Section>

      {/* Goals */}
      <Section variant="muted">
        <SectionHeader title="Goals" subtitle="Our strategic goals aligned with institutional objectives" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Academic Excellence", desc: "Deliver high-quality, outcomes-based education aligned with industry standards" },
            { title: "Research & Innovation", desc: "Advance knowledge through relevant and impactful research" },
            { title: "Community Engagement", desc: "Extend expertise through meaningful community service programs" },
            { title: "Global Competitiveness", desc: "Produce graduates who meet international standards" },
          ].map((goal, i) => (
            <div key={i} className="card-elevated p-6">
              <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold mb-4">
                {i + 1}
              </div>
              <h3 className="font-semibold text-primary mb-2">{goal.title}</h3>
              <p className="text-sm text-muted-foreground">{goal.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Objectives */}
      <Section>
        <SectionHeader title="Specific Objectives" />
        <div className="max-w-4xl mx-auto space-y-4">
          {[
            "Implement outcomes-based curricula aligned with CHED policies and industry requirements",
            "Maintain faculty development programs ensuring advanced qualifications and research productivity",
            "Foster partnerships with industry for curriculum enhancement and student opportunities",
            "Conduct research addressing local and national technological challenges",
            "Engage in community extension programs that leverage computing expertise",
            "Pursue and maintain accreditation and quality assurance certifications",
            "Develop international linkages for academic exchange and collaboration",
            "Provide modern facilities and learning resources for effective instruction",
          ].map((objective, i) => (
            <div key={i} className="flex gap-3 p-4 bg-muted/50 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <span>{objective}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Outcomes Alignment */}
      <Section variant="muted">
        <SectionHeader title="Outcomes Alignment Matrix" subtitle="How our VMGO aligns with program outcomes and accreditation standards" />
        <EvidenceBlock
          title="VMGO-PEO-SO Alignment"
          description="Mapping of Vision, Mission, Goals, and Objectives to Program Educational Objectives and Student Outcomes."
          accreditation={["aaccup", "ched", "aun"]}
        >
          <div className="grid gap-3 mt-4">
            <MetricPlaceholder label="PEOs aligned with Mission" value="5/5" target="100%" />
            <MetricPlaceholder label="SOs mapped to Goals" value="12/12" target="100%" />
            <MetricPlaceholder label="Curriculum alignment score" value="—" target="Target: 90%" />
          </div>
        </EvidenceBlock>
      </Section>
    </>
  );
}
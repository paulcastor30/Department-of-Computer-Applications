import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { EvidenceBlock, EvidenceBadge, MetricPlaceholder } from "@/components/ui/evidence-block";
import { ContentCard, CardGrid } from "@/components/ui/content-card";

export default function Accreditation() {
  return (
    <>
      <PageHero title="Accreditation & Quality Assurance" subtitle="Our commitment to excellence through recognized quality standards." />
      <Section>
        <div className="flex flex-wrap gap-4 justify-center mb-12"><EvidenceBadge type="aaccup" /><EvidenceBadge type="ched" /><EvidenceBadge type="aun" /></div>
        <CardGrid columns={3}>
          <ContentCard title="AACCUP Level III" description="Accrediting Agency of Chartered Colleges and Universities in the Philippines" badge="Achieved 2020" />
          <ContentCard title="CHED COPC" description="Commission on Higher Education Center of Program Compliance" badge="Under Review" />
          <ContentCard title="AUN-QA" description="ASEAN University Network Quality Assurance" badge="Preparing" />
        </CardGrid>
      </Section>
      <Section variant="muted">
        <SectionHeader title="Quality Metrics" />
        <EvidenceBlock title="Accreditation Evidence Summary" accreditation={["aaccup", "ched", "aun"]}>
          <div className="grid gap-3 md:grid-cols-2">
            <MetricPlaceholder label="Faculty with doctoral degrees" value="60%" target="50%" />
            <MetricPlaceholder label="Licensure exam passing rate" value="85%" target="80%" />
            <MetricPlaceholder label="Employment rate" value="95%" target="90%" />
            <MetricPlaceholder label="Research publications" value="85+" />
          </div>
        </EvidenceBlock>
      </Section>
    </>
  );
}

import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { StatTile, StatGrid } from "@/components/ui/stat-tile";
import { EvidenceBlock, MetricPlaceholder } from "@/components/ui/evidence-block";
import { BookOpen, Award, DollarSign, Users } from "lucide-react";

export default function Metrics() {
  return (
    <>
      <PageHero title="Research Metrics Dashboard" subtitle="Key performance indicators for research productivity." />
      <Section>
        <StatGrid columns={4}>
          <StatTile value="85+" label="Total Publications" icon={<BookOpen className="h-8 w-8" />} />
          <StatTile value="12" label="H-Index" icon={<Award className="h-8 w-8" />} />
          <StatTile value="₱5M+" label="Research Funding" icon={<DollarSign className="h-8 w-8" />} />
          <StatTile value="25" label="Research Faculty" icon={<Users className="h-8 w-8" />} />
        </StatGrid>
      </Section>
      <Section variant="muted">
        <EvidenceBlock title="Research Performance Indicators" accreditation={["aaccup", "ched"]}>
          <div className="grid gap-3"><MetricPlaceholder label="Publications per faculty" value="3.4" target="Target: 3.0" /><MetricPlaceholder label="Funded projects" value="8" /><MetricPlaceholder label="Student research papers" value="45" /></div>
        </EvidenceBlock>
      </Section>
    </>
  );
}

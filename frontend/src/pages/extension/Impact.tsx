import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
import { EvidenceBlock, MetricPlaceholder } from "@/components/ui/evidence-block";
export default function Impact() { return (<><PageHero title="Impact & Outcomes" subtitle="Measuring the difference we make in communities." /><Section><EvidenceBlock title="Extension Impact Metrics" accreditation={["aaccup"]}><div className="grid gap-3"><MetricPlaceholder label="Beneficiaries served" value="5,000+" /><MetricPlaceholder label="Community satisfaction" value="95%" /><MetricPlaceholder label="Programs completed" value="45" /></div></EvidenceBlock></Section></>); }

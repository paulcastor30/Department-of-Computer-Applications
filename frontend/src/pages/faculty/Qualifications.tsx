import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
import { EvidenceBlock, MetricPlaceholder } from "@/components/ui/evidence-block";
export default function Qualifications() { return (<><PageHero title="Faculty Qualifications" subtitle="Summary of faculty credentials and expertise." /><Section><EvidenceBlock title="Faculty Qualifications Summary" accreditation={["aaccup", "ched"]}><div className="grid gap-3"><MetricPlaceholder label="Doctoral degree holders" value="60%" target="Target: 50%" /><MetricPlaceholder label="Master's degree holders" value="100%" /><MetricPlaceholder label="With industry certifications" value="80%" /></div></EvidenceBlock></Section></>); }

import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
export default function Achievements() { return (<><PageHero title="Faculty Achievements" subtitle="Recognition and awards received by our faculty." /><Section><div className="space-y-4">{["Best Paper Award - ICICT 2024", "Outstanding Researcher - University Research Council", "CHED Recognition for Excellence in Teaching"].map((a, i) => <div key={i} className="card-elevated p-4">{a}</div>)}</div></Section></>); }

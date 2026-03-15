import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
export default function Development() { return (<><PageHero title="Faculty Development" subtitle="Continuous professional development programs." /><Section><div className="grid gap-4 md:grid-cols-2">{["Training Programs", "Conference Participation", "Research Grants", "Academic Scholarships"].map((d, i) => <div key={i} className="card-elevated p-6 text-center font-medium">{d}</div>)}</div></Section></>); }

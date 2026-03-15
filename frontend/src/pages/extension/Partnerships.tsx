import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
export default function Partnerships() { return (<><PageHero title="Community Partnerships" subtitle="Organizations we work with for community development." /><Section><div className="grid gap-4 md:grid-cols-4">{["LGU Partners", "NGOs", "Schools", "Cooperatives"].map((p, i) => <div key={i} className="card-elevated p-6 text-center font-medium">{p}</div>)}</div></Section></>); }

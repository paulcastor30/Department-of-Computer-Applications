import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
import { ContentCard, CardGrid } from "@/components/ui/content-card";
export default function Organizations() { return (<><PageHero title="Student Organizations" subtitle="Join our vibrant student community." /><Section><CardGrid columns={3}><ContentCard title="Computer Applications Society" description="The official student organization for BSCA students." /><ContentCard title="Google Developer Student Club" description="Building solutions with Google technologies." /><ContentCard title="Cybersecurity Club" description="Learning and practicing cybersecurity skills." /></CardGrid></Section></>); }

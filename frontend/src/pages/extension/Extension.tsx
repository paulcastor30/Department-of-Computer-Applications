import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
import { ContentCard, CardGrid } from "@/components/ui/content-card";
import { StatTile, StatGrid } from "@/components/ui/stat-tile";
import { Users, Heart, Building } from "lucide-react";

export default function Extension() {
  return (
    <>
      <PageHero title="Community Extension" subtitle="Extending our expertise to serve communities and contribute to national development." />
      <Section><StatGrid columns={3}><StatTile value="15+" label="Extension Programs" icon={<Heart className="h-8 w-8" />} /><StatTile value="5,000+" label="Beneficiaries" icon={<Users className="h-8 w-8" />} /><StatTile value="10" label="Partner Communities" icon={<Building className="h-8 w-8" />} /></StatGrid></Section>
      <Section variant="muted"><CardGrid columns={3}><ContentCard title="Extension Programs" href="/extension/programs" /><ContentCard title="Partnerships" href="/extension/partnerships" /><ContentCard title="Impact & Outcomes" href="/extension/impact" /></CardGrid></Section>
    </>
  );
}

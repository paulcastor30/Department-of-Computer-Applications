import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { StatTile, StatGrid } from "@/components/ui/stat-tile";
import { ContentCard, CardGrid } from "@/components/ui/content-card";
import { Users, Briefcase, Award } from "lucide-react";

export default function Alumni() {
  return (
    <>
      <PageHero title="Alumni" subtitle="Celebrating the success of our graduates." />
      <Section><StatGrid columns={3}><StatTile value="2,500+" label="Total Graduates" icon={<Users className="h-8 w-8" />} /><StatTile value="95%" label="Employment Rate" icon={<Briefcase className="h-8 w-8" />} /><StatTile value="50+" label="Companies Represented" icon={<Award className="h-8 w-8" />} /></StatGrid></Section>
      <Section variant="muted"><SectionHeader title="Success Stories" /><CardGrid columns={3}><ContentCard title="Maria Cruz" description="Senior Software Engineer at Google Philippines" badge="Class of 2018" /><ContentCard title="Juan Santos" description="CTO of Local Tech Startup" badge="Class of 2015" /><ContentCard title="Ana Reyes" description="Data Scientist at Accenture" badge="Class of 2020" /></CardGrid></Section>
    </>
  );
}

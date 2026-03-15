import { Link } from "react-router-dom";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { ContentCard, CardGrid } from "@/components/ui/content-card";
import { StatTile, StatGrid } from "@/components/ui/stat-tile";
import { FlaskConical, BookOpen, Users, Globe } from "lucide-react";

export default function Research() {
  return (
    <>
      <PageHero title="Research & Innovation" subtitle="Advancing knowledge through impactful research addressing real-world challenges." />
      <Section>
        <StatGrid columns={4}>
          <StatTile value="85+" label="Scopus Publications" icon={<BookOpen className="h-8 w-8" />} />
          <StatTile value="12" label="Active Projects" icon={<FlaskConical className="h-8 w-8" />} />
          <StatTile value="25" label="Research Faculty" icon={<Users className="h-8 w-8" />} />
          <StatTile value="8" label="Partner Institutions" icon={<Globe className="h-8 w-8" />} />
        </StatGrid>
      </Section>
      <Section variant="muted">
        <SectionHeader title="Explore Research" />
        <CardGrid columns={3}>
          <ContentCard title="Focus Areas" description="Explore our research domains and expertise." href="/research/focus-areas" icon={<FlaskConical className="h-6 w-6" />} />
          <ContentCard title="Publications" description="Browse our Scopus-indexed publications." href="/research/publications" icon={<BookOpen className="h-6 w-6" />} />
          <ContentCard title="Labs & Facilities" description="Discover our research infrastructure." href="/research/labs" icon={<FlaskConical className="h-6 w-6" />} />
        </CardGrid>
      </Section>
    </>
  );
}

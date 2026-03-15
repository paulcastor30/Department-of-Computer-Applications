import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { ContentCard, CardGrid } from "@/components/ui/content-card";
import { FilterBar } from "@/components/ui/filter-bar";

const projects = [
  { title: "AI-Driven Healthcare Analytics", description: "Machine learning for disease detection.", badge: "Active", href: "#" },
  { title: "Smart Agriculture Systems", description: "IoT solutions for Filipino farmers.", badge: "Active", href: "#" },
  { title: "Cybersecurity Framework for SMEs", description: "Affordable security for small businesses.", badge: "Funded", href: "#" },
];

export default function Projects() {
  return (
    <>
      <PageHero title="Research Projects" subtitle="Active and completed research initiatives." />
      <Section>
        <FilterBar searchPlaceholder="Search projects..." className="mb-8" />
        <CardGrid columns={3}>{projects.map((p, i) => <ContentCard key={i} {...p} />)}</CardGrid>
      </Section>
    </>
  );
}

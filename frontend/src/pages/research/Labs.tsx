import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
import { ContentCard, CardGrid } from "@/components/ui/content-card";
import researchLab from "@/assets/research-lab.jpg";

export default function Labs() {
  return (
    <>
      <PageHero title="Labs & Facilities" subtitle="State-of-the-art research infrastructure." />
      <Section>
        <CardGrid columns={2}>
          <ContentCard title="Computer Applications Research Center" description="Main research facility with high-performance computing resources." image={researchLab} />
          <ContentCard title="AI & Machine Learning Lab" description="Specialized lab for AI research with GPU workstations." />
          <ContentCard title="Cybersecurity Lab" description="Isolated network environment for security research." />
          <ContentCard title="IoT & Embedded Systems Lab" description="Development space for IoT prototyping." />
        </CardGrid>
      </Section>
    </>
  );
}

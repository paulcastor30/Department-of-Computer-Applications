import { Link } from "react-router-dom";
import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
import { ContentCard, CardGrid } from "@/components/ui/content-card";
import studentsLab from "@/assets/students-lab.jpg";
import researchLab from "@/assets/research-lab.jpg";

export default function Programs() {
  return (
    <>
      <PageHero title="Academic Programs" subtitle="Industry-aligned curricula designed to prepare students for successful careers in computing." />
      <Section>
        <CardGrid columns={2}>
          <ContentCard title="BS Computer Applications" description="A 4-year undergraduate program producing globally competitive IT professionals." href="/programs/bsca" badge="Undergraduate" image={studentsLab} featured />
          <ContentCard title="MS Computer Applications" description="A graduate program (thesis track) developing research competencies in computing." href="/programs/msca" badge="Graduate" image={researchLab} featured />
        </CardGrid>
      </Section>
    </>
  );
}

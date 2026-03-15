import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Globe } from "lucide-react";

export default function Collaborations() {
  return (
    <>
      <PageHero title="Research Collaborations" subtitle="National and international research partnerships." />
      <Section>
        <SectionHeader title="Partner Institutions" />
        <div className="grid gap-6 md:grid-cols-3">{["National University of Singapore", "University of Tokyo", "UP Diliman", "DLSU", "Ateneo", "DOST-ASTI"].map((partner, i) => (<div key={i} className="card-elevated p-6 text-center"><Globe className="h-8 w-8 text-secondary mx-auto mb-3" /><h3 className="font-semibold">{partner}</h3></div>))}</div>
      </Section>
    </>
  );
}

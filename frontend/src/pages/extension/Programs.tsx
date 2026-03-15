import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
import { ContentCard, CardGrid } from "@/components/ui/content-card";

export default function ExtensionPrograms() {
  return (
    <>
      <PageHero title="Extension Programs" subtitle="Technology-driven community outreach initiatives." />
      <Section><CardGrid columns={3}><ContentCard title="Digital Literacy Training" description="Basic computer skills for underserved communities." badge="Ongoing" /><ContentCard title="IT for Barangays" description="Technology solutions for local government units." badge="Ongoing" /><ContentCard title="Tech for Education" description="Supporting schools with IT resources and training." badge="Ongoing" /></CardGrid></Section>
    </>
  );
}

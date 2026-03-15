import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
import { ContentCard, CardGrid } from "@/components/ui/content-card";

const areas = [
  { title: "Artificial Intelligence & Machine Learning", description: "Research on AI algorithms, deep learning, and intelligent systems." },
  { title: "Data Science & Analytics", description: "Big data processing, predictive analytics, and visualization." },
  { title: "Cybersecurity", description: "Network security, cryptography, and threat detection." },
  { title: "Software Engineering", description: "Software development methodologies and quality assurance." },
  { title: "IoT & Embedded Systems", description: "Connected devices and smart systems development." },
  { title: "Educational Technology", description: "Learning management systems and e-learning innovations." },
];

export default function FocusAreas() {
  return (
    <>
      <PageHero title="Research Focus Areas" subtitle="Our strategic research domains aligned with global computing trends." />
      <Section><CardGrid columns={3}>{areas.map((a, i) => <ContentCard key={i} {...a} href="/research/projects" />)}</CardGrid></Section>
    </>
  );
}

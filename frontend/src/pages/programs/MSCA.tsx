import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { ProcessSteps } from "@/components/ui/timeline";
import { DownloadList } from "@/components/ui/download-block";

export default function MSCA() {
  return (
    <>
      <PageHero title="MS Computer Applications" subtitle="An advanced graduate program developing research competencies in computing (Thesis Track)." />
      <Section>
        <div className="max-w-4xl mx-auto"><p className="text-lg text-muted-foreground">The Master of Science in Computer Applications (MSCA) is designed for professionals seeking to advance their expertise through rigorous research in computing and information technology.</p></div>
      </Section>
      <Section variant="muted">
        <SectionHeader title="Thesis Pathway" />
        <ProcessSteps steps={[
          { step: 1, title: "Coursework", description: "Complete core and elective courses" },
          { step: 2, title: "Comprehensive Exam", description: "Pass the qualifying examination" },
          { step: 3, title: "Thesis Proposal", description: "Defend your research proposal" },
          { step: 4, title: "Thesis Defense", description: "Complete and defend your thesis" },
        ]} />
      </Section>
      <Section>
        <SectionHeader title="Research Areas" />
        <div className="grid gap-4 md:grid-cols-3">{["Artificial Intelligence", "Data Science", "Cybersecurity", "Software Engineering", "IoT & Embedded Systems", "Educational Technology"].map((area, i) => (<div key={i} className="card-elevated p-4 text-center font-medium">{area}</div>))}</div>
      </Section>
      <Section variant="muted">
        <SectionHeader title="Downloads" />
        <DownloadList items={[{ title: "MSCA Curriculum", fileType: "pdf", href: "#" }, { title: "Thesis Guidelines", fileType: "pdf", href: "#" }]} />
      </Section>
    </>
  );
}

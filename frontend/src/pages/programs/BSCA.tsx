import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { EvidenceBlock, MetricPlaceholder } from "@/components/ui/evidence-block";
import { DownloadList } from "@/components/ui/download-block";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function BSCA() {
  return (
    <>
      <PageHero title="BS Computer Applications" subtitle="A comprehensive 4-year program producing globally competitive IT professionals." />
      <Section>
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2>Program Overview</h2>
          <p>The Bachelor of Science in Computer Applications (BSCA) is designed to produce IT professionals with strong foundations in computing, business applications, and industry-ready skills.</p>
        </div>
      </Section>
      <Section variant="muted">
        <SectionHeader title="Program Educational Objectives (PEOs)" />
        <div className="max-w-3xl mx-auto space-y-3">
          {["Demonstrate professional competence in IT careers", "Pursue lifelong learning and advanced studies", "Contribute to national development through technology", "Practice ethical and socially responsible computing"].map((peo, i) => (
            <div key={i} className="card-elevated p-4 flex gap-3"><span className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold shrink-0">{i+1}</span><span>{peo}</span></div>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeader title="Curriculum" />
        <DownloadList items={[{ title: "BSCA Curriculum (CMO 25 s.2015 Aligned)", fileType: "pdf", fileSize: "2.1 MB", href: "#" }]} />
        <EvidenceBlock title="CHED PSG Alignment" accreditation={["ched"]} className="mt-6"><MetricPlaceholder label="Curriculum alignment" value="100%" /></EvidenceBlock>
      </Section>
      <Section variant="muted">
        <SectionHeader title="Frequently Asked Questions" />
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          <AccordionItem value="1"><AccordionTrigger>What are the admission requirements?</AccordionTrigger><AccordionContent>High school diploma or equivalent, passing the entrance examination, and interview.</AccordionContent></AccordionItem>
          <AccordionItem value="2"><AccordionTrigger>How long is the program?</AccordionTrigger><AccordionContent>The BSCA program is a 4-year undergraduate degree.</AccordionContent></AccordionItem>
          <AccordionItem value="3"><AccordionTrigger>What career opportunities are available?</AccordionTrigger><AccordionContent>Software Developer, Systems Analyst, Database Administrator, IT Consultant, and more.</AccordionContent></AccordionItem>
        </Accordion>
      </Section>
    </>
  );
}

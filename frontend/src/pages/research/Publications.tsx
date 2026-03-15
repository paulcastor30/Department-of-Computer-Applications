import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { FilterBar } from "@/components/ui/filter-bar";
import { EvidenceBlock, MetricPlaceholder } from "@/components/ui/evidence-block";

export default function Publications() {
  return (
    <>
      <PageHero title="Publications" subtitle="Browse our research publications and scholarly works." />
      <Section>
        <FilterBar searchPlaceholder="Search publications..." filters={[{ name: "Type", options: [{ label: "Journal", value: "journal" }, { label: "Conference", value: "conf" }] }, { name: "Year", options: [{ label: "2024", value: "2024" }, { label: "2023", value: "2023" }] }]} className="mb-8" />
        <EvidenceBlock title="Scopus-Indexed Publications" accreditation={["aaccup", "ched"]}><MetricPlaceholder label="Total Scopus publications" value="85+" /><MetricPlaceholder label="H-Index (Department)" value="12" /></EvidenceBlock>
        <div className="mt-8 space-y-4">{[1, 2, 3].map(i => (<div key={i} className="card-elevated p-4"><h4 className="font-semibold">Sample Publication Title {i}</h4><p className="text-sm text-muted-foreground">Author, A., Author, B. (2024). Journal Name, Vol(Issue), pp. DOI: 10.xxxx/xxxxx</p></div>))}</div>
      </Section>
    </>
  );
}

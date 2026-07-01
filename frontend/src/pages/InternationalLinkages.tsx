import { Seo } from "@/components/Seo";
import { Section, SectionHeader } from "@/components/ui/section";
import { placeholder } from "@/content/siteContent";

const linkageCategories = [
  "Active international memoranda of agreement or understanding.",
  "Student or faculty mobility activities.",
  "Visiting scholars, seminars, or collaborative teaching activities.",
  "International internships or industry placements.",
  "Joint research, publication, or extension collaborations.",
];

export default function InternationalLinkages() {
  return (
    <>
      <Seo title="International Linkages" description="International partnerships, mobility activities, collaborations, and documented linkages." />

      <Section>
        <SectionHeader
          title="International Linkages"
          subtitle="International linkage information should include only active, documented partnerships and activities verified by the Department, College, or University."
          align="left"
        />
        <div className="rounded-md border border-border bg-muted/30 p-5 text-sm leading-6 text-muted-foreground">
          Active international partnerships, mobility activities, visiting scholars, internships, and collaborative
          projects are {placeholder.toLowerCase()}.
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader title="Information to be Maintained" align="left" />
        <ul className="grid gap-4 md:grid-cols-2">
          {linkageCategories.map((item) => (
            <li key={item} className="rounded-md border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
              {item}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

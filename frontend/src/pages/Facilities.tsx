import { Seo } from "@/components/Seo";
import { Section, SectionHeader } from "@/components/ui/section";
import { placeholder } from "@/content/siteContent";

const facilityCategories = [
  "Teaching laboratories and classrooms.",
  "Computing equipment and development workstations.",
  "Embedded systems, IoT, electronics, and prototyping resources.",
  "Software platforms, licensed tools, and learning systems.",
  "Student support spaces and technical support arrangements.",
];

export default function Facilities() {
  return (
    <>
      <Seo title="Facilities" description="Facilities, laboratories, equipment, software, and student support resources." />

      <Section>
        <SectionHeader
          title="Facilities"
          subtitle="Facilities information should be based on verified inventories, laboratory records, equipment lists, and approved descriptions."
          align="left"
        />
        <div className="rounded-md border border-border bg-muted/30 p-5 text-sm leading-6 text-muted-foreground">
          Official laboratory names, equipment inventories, software resources, room assignments, and support facilities
          are {placeholder.toLowerCase()}.
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader title="Information to be Maintained" align="left" />
        <ul className="grid gap-4 md:grid-cols-2">
          {facilityCategories.map((item) => (
            <li key={item} className="rounded-md border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
              {item}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

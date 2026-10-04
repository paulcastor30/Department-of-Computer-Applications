import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Section, SectionHeader } from "@/components/ui/section";
import { placeholder } from "@/content/siteContent";

const extensionSections = [
  ["Programs", "/extension/programs", "Extension programs and continuing activities."],
  ["Service Projects", "/extension/service-projects", "Community projects, project leaders, and implementation periods."],
  ["Partnerships", "/extension/partnerships", "Partner communities, institutions, and documented roles."],
  ["Technology Transfer", "/extension/tech-transfer", "Technology-transfer activities and outputs."],
  ["Impact", "/extension/impact", "Documented outputs, outcomes, and impact evidence."],
];

export default function Extension() {
  return (
    <>
      <Seo title="Community work" description="Extension programs, community projects, partners, outputs, and impact documentation." />

      <Section>
        <SectionHeader as="h1"
          title="Community work"
          subtitle="Community work shares computing knowledge and tools beyond the classroom. Explore the available information below."
          align="left"
        />
        <div className="max-w-4xl rounded-md border border-border bg-muted/30 p-5 text-sm leading-6 text-muted-foreground">
          Verified extension project records, partner communities, implementation periods, outputs, and impact
          documentation are {placeholder.toLowerCase()}.
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader title="Explore community work" align="left" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {extensionSections.map(([title, href, description]) => (
            <Link key={href} to={href} className="rounded-md border border-border bg-background p-5 hover:border-secondary">
              <h2 className="mb-2 text-lg font-semibold text-primary">{title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{description}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

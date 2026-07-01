import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Section, SectionHeader } from "@/components/ui/section";
import { placeholder } from "@/content/siteContent";

const researchSections = [
  ["Research Agenda", "/research/focus-areas", "Official research agenda and priority areas."],
  ["Projects", "/research/projects", "Current and completed research projects."],
  ["Publications", "/research/publications", "Verified publications and scholarly outputs."],
  ["Laboratories", "/research/labs", "Research laboratories and facilities."],
  ["Student Research", "/research/student-research", "Undergraduate and graduate student research involvement."],
  ["Collaborations", "/research/collaborations", "Documented research collaborations and partners."],
];

export default function Research() {
  return (
    <>
      <Seo title="Research" description="Research agenda, projects, publications, laboratories, and student research." />

      <Section>
        <SectionHeader
          title="Research"
          subtitle="This section should present verified research agenda, projects, publications, laboratories, collaborations, and student research involvement."
          align="left"
        />
        <div className="max-w-4xl rounded-md border border-border bg-muted/30 p-5 text-sm leading-6 text-muted-foreground">
          Current verified research agenda, active projects, publication lists, laboratory records, and collaboration
          documents are {placeholder.toLowerCase()}.
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader title="Research Information" align="left" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {researchSections.map(([title, href, description]) => (
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

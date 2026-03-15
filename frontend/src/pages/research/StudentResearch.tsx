import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { ProcessSteps } from "@/components/ui/timeline";

export default function StudentResearch() {
  return (
    <>
      <PageHero title="Student Research Involvement" subtitle="Opportunities for students to participate in research." />
      <Section>
        <SectionHeader title="How to Get Involved" />
        <ProcessSteps steps={[
          { step: 1, title: "Express Interest", description: "Contact faculty members in your area of interest" },
          { step: 2, title: "Apply", description: "Submit application for research assistantship" },
          { step: 3, title: "Train", description: "Complete research methodology training" },
          { step: 4, title: "Contribute", description: "Work on active research projects" },
        ]} />
      </Section>
    </>
  );
}

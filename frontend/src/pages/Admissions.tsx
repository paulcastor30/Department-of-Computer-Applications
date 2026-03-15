import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { ProcessSteps } from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Admissions() {
  return (
    <>
      <PageHero title="Admissions" subtitle="Join the Department of Computer Applications and start your journey." />
      <Section><SectionHeader title="How to Apply" /><ProcessSteps steps={[{ step: 1, title: "Submit Application", description: "Complete online application form" }, { step: 2, title: "Entrance Examination", description: "Take the university entrance exam" }, { step: 3, title: "Interview", description: "Attend the admissions interview" }, { step: 4, title: "Enroll", description: "Complete enrollment requirements" }]} /></Section>
      <Section variant="muted"><SectionHeader title="Request Information" /><form className="max-w-md mx-auto space-y-4"><Input placeholder="Full Name" className="form-input" /><Input type="email" placeholder="Email Address" className="form-input" /><Input placeholder="Program of Interest" className="form-input" /><Button type="submit" className="btn-cta-primary w-full">Request Information</Button></form></Section>
    </>
  );
}

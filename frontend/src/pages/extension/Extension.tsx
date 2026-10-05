import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { DepartmentWorkExample } from "@/components/DepartmentWorkExample";
export default function Extension() {
  return <><Seo title="Community work" description="Ask the Department of Computer Applications about current community activities and collaboration." />
    <PageHero title="Community work" subtitle="Connect with the department about activities beyond the classroom." />
    <DepartmentWorkExample slug="my-comapps-workshop-2024" heading="A community learning example" />
    <Section><SectionHeader title="Ask about participating or collaborating" className="mb-5" />
      <p className="max-w-3xl leading-7">If you represent a community, school or organization, tell the department about your needs or proposed activity. Students and faculty can also enquire about current participation opportunities.</p>
      <Link className="action-link mt-6" to="/about/contact">Ask about community work</Link>
    </Section></>;
}

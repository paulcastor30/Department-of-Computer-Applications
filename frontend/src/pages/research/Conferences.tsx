import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
import { ConferenceRecordList } from "@/components/ConferenceRecordList";

export default function Conferences() {
  return <>
    <Seo title="Research conferences" description="Conference research involving DCA faculty, students and collaborators: authors, titles, dates, locations and withdrawn entries." />
    <PageHero title="Research conferences" subtitle="Explore the department’s conference research records." />
    <Section><Link className="text-link inline-flex min-h-11 items-center" to="/research">Research overview</Link></Section>
    <ConferenceRecordList />
  </>;
}

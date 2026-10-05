import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
import { PublicationRecordList } from "@/components/PublicationRecordList";

export default function Publications() {
  return <>
    <Seo title="Publications" description="Explore publications involving DCA faculty and collaborators, with authors, publication dates, journal and conference details, and links to publisher records." />
    <PageHero title="Publications" subtitle="Explore published research involving department faculty and their collaborators." />
    <Section><Link className="text-link inline-flex min-h-11 items-center" to="/research">Research overview</Link></Section>
    <PublicationRecordList />
  </>;
}

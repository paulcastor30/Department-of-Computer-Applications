import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { ResearchProjectList } from "@/components/ResearchProjectList";

export default function Projects() {
  return <>
    <Seo title="Research projects" description="Explore department research projects, reporting years, leaders, teams and funding categories." />
    <PageHero title="Research projects" subtitle="Research involving the Department of Computer Applications and its collaborators." />
    <div className="container pt-6"><Link className="text-link inline-flex min-h-11 items-center" to="/research">Research overview</Link></div>
    <ResearchProjectList />
  </>;
}

import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { ResearchProjectList } from "@/components/ResearchProjectList";

export default function Projects() {
  return <>
    <Seo title="Research projects" description="Explore department research projects, reporting years, leaders, teams and funding categories." />
    <PageHero title="Research projects" subtitle="Research involving the Department of Computer Applications and its collaborators." />
    <ResearchProjectList />
  </>;
}

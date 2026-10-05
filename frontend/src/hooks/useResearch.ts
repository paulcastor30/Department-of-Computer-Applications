import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";

export type ResearchProject = {
  id: number;
  slug: string;
  title: string;
  reporting_year: string;
  research_leader: string;
  team_members: string[];
  funding_display: string;
};

export function useResearchProjects() {
  return useQuery<ResearchProject[]>({
    queryKey: ["research", "projects"],
    queryFn: () => fetchJSON<ResearchProject[]>("/api/research/projects/"),
  });
}

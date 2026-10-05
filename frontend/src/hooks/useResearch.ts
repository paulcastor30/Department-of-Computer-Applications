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


export type ConferenceRecord = {
  id: number;
  slug: string;
  title: string;
  year: number;
  authors: string;
  conference: string;
  date_label: string;
  starts_on: string;
  ends_on: string;
  location: string;
  scope_display: string;
  withdrawn: boolean;
};

export function useConferenceRecords() {
  return useQuery<ConferenceRecord[]>({
    queryKey: ["research", "conferences"],
    queryFn: () => fetchJSON<ConferenceRecord[]>("/api/research/conferences/"),
  });
}

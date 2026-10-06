import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";

export type ResearchProject = {
  id: number;
  slug: string;
  title: string;
  plain_language_summary?: string;
  intended_audience?: string;
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


export type PublicationRecord = {
  id: number;
  slug: string;
  title: string;
  year: number;
  authors: string;
  venue: string;
  kind: "JOURNAL" | "PROCEEDINGS" | "PREPRINT";
  kind_display: string;
  citation_details: string;
  date_label: string;
  publisher: string;
  doi: string;
  source_url: string;
};

export function usePublicationRecords() {
  return useQuery<PublicationRecord[]>({
    queryKey: ["research", "publications"],
    queryFn: () => fetchJSON<PublicationRecord[]>("/api/research/publications/"),
  });
}

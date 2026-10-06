import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";

export type ExtensionProject = {
  id: number;
  slug: string;
  title: string;
  plain_language_summary?: string;
  intended_audience?: string;
  reporting_year: number;
  extension_leader: string;
  participant_groups: { label: string; members: string[] }[];
};

export function useExtensionProjects() {
  return useQuery<ExtensionProject[]>({
    queryKey: ["extension", "projects"],
    queryFn: () => fetchJSON<ExtensionProject[]>("/api/extension/projects/"),
  });
}

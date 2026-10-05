import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";

export type ProjectPrototype = {
  id: number;
  slug: string;
  title: string;
  reporting_year: number;
  summary: string;
  kind: string;
  kind_display: string;
  creator_credits: string;
  source_url: string;
};

export function usePrototypes() {
  return useQuery<ProjectPrototype[]>({
    queryKey: ["core", "prototypes"],
    queryFn: () => fetchJSON<ProjectPrototype[]>("/api/core/prototypes/"),
  });
}

import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";
import type { NewsPost } from "@/types/api";

export function useNews() {
  return useQuery<NewsPost[]>({
    queryKey: ["communications", "news"],
    queryFn: () => fetchJSON<NewsPost[]>("/api/communications/news/"),
  });
}

export function useEvents() {
  return useQuery<NewsPost[]>({
    queryKey: ["communications", "events"],
    queryFn: () => fetchJSON<NewsPost[]>("/api/communications/events/"),
  });
}
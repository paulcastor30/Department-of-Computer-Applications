import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";
import type { CalendarResponse } from "@/types/calendar";
import type { NewsPost } from "@/types/api";

export function useNews() {
  return useQuery<NewsPost[]>({
    queryKey: ["communications", "news"],
    queryFn: () => fetchJSON<NewsPost[]>("/api/communications/news/"),
  });
}

export function useEvents(view = "upcoming", kind = "all") {
  return useQuery<CalendarResponse>({
    queryKey: ["communications", "events", view, kind],
    queryFn: () => fetchJSON<CalendarResponse>(`/api/communications/events/?view=${view}&kind=${kind}`),
  });
}

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";
export type RecordSearchResult = { kind: string; title: string; href: string; summary: string };
type SearchResponse = { query: string; results: RecordSearchResult[]; has_more?: boolean };
export function useSiteSearch(query: string, enabled: boolean) {
  const [debounced, setDebounced] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => setDebounced(query), 250); return () => window.clearTimeout(timer); }, [query]);
  const result = useQuery<SearchResponse>({
    queryKey: ["core", "public-search", query],
    queryFn: () => fetchJSON<SearchResponse>(`/api/core/search/?q=${encodeURIComponent(query)}`),
    enabled: enabled && query.length >= 2 && debounced === query,
    retry: false,
    staleTime: 30_000,
  });
  return { ...result, waiting: enabled && query.length >= 2 && (query !== debounced || result.isFetching) };
}

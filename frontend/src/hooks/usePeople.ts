import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";
import type { FacultyMember } from "@/types/api";

export function useFaculty() {
  return useQuery<FacultyMember[]>({
    queryKey: ["people", "faculty"],
    queryFn: () => fetchJSON<FacultyMember[]>("/api/people/faculty/"),
  });
}
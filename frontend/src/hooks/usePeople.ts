import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";
import type { FacultyDirectoryMember, FacultyMember } from "@/types/api";

export interface DepartmentRole {
  id: number;
  role: "chairperson" | "admin_aide" | "lab_technician";
  role_display: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  office: string;
}

export function useDepartmentOrganization() {
  return useQuery<DepartmentRole[]>({
    queryKey: ["people", "organization"],
    queryFn: () => fetchJSON<DepartmentRole[]>("/api/people/organization/"),
  });
}

export function useFaculty() {
  return useQuery<FacultyDirectoryMember[]>({
    queryKey: ["people", "faculty"],
    queryFn: () => fetchJSON<FacultyDirectoryMember[]>("/api/people/faculty/"),
  });
}

export function useFacultyMember(slug: string | undefined) {
  return useQuery<FacultyMember>({
    queryKey: ["people", "faculty", slug],
    queryFn: () => fetchJSON<FacultyMember>(`/api/people/faculty/${slug}/`),
    enabled: Boolean(slug),
  });
}

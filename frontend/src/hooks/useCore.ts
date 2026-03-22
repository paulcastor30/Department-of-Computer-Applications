import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";
import type { DepartmentProfile, HomePayload, SiteSetting } from "@/types/api";

export function useHomePayload() {
  return useQuery<HomePayload>({
    queryKey: ["core", "home"],
    queryFn: () => fetchJSON<HomePayload>("/api/core/home/"),
  });
}

export function useSiteSettings() {
  return useQuery<SiteSetting>({
    queryKey: ["core", "site-settings"],
    queryFn: () => fetchJSON<SiteSetting>("/api/core/site-settings/"),
  });
}

export function useDepartmentProfile() {
  return useQuery<DepartmentProfile>({
    queryKey: ["core", "department-profile"],
    queryFn: () => fetchJSON<DepartmentProfile>("/api/core/department-profile/"),
  });
}
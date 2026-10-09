import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";

export type AlumniConfiguration = {
  accepting_updates: boolean; contact_label: string; contact_email: string;
  privacy_notice: string; notice_version: string; retention_days: number | null;
};
export type AlumniProfile = {
  email: string; full_name: string; bsca_year: number | null; msca_year: number | null;
  career_status: string; employer: string; job_title: string; interests: string;
  preferred_contact: string; phone: string; receive_updates: boolean; willing_to_mentor: boolean;
};
export type AlumniOpportunity = { slug: string; title: string; kind_label: string; description: string; provider: string; url: string; closes_on: string | null };

export function useAlumniConfiguration() {
  return useQuery<AlumniConfiguration>({ queryKey: ["alumni", "configuration"], queryFn: () => fetchJSON("/api/alumni/configuration/") });
}

export function useAlumniOpportunities() {
  return useQuery<AlumniOpportunity[]>({ queryKey: ["alumni", "opportunities"], queryFn: () => fetchJSON("/api/alumni/opportunities/") });
}

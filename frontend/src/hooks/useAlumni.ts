import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";

export type AlumniConfiguration = {
  accepting_updates: boolean; contact_label: string; contact_email: string;
  privacy_notice: string; notice_version: string; retention_days: number | null;
  retain_indefinitely?: boolean; access_keys_enabled?: boolean; email_links_available?: boolean;
};
export type AlumniCareerEntry = {
  id: number; reported_at: string; entry_kind: string; career_status: string;
  employer: string; job_title: string; industry: string; work_city: string; work_country: string;
  work_arrangement: string; duties: string; skills_used: string; work_alignment: string;
  alignment_explanation: string; career_start: string | null; career_end: string | null;
  further_study: boolean; study_program: string; study_institution: string; exam_status: string;
  exam_details: string; program_feedback: string;
};
export type AlumniProfile = {
  email: string; full_name: string; bsca_year: number | null; msca_year: number | null;
  career_status: string; employer: string; job_title: string; interests: string;
  preferred_contact: string; phone: string; receive_updates: boolean; willing_to_mentor: boolean;
  career_history?: AlumniCareerEntry[]; email_verified_at?: string | null;
  student_id?: string; family_name?: string; first_name?: string; middle_name?: string;
  permanent_address?: string; landline?: string; bsca_period?: string; msca_period?: string;
  sex?: string; residence_city?: string; residence_country?: string; industry?: string;
  work_city?: string; work_country?: string; work_arrangement?: string; duties?: string;
  skills_used?: string; work_alignment?: string; alignment_explanation?: string;
  career_start?: string | null; career_end?: string | null; further_study?: boolean;
  study_program?: string; study_institution?: string; exam_status?: string; exam_details?: string;
  program_feedback?: string; network_interests?: string; professional_url?: string;
};
export type AlumniOpportunity = { slug: string; title: string; kind_label: string; description: string; provider: string; url: string; closes_on: string | null };

export function useAlumniConfiguration() {
  return useQuery<AlumniConfiguration>({ queryKey: ["alumni", "configuration"], queryFn: () => fetchJSON("/api/alumni/configuration/") });
}

export function useAlumniOpportunities() {
  return useQuery<AlumniOpportunity[]>({ queryKey: ["alumni", "opportunities"], queryFn: () => fetchJSON("/api/alumni/opportunities/") });
}

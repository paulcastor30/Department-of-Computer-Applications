import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";
import type { Program } from "@/types/api";

export type LearningResource = {
  slug: string; title: string; topic: string; topic_label: string; provider: string;
  description: string; url: string; level_label: string; resource_type: string;
  access_note: string; activity: string; start_here: boolean;
  source_collection: string; source_section: string; source_url: string;
};

export function useLearningResources() {
  return useQuery<LearningResource[]>({
    queryKey: ["academics", "learning-resources"],
    queryFn: () => fetchJSON<LearningResource[]>("/api/academics/learning-resources/"),
  });
}

export function usePrograms() {
  return useQuery<Program[]>({
    queryKey: ["academics", "programs"],
    queryFn: () => fetchJSON<Program[]>("/api/academics/programs/"),
  });
}

export function useProgram(slug: string) {
  return useQuery<Program>({
    queryKey: ["academics", "programs", slug],
    queryFn: () => fetchJSON<Program>(`/api/academics/programs/${slug}/`),
  });
}


export type RegistrarForm = { form_id: string; title: string; href: string; note: string; fillable_form_id: string | null };

export function useRegistrarForms() {
  return useQuery<RegistrarForm[]>({
    queryKey: ["academics", "registrar-forms"],
    queryFn: () => fetchJSON<RegistrarForm[]>("/api/academics/forms/registrar/"),
  });
}

export interface SiteSetting {
  id: number;
  site_name: string;
  short_name: string;
  primary_email: string;
  primary_phone: string;
  address: string;
  facebook_url: string;
  youtube_url: string;
  linkedin_url: string;
  updated_at: string;
}

export interface DepartmentProfile {
  id: number;
  title: string;
  overview: string;
  vision: string;
  mission: string;
  goals: string;
  outcomes_mapping_note: string;
  updated_at: string;
}

export interface HeroSection {
  id: number;
  title: string;
  slug: string;
  eyebrow: string;
  subtitle: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  background_image: string | null;
  featured: boolean;
  is_published: boolean;
  sort_order: number;
  updated_at: string;
}

export interface QuickStat {
  id: number;
  label: string;
  value: string;
  note: string;
  sort_order: number;
  updated_at: string;
}

export interface HomePayload {
  site_settings: SiteSetting | Record<string, never>;
  department_profile: DepartmentProfile | Record<string, never>;
  hero_sections: HeroSection[];
  quick_stats: QuickStat[];
}

export interface Program {
  id: number;
  code: string;
  title: string;
  slug: string;
  degree_level: string;
  degree_level_display: string;
  overview: string;
  formal_description: string;
  academic_orientation: string;
  intended_learners: string;
  culminating_requirement: string;
  duration: string;
  curriculum_load: string;
  recognition: string;
  program_goals: string;
  program_goals_list: string[];
  program_educational_objectives: string;
  program_educational_objectives_list: string[];
  outcomes: string;
  outcomes_list: string[];
  academic_areas: string;
  academic_areas_list: string[];
  specialization_tracks: string;
  specialization_tracks_list: string[];
  curriculum_structure: string;
  curriculum_structure_list: string[];
  thesis_information: string;
  thesis_information_list: string[];
  student_support: string;
  student_support_list: string[];
  contact_information: string;
  curriculum_evidence: string;
  curriculum_evidence_list: string[];
  quality_evidence: string;
  quality_evidence_list: string[];
  career_opportunities: string;
  career_opportunities_list: string[];
  admission_requirements: string;
  admission_requirements_list: string[];
  progression_requirements: string;
  progression_requirements_list: string[];
  historical_notes: string;
  historical_notes_list: string[];
  faq_intro: string;
  curriculum_pdf_url: string | null;
  documents: ProgramDocument[];
  seo_title: string;
  seo_description: string;
  og_title: string;
  og_description: string;
  canonical_url: string;
  is_published: boolean;
  featured: boolean;
  sort_order: number;
  updated_at: string;
}

export interface ProgramDocument {
  id: number;
  title: string;
  document_type: string;
  document_type_display: string;
  file_url: string | null;
  url: string;
  href: string;
  note: string;
  sort_order: number;
  updated_at: string;
}

export interface FacultyMember {
  id: number;
  title: string;
  slug: string;
  position: string;
  email: string;
  phone: string;
  photo: string | null;
  educational_background: string;
  research_interests: string;
  courses_taught: string;
  certifications: string;
  awards: string;
  office: string;
  featured: boolean;
  is_published: boolean;
  updated_at: string;
  evidence_documents: string[];
}

export interface NewsPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  body: string;
  featured_image: string | null;
  published_at: string | null;
  featured: boolean;
  is_published: boolean;
  updated_at: string;
  evidence_documents: string[];
}

export interface EvidenceDocument {
  id: number;
  framework: string;
  area_code: string;
  title: string;
  description: string;
  file: string;
  last_updated: string;
  is_public_placeholder: boolean;
}

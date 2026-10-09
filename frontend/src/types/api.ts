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
  study_plan_guidance_list?: string[];
  completion_requirements_list?: string[];
  content_reviewed_on?: string | null;
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
  admissions_url?: string;
  admissions_portal_url?: string;
  transfer_evaluation_email?: string;
  transfer_evaluation_instructions?: string;
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
  fillable_form_id?: string | null;
  form_group?: string;
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

export type FacultyServiceClassification =
  | "active_dca_faculty"
  | "affiliated_msca_faculty"
  | "retired_dca_faculty"
  | "resigned_dca_faculty"
  | "academic_staff"
  | "laboratory_personnel";

export type FacultyStatus = "" | "active" | "active_full_time" | "study_leave" | "sabbatical_leave" | "retired" | "resigned" | "inactive_affiliation";

export interface FacultyDirectoryMember {
  transferred_from_dca?: boolean;
  prc_license_number?: string;
  last_updated_note?: string;
  id: number;
  title: string;
  slug: string;
  personnel_type: "faculty" | "academic_staff" | "laboratory_technician";
  personnel_type_display: string;
  service_classification: FacultyServiceClassification;
  service_classification_display: string;
  faculty_status: FacultyStatus;
  faculty_status_display: string;
  position: string;
  employment_classification: string;
  faculty_category: string;
  highest_degree: string;
  profile_summary: string;
  email: string;
  phone: string;
  photo: string | null;
  specialization_areas: string;
  research_interests: string;
  courses_taught: string;
  teaching_areas: string;
  office: string;
  home_unit: string;
  supporting_programs: string;
  msca_roles: string;
  active_affiliation: boolean;
  seo_title: string;
  seo_description: string;
  og_title: string;
  og_description: string;
  featured: boolean;
  is_published: boolean;
  sort_order: number;
  updated_at: string;
  supervised_works_count: number;
  publications_count: number;
  research_projects_count: number;
  extension_projects_count: number;
}

export interface FacultyEducation {
  id: number;
  degree_level: "doctorate" | "masters" | "bachelors" | "other";
  degree_level_display: string;
  degree_name: string;
  field_or_specialization: string;
  institution: string;
  year_completed: number | null;
  academic_status: "completed" | "ongoing" | "experience";
}

export interface FacultyExpertise {
  id: number;
  expertise_type: "expertise" | "research_interest" | "teaching_area" | "msca_course_support";
  expertise_type_display: string;
  title: string;
  description: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FacultySupervisedWork {
  id: number;
  program_level: "BSCA" | "MSCA";
  program_level_display: string;
  title: string;
  researchers: string;
  adviser: string;
  co_adviser: string;
  abstract: string;
  award: string;
  academic_year: string;
  completion_year: number | null;
  faculty_role: string;
  evidence_url: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FacultyPublication {
  id: number;
  title: string;
  authors: string;
  venue: string;
  publication_type: string;
  publication_date: string | null;
  year: number | null;
  doi: string;
  url: string;
  indexing_note: string;
  citation_text: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FacultyConference {
  id: number;
  title: string;
  conference_name: string;
  location: string;
  event_date: string | null;
  year: number | null;
  role: string;
  evidence_url: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FacultyResearchProject {
  id: number;
  funding_type: "internal" | "external";
  funding_type_display: string;
  title: string;
  funding_source: string;
  role: string;
  implementation_period: string;
  start_year: number | null;
  end_year: number | null;
  amount: string;
  status: string;
  outputs_or_evidence: string;
  evidence_url: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FacultyExtensionProject {
  id: number;
  title: string;
  funding_source: string;
  role: string;
  implementation_period: string;
  partner_community: string;
  start_year: number | null;
  end_year: number | null;
  status: string;
  evidence_url: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FacultyCreativeWork {
  id: number;
  title: string;
  category: string;
  work_date: string | null;
  year: number | null;
  description: string;
  role: string;
  evidence_url: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FacultyTrainingSeminar {
  id: number;
  title: string;
  organizer: string;
  event_date: string | null;
  year: number | null;
  role: string;
  venue: string;
  evidence_url: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FacultyAchievement {
  id: number;
  title: string;
  awarding_body: string;
  achievement_date: string | null;
  year: number | null;
  description: string;
  level: string;
  evidence_url: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DepartmentContribution {
  id: number;
  kind: "research" | "publication" | "conference" | "extension";
  title: string;
  year: string;
  role: string;
  href: string;
  withdrawn: boolean;
  doi: string;
}

export interface FacultyMember extends FacultyDirectoryMember {
  department_contributions?: DepartmentContribution[];
  educational_background: string;
  advising_areas: string;
  certifications: string;
  awards: string;
  appointment_or_assignment_note: string;
  start_year: number | null;
  end_year: number | null;
  evidence_documents: string[];
  education_records: FacultyEducation[];
  expertise_records: FacultyExpertise[];
  supervised_works: FacultySupervisedWork[];
  publications: FacultyPublication[];
  conferences: FacultyConference[];
  research_projects: FacultyResearchProject[];
  extension_projects: FacultyExtensionProject[];
  creative_works: FacultyCreativeWork[];
  training_seminars: FacultyTrainingSeminar[];
  achievements: FacultyAchievement[];
}

export interface NewsPost {
  source_url?: string;
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

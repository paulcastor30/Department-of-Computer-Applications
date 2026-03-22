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
  overview: string;
  career_opportunities: string;
  admission_requirements: string;
  faq_intro: string;
  featured: boolean;
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
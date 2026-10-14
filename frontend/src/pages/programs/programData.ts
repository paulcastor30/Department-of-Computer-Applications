import type { Program } from "@/types/api";

export type ProgramDocumentLink = {
  recordId?: number;
  fillableFormId?: string;
  documentType?: string;
  formGroup?: string;
  label: string;
  href?: string;
  note?: string;
};

export type ProgramProfile = {
  slug: string;
  code: string;
  title: string;
  level: string;
  degreeLevelCode: string;
  duration: string;
  units: string;
  recognition: string;
  summary: string;
  route: string;
  academicOrientation: string;
  intendedLearners: string;
  culminatingRequirement: string;
  academicFocus: string[];
  goals: string[];
  peos: string[];
  outcomes: string[];
  academicAreas: string[];
  curriculumStructure: string[];
  thesisInformation: string[];
  advisingInformation: string[];
  studentSupport: string[];
  documents: ProgramDocumentLink[];
  admissions: string[];
  admissionsUrl: string;
  admissionsPortalUrl: string;
  transferEvaluationEmail: string;
  transferEvaluationInstructions: string;
  progression: string[];
  pathways: string[];
  historicalNotes: string[];
  contactInformation: string;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  canonicalUrl: string;
  curriculumNotes: string[];
  studyTerms: string[];
  completionRequirements: string[];
  reviewedOn: string;
};

// Route identity is stable; academic content comes only from the public Django API.
export function hasProgramContent(value: string | undefined | null): boolean {
  return Boolean(value?.trim() && !/to be (provided|validated) by the department/i.test(value));
}
export function availableProgramItems(items: string[] = []): string[] {
  return items.filter(hasProgramContent);
}
function text(value: string | undefined | null): string {
  return hasProgramContent(value) ? value!.trim() : "";
}
export function normalizeProgram(program: Program): ProgramProfile {
  const code = text(program.code);
  const route = code === "BSCA" ? "/programs/bsca" : code === "MSCA" ? "/programs/msca" : `/programs/${program.slug}`;
  const documents: ProgramDocumentLink[] = (program.documents || [])
    .filter(document => hasProgramContent(document.title) && document.href)
    .map(document => ({ ...(document.id ? {recordId: document.id} : {}), label: document.title, href: document.href,
      documentType: document.document_type, formGroup: document.form_group || undefined,
      fillableFormId: document.fillable_form_id || undefined, note: text(document.note) || undefined }));
  // A curriculum attached directly to the published CMS program is also authoritative.
  if (program.curriculum_pdf_url && !documents.some(document => document.href === program.curriculum_pdf_url)) {
    documents.unshift({ label: `${code} curriculum`, documentType: "CURRICULUM", href: program.curriculum_pdf_url });
  }
  return {
    code, route, title: text(program.title), slug: program.slug,
    level: text(program.degree_level_display), degreeLevelCode: program.degree_level,
    documents,
    duration: text(program.duration),
    units: text(program.curriculum_load),
    recognition: text(program.recognition),
    summary: text(program.formal_description),
    academicOrientation: text(program.academic_orientation),
    intendedLearners: text(program.intended_learners),
    culminatingRequirement: text(program.culminating_requirement),
    admissionsUrl: text(program.admissions_url),
    admissionsPortalUrl: text(program.admissions_portal_url),
    transferEvaluationEmail: text(program.transfer_evaluation_email),
    transferEvaluationInstructions: text(program.transfer_evaluation_instructions),
    contactInformation: text(program.contact_information),
    seoTitle: text(program.seo_title),
    seoDescription: text(program.seo_description),
    ogTitle: text(program.og_title),
    ogDescription: text(program.og_description),
    canonicalUrl: text(program.canonical_url),
    reviewedOn: text(program.content_reviewed_on),
    academicFocus: availableProgramItems(program.academic_areas_list),
    goals: availableProgramItems(program.program_goals_list),
    peos: availableProgramItems(program.program_educational_objectives_list),
    outcomes: availableProgramItems(program.outcomes_list),
    academicAreas: availableProgramItems(program.academic_areas_list),
    curriculumStructure: availableProgramItems(program.curriculum_structure_list),
    thesisInformation: availableProgramItems(program.thesis_information_list),
    advisingInformation: availableProgramItems(program.progression_requirements_list),
    studentSupport: availableProgramItems(program.student_support_list),
    admissions: availableProgramItems(program.admission_requirements_list),
    progression: availableProgramItems(program.progression_requirements_list),
    pathways: availableProgramItems(program.career_opportunities_list),
    historicalNotes: availableProgramItems(program.historical_notes_list),
    curriculumNotes: availableProgramItems(program.curriculum_evidence_list),
    studyTerms: availableProgramItems(program.study_plan_guidance_list),
    completionRequirements: availableProgramItems(program.completion_requirements_list),
  };
}
export function normalizePrograms(programs: Program[] | undefined): ProgramProfile[] {
  return (programs || []).filter(program => program.is_published === true).map(normalizeProgram);
}

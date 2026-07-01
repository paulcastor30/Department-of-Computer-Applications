import type { Program } from "@/types/api";

export const placeholder = "To be provided by the Department.";

export type ProgramDocumentLink = {
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
  progression: string[];
  pathways: string[];
  historicalNotes: string[];
  contactInformation: string;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  canonicalUrl: string;
  isFallback: boolean;
};

const bscaFallback: ProgramProfile = {
  slug: "bsca",
  code: "BSCA",
  title: "Bachelor of Science in Computer Applications",
  level: "Undergraduate",
  degreeLevelCode: "UNDERGRAD",
  duration: placeholder,
  units: placeholder,
  recognition: "",
  summary: placeholder,
  route: "/programs/bsca",
  academicOrientation: placeholder,
  intendedLearners: placeholder,
  culminatingRequirement: "Undergraduate Thesis",
  academicFocus: [placeholder],
  goals: [placeholder],
  peos: [],
  outcomes: [placeholder],
  academicAreas: [placeholder],
  curriculumStructure: [placeholder],
  thesisInformation: [
    "The culminating academic requirement is the Undergraduate Thesis.",
    "Official thesis procedures, advising arrangements, and assessment documentation are To be provided by the Department.",
  ],
  advisingInformation: [placeholder],
  studentSupport: [placeholder],
  documents: [
    { label: "BSCA curriculum", note: placeholder },
    { label: "Undergraduate admission guide", note: placeholder },
    { label: "BSCA program brochure", note: placeholder },
    { label: "Student handbook or advising guide", note: placeholder },
  ],
  admissions: [placeholder],
  progression: [placeholder],
  pathways: [placeholder],
  historicalNotes: [],
  contactInformation: placeholder,
  seoTitle: "Bachelor of Science in Computer Applications",
  seoDescription: "Formal undergraduate program information for the Bachelor of Science in Computer Applications.",
  ogTitle: "Bachelor of Science in Computer Applications",
  ogDescription: "Undergraduate academic program information with official Department content to be provided.",
  canonicalUrl: "",
  isFallback: true,
};

const mscaFallback: ProgramProfile = {
  slug: "msca",
  code: "MSCA",
  title: "Master of Science in Computer Applications",
  level: "Graduate",
  degreeLevelCode: "GRAD",
  duration: placeholder,
  units: placeholder,
  recognition: "",
  summary: placeholder,
  route: "/programs/msca",
  academicOrientation: placeholder,
  intendedLearners: placeholder,
  culminatingRequirement: "Master’s Thesis or Graduate Thesis",
  academicFocus: [placeholder],
  goals: [placeholder],
  peos: [],
  outcomes: [placeholder],
  academicAreas: [placeholder],
  curriculumStructure: [placeholder],
  thesisInformation: [
    "The culminating academic requirement is the Master’s Thesis or Graduate Thesis.",
    "Official thesis procedures, advising arrangements, and assessment documentation are To be provided by the Department.",
  ],
  advisingInformation: [placeholder],
  studentSupport: [placeholder],
  documents: [
    { label: "MSCA curriculum", note: placeholder },
    { label: "Graduate admission guide", note: placeholder },
    { label: "MSCA program brochure", note: placeholder },
    { label: "Graduate handbook or thesis guide", note: placeholder },
  ],
  admissions: [placeholder],
  progression: [placeholder],
  pathways: [placeholder],
  historicalNotes: [],
  contactInformation: placeholder,
  seoTitle: "Master of Science in Computer Applications",
  seoDescription: "Formal graduate program information for the Master of Science in Computer Applications.",
  ogTitle: "Master of Science in Computer Applications",
  ogDescription: "Graduate academic program information with official Department content to be provided.",
  canonicalUrl: "",
  isFallback: true,
};

export const fallbackPrograms = [bscaFallback, mscaFallback];

const fallbackBySlug = {
  bsca: bscaFallback,
  msca: mscaFallback,
};

function lines(adminItems: string[] | undefined, fallbackItems: string[]) {
  return adminItems && adminItems.length > 0 ? adminItems : fallbackItems;
}

function text(value: string | undefined | null, fallback: string) {
  return value && value.trim() ? value : fallback;
}

function documentsFor(program: Program | undefined, fallback: ProgramProfile): ProgramDocumentLink[] {
  const programDocuments: ProgramDocumentLink[] = program?.documents
    ?.filter((document) => document.title)
    .map((document) => ({
      label: document.title,
      href: document.href || undefined,
      note: document.href ? undefined : document.note || placeholder,
    })) || [];

  if (program?.curriculum_pdf_url && !programDocuments.some((document) => document.label.toLowerCase().includes("curriculum"))) {
    programDocuments.unshift({
      label: `${program.code} curriculum`,
      href: program.curriculum_pdf_url,
    });
  }

  return programDocuments.length ? programDocuments : fallback.documents;
}

function fallbackFor(program: Program | undefined, fallback?: ProgramProfile): ProgramProfile {
  if (fallback) return fallback;
  if (program?.slug === "msca" || program?.code === "MSCA") return mscaFallback;
  return bscaFallback;
}

export function normalizeProgram(program: Program | undefined, fallback?: ProgramProfile): ProgramProfile {
  const base = fallbackFor(program, fallback);
  if (!program) return base;

  const academicAreas = lines(program.academic_areas_list, lines(program.specialization_tracks_list, base.academicAreas));
  const requiredThesis = base.code === "MSCA" ? "Master’s Thesis or Graduate Thesis" : "Undergraduate Thesis";
  const thesisInformation = lines(program.thesis_information_list, base.thesisInformation);

  return {
    ...base,
    code: text(program.code, base.code),
    title: text(program.title, base.title),
    slug: text(program.slug, base.slug),
    level: text(program.degree_level_display, base.level),
    degreeLevelCode: text(program.degree_level, base.degreeLevelCode),
    duration: text(program.duration, base.duration),
    units: text(program.curriculum_load, base.units),
    recognition: text(program.recognition, base.recognition),
    summary: text(program.formal_description, text(program.overview, base.summary)),
    route: `/programs/${text(program.slug, base.slug)}`,
    academicOrientation: text(program.academic_orientation, base.academicOrientation),
    intendedLearners: text(program.intended_learners, base.intendedLearners),
    culminatingRequirement: requiredThesis,
    academicFocus: academicAreas,
    goals: lines(program.program_goals_list, lines(program.program_educational_objectives_list, base.goals)),
    peos: lines(program.program_educational_objectives_list, base.peos),
    outcomes: lines(program.outcomes_list, base.outcomes),
    academicAreas,
    curriculumStructure: lines(program.curriculum_structure_list, lines(program.curriculum_evidence_list, base.curriculumStructure)),
    thesisInformation,
    advisingInformation: lines(program.progression_requirements_list, base.advisingInformation),
    studentSupport: lines(program.student_support_list, base.studentSupport),
    documents: documentsFor(program, base),
    admissions: lines(program.admission_requirements_list, base.admissions),
    progression: lines(program.progression_requirements_list, base.progression),
    pathways: lines(program.career_opportunities_list, base.pathways),
    historicalNotes: lines(program.historical_notes_list, base.historicalNotes),
    contactInformation: text(program.contact_information, base.contactInformation),
    seoTitle: text(program.seo_title, base.seoTitle),
    seoDescription: text(program.seo_description, base.seoDescription),
    ogTitle: text(program.og_title, base.ogTitle),
    ogDescription: text(program.og_description, base.ogDescription),
    canonicalUrl: text(program.canonical_url, base.canonicalUrl),
    isFallback: false,
  };
}

export function normalizePrograms(adminPrograms: Program[] | undefined): ProgramProfile[] {
  if (!adminPrograms || adminPrograms.length === 0) return fallbackPrograms;

  return adminPrograms
    .filter((program) => program.slug === "bsca" || program.slug === "msca" || program.code === "BSCA" || program.code === "MSCA")
    .map((program) => normalizeProgram(program))
    .sort((a, b) => {
      const order = { bsca: 0, msca: 1 };
      return (order[a.slug as keyof typeof order] ?? 99) - (order[b.slug as keyof typeof order] ?? 99);
    });
}

export const bscaProgram = bscaFallback;
export const mscaProgram = mscaFallback;

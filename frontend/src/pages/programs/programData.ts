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

// Reference: owner-supplied BSCA presentation, slides 5–6, 9, and 14.
// Django stores the same reference through migration 0007; substantive CMS edits take precedence.
const bscaFallback: ProgramProfile = {
  slug: "bsca",
  code: "BSCA",
  title: "Bachelor of Science in Computer Applications",
  level: "Undergraduate",
  degreeLevelCode: "UNDERGRAD",
  duration: placeholder,
  units: placeholder,
  recognition: "",
  summary: "Computer Applications bridges computing and the physical world. BSCA brings together software, firmware, and hardware to develop embedded, connected, and intelligent systems for real-world applications.",
  route: "/programs/bsca",
  academicOrientation: "Software, firmware, and hardware integration",
  intendedLearners: placeholder,
  culminatingRequirement: "Undergraduate Thesis",
  academicFocus: [
    "Software: the programs, logic, and interfaces people use.",
    "Firmware: software that controls electronic devices.",
    "Hardware: the physical components of a computer or electronic system.",
    "Embedded and connected systems: computing built into devices, including devices that exchange information over a network."
  ],
  goals: [placeholder],
  peos: [],
  outcomes: [
    "Apply knowledge of mathematics and sciences to solve computer electronics problems.",
    "Analyze a problem, formulate and identify solutions for computer applications and technology problems using analytical tools appropriate to areas of specialization.",
    "Apply design principle using software and firmware for broadly defined computer applications.",
    "Implement and evaluate computer application systems, components or processes to meet specific needs.",
    "Select and apply appropriate techniques, resources and modern computing and ICT tools necessary for computer applications practices.",
    "Function effectively as a member or leader of a development team recognizing the different roles within a team to accomplish a common goal.",
    "Communicate effectively with the computer applications community and with society at large about complex computer application activities through logical writing, presentations, and clear instructions.",
    "Understand and commit to professional ethics and responsibilities and norms of computer and cyber technology practices.",
    "Recognize the need for and have the ability, to engage in independent learning for continual development as a technology specialist."
  ],
  academicAreas: [
    "Software: the programs, logic, and interfaces people use.",
    "Firmware: software that controls electronic devices.",
    "Hardware: the physical components of a computer or electronic system.",
    "Embedded and connected systems: computing built into devices, including devices that exchange information over a network."
  ],
  curriculumStructure: [
    "Foundations: programming, mathematics, digital systems, and computer architecture.",
    "Core development: microcontrollers, operating systems, embedded systems, and software and firmware.",
    "System integration: the Internet of Things (IoT), connected systems, embedded intelligence, and hardware–software integration.",
    "Application: technical projects, research, Undergraduate Thesis, and industry training."
  ],
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

export function hasProgramContent(value: string | undefined | null): boolean {
  return Boolean(value?.trim() && !/^to be (provided|validated) by the department[.]?$/i.test(value.trim()));
}

export function availableProgramItems(items: string[]): string[] {
  return items.filter(hasProgramContent);
}

function lines(adminItems: string[] | undefined, fallbackItems: string[]) {
  const available = availableProgramItems(adminItems || []);
  return available.length ? available : fallbackItems;
}

function text(value: string | undefined | null, fallback: string) {
  return hasProgramContent(value) ? value!.trim() : fallback;
}

function documentsFor(program: Program | undefined, fallback: ProgramProfile): ProgramDocumentLink[] {
  const programDocuments: ProgramDocumentLink[] = program?.documents
    ?.filter((document) => document.title)
    .map((document) => ({
      label: document.title,
      href: document.href || undefined,
      note: document.href ? undefined : document.note || placeholder,
    })) || [];

  if (program?.curriculum_pdf_url && !programDocuments.some((document) => document.label.toLowerCase().includes("curriculum") && document.href)) {
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
    route: base.route,
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
  return fallbackPrograms.map(base => normalizeProgram(
    adminPrograms?.find(program => program.code === base.code || program.slug === base.slug), base,
  ));
}

export const bscaProgram = bscaFallback;
export const mscaProgram = mscaFallback;

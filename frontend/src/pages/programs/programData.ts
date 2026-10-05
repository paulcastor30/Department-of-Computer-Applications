import type { Program } from "@/types/api";

export const placeholder = "To be provided by the Department.";

export type ProgramDocumentLink = {
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
  duration: "Four-year study sequence in the BSCA prospectus.",
  units: "147 units excluding NSTP; 153 units including the six NSTP units.",
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
    "Proposal hearing — Prepare Form 017 (Nomination of Members of Advisory Panel). Submit Form 019 (Approval for Proposal Hearing) with your manuscript to the College Dean and panel members at least one week before the presentation. Prepare three copies and attach the official receipt (OR) or scholarship approval/signature.",
    "Proposal approval — Prepare Form 020 (Approval of Proposal), including both pages, with one copy for each panel member.",
    "Final defense — Prepare Form 021 (Nomination of Members of Oral Exam Panel). Submit Form 022 (Approval for Final Defense) with your manuscript to the College Dean and panel members one week before the presentation. Prepare three copies and attach the official receipt or scholarship grant approval/signature. Ask your thesis adviser or the department for the payment slip.",
    "Final-defense poster — Attach an A4 research poster summarizing the abstract, introduction, research design and methods, results and discussion, and conclusions and recommendations.",
    "Final-defense timing — Conduct the final presentation at least one month before grades are automatically locked. Confirm the applicable grade-locking date with your thesis adviser or the department before scheduling.",
    "Final-defense reports — Prepare Form 023 (Oral Exam Report on Final Defense), including both pages, with one copy per panel member, and Form 024 (Panel Oral Exam Report).",
    "Bound manuscript — Print the Certificate of Panel Approval and attach the Certificate of Authentic Authorship as the last page of your manuscript. Use the ODGP Research Quick Guide for the authorship certificate format.",
    "Forms and advising — Ask your thesis adviser or the department for current forms, the Research Quick Guide, payment instructions, adviser/panel arrangements and the applicable graduation submission checklist. This summary covers the supplied procedure; it does not replace the full guide.",
  ],
  advisingInformation: [placeholder],
  studentSupport: [placeholder],
  documents: [
    { label: "BSCA prospectus (PDF, 5 pages)", href: "/curricula/bsca-prospectus.pdf", note: "Department-supplied prospectus." },
    { label: "BSCA curriculum", note: placeholder },
    { label: "Undergraduate admission guide", note: placeholder },
    { label: "BSCA program brochure", note: placeholder },
    { label: "Student handbook or advising guide", note: placeholder },
  ],
  admissions: [
    "Admission to BSCA follows MSU-IIT’s official admissions procedures. Review the current requirements, document checklist and application announcements before applying.",
    "Incoming first-year applicants should use the MSU-IIT Admission Portal when applications open. Transfer and second-degree applicants should follow the university’s applicable instructions and contact the department about program evaluation.",
    "Admission is subject to the university’s selection process and available program slots.",
  ],
  admissionsUrl: "https://www.msuiit.edu.ph/offices/admissions/requirements.php",
  admissionsPortalUrl: "https://admission.msuiit.edu.ph/",
  progression: [placeholder],
  pathways: [placeholder],
  historicalNotes: [],
  contactInformation: placeholder,
  seoTitle: "Bachelor of Science in Computer Applications",
  seoDescription: "Formal undergraduate program information for the Bachelor of Science in Computer Applications.",
  ogTitle: "Bachelor of Science in Computer Applications",
  ogDescription: "Explore BSCA at MSU-IIT: software, firmware and hardware foundations for embedded, connected and intelligent systems.",
  canonicalUrl: "",
  curriculumNotes: ["Curriculum source: BSCA prospectus, citing BOR Resolution No. 129, Series of 2018."],
  studyTerms: [
    "Units: the credit assigned to a course. The total describes the study load, not the number of courses.",
    "NSTP (National Service Training Program): the two first-year subjects shown separately in parentheses in the prospectus. They add six units to the 147-unit total."
  ],
  completionRequirements: [
    "Undergraduate Thesis: BCA199 is listed as a three-unit course, following Research Methods.",
    "On-the-job training: BCA197 is listed as six units and 700 hours in the final semester."
  ],
  reviewedOn: "2026-10-05",
  isFallback: true,
};

const mscaFallback: ProgramProfile = {
  slug: "msca",
  code: "MSCA",
  title: "Master of Science in Computer Applications",
  level: "Graduate",
  degreeLevelCode: "GRAD",
  duration: "Two-year study sequence in the MSCA prospectus.",
  units: "31 units for the non-scholar plan; 34 for the ERDT scholarship plan; 43 for the plan with bridging courses. Confirm your applicable plan with the department.",
  recognition: "",
  summary: "MSCA advances the study of Computer Applications through specialized study and research in embedded and connected systems. It builds on software, firmware, and hardware foundations to address real-world computing problems.",
  route: "/programs/msca",
  academicOrientation: "Advanced study and research in embedded and connected systems",
  intendedLearners: placeholder,
  culminatingRequirement: "Master’s Thesis or Graduate Thesis",
  academicFocus: [
    "Advanced embedded systems: computing built into devices, including how software and hardware work together.",
    "Internet of Things (IoT): connected devices, their networks, and device security.",
    "Machine learning and computer vision: methods that help systems learn from data and interpret images.",
    "Cloud computing and IoT data analytics: services and methods for managing and analyzing data from connected systems."
  ],
  goals: [placeholder],
  peos: [],
  outcomes: [
    "Demonstrate mastery of advanced knowledge in Computer Applications to solve complex computing problems and apply relevant approaches, resources, and emerging technologies.",
    "Apply practical skills, ideas, and related technologies to new problems and societal issues in Computer Applications.",
    "Conduct research, collaborate, and communicate results in written work and presentations."
  ],
  academicAreas: [
    "Advanced embedded systems: computing built into devices, including how software and hardware work together.",
    "Internet of Things (IoT): connected devices, their networks, and device security.",
    "Machine learning and computer vision: methods that help systems learn from data and interpret images.",
    "Cloud computing and IoT data analytics: services and methods for managing and analyzing data from connected systems."
  ],
  curriculumStructure: [
    "Core study: advanced computer organization, advanced operating systems, research methods, and system development with emerging technologies.",
    "Specialized study: subjects selected in relation to the student\u2019s research interests, including embedded systems and IoT.",
    "Research preparation: systematic review and a research seminar in ICT.",
    "Independent research: the Master\u2019s Thesis."
  ],
  thesisInformation: [
    "The culminating academic requirement is the Master’s Thesis or Graduate Thesis.",
    "Proposal hearing — Prepare Form 017 (Nomination of Members of Advisory Panel). Submit Form 019 (Approval for Proposal Hearing) with your manuscript to the College Dean and panel members at least one week before the presentation. Prepare three copies and attach the official receipt (OR) or scholarship approval/signature.",
    "Proposal approval — Prepare Form 020 (Approval of Proposal), including both pages, with one copy for each panel member.",
    "Final defense — Prepare Form 021 (Nomination of Members of Oral Exam Panel). Submit Form 022 (Approval for Final Defense) with your manuscript to the College Dean and panel members one week before the presentation. Prepare three copies and attach the official receipt or scholarship grant approval/signature. Ask the graduate coordinator for the payment slip.",
    "Final-defense poster — Attach an A4 research poster summarizing the abstract, introduction, research design and methods, results and discussion, and conclusions and recommendations.",
    "Final-defense timing — Conduct the final presentation at least one month before grades are automatically locked. Confirm the applicable grade-locking date with the graduate coordinator before scheduling.",
    "Final-defense reports — Prepare Form 023 (Oral Exam Report on Final Defense), including both pages, with one copy per panel member, and Form 024 (Panel Oral Exam Report).",
    "Bound manuscript — Print the Certificate of Panel Approval and attach the Certificate of Authentic Authorship as the last page of your manuscript. Use the ODGP Research Quick Guide for the authorship certificate format.",
    "Forms and advising — Ask the graduate coordinator for current forms, the Research Quick Guide, payment instructions, adviser/panel arrangements and the applicable graduation submission checklist. This summary covers the supplied procedure; it does not replace the full guide.",
  ],
  advisingInformation: [placeholder],
  studentSupport: [placeholder],
  documents: [
    { label: "MSCA prospectus (PDF, 4 pages)", href: "/curricula/msca-prospectus.pdf", note: "Department-supplied prospectus." },
    { label: "MSCA curriculum", note: placeholder },
    { label: "Graduate admission guide", note: placeholder },
    { label: "MSCA program brochure", note: placeholder },
    { label: "Revised university graduate publication policy (June 2026)", href: "https://msuiit.edu.ph/news/news-detail.php?id=2496", note: "Confirm the graduate track and required evidence with your coordinator." },
    { label: "CCS graduate thesis guide and forms", documentType: "HANDBOOK", href: "https://sites.google.com/g.msuiit.edu.ph/ccsg/resources", note: "College resources for the Graduate Framework, Thesis Guide and graduate forms. Follow college guidance for the applicable procedure and form version." },
    { label: "CCS graduate coordinator and contact details", documentType: "CONTACT", href: "https://sites.google.com/g.msuiit.edu.ph/ccsg/contact" },
  ],
  admissions: ['MSCA applicants should follow the College of Computer Studies graduate application and admission procedures. Review the official guide for eligibility, required documents, program acceptance, university admission and enrolment steps.'],
  admissionsUrl: "https://sites.google.com/g.msuiit.edu.ph/ccsg/applicationadmission",
  admissionsPortalUrl: "",
  progression: [placeholder],
  pathways: [placeholder],
  historicalNotes: [],
  contactInformation: "CCS Graduate Program Coordinator\nOffice of the Dean, College of Computer Studies, MSU-IIT\nccs.gs@g.msuiit.edu.ph",
  seoTitle: "Master of Science in Computer Applications",
  seoDescription: "Formal graduate program information for the Master of Science in Computer Applications.",
  ogTitle: "Master of Science in Computer Applications",
  ogDescription: "Explore MSCA at MSU-IIT: advanced study and research in Computer Applications, with program information and admissions guidance.",
  canonicalUrl: "",
  curriculumNotes: ["Curriculum source: MSCA prospectus, citing BOR Resolution No. 128, Series of 2023."],
  studyTerms: [
    "Units: the credit assigned to a course. Different study plans have different total units.",
    "Non-scholar plan: the 31-unit study sequence labelled “A. Non-Scholar” in the prospectus.",
    "ERDT (Engineering Research and Development for Technology): the scholarship program named in the 34-unit study plan, which includes Technology Entrepreneurship.",
    "Bridging courses: additional foundational subjects used to prepare a student for advanced study. The prospectus shows a 43-unit plan with bridging courses, with subjects selected through the adviser’s evaluation of the study plan."
  ],
  completionRequirements: [
    "Master’s Thesis: MCA300 is listed as a six-unit course.",
    "Comprehensive examination: the prospectus lists this examination after the required core study. Ask the department about scheduling and preparation.",
    "Publication requirement: follow the university’s revised graduate publication policy, approved in June 2026. Required evidence differs by graduate track. Ask the graduate coordinator which track and requirement apply to MSCA."
  ],
  reviewedOn: "2026-10-05",
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
      documentType: document.document_type,
      formGroup: document.form_group || undefined,
      href: document.href || undefined,
      note: hasProgramContent(document.note) ? document.note : (document.href ? undefined : placeholder),
    })) || [];

  if (program?.curriculum_pdf_url && !programDocuments.some((document) => document.label.toLowerCase().includes("curriculum") && document.href)) {
    programDocuments.unshift({
      label: `${program.code} curriculum`,
      href: program.curriculum_pdf_url,
    });
  }

  const hasCurriculum = Boolean(program?.curriculum_pdf_url) || program?.documents?.some(document =>
    document.href && (document.document_type === "CURRICULUM" || /curriculum|prospectus/i.test(document.title)));
  if (!hasCurriculum) {
    const prospectus = fallback.documents.find(document => document.href && document.label.includes("prospectus"));
    if (prospectus) programDocuments.unshift(prospectus);
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
    curriculumStructure: lines(program.curriculum_structure_list, base.curriculumStructure),
    curriculumNotes: lines(program.curriculum_evidence_list, base.curriculumNotes),
    studyTerms: lines(program.study_plan_guidance_list, base.studyTerms),
    completionRequirements: lines(program.completion_requirements_list, base.completionRequirements),
    reviewedOn: /^\d{4}-\d{2}-\d{2}$/.test(program.content_reviewed_on || "") ? program.content_reviewed_on! : base.reviewedOn,
    thesisInformation,
    advisingInformation: lines(program.progression_requirements_list, base.advisingInformation),
    studentSupport: lines(program.student_support_list, base.studentSupport),
    documents: documentsFor(program, base),
    admissions: lines(program.admission_requirements_list, base.admissions),
    admissionsUrl: text(program.admissions_url, base.admissionsUrl),
    admissionsPortalUrl: text(program.admissions_portal_url, base.admissionsPortalUrl),
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

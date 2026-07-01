import type { Program } from "@/types/api";

export type ProgramProfile = {
  slug: string;
  code: string;
  title: string;
  level: string;
  duration: string;
  units: string;
  recognition: string;
  summary: string;
  route: string;
  intendedLearners: string;
  academicFocus: string[];
  peos: string[];
  goals: string[];
  outcomes: string[];
  tracks: string[];
  curriculumStructure: string[];
  capstoneOrThesis: string[];
  industryOrAdvising: string[];
  studentSupport: string[];
  documents: Array<{ label: string; href?: string; note?: string }>;
  curriculumEvidence: string[];
  qualityEvidence: string[];
  admissions: string[];
  progression: string[];
  careers: string[];
};

export const bscaProgram: ProgramProfile = {
  slug: "bsca",
  code: "BSCA",
  title: "Bachelor of Science in Computer Applications",
  level: "Undergraduate",
  duration: "4 years",
  units: "147 academic units plus NSTP, with 700-hour OJT",
  recognition: "BOR-approved curriculum, Resolution No. 129, Series of 2018",
  summary:
    "The BSCA program is an undergraduate applied-computing program covering software and firmware development, embedded systems, Internet of Things, applied research, thesis work, and supervised industry immersion.",
  route: "/programs/bsca",
  intendedLearners:
    "Applicants seeking an undergraduate computing program with emphasis on applied software development, systems development, embedded systems, IoT, and supervised industry exposure.",
  academicFocus: [
    "Applied computing and software development.",
    "Systems development, integration, and deployment.",
    "Embedded systems, firmware, and connected devices.",
    "Internet of Things and related computing applications.",
    "Applied research and undergraduate thesis work.",
  ],
  peos: [
    "Professional growth and advancement in career.",
    "Pursuit of graduate studies or further training.",
    "Continuous professional development and lifelong learning.",
    "Ethical and competent practice of the computer applications profession.",
  ],
  goals: [
    "Provide students with foundational and applied preparation in computer applications.",
    "Develop competence in software, firmware, systems, and application development.",
    "Prepare students for supervised research, industry immersion, and professional practice.",
  ],
  outcomes: [
    "CA01 - Apply knowledge of mathematics and sciences to solve computer electronics problems.",
    "CA02 - Analyze a problem, formulate, and identify solutions for computer applications and technology problems using analytical tools appropriate to areas of specialization.",
    "CA03 - Apply design principles using software and firmware for broadly defined computer applications.",
    "CA04 - Implement and evaluate computer application systems, components, or processes to meet specific needs.",
    "CA05 - Select and apply appropriate techniques, resources, and modern computing and ICT tools necessary for computer applications practice.",
    "CA06 - Function effectively as a member or leader of a development team, recognizing different roles within a team to accomplish a common goal.",
    "CA07 - Communicate effectively with the computer applications community and society at large through logical writing, presentations, and clear instructions.",
    "CA08 - Understand and commit to professional ethics, responsibilities, and norms of computer and cyber technology practice.",
    "CA09 - Recognize the need for, and have the ability to engage in, independent learning for continual development as a technology specialist.",
  ],
  tracks: [
    "Embedded Systems Track: edge devices, control, interfacing, and embedded intelligence.",
    "Computer Vision.",
    "HDL Programming.",
    "Embedded Systems Programming.",
    "Digital Signal Processing.",
    "Internet of Things Track: connectivity, data exchange, smart monitoring, and intelligent systems.",
    "Programming for IoT.",
    "Applied IoT.",
    "Artificial Intelligence in IoT.",
    "Robotics Systems.",
  ],
  curriculumStructure: [
    "General education and values formation.",
    "Mathematics and analytical foundations.",
    "Programming, data structures, algorithms, and application development.",
    "Information management and real-world application systems.",
    "Computer systems, embedded systems, firmware, and Internet of Things.",
    "Technical electives and specialization courses.",
    "Research methods, undergraduate thesis, and practicum or industry immersion.",
  ],
  capstoneOrThesis: [
    "Research methods and undergraduate thesis are included in the program structure.",
    "Student project, thesis, or prototype documentation should be maintained by the Department.",
  ],
  industryOrAdvising: [
    "The curriculum records indicate a supervised industry immersion or on-the-job training component.",
    "Current internship placement procedures, host institutions, and advising processes are To be provided by the Department.",
  ],
  studentSupport: [
    "Academic advising arrangements are To be provided by the Department.",
    "Laboratory access, software resources, and technical support arrangements are To be provided by the Department.",
    "Student handbook or advising guide is To be provided by the Department.",
  ],
  documents: [
    { label: "BSCA curriculum", note: "To be provided by the Department." },
    { label: "Admission guide", note: "To be provided by the Department." },
    { label: "Program brochure", note: "To be provided by the Department." },
    { label: "Student handbook or advising guide", note: "To be provided by the Department." },
  ],
  curriculumEvidence: [
    "Applied computing focus on real-world design, development, integration, and deployment of computing applications and systems.",
    "Two specialization pathways in Embedded Systems and Internet of Things.",
    "Hands-on laboratory and project work through programming demonstrations, guided laboratory sessions, and project-based learning.",
    "Applied research, research methods, and undergraduate thesis development.",
    "700-hour supervised industry immersion for workplace readiness, including opportunities with national and international companies.",
    "Emerging technology orientation aligned with Industry 4.0, IoT, AI, and current technological demands.",
  ],
  qualityEvidence: [
    "Curriculum map showing every course contribution to program outcomes.",
    "Syllabi with outcomes, assessment tasks, rubrics, references, and continuous improvement notes.",
    "OJT memoranda, supervisor evaluations, student portfolios, and employer feedback.",
    "Thesis abstracts, prototype documentation, defense rubrics, and adviser-panel evaluation records.",
  ],
  admissions: [
    "University admission eligibility and compliance with current undergraduate admission policies.",
    "Department orientation on program outcomes, retention rules, professional conduct, and computing laboratory use.",
    "Advising record for course sequencing, prerequisite compliance, and academic intervention where needed.",
  ],
  progression: [
    "Completion of prerequisite courses before advanced programming, systems, embedded, and research courses.",
    "Research-methods preparation before thesis work.",
    "OJT deployment only after the department verifies readiness, documentation, and host-office requirements.",
  ],
  careers: [
    "Software developer",
    "Systems analyst",
    "IoT or embedded-systems developer",
    "Data and application support specialist",
    "QA tester or technical documentation specialist",
    "Graduate-study candidate in computing and allied fields",
  ],
};

export const mscaProgram: ProgramProfile = {
  slug: "msca",
  code: "MSCA",
  title: "Master of Science in Computer Applications",
  level: "Graduate",
  duration: "Coursework, comprehensive examination, thesis proposal, thesis defense",
  units: "31 units for the regular track; 43 units when bridging courses are required",
  recognition: "Revised graduate curriculum with thesis and publication requirements",
  summary:
    "The MSCA program is a thesis-based graduate program in applied computing, embedded systems, IoT, machine learning, cloud computing, cybersecurity, analytics, and related computing applications.",
  route: "/programs/msca",
  intendedLearners:
    "Applicants seeking graduate-level preparation in applied computing research, advanced systems, computing applications, and thesis-based scholarly work.",
  academicFocus: [
    "Applied computing research.",
    "Embedded systems and Internet of Things.",
    "Machine learning, analytics, and intelligent systems.",
    "Cloud computing and networked systems.",
    "Thesis development and scholarly dissemination.",
  ],
  peos: [],
  goals: [
    "Develop graduate-level competence in applied computing research.",
    "Prepare students to conduct thesis work using appropriate methods, data, and ethical research practice.",
    "Support scholarly output, technical leadership, and progression to advanced professional or doctoral pathways.",
  ],
  outcomes: [
    "Formulate research problems grounded in computing theory, applied systems, and documented societal or industry need.",
    "Design and evaluate advanced computing solutions using rigorous methods, defensible data, and ethical research practice.",
    "Produce a thesis and a publication-quality research output appropriate for refereed or juried scholarly venues.",
    "Lead computing projects, mentor technical teams, and contribute to institutional research, extension, and innovation agendas.",
  ],
  tracks: [
    "Advanced Embedded Systems.",
    "Advanced Digital Signal Processing.",
    "Advanced Computer Vision.",
    "Applied Machine Learning for Embedded Systems.",
    "Advanced Internet of Things.",
    "Network Security for IoT.",
    "Advanced Cloud Computing.",
    "Applied Big-Data and Analytics for IoT.",
  ],
  curriculumStructure: [
    "Core graduate courses in advanced computer organization, advanced operating systems, research methods, emerging technologies, ICT for peace and development, and systematic review.",
    "Specialization courses in embedded systems, digital signal processing, computer vision, machine learning for embedded systems, IoT, network security, cloud computing, and big-data analytics.",
    "Comprehensive examination after required core preparation.",
    "Thesis proposal, thesis implementation, final defense, and publication or juried scholarly output.",
    "Prescribed bridging courses for applicants requiring additional computing preparation.",
  ],
  capstoneOrThesis: [
    "The MSCA is structured as a thesis-based graduate program.",
    "The pathway includes thesis proposal, thesis implementation, final defense, and publication or juried scholarly-output evidence.",
  ],
  industryOrAdvising: [
    "Graduate advising arrangements, adviser assignment procedures, and research supervision loads are To be provided by the Department.",
    "Graduate-school residency, comprehensive examination, and thesis procedures should follow official Graduate School policies.",
  ],
  studentSupport: [
    "Graduate advising information is To be provided by the Department.",
    "Research laboratory access and scholarly support arrangements are To be provided by the Department.",
    "Graduate handbook or thesis guide is To be provided by the Department.",
  ],
  documents: [
    { label: "MSCA curriculum", note: "To be provided by the Department." },
    { label: "Graduate admission guide", note: "To be provided by the Department." },
    { label: "Program brochure", note: "To be provided by the Department." },
    { label: "Graduate handbook or thesis guide", note: "To be provided by the Department." },
  ],
  curriculumEvidence: [
    "Core courses cover advanced computer organization, advanced operating systems, research methods, emerging technologies, ICT for peace and development, systematic review, and thesis.",
    "Specialization courses include advanced embedded systems, digital signal processing, computer vision, machine learning for embedded systems, IoT, IoT network security, cloud computing, and big-data analytics for IoT.",
    "Comprehensive examination is taken after the required core preparation and before thesis progression.",
    "Graduation requires a thesis and at least one research output accepted in a refereed journal or equivalent juried scholarly outlet.",
  ],
  qualityEvidence: [
    "Graduate faculty qualifications, research supervision load, adviser expertise, and panel membership records.",
    "Course syllabi with graduate-level outcomes, assessment rubrics, research tasks, and current references.",
    "Comprehensive examination policies, results, item analysis, and improvement actions.",
    "Thesis proposals, ethics documentation, defense minutes, publication evidence, and citation or utilization records.",
  ],
  admissions: [
    "Graduate-school admission compliance, transcript review, and program-fit evaluation.",
    "Bridging-course prescription for applicants needing additional preparation in computing foundations.",
    "Orientation on research ethics, thesis supervision, graduate retention, residency, and publication expectations.",
  ],
  progression: [
    "Completion of core coursework before comprehensive examination.",
    "Enrollment in graduate residency when no other course is taken while preparing for examination or thesis requirements.",
    "Successful thesis proposal defense before implementation, final defense, and publication documentation.",
  ],
  careers: [
    "Graduate researcher",
    "Computing faculty member or trainer",
    "Systems architect",
    "IoT, AI, or analytics specialist",
    "Technology project lead",
    "Doctoral-study candidate",
  ],
};

export const programs = [bscaProgram, mscaProgram];

export const historicalLinkages = [
  "Earlier MSCA curriculum documents included an ERDT scholarship-aligned 34-unit structure.",
  "The department should present this as a previous ERDT-linked curriculum track, not as a current scholarship offer.",
  "This historical linkage may support future partnership, scholarship, and quality-assurance narratives when backed by dated documents and outputs.",
];

export const qaStandards = [
  "CHED COPC: approved curriculum, PSG compliance, faculty qualifications, facilities, library and laboratory resources, admission and retention policies, and student-support evidence.",
  "AACCUP Level III: outcomes-based instruction, faculty development, student achievement, research, extension, linkages, stakeholder feedback, and documented continuous improvement.",
  "CHED COE: qualified faculty profile, research productivity, graduate outcomes, extension leadership, institutional linkages, facilities, specialization strength, and evidence of distinction.",
  "AUN-QA: expected learning outcomes, curriculum structure and content, teaching-learning approach, student assessment, academic staff quality, student support, facilities, output indicators, and stakeholder feedback.",
];

export const evidenceMatrix = [
  {
    framework: "CHED COPC",
    evidence: "Curriculum authority, PSG alignment, faculty credentials, facilities, laboratory and library holdings, admission-retention rules, and student services.",
  },
  {
    framework: "AACCUP Level III",
    evidence: "Instructional quality, research and extension outputs, faculty development, student performance, linkages, stakeholder evaluation, and actions taken.",
  },
  {
    framework: "CHED COE",
    evidence: "Program distinction through faculty profile, high-quality research, graduate outcomes, extension utilization, external linkages, facilities, and specialization leadership.",
  },
  {
    framework: "AUN-QA",
    evidence: "Outcome-curriculum-assessment alignment, academic staff quality, student support, facilities, quality enhancement, stakeholder feedback, and output measures.",
  },
];

const fallbackBySlug = {
  bsca: bscaProgram,
  msca: mscaProgram,
};

function pickList(adminItems: string[] | undefined, fallbackItems: string[]) {
  return adminItems && adminItems.length > 0 ? adminItems : fallbackItems;
}

export function normalizeProgram(program: Program | undefined, fallback: ProgramProfile): ProgramProfile {
  if (!program) return fallback;

  return {
    ...fallback,
    code: program.code || fallback.code,
    title: program.title || fallback.title,
    slug: program.slug === "msca" ? "msca" : program.slug === "bsca" ? "bsca" : fallback.slug,
    level: program.degree_level_display || fallback.level,
    duration: program.duration || fallback.duration,
    units: program.curriculum_load || fallback.units,
    recognition: program.recognition || fallback.recognition,
    summary: program.overview || fallback.summary,
    route: `/programs/${program.slug || fallback.slug}`,
    intendedLearners: fallback.intendedLearners,
    academicFocus: fallback.academicFocus,
    peos: pickList(program.program_educational_objectives_list, fallback.peos),
    goals: fallback.goals,
    outcomes: pickList(program.outcomes_list, fallback.outcomes),
    tracks: pickList(program.specialization_tracks_list, fallback.tracks),
    curriculumStructure: fallback.curriculumStructure,
    capstoneOrThesis: fallback.capstoneOrThesis,
    industryOrAdvising: fallback.industryOrAdvising,
    studentSupport: fallback.studentSupport,
    documents: fallback.documents,
    curriculumEvidence: pickList(program.curriculum_evidence_list, fallback.curriculumEvidence),
    qualityEvidence: pickList(program.quality_evidence_list, fallback.qualityEvidence),
    admissions: pickList(program.admission_requirements_list, fallback.admissions),
    progression: pickList(program.progression_requirements_list, fallback.progression),
    careers: pickList(program.career_opportunities_list, fallback.careers),
  };
}

export function normalizePrograms(adminPrograms: Program[] | undefined): ProgramProfile[] {
  if (!adminPrograms || adminPrograms.length === 0) return programs;

  const merged = programs.map((fallback) => {
    const adminProgram = adminPrograms.find((program) => program.slug === fallback.slug || program.code === fallback.code);
    return normalizeProgram(adminProgram, fallback);
  });

  const extraPrograms = adminPrograms
    .filter((program) => !fallbackBySlug[program.slug as keyof typeof fallbackBySlug])
    .map((program) => ({
      slug: program.slug === "msca" ? "msca" : "bsca",
      code: program.code,
      title: program.title,
      level: program.degree_level_display || program.degree_level,
      duration: program.duration || "See program details",
      units: program.curriculum_load || "See approved curriculum",
      recognition: program.recognition || "Published program record",
      summary: program.overview,
      route: `/programs/${program.slug}`,
      intendedLearners: "To be provided by the Department.",
      academicFocus: [],
      peos: program.program_educational_objectives_list || [],
      goals: [],
      outcomes: program.outcomes_list || [],
      tracks: program.specialization_tracks_list || [],
      curriculumStructure: [],
      capstoneOrThesis: [],
      industryOrAdvising: [],
      studentSupport: [],
      documents: [],
      curriculumEvidence: program.curriculum_evidence_list || [],
      qualityEvidence: program.quality_evidence_list || [],
      admissions: program.admission_requirements_list || [],
      progression: program.progression_requirements_list || [],
      careers: program.career_opportunities_list || [],
    }));

  return [...merged, ...extraPrograms];
}

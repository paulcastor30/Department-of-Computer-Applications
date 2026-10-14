import type { Program } from "@/types/api";
export const publishedPrograms = ["BSCA", "MSCA"].map(code => ({
  code, slug: code.toLowerCase(), is_published: true,
  title: code === "BSCA" ? "Bachelor of Science in Computer Applications" : "Master of Science in Computer Applications",
  degree_level: code === "BSCA" ? "UNDERGRAD" : "GRAD",
  degree_level_display: code === "BSCA" ? "Undergraduate" : "Graduate",
  culminating_requirement: code === "BSCA" ? "Undergraduate Thesis" : "Master’s Thesis or Graduate Thesis",
  formal_description: code === "BSCA" ? "Published undergraduate introduction." : "MSCA advances the study of Computer Applications through graduate research.",
  academic_areas_list: [code === "BSCA" ? "Firmware: software that controls devices." : "Advanced embedded systems: computing built into devices."],
  outcomes_list: ["Apply knowledge of mathematics and sciences."],
  curriculum_load: code === "MSCA" ? "31 units for the non-scholar plan." : "153 units.",
  study_plan_guidance_list: ["Bridging courses: foundation subjects."],
  completion_requirements_list: ["Publication requirement: follow the approved graduate policy."],
  curriculum_evidence_list: ["BOR Resolution No. 128, Series of 2023."],
  admissions_url: code === "BSCA" ? "https://www.msuiit.edu.ph/offices/admissions/requirements.php" : "https://sites.google.com/g.msuiit.edu.ph/ccsg/applicationadmission",
  admissions_portal_url: code === "BSCA" ? "https://admission.msuiit.edu.ph/" : "",
  documents: [{ title: `${code} prospectus (PDF, ${code === "BSCA" ? 5 : 4} pages)`, href: `/curricula/${code.toLowerCase()}-prospectus.pdf` },
    ...(code === "MSCA" ? [{ title: "Revised university graduate publication policy (June 2026)", href: "https://msuiit.edu.ph/news/news-detail.php?id=2496" }] : [])],
} as Program));

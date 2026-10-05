export const departmentQuestions = [
  { title: "Who are we?", description: "Meet the department, faculty, and staff.", href: "/about" },
  { title: "What do we do?", description: "Explore teaching, research, and community work.", href: "/our-work" },
  { title: "When can you participate?", description: "Find announcements and ask about dates.", href: "/news" },
  { title: "Where are we?", description: "Get directions and plan an accessible visit.", href: "/about/location" },
  { title: "Why does our work matter?", description: "Read our college's mission and vision.", href: "/about#purpose" },
  { title: "How can you connect?", description: "Ask about studying, visiting, or working with us.", href: "/about/contact" },
];

export const departmentIdentity = {
  name: "Department of Computer Applications",
  college: "College of Computer Studies",
  institution: "Mindanao State University – Iligan Institute of Technology",
  address: "1st floor, College of Computer Studies\nMindanao State University-Iligan Institute of Technology\nAndres Bonifacio Avenue, Tibanga, 9200 Iligan City, Philippines",
  email: "ccs.ca@g.msuiit.edu.ph",
  phone: "+63 221 2002",
  phoneExtension: "4112",
  officeHours: "Monday to Friday, 8:00 AM–5:00 PM (Philippine time)",
};

export const placeholder = "To be provided by the Department";

export const primaryNavigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "People", href: "/faculty" },
  { label: "Research", href: "/research" },
  { label: "News and Events", href: "/news" },
  { label: "Contact & visit", href: "/about/contact" },
];

export const homepageSections = [
  {
    title: "Academic Programs",
    description:
      "Undergraduate and graduate programs in computer applications.",
    href: "/programs",
  },
  {
    title: "Faculty",
    description:
      "Academic staff profiles, specializations, and research interests.",
    href: "/faculty",
  },
  {
    title: "Research",
    description:
      "Research agenda, projects, publications, laboratories, and student research.",
    href: "/research",
  },
  {
    title: "Extension and Community Engagement",
    description:
      "Community engagement activities and documented extension work.",
    href: "/extension",
  },
  {
    title: "Facilities",
    description:
      "Teaching laboratories, equipment, software, and support spaces.",
    href: "/facilities",
  },
  {
    title: "Quality Assurance and Accreditation",
    description:
      "Program quality processes and accreditation-related evidence categories.",
    href: "/accreditation",
  },
];

export const missingOfficialContent = [
  "Current department mandate or officially approved department profile.",
  "Complete faculty roster with ranks, degrees, specialization areas, and official contact links.",
  "Verified research agenda, active projects, publications, laboratories, and student research records.",
  "Verified extension projects with partner communities, project leaders, dates, outputs, and impact documentation.",
  "Official facilities inventory, laboratory names, equipment lists, and software resources.",
  "Active international linkages, mobility activities, visiting scholars, internships, and collaborations.",
  "Closure exceptions and enquiry-routing procedure.",
];

const allSearchPages = [
  { title: "Student & faculty resources", keywords: ["resources", "forms", "thesis", "defense", "advising", "support", "current students"], href: "/resources" },
  ...departmentQuestions.map(question => ({ title: question.title, keywords: [question.title.toLowerCase()], href: question.href })),
  { title: "What we do", keywords: ["what", "our work", "teaching", "research", "community", "collaborate"], href: "/our-work" },
  { title: "Using this website", keywords: ["accessibility", "keyboard", "screen reader", "zoom", "help using"], href: "/accessibility" },
  { 
    title: "Home",
    keywords: ["home", "index"], 
     href: "/" },
  { 
    title: "About", 
    keywords: ["about", "college", "who", "department"],
    href: "/about" },
  { 
    title: "History", 
    keywords: ["history"], 
    href: "/about/history" },
  {
    title: "College vision and mission",
    keywords: ["vision", "mission", "goals", "mvgo", "vmgo"],
    href: "/about/vmgo",
  },
  {
    title: "Chair Message",
    keywords: ["chair", "message"],
    href: "/about/chair-message",
  },
  {
    title: "Organization",
    keywords: ["organization", "structure"],
    href: "/about/organization",
  },
  {
    title: "Faculty and Staff",
    keywords: ["faculty and staff", "staff"],
    href: "/about/faculty-staff",
  },
  {
    title: "Contact",
    keywords: ["contact", "email", "phone"],
    href: "/about/contact",
  },
  {
    title: "Location",
    keywords: ["location", "map", "address"],
    href: "/about/location",
  },
  {
    title: "Academic Programs",
    keywords: ["programs", "academic programs"],
    href: "/programs",
  },
  {
    title: "BSCA",
    keywords: ["bsca", "computer applications"],
    href: "/programs/bsca",
  },
  { title: "MSCA", keywords: ["msca", "masters"], href: "/programs/msca" },
  {
    title: "Faculty",
    keywords: ["faculty", "teachers", "professors"],
    href: "/faculty",
  },
  {
    title: "Faculty Profile",
    keywords: ["profile", "faculty profile"],
    href: "/faculty",
  },
  {
    title: "Faculty Qualifications",
    keywords: ["qualifications", "degrees"],
    href: "/faculty/qualifications",
  },
  {
    title: "Faculty Achievements",
    keywords: ["achievements", "awards"],
    href: "/faculty/achievements",
  },
  {
    title: "Faculty Development",
    keywords: ["development", "training"],
    href: "/faculty/development",
  },
  { title: "Research", keywords: ["research"], href: "/research" },
  {
    title: "Research Focus Areas",
    keywords: ["focus areas", "research focus"],
    href: "/research/focus-areas",
  },
  {
    title: "Research Faculty Profiles",
    keywords: ["research faculty", "faculty profiles"],
    href: "/research/faculty-profiles",
  },
  {
    title: "Research Projects",
    keywords: ["projects", "research projects"],
    href: "/research/projects",
  },
  {
    title: "Publications",
    keywords: ["publications", "papers"],
    href: "/research/publications",
  },
  {
    title: "Research Labs",
    keywords: ["labs", "laboratories"],
    href: "/research/labs",
  },
  {
    title: "Student Research",
    keywords: ["student research"],
    href: "/research/student-research",
  },
  {
    title: "Collaborations",
    keywords: ["collaborations", "partners"],
    href: "/research/collaborations",
  },
  {
    title: "Research Metrics",
    keywords: ["metrics", "statistics"],
    href: "/research/metrics",
  },
  {
    title: "Extension",
    keywords: ["extension", "community"],
    href: "/extension",
  },
  {
    title: "Extension Programs",
    keywords: ["extension programs"],
    href: "/extension/programs",
  },
  {
    title: "Partnerships",
    keywords: ["partnerships", "partners"],
    href: "/extension/partnerships",
  },
  {
    title: "Technology Transfer",
    keywords: ["technology transfer", "tech transfer"],
    href: "/extension/tech-transfer",
  },
  {
    title: "Service Projects",
    keywords: ["service projects"],
    href: "/extension/service-projects",
  },
  {
    title: "Impact",
    keywords: ["impact", "outcomes"],
    href: "/extension/impact",
  },
  {
    title: "Current Students",
    keywords: ["current students"],
    href: "/students/current",
  },
  {
    title: "Prospective Students",
    keywords: ["prospective students", "admissions"],
    href: "/students/prospective",
  },
  {
    title: "Student Organizations",
    keywords: ["organizations", "student organizations"],
    href: "/students/organizations",
  },
  {
    title: "Admissions",
    keywords: ["admissions", "apply"],
    href: "/admissions",
  },
  {
    title: "Apply",
    keywords: ["apply", "application"],
    href: "/admissions/apply",
  },
  {
    title: "Request Info",
    keywords: ["request info", "information"],
    href: "/admissions/request-info",
  },
  { title: "Alumni", keywords: ["alumni"], href: "/alumni" },
  { title: "News and Events", keywords: ["news", "events"], href: "/news" },
  { title: "Events", keywords: ["events", "calendar"], href: "/news/events" },
  {
    title: "Facilities",
    keywords: ["facilities", "labs"],
    href: "/facilities",
  },
  {
    title: "International Linkages",
    keywords: ["international", "linkages"],
    href: "/international-linkages",
  },
  {
    title: "Accreditation",
    keywords: ["accreditation", "quality assurance"],
    href: "/accreditation",
  },
  { title: "AACCUP", keywords: ["aaccup"], href: "/accreditation/aaccup" },
  { title: "CHED", keywords: ["ched"], href: "/accreditation/ched" },
  {
    title: "AUN-QA",
    keywords: ["aun", "aun-qa"],
    href: "/accreditation/aun-qa",
  },
];


// Keep saved links working, but do not promote unfinished destinations in search.
const availableSearchRoutes = new Set(["/", "/about", "/about/vmgo", "/our-work", "/programs", "/programs/bsca", "/programs/msca", "/faculty", "/research", "/extension", "/news", "/news/events", "/admissions", "/admissions/apply", "/admissions/request-info", "/resources", "/students/current", "/about/contact", "/about/location", "/accessibility"]);
export const searchPages = allSearchPages.filter(page => availableSearchRoutes.has(page.href));

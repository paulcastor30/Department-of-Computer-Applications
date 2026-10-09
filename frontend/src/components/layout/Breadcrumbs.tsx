import { Link, useLocation } from "react-router-dom";
import { useFacultyMember } from "@/hooks/usePeople";
import { ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  about: "About",
  "our-work": "Our work",
  accessibility: "Using this website",
  vmgo: "College vision and mission",
  history: "History",
  "chair-message": "Chair's Message",
  organization: "Organization",
  "faculty-staff": "Faculty & Staff",
  contact: "Contact",
  location: "Location",
  programs: "Programs",
  bsca: "BS Computer Applications",
  msca: "MS Computer Applications",
  research: "Research",
  "focus-areas": "Focus Areas",
  "faculty-profiles": "Faculty Profiles",
  projects: "Projects",
  publications: "Publications",
  labs: "Labs & Facilities",
  "student-research": "Student Research",
  collaborations: "Collaborations",
  metrics: "Metrics Dashboard",
  extension: "Community work",
  partnerships: "Partnerships",
  "tech-transfer": "Tech Transfer",
  "service-projects": "Service Projects",
  impact: "Impact & Outcomes",
  faculty: "Faculty & Staff",
  qualifications: "Qualifications",
  achievements: "Achievements",
  development: "Development",
  students: "Students",
  current: "Current Students",
  prospective: "Prospective Students",
  organizations: "Organizations",
  admissions: "Admissions",
  apply: "Apply",
  "request-info": "Request Info",
  alumni: "Alumni",
  news: "News & Events",
  events: "Events",
  accreditation: "Accreditation",
  aaccup: "AACCUP",
  ched: "CHED",
  "aun-qa": "AUN QA",
  "international-linkages": "International Linkages",
  facilities: "Facilities",
  resources: "Student & faculty resources",
  "sojt-guide": "SOJT Process Guide",
  "thesis-guide": "Thesis Process Guide",
  policies: "Policies",
  reports: "Reports",
  faq: "FAQ",
  sitemap: "Site Map",
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const facultySlug = pathnames[0] === "faculty" && pathnames.length === 2 && !routeLabels[pathnames[1]] ? pathnames[1] : undefined;
  const { data: facultyMember } = useFacultyMember(facultySlug);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="bg-muted/50 border-b border-border">

      <div className="container py-3 ">
        <ol className="flex items-center flex-wrap gap-1.5 text-sm">
          <li>
            <Link to="/" className="breadcrumb-link flex items-center gap-1 hover:text-primary">
              <Home aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </li>
          {pathnames.map((segment, index) => {
            const href = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const label = (isLast && facultySlug && facultyMember?.title) || routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

            return (
              <li key={href} className="flex items-center gap-1.5">
                <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground" />
                {isLast ? (
                  <span className="breadcrumb-current" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link to={href} className="breadcrumb-link hover:text-primary">
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

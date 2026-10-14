import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { WhatIsComputerApplications, WhatStudentsBuild, ChoosingComputerApplications } from "@/components/HomeOrientation";
export default function ProspectiveStudents() {
  return <>
    <Seo title="Thinking of studying here?" description="Understand Computer Applications, explore BSCA and MSCA programs, and find official admission guidance." />
    <PageHero title="Thinking of studying here?" subtitle="Understand the field and explore your study options." />
    <nav aria-label="Prospective student tasks" className="container flex flex-wrap gap-3 py-8"><Link className="outline-link" to="/programs/bsca">Explore BSCA</Link><Link className="outline-link" to="/programs/msca">Explore MSCA</Link><Link className="action-link" to="/admissions">How to apply</Link><Link className="outline-link" to="/about/contact">Ask about studying here</Link></nav>
    <WhatIsComputerApplications /><WhatStudentsBuild /><ChoosingComputerApplications />
  </>;
}

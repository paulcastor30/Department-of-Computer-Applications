import { CollegePurpose } from "@/components/CollegePurpose";
import { departmentProfileText } from "@/lib/departmentProfileText";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { useDepartmentProfile } from "@/hooks/useCore";
import { departmentIntroduction } from "@/content/departmentIntroduction";
export default function About() {
  const { data, isError } = useDepartmentProfile();
  return <><Seo title="About the department" description="Who we are, what we do, and how to find more information."/><PageHero title="About the department" subtitle="Get to know the Department of Computer Applications at MSU–Iligan Institute of Technology."/>
    <div className="container max-w-5xl space-y-12 py-12"><section><h2 className="section-title">Who we are</h2><p className="mt-4 leading-8 whitespace-pre-line">{departmentProfileText(data?.overview) || departmentIntroduction.overview}</p><p className="mt-3 leading-8">{departmentIntroduction.explanation}</p><Link className="text-link mt-4 inline-flex" to="/faculty">Meet our faculty</Link></section>
    <section id="work"><h2 className="section-title">What we do</h2><p className="mt-4 leading-8">Our two degree programs are the Bachelor of Science in Computer Applications (BSCA) and Master of Science in Computer Applications (MSCA). Computer applications means using computing to address practical needs.</p><p className="mt-3 leading-8">Explore teaching, research information, and community work to understand the department beyond its degree programs.</p><Link className="text-link mt-4 inline-flex min-h-11 items-center" to="/our-work">Understand our work</Link></section>
    <section id="purpose"><h2 className="section-title mb-5">Why we do this work</h2><CollegePurpose />{isError && <p className="notice mt-4">The department overview could not be loaded. The college statements above are available here.</p>}</section>
    <section><h2 className="section-title">Explore our work</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">{[["Alumni connections", "/alumni"],["Department organization", "/about/organization"],["Research", "/research"],["Community work", "/extension"],["Faculty and staff", "/faculty"],["Student & faculty resources", "/resources"], ["Facilities", "/facilities"], ["Accreditation & Quality Assurance", "/accreditation"]].map(([label,href]) => <li key={href}><Link className="outline-link w-full" to={href}>{label}</Link></li>)}</ul></section>
    <section><h2 className="section-title">Get in touch</h2><p className="mt-4 mb-5">Questions about the department? Start with our contact and visiting information.</p><Link className="action-link" to="/about/contact">Contact & visit</Link></section></div></>;
}

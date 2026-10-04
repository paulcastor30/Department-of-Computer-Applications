import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { useDepartmentProfile } from "@/hooks/useCore";
import { departmentIdentity, placeholder } from "@/content/siteContent";
export default function About() {
  const { data, isError } = useDepartmentProfile();
  return <><Seo title="About the department" description="Who we are, what we do, and how to find more information."/><PageHero title="About the department" subtitle="Get to know the Department of Computer Applications at MSU–Iligan Institute of Technology."/>
    <div className="container max-w-5xl space-y-12 py-12"><section><h2 className="section-title">Who we are</h2><p className="mt-4 leading-8 whitespace-pre-line">{data?.overview || `The ${departmentIdentity.name} is part of the ${departmentIdentity.college}, ${departmentIdentity.institution}.`}</p><Link className="text-link mt-4 inline-flex" to="/faculty">Meet our faculty</Link></section>
    <section><h2 className="section-title">What we offer</h2><p className="mt-4 leading-8">Our two degree programs are the Bachelor of Science in Computer Applications (BSCA) and Master of Science in Computer Applications (MSCA). Computer applications means using computing to address practical needs.</p><Link className="text-link mt-4 inline-flex" to="/programs">Compare the programs</Link></section>
    <section id="purpose"><h2 className="section-title">Why we do this work</h2><h3 className="mt-5 font-semibold">Our mission</h3><p className="mt-2 whitespace-pre-line leading-8">{data?.mission || placeholder}</p><h3 className="mt-5 font-semibold">Our vision</h3><p className="mt-2 whitespace-pre-line leading-8">{data?.vision || placeholder}</p><h3 className="mt-5 font-semibold">Our goals</h3><p className="mt-2 whitespace-pre-line leading-8">{data?.goals || placeholder}</p>{isError && <p className="notice mt-4">Some department information could not be loaded. Please contact us if you need it.</p>}</section>
    <section><h2 className="section-title">Explore our work</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">{[["Research", "/research"],["Community work", "/extension"],["Facilities", "/facilities"],["International partnerships", "/international-linkages"],["Quality assurance", "/accreditation"],["Department history", "/about/history"]].map(([label,href]) => <li key={href}><Link className="outline-link w-full" to={href}>{label}</Link></li>)}</ul></section>
    <section><h2 className="section-title">Get in touch</h2><p className="mt-4 mb-5">Questions about the department? Start with our contact and visiting information.</p><Link className="action-link" to="/about/contact">Contact & visit</Link></section></div></>;
}

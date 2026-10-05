import { Link } from "react-router-dom";
import { departmentIdentity } from "@/content/siteContent";
import { useSiteSettings } from "@/hooks/useCore";

export function Footer() {
  const { data } = useSiteSettings();
  const email = data?.primary_email || departmentIdentity.email;
  return <footer className="border-t border-border bg-primary text-white"><div className="container grid gap-8 py-12 md:grid-cols-3">
    <div><h2 className="mb-3 text-lg font-semibold">{departmentIdentity.name}</h2><p className="mb-4 text-sm leading-6">{departmentIdentity.college}<br/>{departmentIdentity.institution}</p><a href={`mailto:${email}`} className="inline-flex min-h-11 items-center break-all underline underline-offset-4">{email}</a></div>
    <nav aria-label="Explore the department"><h2 className="mb-3 font-semibold">Explore</h2><ul className="grid gap-2">{[["What we do", "/our-work"], ["Research", "/research"],["Community work", "/extension"],["Facilities", "/facilities"],["International partnerships", "/international-linkages"],["Quality assurance", "/accreditation"]].map(([label,href]) => <li key={href}><Link className="inline-flex min-h-11 items-center underline-offset-4 hover:underline" to={href}>{label}</Link></li>)}</ul></nav>
    <nav aria-label="Get help"><h2 className="mb-3 font-semibold">Get help</h2><ul className="grid gap-2">{[["Student & faculty resources", "/resources"], ["Contact & visiting information", "/about/contact"],["How to apply", "/admissions"],["Location & directions", "/about/location"],["Using this website", "/accessibility"]].map(([label,href]) => <li key={href}><Link className="inline-flex min-h-11 items-center underline-offset-4 hover:underline" to={href}>{label}</Link></li>)}</ul></nav>
    </div><div className="border-t border-white/20"><div className="container py-5 text-sm">© {new Date().getFullYear()} {departmentIdentity.name}</div></div></footer>;
}

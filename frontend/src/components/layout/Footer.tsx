import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { departmentIdentity, primaryNavigation } from "@/content/siteContent";
import Logo from "@/assets/ccs-logo.png";

const footerSections = [
  {
    title: "Department",
    links: primaryNavigation.filter((item) => ["About", "Faculty", "Contact"].includes(item.label)),
  },
  {
    title: "Academic Work",
    links: primaryNavigation.filter((item) => ["Academic Programs", "Research", "Extension"].includes(item.label)),
  },
  {
    title: "Institutional Information",
    links: primaryNavigation.filter((item) => ["Facilities", "International Linkages", "Quality Assurance", "News and Events"].includes(item.label)),
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container grid gap-10 py-10 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link to="/" className="mb-5 flex items-center gap-3">
            <img src={Logo} alt="College of Computer Studies logo" className="h-14 w-14 object-contain" />
            <div>
              <div className="font-semibold">{departmentIdentity.name}</div>
              <div className="text-sm opacity-80">{departmentIdentity.college}</div>
            </div>
          </Link>
          <div className="space-y-3 text-sm opacity-90">
            <a href={`mailto:${departmentIdentity.email}`} className="flex items-center gap-2 hover:text-secondary">
              <Mail className="h-4 w-4" />
              {departmentIdentity.email}
            </a>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {departmentIdentity.phone}
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{departmentIdentity.address}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">{section.title}</h2>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="opacity-85 hover:text-secondary hover:opacity-100">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-2 py-4 text-xs opacity-80 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {departmentIdentity.name}. {departmentIdentity.institution}.</p>
          <p>Official public information should be verified by the Department before publication.</p>
        </div>
      </div>
    </footer>
  );
}

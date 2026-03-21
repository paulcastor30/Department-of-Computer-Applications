import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Logo from "@/assets/ccs-logo.png";


const quickLinks = [
  {
    title: "Academics",
    links: [
      { label: "BS Computer Applications", href: "/programs/bsca" },
      { label: "MS Computer Applications", href: "/programs/msca" },
      { label: "Course Catalog", href: "/programs" },
      { label: "Academic Calendar", href: "/students/current" },
    ],
  },
  {
    title: "Research & Extension",
    links: [
      { label: "Research Projects", href: "/research/projects" },
      { label: "Publications", href: "/research/publications" },
      { label: "Labs & Facilities", href: "/research/labs" },
      { label: "Extension Programs", href: "/extension" },
    ],
  },
  {
    title: "Students",
    links: [
      { label: "Admissions", href: "/admissions" },
      { label: "Current Students", href: "/students/current" },
      { label: "Student Organizations", href: "/students/organizations" },
      { label: "Alumni", href: "/alumni" },
    ],
  },
  {
    title: "Accreditation & QA",
    links: [
      { label: "AACCUP Status", href: "/accreditation/aaccup" },
      { label: "CHED COPC/COE", href: "/accreditation/ched" },
      { label: "AUN QA", href: "/accreditation/aun-qa" },
      { label: "Quality Assurance", href: "/accreditation" },
    ],
  },
];

const resourceLinks = [
  { label: "Industry Partnerships", href: "/partnerships" },
  { label: "International Linkages", href: "/international" },
  { label: "Infrastructure", href: "/facilities" },
  { label: "Downloads & Forms", href: "/resources" },
  { label: "Policies", href: "/policies" },
  { label: "Annual Reports", href: "/reports" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Brand & Contact */}
          <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-3 mb-6">
            <img
              src={Logo}
              alt="Computer Applications Logo"
              className="h-20 w-20 object-contain"
            />
            <div>
              <div className="font-bold text-lg text-white">Computer Applications</div>
              <div className="text-xs opacity-80">Department of Excellence</div>
            </div>
          </Link>

            <div className="space-y-3 text-sm opacity-90">
              <a href="mailto:ccs.ca@g.msuiit.edu.ph" className="flex items-center gap-2 hover:text-secondary transition-colors">
                <Mail className="h-4 w-4" />
                ccs.ca@g.msuiit.edu.ph
              </a>
              <a href="tel:+63-2-1234-5678" className="flex items-center gap-2 hover:text-secondary transition-colors">
                <Phone className="h-4 w-4" />
                (+63) 912-345-6789
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>College of Computer Studies, Mindanao State University - Iligan Institute of Technology, Andres Bonifacio Avenue, Iligan City, 9200 Philippines</span>
              </div>
            </div>
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={Icon.displayName || "Social"}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {quickLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-secondary mb-4">{section.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="opacity-80 hover:opacity-100 hover:text-secondary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Resources Row */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {resourceLinks.map((link) => (
              <Link key={link.href} to={link.href} className="opacity-80 hover:opacity-100 hover:text-secondary transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="max-w-md">
            <h3 className="font-semibold text-secondary mb-2">Stay Updated</h3>
            <p className="text-sm opacity-80 mb-4">Subscribe to our newsletter for news, events, and research updates.</p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                aria-label="Email for newsletter"
              />
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-80">
            <div>
              © {new Date().getFullYear()} Department of Computer Applications. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-secondary transition-colors">Terms of Use</Link>
              <Link to="/accessibility" className="hover:text-secondary transition-colors">Accessibility</Link>
              <Link to="/sitemap" className="hover:text-secondary transition-colors">Site Map</Link>
              <Link to="/faq" className="hover:text-secondary transition-colors">FAQs</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
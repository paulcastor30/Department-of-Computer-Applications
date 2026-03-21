import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, ChevronDown, Facebook, Twitter, Linkedin, Youtube, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Logo from "@/assets/ccs-logo.png";
const mainNavItems = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Overview", href: "/about" },
      { label: "Vision, Mission, Goals", href: "/about/vmgo" },
      { label: "History & Milestones", href: "/about/history" },
      { label: "Chair's Message", href: "/about/chair-message" },
      { label: "Organizational Structure", href: "/about/organization" },
      { label: "Faculty & Staff", href: "/about/faculty-staff" },
      { label: "Contact Us", href: "/about/contact" },
      { label: "Location", href: "/about/location" },
    ],
  },
  {
    label: "Programs",
    href: "/programs",
    children: [
      { label: "All Programs", href: "/programs" },
      { label: "BS Computer Applications", href: "/programs/bsca" },
      { label: "MS Computer Applications", href: "/programs/msca" },
    ],
  },
  {
    label: "Research",
    href: "/research",
    children: [
      { label: "Overview", href: "/research" },
      { label: "Focus Areas", href: "/research/focus-areas" },
      { label: "Faculty Profiles", href: "/research/faculty-profiles" },
      { label: "Projects", href: "/research/projects" },
      { label: "Publications", href: "/research/publications" },
      { label: "Labs & Facilities", href: "/research/labs" },
      { label: "Student Research", href: "/research/student-research" },
      { label: "Collaborations", href: "/research/collaborations" },
      { label: "Metrics Dashboard", href: "/research/metrics" },
    ],
  },
  {
    label: "Extension",
    href: "/extension",
    children: [
      { label: "Overview", href: "/extension" },
      { label: "Programs", href: "/extension/programs" },
      { label: "Partnerships", href: "/extension/partnerships" },
      { label: "Tech Transfer", href: "/extension/tech-transfer" },
      { label: "Service Projects", href: "/extension/service-projects" },
      { label: "Impact & Outcomes", href: "/extension/impact" },
    ],
  },
  {
    label: "Faculty",
    href: "/faculty",
    children: [
      { label: "Directory", href: "/faculty" },
      { label: "Qualifications", href: "/faculty/qualifications" },
      { label: "Achievements", href: "/faculty/achievements" },
      { label: "Development", href: "/faculty/development" },
    ],
  },
  {
    label: "Students",
    href: "/students",
    children: [
      { label: "Current Students", href: "/students/current" },
      { label: "Prospective Students", href: "/students/prospective" },
      { label: "Organizations", href: "/students/organizations" },
    ],
  },
  { label: "Admissions", href: "/admissions" },
  { label: "Alumni", href: "/alumni" },
  { label: "News & Events", href: "/news" },
];

export function Header() {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Utility Bar - Navy */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Department of Computer Applications</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://www.facebook.com/MSUIIT.CCS.CA.Dept"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-secondary transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>

              <a href="#" aria-label="Twitter" className="hover:text-secondary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>

              <a
                href="https://www.linkedin.com/in/msuiit-computer-applications-department-353b13299/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-secondary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>

              <a href="#" aria-label="YouTube" className="hover:text-secondary transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
              <span className="w-px h-4 bg-primary-foreground/30" />
            </div>
            <a
              href="https://www.msuiit.edu.ph/redirect.php?page=my.iit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-secondary transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">My.IIT Login</span>
            </a>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-1.5 hover:text-secondary transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="bg-card border-b border-border animate-slide-down">
          <div className="container py-4">
            <form className="flex gap-2 max-w-xl mx-auto" role="search">
              <Input
                type="search"
                placeholder="Search pages, programs, faculty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                aria-label="Search site"
              />
              <Button type="submit">Search</Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Main Navigation - White background */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="container flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={Logo}
              alt="Computer Applications Logo"
              className="h-20 w-20 object-contain"
            />
            <div className="hidden sm:block">
              <div className="font-bold text-lg text-primary group-hover:text-accent transition-colors">
                Computer Applications
              </div>
              <div className="text-xs text-muted-foreground">Department of Excellence</div>
            </div>
          </Link>


          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {mainNavItems.map((item) =>
              item.children ? (
                // ✅ KEY FIX: relative group wrapper so dropdown is positioned under THIS trigger
                <div key={item.label} className="relative group">
                  <button
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-md hover:bg-muted transition-colors text-primary",
                      isActive(item.href) && "text-secondary font-semibold border-b-2 border-secondary rounded-none"
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                  </button>

                  {/* Dropdown — pt-1 bridges the gap so hover stays active */}
                  <div className="absolute top-full left-0 z-50 hidden group-hover:block pt-1">
                    <ul className="w-56 rounded-md border border-border bg-popover shadow-lg p-2 grid gap-0.5">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            to={child.href}
                            className={cn(
                              "block select-none rounded-md px-3 py-2.5 text-sm leading-none no-underline outline-none transition-colors hover:bg-secondary/10 hover:text-secondary focus:bg-secondary/10 focus:text-secondary",
                              location.pathname === child.href && "bg-secondary/10 font-medium text-secondary"
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium px-3 py-2 rounded-md hover:bg-muted transition-colors inline-block text-primary",
                    isActive(item.href) && "text-secondary font-semibold border-b-2 border-secondary rounded-none"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admissions/request-info">Request Info</Link>
            </Button>
            <Button className="btn-cta-primary" size="sm" asChild>
              <Link to="/admissions/apply">Apply Now</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <div className="flex flex-col gap-6 pt-6">
                <div className="flex flex-col gap-2">
                  <Button className="btn-cta-primary w-full" asChild>
                    <Link to="/admissions/apply">Apply Now</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/admissions/request-info">Request Info</Link>
                  </Button>
                </div>
                <nav className="flex flex-col gap-1">
                  {mainNavItems.map((item) => (
                    <div key={item.label}>
                      {item.children ? (
                        <details className="group">
                          <summary className="flex items-center justify-between p-3 rounded-md hover:bg-muted cursor-pointer font-medium text-primary">
                            {item.label}
                            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                          </summary>
                          <div className="pl-4 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <SheetClose asChild key={child.href}>
                                <Link
                                  to={child.href}
                                  className="block p-2 rounded-md text-sm text-muted-foreground hover:text-secondary hover:bg-secondary/5"
                                >
                                  {child.label}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        </details>
                      ) : (
                        <SheetClose asChild>
                          <Link
                            to={item.href}
                            className="block p-3 rounded-md font-medium text-primary hover:bg-muted hover:text-secondary"
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

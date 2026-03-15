import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, ChevronDown, Facebook, Twitter, Linkedin, Youtube, GraduationCap, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

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
      {/* Top Utility Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Department of Computer Applications</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="hover:text-secondary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-secondary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-secondary transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-secondary transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
              <span className="w-px h-4 bg-primary-foreground/30" />
            </div>
            <Link to="/portal" className="flex items-center gap-1.5 hover:text-secondary transition-colors">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Portal Login</span>
            </Link>
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

      {/* Main Navigation */}
      <div className="bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-secondary" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                Computer Applications
              </div>
              <div className="text-xs text-muted-foreground">Department of Excellence</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-0.5">
              {mainNavItems.map((item) =>
                item.children ? (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuTrigger
                      className={cn(
                        "text-sm font-medium px-3 py-2 bg-transparent data-[state=open]:bg-muted",
                        isActive(item.href) && "text-secondary font-semibold"
                      )}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-1 p-4 w-56 bg-popover">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={child.href}
                                className={cn(
                                  "block select-none rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                  location.pathname === child.href && "bg-muted font-medium"
                                )}
                              >
                                {child.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.label}>
                    <Link
                      to={item.href}
                      className={cn(
                        "text-sm font-medium px-3 py-2 rounded-md hover:bg-muted transition-colors inline-block",
                        isActive(item.href) && "text-secondary font-semibold"
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>

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
                <Menu className="h-6 w-6" />
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
                          <summary className="flex items-center justify-between p-3 rounded-md hover:bg-muted cursor-pointer font-medium">
                            {item.label}
                            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                          </summary>
                          <div className="pl-4 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <SheetClose asChild key={child.href}>
                                <Link
                                  to={child.href}
                                  className="block p-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
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
                            className="block p-3 rounded-md font-medium hover:bg-muted"
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

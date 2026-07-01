import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { departmentIdentity, primaryNavigation } from "@/content/siteContent";
import { cn } from "@/lib/utils";
import Logo from "@/assets/ccs-logo.png";

export function Header() {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="border-b border-border bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-2 text-xs md:text-sm">
          <span>{departmentIdentity.institution}</span>
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            className="inline-flex items-center gap-2 hover:text-secondary"
            aria-label="Search site"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-b border-border bg-muted/30">
          <div className="container py-4">
            <form className="mx-auto flex max-w-xl gap-2" role="search">
              <Input type="search" placeholder="Search the department website" aria-label="Search the department website" />
              <Button type="submit" variant="outline">Search</Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => setSearchOpen(false)} aria-label="Close search">
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      <div className="container flex items-center justify-between gap-6 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img src={Logo} alt="College of Computer Studies logo" className="h-14 w-14 object-contain" />
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-tight text-primary md:text-base">{departmentIdentity.name}</div>
            <div className="text-xs leading-tight text-muted-foreground">{departmentIdentity.college}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "rounded-sm px-2.5 py-2 text-sm font-medium text-primary hover:bg-muted",
                isActive(item.href) && "border-b-2 border-secondary text-secondary"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <nav className="mt-8 grid gap-1" aria-label="Mobile navigation">
              {primaryNavigation.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "rounded-sm px-3 py-3 text-sm font-medium text-primary hover:bg-muted",
                      isActive(item.href) && "bg-muted text-secondary"
                    )}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

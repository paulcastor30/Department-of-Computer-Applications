import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { departmentIdentity, primaryNavigation, searchPages } from "@/content/siteContent";
import Logo from "@/assets/ccs-logo.png";

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const normalized = query.trim().toLowerCase();
  const results = normalized ? Array.from(new Map(searchPages.filter(page => page.title.toLowerCase().includes(normalized) || page.keywords.some(word => word.toLowerCase().includes(normalized))).map(page => [page.href, page])).values()) : [];

  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); setQuery(""); }, [pathname]);

  return (
    <header className="site-header" onKeyDown={event => {
      if (event.key === "Escape") {
        if (searchOpen) { setSearchOpen(false); searchButtonRef.current?.focus(); }
        else if (menuOpen) { setMenuOpen(false); menuButtonRef.current?.focus(); }
      }
    }}>
      <div className="border-b border-border bg-muted/40"><div className="container py-2 text-sm text-muted-foreground">MSU–Iligan Institute of Technology · {departmentIdentity.college}</div></div>
      <div className="container flex flex-wrap items-center justify-between gap-4 py-5">
        <Link to="/" className="flex w-full min-w-0 items-center gap-3 font-semibold text-primary sm:w-auto sm:flex-1" aria-label="Department of Computer Applications home">
          <img src={Logo} alt="" width="52" height="52" className="h-12 w-12 shrink-0 object-contain" />
          <span className="max-w-sm text-base leading-snug sm:text-xl">{departmentIdentity.name}</span>
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link className="outline-link text-sm" to="/resources">Student &amp; faculty resources</Link>
          <button ref={searchButtonRef} aria-label="Search site" type="button" className="control-button" aria-expanded={searchOpen} aria-controls="site-search" onClick={() => setSearchOpen(value => !value)}><Search aria-hidden="true" size={18}/><span>Search</span></button>
          <button ref={menuButtonRef} type="button" className="control-button md:hidden" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? <X aria-hidden="true" size={18}/> : <Menu aria-hidden="true" size={18}/>}<span>Menu</span></button>
        </div>
      </div>
      <nav id="primary-nav" aria-label="Main navigation" className={`container ${menuOpen ? "flex" : "hidden"} flex-col gap-1 pb-4 md:flex md:flex-row md:flex-wrap md:gap-2`}>
        {primaryNavigation.map(item => <Link key={item.href} to={item.href} aria-current={pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`)) ? "page" : undefined} className="nav-item">{item.label}</Link>)}
      </nav>
      {searchOpen && <div id="site-search" className="border-t border-border bg-muted/30"><div className="container py-5">
        <form role="search" onSubmit={event => { event.preventDefault(); if (results[0]) navigate(results[0].href); }} className="max-w-2xl">
          <label htmlFor="site-search-input" className="mb-2 block font-semibold text-primary">Find a page</label>
          <div className="flex gap-2"><input id="site-search-input" ref={inputRef} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try programs, email, or location" className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-3"/><button type="submit" className="action-link">Search</button></div>
          <p className="mt-3 text-sm text-muted-foreground" role="status">{normalized ? `${results.length} matching ${results.length === 1 ? "page" : "pages"}.` : "Search page titles and topics. Use Tab to move through results."}</p>
          {normalized && <ul className="mt-3 grid gap-1">{results.map(page => <li key={page.href}><Link className="block rounded-md px-3 py-3 text-primary underline underline-offset-4 hover:bg-muted" to={page.href}>{page.title}</Link></li>)}</ul>}
          {normalized && !results.length && <p className="mt-3">Try another word, or <Link to="/about/contact" className="text-link">contact the department</Link>.</p>}
        </form>
      </div></div>}
    </header>
  );
}

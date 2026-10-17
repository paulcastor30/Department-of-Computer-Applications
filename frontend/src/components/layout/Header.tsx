import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSiteSearch } from "@/hooks/useSiteSearch";
import { matchesFormQuery } from "@/lib/formSearch";
import { Menu, Search, X } from "lucide-react";
import { departmentIdentity, primaryNavigation, primarySectionFor, searchPages } from "@/content/siteContent";

export function Header() {
  const { pathname, hash, search } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [visibleRecords, setVisibleRecords] = useState(6);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const normalized = query.trim().toLowerCase();
  const matchingPages = normalized ? searchPages.filter(page => matchesFormQuery(`${page.title} ${page.keywords.join(" ")}`, normalized)) : [];
  const results = matchingPages.filter((page, index) => matchingPages.findIndex(item => item.href === page.href) === index);

  const records = useSiteSearch(normalized, searchOpen);
  const recordResults = records.data?.results || [];
  const matchCount = results.length + recordResults.length;
  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); setQuery(""); }, [pathname, hash, search]);

  return (
    <header className="site-header" onKeyDown={event => {
      if (event.key === "Escape") {
        if (searchOpen) { setSearchOpen(false); searchButtonRef.current?.focus(); }
        else if (menuOpen) { setMenuOpen(false); menuButtonRef.current?.focus(); }
      }
    }}>
      <div className="site-institution"><div className="container">MSU–Iligan Institute of Technology · {departmentIdentity.college}</div></div>
      <div className="container site-identity-row">
        <Link to="/" className="site-identity" aria-label="Department of Computer Applications home">
          <img src="/MSU-IIT%20Logo.png" alt="" width="48" height="48" />
          <span>{departmentIdentity.name}</span>
        </Link>
        <div className="site-utilities">
          <nav aria-label="Quick access" className="flex"><Link className="header-control" to="/admissions">Apply</Link><Link className="header-control" to="/alumni">Alumni</Link></nav>
          <button ref={searchButtonRef} aria-label="Search site" type="button" className="header-control" aria-expanded={searchOpen} aria-controls="site-search" onClick={() => { setSearchOpen(value => !value); setMenuOpen(false); }}><Search aria-hidden="true" size={18}/><span>Search</span></button>
          <button ref={menuButtonRef} type="button" className="header-control menu-toggle" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => { setMenuOpen(value => !value); setSearchOpen(false); }}>{menuOpen ? <X aria-hidden="true" size={18}/> : <Menu aria-hidden="true" size={18}/>}<span>Menu</span></button>
        </div>
      </div>
      <nav id="primary-nav" aria-label="Main navigation" className={`container primary-nav ${menuOpen ? "is-open" : ""}`}>
        {primaryNavigation.map(item => <Link key={item.href} to={item.href} aria-current={primarySectionFor(pathname) === item.href ? "page" : undefined} className="nav-item">{item.label}</Link>)}
      </nav>
      {searchOpen && <div id="site-search" className="border-t border-border bg-muted/30"><div className="container py-5">
        <form role="search" onSubmit={event => { event.preventDefault(); resultsRef.current?.focus(); }} className="max-w-2xl">
          <label htmlFor="site-search-input" className="mb-2 block font-semibold text-primary">Search the website</label>
          <div className="flex gap-2"><input id="site-search-input" ref={inputRef} type="search" maxLength={160} value={query} onChange={event => { setQuery(event.target.value); setVisibleRecords(6); }} placeholder="Try a name, paper title, project or form number" className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-3 text-base"/><button type="submit" className="action-link">Search</button></div>
          <h2 ref={resultsRef} tabIndex={-1} className="mt-4 font-semibold">Search results</h2>
          <p className="mt-3 text-sm text-muted-foreground" role="status">{normalized ? `${matchCount} matching ${recordResults.length ? "results" : matchCount === 1 ? "page" : "pages"}.` : "Search pages, people, research, announcements and forms. Use Tab to move through results."}{records.waiting && " Searching department records…"}</p>
          {records.isError && <div className="mt-3 text-sm"><p>Department records could not be searched.</p><button type="button" className="text-link min-h-11" onClick={() => void records.refetch()}>Try searching records again</button></div>}
          {normalized && <ul className="mt-3 grid gap-1">{results.map(page => <li key={page.href}><Link className="block rounded-md px-3 py-3 text-primary underline underline-offset-4 hover:bg-muted" to={page.href}>{page.title}</Link></li>)}</ul>}
          {recordResults.length > 0 && <div className="mt-5"><h3 className="font-semibold">Department records</h3><ul id="record-search-results" className="mt-2 grid gap-2">{recordResults.slice(0, visibleRecords).map(record => <li key={`${record.kind}-${record.title}-${record.href}`} className="rounded-md border border-border p-3">
            <p className="text-sm text-muted-foreground">{record.kind}</p><Link className="text-link inline-flex min-h-11 items-center" to={record.href}>{record.title}</Link>
            {record.summary && <p className="text-sm leading-6 text-muted-foreground">{record.summary}</p>}
          </li>)}</ul><p className="mt-3 text-sm text-muted-foreground" aria-live="polite">Showing {Math.min(visibleRecords, recordResults.length)} of {recordResults.length} department records.</p>
            {visibleRecords < recordResults.length && <button type="button" className="outline-link mt-3" aria-controls="record-search-results" onClick={() => setVisibleRecords(count => count + 6)}>Show more department records</button>}
          </div>}
          {records.data?.has_more && <p className="mt-3 text-sm">Use a more specific search to narrow the results.</p>}
          {normalized && !matchCount && !records.waiting && <p className="mt-3">Try another word, or <Link to="/about/contact" className="text-link">contact the department</Link>.</p>}
        </form>
      </div></div>}
    </header>
  );
}

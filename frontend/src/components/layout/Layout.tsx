import { ReactNode, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Breadcrumbs } from "./Breadcrumbs";

export function Layout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  const previous = useRef<string | null>(null);
  useEffect(() => {
    const next = pathname + hash;
    if (previous.current === next) return;
    const firstVisit = previous.current === null;
    previous.current = next;
    if (firstVisit && !hash) return;
    let observer: MutationObserver | undefined;
    const frame = requestAnimationFrame(() => {
      let anchor = hash.slice(1);
      try { anchor = decodeURIComponent(anchor); } catch { /* Keep a malformed anchor as plain text. */ }
      const target = hash ? document.getElementById(anchor) : document.querySelector<HTMLElement>("main h1");
      if (!hash) window.scrollTo({ top: 0, behavior: "instant" });
      if (target) { target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); if (hash) target.scrollIntoView(); }
      else {
        document.getElementById("main-content")?.focus();
        if (hash) {
          observer = new MutationObserver(() => {
            const loadedTarget = document.getElementById(anchor);
            if (!loadedTarget) return;
            loadedTarget.setAttribute("tabindex", "-1");
            loadedTarget.focus({ preventScroll: true });
            loadedTarget.scrollIntoView();
            observer?.disconnect();
          });
          observer.observe(document.getElementById("main-content") || document.body, { childList: true, subtree: true });
        }
      }
    });
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); };
  }, [pathname, hash]);
  return <div className="flex min-h-screen flex-col"><a href="#main-content" className="skip-link">Skip to main content</a><Header />{pathname !== "/" && <Breadcrumbs />}<main id="main-content" tabIndex={-1} className="flex-1">{children}</main><Footer /></div>;
}

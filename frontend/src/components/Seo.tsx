import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SeoProps {
  title: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
}

export function Seo({ title, description, keywords, ogTitle, ogDescription, canonicalUrl }: SeoProps) {
  const { pathname } = useLocation();
  useEffect(() => {
    const fullTitle = title === "Home" ? "Department of Computer Applications | MSU-IIT" : `${title} | Computer Applications, MSU-IIT`;
    document.title = fullTitle;

    const setMeta = (selector: string, attribute: "name" | "property", key: string, value: string) => {
      let meta = document.querySelector<HTMLMetaElement>(selector);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.content = value;
    };

    if (description) {
      setMeta('meta[name="description"]', "name", "description", description);
      setMeta('meta[property="og:description"]', "property", "og:description", description);
    }

    if (ogDescription) {
      setMeta('meta[property="og:description"]', "property", "og:description", ogDescription);
    }

    if (keywords?.length) {
      setMeta('meta[name="keywords"]', "name", "keywords", keywords.join(", "));
    }

    setMeta('meta[property="og:title"]', "property", "og:title", ogTitle || fullTitle);

    setMeta('meta[name="twitter:title"]', "name", "twitter:title", ogTitle || fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", ogDescription || description || "Department information, programs, news, and contact details.");
    const canonical = canonicalUrl || `https://msuiit-comapps.vercel.app${pathname === "/" ? "/" : pathname}`;
    setMeta('meta[property="og:url"]', "property", "og:url", canonical);
    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [canonicalUrl, description, keywords, ogDescription, ogTitle, pathname, title]);

  return null;
}

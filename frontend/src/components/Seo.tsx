import { useEffect } from "react";

interface SeoProps {
  title: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
}

export function Seo({ title, description, keywords, ogTitle, ogDescription, canonicalUrl }: SeoProps) {
  useEffect(() => {
    const fullTitle = `${title} | Department of Computer Applications`;
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

    if (canonicalUrl) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
    }
  }, [canonicalUrl, description, keywords, ogDescription, ogTitle, title]);

  return null;
}

import { useEffect } from "react";

interface SeoProps {
  title: string;
  description?: string;
  keywords?: string[];
}

export function Seo({ title, description, keywords }: SeoProps) {
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

    if (keywords?.length) {
      setMeta('meta[name="keywords"]', "name", "keywords", keywords.join(", "));
    }

    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
  }, [description, keywords, title]);

  return null;
}

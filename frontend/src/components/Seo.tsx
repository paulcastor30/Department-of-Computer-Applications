import { useEffect } from "react";

interface SeoProps {
  title: string;
  description?: string;
}

export function Seo({ title, description }: SeoProps) {
  useEffect(() => {
    document.title = `${title} | Department of Computer Applications`;

    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [description, title]);

  return null;
}

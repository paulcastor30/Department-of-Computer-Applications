import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";
import type { NewsPost } from "@/types/api";
import { Seo } from "@/components/Seo";
export default function NewsDetail() {
  const { slug } = useParams();
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["communications", "news", slug], queryFn: () => fetchJSON<NewsPost>(`/api/communications/news/${slug}/`), enabled: Boolean(slug) });
  return <section className="container py-12"><Link className="text-link" to="/news">Back to news and events</Link><h1 className="mt-6 max-w-3xl text-3xl font-semibold text-primary">{data?.title || "News article"}</h1><Seo title={data?.title || "News article"} description={data?.summary || "Department news"}/>{isLoading && <p className="mt-5" role="status">Loading article…</p>}{isError && <div className="notice mt-5"><p>This article could not be loaded.</p><button className="outline-link mt-3" onClick={() => refetch()}>Try again</button></div>}{data && <article className="mt-6 max-w-3xl space-y-6">{data.published_at && <p className="text-muted-foreground"><time dateTime={data.published_at}>Posted {new Date(data.published_at).toLocaleDateString("en-PH", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Manila" })}</time></p>}<p className="text-lg leading-8">{data.summary}</p>{data.body && <div className="whitespace-pre-line leading-8">{data.body}</div>}</article>}</section>;
}

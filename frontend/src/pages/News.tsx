import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { useNews } from "@/hooks/useCommunications";
import { placeholder } from "@/content/siteContent";

export function NewsList({ limit }: { limit?: number }) {
  const { data = [], isLoading, isError, refetch } = useNews();
  if (isLoading) return <p role="status">Loading news… You can continue exploring the website.</p>;
  if (isError) return <div className="notice"><p>We could not load the news right now.</p><button className="outline-link mt-3" type="button" onClick={() => refetch()}>Try again</button><Link className="text-link ml-4" to="/about/contact">Contact us</Link></div>;
  if (!data.length) return <p className="notice">Official news and event dates: {placeholder}.</p>;
  const posts = limit ? data.slice(0, limit) : data;
  return <div className="grid gap-5 md:grid-cols-3">{posts.map(post => <article key={post.id} className="rounded-lg border border-border bg-background p-6"><p className="mb-3 text-sm text-muted-foreground">{post.published_at ? <time dateTime={post.published_at}>Posted {new Date(post.published_at).toLocaleDateString("en-PH", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Manila" })}</time> : "Publication date to be provided"}</p><h3 className="mb-3 text-xl font-semibold text-primary"><Link className="hover:underline" to={`/news/${post.slug}`}>{post.title}</Link></h3><p className="mb-4 leading-7 text-muted-foreground">{post.summary || placeholder}</p><Link className="text-link" to={`/news/${post.slug}`}>Read more<span className="sr-only">: {post.title}</span></Link></article>)}</div>;
}
export default function News() {
  return <><Seo title="News and Events" description="Read the latest department news and dated announcements."/><PageHero title="News and events" subtitle="Find announcements, activities, and updates from the department."/><section className="container py-12"><h2 className="sr-only">Published announcements</h2><NewsList/></section></>;
}

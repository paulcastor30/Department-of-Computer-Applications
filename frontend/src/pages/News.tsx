import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { useNews } from "@/hooks/useCommunications";
import { placeholder } from "@/content/siteContent";

const categoryLabels: Record<string, string> = { NEWS: "News", ANNOUNCEMENT: "Announcement", EVENT: "Event announcement" };

export function NewsList({ limit }: { limit?: number }) {
  const { data = [], isLoading, isError, refetch } = useNews();
  if (isLoading) return <p role="status">Loading news… You can continue exploring the website.</p>;
  if (isError) return <div className="notice"><p>We could not load the news right now.</p><div className="mt-3 flex flex-wrap items-center gap-4"><button className="outline-link" type="button" onClick={() => refetch()}>Try again</button><Link className="text-link inline-flex min-h-11 items-center" to="/about/contact">Ask about announcements</Link></div></div>;
  if (!data.length) return <div className="notice"><p>There are no published department announcements at the moment.</p><Link className="text-link inline-flex min-h-11 items-center mt-2" to="/about/contact">Ask about upcoming activities</Link></div>;
  const posts = limit ? data.slice(0, limit) : data;
  return <div className="grid gap-5 md:grid-cols-3">{posts.map(post => <article key={post.id} className="overflow-hidden rounded-lg border border-border bg-background">
    {post.featured_image && <img src={post.featured_image} alt="" loading="lazy" decoding="async" width="640" height="360" className="aspect-video w-full object-cover" onError={event => { event.currentTarget.hidden = true; }} />}
    <div className="p-6"><p className="mb-2 text-sm font-semibold text-secondary">{categoryLabels[post.category] || "Department update"}</p>
      <p className="mb-3 text-sm text-muted-foreground">{post.published_at ? <time dateTime={post.published_at}>Posted {new Date(post.published_at).toLocaleDateString("en-PH", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Manila" })}</time> : "Publication date to be provided"}</p>
      <h3 className="mb-3 text-xl font-semibold text-primary"><Link className="underline underline-offset-4" to={`/news/${post.slug}`}>{post.title}</Link></h3>
      <p className="mb-4 leading-7 text-muted-foreground">{post.summary || placeholder}</p>
      <Link className="text-link inline-flex min-h-11 items-center" to={`/news/${post.slug}`}>Read announcement<span className="sr-only">: {post.title}</span></Link>
    </div>
  </article>)}</div>;
}

export default function News() {
  return <><Seo title="News and events" description="Find department announcements, activities, and where to ask about dates." />
    <PageHero title="News and events" subtitle="Read current announcements. Open an announcement for its activity dates and participation details." />
    <section className="container py-10" aria-labelledby="news-dates"><h2 id="news-dates" className="text-xl font-semibold">Looking for a date?</h2>
      <p className="mt-3 mb-4 max-w-3xl">Dates marked “Posted” show when an announcement was published. Check its full text for event dates, times, and location. Confirm arrangements with the department before travelling.</p>
      <nav aria-label="Find application and visiting dates" className="flex flex-wrap gap-3"><Link className="outline-link" to="/admissions">Application dates and steps</Link><Link className="outline-link" to="/about/contact#visit">Ask about visiting hours</Link></nav>
    </section>
    <section className="container pb-12" aria-labelledby="news-announcements"><h2 id="news-announcements" className="mb-5 text-2xl font-semibold">Department announcements</h2><NewsList /></section>
  </>;
}

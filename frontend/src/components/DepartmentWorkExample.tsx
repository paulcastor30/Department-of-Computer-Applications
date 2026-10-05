import { Link } from "react-router-dom";
import { useNews } from "@/hooks/useCommunications";
import { Section, SectionHeader } from "@/components/ui/section";

export function DepartmentWorkExample({ slug, heading }: { slug: string; heading: string }) {
  const { data = [], isLoading, isError } = useNews();
  const post = data.find(item => item.slug === slug);
  if (isLoading) return <Section><p role="status">Loading department example…</p></Section>;
  if (isError) return <Section><p>Department examples could not be loaded. Contact the department for information about its work.</p></Section>;
  if (!post) return null;
  return <Section variant="muted">
    <SectionHeader title={heading} className="mb-5" />
    <article className="max-w-3xl">
      <h3 className="text-xl font-semibold text-primary">{post.title}</h3>
      {post.published_at && <p className="mt-2 text-sm text-muted-foreground">University report: <time dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString("en-PH", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Manila" })}</time></p>}
      <p className="mt-4 leading-7">{post.summary}</p>
      <div className="mt-4 flex flex-wrap gap-5">
        <Link className="text-link inline-flex min-h-11 items-center" to={`/news/${post.slug}`}>Read about this work</Link>
        {post.source_url && <a className="text-link inline-flex min-h-11 items-center" href={post.source_url}>Official MSU-IIT report</a>}
      </div>
    </article>
  </Section>;
}

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Section, SectionHeader } from "@/components/ui/section";
import { departmentIdentity, homepageSections, placeholder } from "@/content/siteContent";
import { useNews } from "@/hooks/useCommunications";

export default function Index() {
  const { data: news = [] } = useNews();
  const latestNews = news.slice(0, 3);

  return (
    <>
      <Seo
        title="Home"
        description="Official website of the Department of Computer Applications, College of Computer Studies, MSU-Iligan Institute of Technology."
      />

      <section className="border-b border-border bg-background py-16 md:py-20">
        <div className="container max-w-5xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">{departmentIdentity.college}</p>
          <h1 className="mb-5 text-3xl font-bold leading-tight text-primary md:text-5xl">{departmentIdentity.name}</h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
            The Department of Computer Applications is an academic department of the College of Computer Studies,
            MSU-Iligan Institute of Technology. This website provides official information on academic programs,
            faculty, research, extension, facilities, quality assurance, and department announcements.
          </p>
        </div>
      </section>

      <Section>
        <SectionHeader title="Department Information" align="left" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {homepageSections.map((item) => (
            <Link key={item.href} to={item.href} className="rounded-md border border-border bg-background p-5 hover:border-secondary">
              <h2 className="mb-2 text-lg font-semibold text-primary">{item.title}</h2>
              <p className="mb-4 text-sm leading-6 text-muted-foreground">{item.description}</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                View section <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader
          title="Academic Focus"
          subtitle="The Department’s public academic focus should be confirmed against officially approved program documents, department plans, and college-level records."
          align="left"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            "Applied computing and computer applications.",
            "Embedded systems, Internet of Things, and connected systems.",
            "Research, thesis work, industry immersion, and community engagement.",
          ].map((item) => (
            <div key={item} className="rounded-md border border-border bg-background p-5 text-sm leading-6 text-muted-foreground">
              {item}
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader title="News and Announcements" align="left" />
        {latestNews.length ? (
          <div className="grid gap-5 md:grid-cols-3">
            {latestNews.map((item) => (
              <article key={item.id} className="rounded-md border border-border p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary">{item.category}</p>
                <h2 className="mb-3 text-lg font-semibold text-primary">{item.title}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{item.summary || placeholder}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            Official announcements and department news are {placeholder.toLowerCase()}.
          </div>
        )}
        <Link to="/news" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
          View news and events <ArrowRight className="h-4 w-4" />
        </Link>
      </Section>
    </>
  );
}

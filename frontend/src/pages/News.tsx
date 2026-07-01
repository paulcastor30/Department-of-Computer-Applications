import { Seo } from "@/components/Seo";
import { Section, SectionHeader } from "@/components/ui/section";
import { placeholder } from "@/content/siteContent";
import { useNews } from "@/hooks/useCommunications";

export default function News() {
  const { data: news = [], isLoading, isError } = useNews();

  return (
    <>
      <Seo title="News and Events" description="Official department news, announcements, events, defenses, visits, and workshops." />

      <Section>
        <SectionHeader
          title="News and Events"
          subtitle="Department news should be factual, dated, and limited to official announcements, academic activities, visits, workshops, thesis defenses, achievements, and events."
          align="left"
        />

        {isLoading && <p className="text-sm text-muted-foreground">Loading news and events...</p>}
        {isError && <p className="text-sm text-muted-foreground">News and events could not be loaded.</p>}

        {news.length ? (
          <div className="grid gap-5 md:grid-cols-3">
            {news.map((item) => (
              <article key={item.id} className="rounded-md border border-border p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary">{item.category || "Announcement"}</p>
                <h2 className="mb-3 text-lg font-semibold text-primary">{item.title}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{item.summary || placeholder}</p>
              </article>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="rounded-md border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
              Official news and events are {placeholder.toLowerCase()}.
            </div>
          )
        )}
      </Section>
    </>
  );
}

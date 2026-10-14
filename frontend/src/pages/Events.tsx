import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { useEvents } from "@/hooks/useCommunications";
import { calendarDate } from "@/lib/calendarDate";
export default function Events() {
  const [view, setView] = useState("upcoming");
  const [kind, setKind] = useState("all");
  const {data, isPending, isError, refetch} = useEvents(view, kind);
  const entries = data?.results || [];
  return <><Seo title="Events and deadlines" description="Find upcoming department activities, submission deadlines and research conference dates." />
    <PageHero title="Events and deadlines" subtitle="Activity dates, submission deadlines and research conference dates." />
    <section className="container max-w-5xl py-10" aria-labelledby="dates-title">
      <nav aria-label="News and date views" className="mb-8 flex flex-wrap gap-3"><Link className="outline-link" to="/news">Department announcements</Link><Link className="outline-link" to="/admissions">How to apply</Link><Link className="outline-link" to="/resources">Student resources</Link></nav>
      <div className="mb-6 flex flex-wrap gap-5">
        <label className="grid gap-2 font-semibold" htmlFor="calendar-view">Date view<select id="calendar-view" className="min-h-11 rounded-md border border-input bg-background px-3 font-normal" value={view} onChange={event => setView(event.target.value)}><option value="upcoming">Upcoming and ongoing</option><option value="past">Past dates</option></select></label>
        <label className="grid gap-2 font-semibold" htmlFor="calendar-kind">Show<select id="calendar-kind" className="min-h-11 rounded-md border border-input bg-background px-3 font-normal" value={kind} onChange={event => setKind(event.target.value)}><option value="all">All dates</option><option value="events">Department activities</option><option value="deadlines">Deadlines</option><option value="conferences">Research conference dates</option></select></label>
      </div>
      <h2 id="dates-title" className="text-2xl font-semibold">{view === "past" ? "Past dates" : "Upcoming and ongoing"}</h2>
      <p className="mb-6 mt-3 text-sm text-muted-foreground">Dates and activity times use Philippine time. Research conference entries link to the corresponding paper records.</p>
      {isPending ? <p role="status">Loading dates…</p> : isError ? <div role="status"><p>Dates could not be loaded.</p><button type="button" className="outline-link mt-3" onClick={() => void refetch()}>Try again</button></div> : <>
        <p role="status" className="mb-5 text-sm text-muted-foreground">{entries.length} {entries.length === 1 ? "entry" : "entries"}{data?.today && ` · As of ${calendarDate(data.today)}`}</p>
        {!entries.length && <div className="notice"><p>No {view === "past" ? "past" : "upcoming"} dates are listed for this view.</p><Link className="text-link mt-3 inline-flex min-h-11 items-center" to="/about/contact">Ask about department dates</Link></div>}
        <ol className="grid gap-5">{entries.map(entry => <li key={entry.id} className="rounded-md border border-border p-5 sm:p-6">
          <p className="text-sm font-semibold text-secondary">{entry.label}{entry.status && ` · ${entry.status}`}</p>
          <p className="mt-2 font-semibold"><time dateTime={entry.starts_on}>{calendarDate(entry.starts_on)}</time>{entry.ends_on !== entry.starts_on && <> – <time dateTime={entry.ends_on}>{calendarDate(entry.ends_on)}</time></>}{entry.starts_at && ` · ${entry.starts_at.slice(0,5)} Philippine time`}</p>
          <h3 className="mt-3 text-xl font-semibold"><Link className="text-link" to={entry.href}>{entry.title}</Link></h3>
          {entry.summary && <p className="mt-3 leading-7 text-muted-foreground">{entry.summary}</p>}{entry.location && <p className="mt-3"><strong>Location:</strong> {entry.location}</p>}
          <Link className="text-link mt-3 inline-flex min-h-11 items-center" to={entry.href}>View {entry.kind === "conferences" ? "conference record" : "announcement"}<span className="sr-only">: {entry.title}</span></Link>
        </li>)}</ol>
      </>}
    </section></>;
}

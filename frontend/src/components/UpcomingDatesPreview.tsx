import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useCommunications";
import { calendarDate } from "@/lib/calendarDate";
export function UpcomingDatesPreview() {
  const {data,isPending,isError,refetch}=useEvents("upcoming","all");
  const entries=(data?.results || []).slice(0,3);
  return <aside aria-labelledby="home-dates-title" className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
    <h3 id="home-dates-title" className="text-xl font-semibold">Upcoming dates</h3>
    {isPending ? <p role="status" className="mt-3">Loading dates…</p> : isError ? <div className="mt-3"><p>Dates could not be loaded.</p><button className="text-link min-h-11" onClick={()=>void refetch()}>Try again</button></div> : entries.length ? <ul className="mt-4 divide-y divide-border">{entries.map(entry=><li key={entry.id} className="py-3"><p className="text-sm font-semibold">{entry.label}{entry.status && ` · ${entry.status}`}</p><p className="mt-1 text-sm text-muted-foreground"><time dateTime={entry.starts_on}>{calendarDate(entry.starts_on)}</time>{entry.ends_on!==entry.starts_on && <> – <time dateTime={entry.ends_on}>{calendarDate(entry.ends_on)}</time></>}</p><Link className="text-link mt-2 inline-block leading-6" to={entry.href}>{entry.title}</Link></li>)}</ul> : <p className="mt-3 leading-7 text-muted-foreground">No upcoming dates are currently listed.</p>}
    <Link className="text-link mt-4 inline-flex min-h-11 items-center" to="/news/events">View all events and deadlines</Link>
  </aside>;
}

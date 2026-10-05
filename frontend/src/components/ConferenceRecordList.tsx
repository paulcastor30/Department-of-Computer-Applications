import { useState } from "react";
import { Link } from "react-router-dom";
import { useConferenceRecords } from "@/hooks/useResearch";
import { Section, SectionHeader } from "@/components/ui/section";

export function ConferenceRecordList({ preview = false }: { preview?: boolean }) {
  const { data = [], isLoading, isError } = useConferenceRecords();
  const [year, setYear] = useState("all");
  const years = [...new Set(data.map(record => record.year))].sort((a, b) => b - a);
  const records = preview ? data.filter(record => !record.withdrawn).slice(0, 3) : data.filter(record => year === "all" || String(record.year) === year);
  return <Section id="conference-records" variant="muted">
    <SectionHeader title="Research at conferences" subtitle="Conference research involving DCA faculty, students and collaborators. Records include future-dated conferences and withdrawn entries; listing does not establish completed presentation or publication." className="mb-6" />
    {isLoading ? <p role="status">Loading conference records…</p> : isError ? <p role="status">Conference records could not be loaded. <Link className="text-link" to="/about/contact">Contact the department for conference information.</Link></p> : !data.length ? <p>No conference records are currently listed.</p> : <>
      {!preview && <div className="mb-6 max-w-xs">
        <label className="mb-2 block font-semibold" htmlFor="conference-year">Conference year</label>
        <select id="conference-year" className="min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground" value={year} onChange={event => setYear(event.target.value)}>
          <option value="all">All years</option>
          {years.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
        <p role="status" className="mt-3 text-sm text-muted-foreground">{records.length} conference {records.length === 1 ? "record" : "records"}{year === "all" ? " across all years" : ` for ${year}`}.</p>
      </div>}
      <div className="space-y-5">{records.map(record => <article id={record.slug} key={record.slug} className="scroll-mt-24 rounded-md border border-border bg-background p-5 md:p-6">
        <div className="mb-3 flex flex-wrap gap-3 text-sm font-semibold">
          <span>{record.year} · {record.scope_display}</span>
          {record.withdrawn && <span className="rounded border border-border px-2 text-foreground">Withdrawn</span>}
        </div>
        <h3 className="text-lg font-semibold leading-7 text-primary">{record.title}</h3>
        <p className="mt-3 leading-7">{record.conference}</p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><dt className="text-sm font-semibold">Conference dates</dt><dd className="mt-1 leading-7">{record.date_label}</dd></div>
          <div><dt className="text-sm font-semibold">Location</dt><dd className="mt-1 leading-7">{record.location}</dd></div>
        </dl>
        <details className="mt-4 border-t border-border pt-3">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold text-primary">View authors<span className="sr-only"> for {record.title}</span></summary>
          <p className="mt-3 leading-7">{record.authors}</p>
        </details>
      </article>)}</div>
    </>}
    {preview && <Link className="action-link mt-6" to="/research/conferences">View all conference records</Link>}
  </Section>;
}

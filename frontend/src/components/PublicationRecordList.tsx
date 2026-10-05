import { useState } from "react";
import { Link } from "react-router-dom";
import { usePublicationRecords } from "@/hooks/useResearch";
import { Section, SectionHeader } from "@/components/ui/section";

export function PublicationRecordList({ preview = false }: { preview?: boolean }) {
  const { data = [], isLoading, isError } = usePublicationRecords();
  const [year, setYear] = useState("all");
  const [kind, setKind] = useState("all");
  const years = [...new Set(data.map(record => record.year))].sort((a, b) => b - a);
  const records = preview ? data.slice(0, 3) : data.filter(record => (year === "all" || String(record.year) === year) && (kind === "all" || record.kind === kind));
  return <Section id="publication-records">
    <SectionHeader title="Publications" subtitle="Papers involving DCA faculty, students and collaborators. Open a publisher record for the full citation and available access to the paper." className="mb-6" />
    {isLoading ? <p role="status">Loading publications…</p> : isError ? <p role="status">Publications could not be loaded. <Link className="text-link" to="/about/contact">Contact the department for publication information.</Link></p> : !data.length ? <p>No publications are currently listed.</p> : <>
      {!preview && <>
        <p className="mb-5 max-w-3xl leading-7 text-muted-foreground">Years use the first online publication date when available, otherwise the citation year. Preprints are listed separately by type and are not peer-reviewed journal articles.</p>
        <div className="mb-3 grid max-w-xl gap-4 sm:grid-cols-2">
          <div><label className="mb-2 block font-semibold" htmlFor="publication-year">Publication year</label>
            <select id="publication-year" className="min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground" value={year} onChange={event => setYear(event.target.value)}>
              <option value="all">All years</option>{years.map(value => <option key={value} value={value}>{value}</option>)}
            </select></div>
          <div><label className="mb-2 block font-semibold" htmlFor="publication-kind">Publication type</label>
            <select id="publication-kind" className="min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground" value={kind} onChange={event => setKind(event.target.value)}>
              <option value="all">All types</option><option value="JOURNAL">Journal articles</option><option value="PROCEEDINGS">Conference papers</option><option value="PREPRINT">Preprints</option>
            </select></div>
        </div>
        <p role="status" className="mb-6 text-sm text-muted-foreground">{records.length} {records.length === 1 ? "publication" : "publications"} shown.</p>
      </>}
      {!records.length && <p>No publications match these filters. Choose another year or publication type.</p>}
      <div className="space-y-5">{records.map(record => <article id={record.slug} key={record.slug} className="scroll-mt-24 rounded-md border border-border bg-background p-5 md:p-6">
        <p className="mb-3 text-sm font-semibold">{record.year} · {record.kind_display}</p>
        <h3 className="text-lg font-semibold leading-7 text-primary">{record.title}</h3>
        <p className="mt-3 leading-7">{record.venue}</p>
        {record.citation_details && <p className="mt-2 leading-7 text-muted-foreground">{record.citation_details}</p>}
        <p className="mt-2 leading-7 text-muted-foreground">{record.date_label}</p>
        {record.kind === "PREPRINT" && <p className="mt-3 leading-7">Preprint: this record does not establish peer-reviewed publication.</p>}
        <details className="mt-4 border-t border-border pt-3">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold text-primary">View authors and citation details<span className="sr-only"> for {record.title}</span></summary>
          <p className="mt-3 leading-7">{record.authors}</p>
          {record.publisher && <p className="mt-3 leading-7">Publisher: {record.publisher}</p>}
          {record.doi && <p className="mt-2 break-words leading-7">DOI: {record.doi}</p>}
        </details>
        <a className="text-link mt-3 inline-flex min-h-11 items-center" href={record.source_url}>Open {record.kind === "PREPRINT" ? "preprint" : "publication"} record<span className="sr-only"> for {record.title}</span></a>
      </article>)}</div>
    </>}
    {preview && <Link className="action-link mt-6" to="/research/publications">View all publications</Link>}
  </Section>;
}

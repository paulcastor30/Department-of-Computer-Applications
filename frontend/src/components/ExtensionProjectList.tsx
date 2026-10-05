import { useState } from "react";
import { Link } from "react-router-dom";
import { useExtensionProjects } from "@/hooks/useExtension";
import { Section, SectionHeader } from "@/components/ui/section";

export function ExtensionProjectList() {
  const { data = [], isLoading, isError } = useExtensionProjects();
  const [year, setYear] = useState("all");
  const years = [...new Set(data.map(project => project.reporting_year))].sort((a, b) => b - a);
  const records = data.filter(project => year === "all" || String(project.reporting_year) === year);
  return <Section id="extension-projects">
    <SectionHeader title="Extension programs and projects" subtitle="Community activities involving DCA faculty and their collaborators. Reporting years do not indicate whether an activity is ongoing or completed." className="mb-6" />
    {isLoading ? <p role="status">Loading extension records…</p> : isError ? <p role="status">Extension records could not be loaded. <Link className="text-link" to="/about/contact">Contact the department for community activity information.</Link></p> : !data.length ? <p>No extension records are currently listed.</p> : <>
      <div className="mb-6 max-w-xs">
        <label className="mb-2 block font-semibold" htmlFor="extension-year">Reporting year</label>
        <select id="extension-year" className="min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground" value={year} onChange={event => setYear(event.target.value)}>
          <option value="all">All years</option>{years.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
        <p role="status" className="mt-3 text-sm text-muted-foreground">{records.length} extension {records.length === 1 ? "record" : "records"} shown.</p>
      </div>
      <div className="space-y-5">{records.map(project => <article id={project.slug} key={project.slug} className="scroll-mt-24 rounded-md border border-border p-5 md:p-6">
        <p className="mb-3 text-sm font-semibold">Reporting year: {project.reporting_year}</p>
        <h3 className="text-lg font-semibold leading-7 text-primary">{project.title}</h3>
        <dl className="mt-4"><dt className="text-sm font-semibold">Extension leader</dt><dd className="mt-1 leading-7">{project.extension_leader}</dd></dl>
        {project.participant_groups.length > 0 && <details className="mt-4 border-t border-border pt-3">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold text-primary">View participants<span className="sr-only"> for {project.title}, {project.reporting_year}</span></summary>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Participant groups are as reported for this record and may differ from current appointments.</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">{project.participant_groups.map(group => <section key={group.label}>
            <h4 className="font-semibold">{group.label}</h4>
            <ul className="mt-2 list-disc space-y-2 pl-5 leading-7">{group.members.map(name => <li key={name}>{name}</li>)}</ul>
          </section>)}</div>
        </details>}
      </article>)}</div>
    </>}
  </Section>;
}

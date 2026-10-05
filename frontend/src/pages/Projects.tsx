import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { usePrototypes } from "@/hooks/usePrototypes";

export default function Projects() {
  const { data = [], isLoading, isError } = usePrototypes();
  const [year, setYear] = useState("all");
  const [kind, setKind] = useState("all");
  const years = [...new Set(data.map(project => project.reporting_year))].sort((a, b) => b - a);
  const kinds = [...new Map(data.map(project => [project.kind, project.kind_display])).entries()].sort((a, b) => a[1].localeCompare(b[1]));
  const records = data.filter(project => (year === "all" || String(project.reporting_year) === year) && (kind === "all" || project.kind === kind));
  return <>
    <Seo title="Projects and prototypes" description="Explore embedded games, sensors, displays and controllers from the department project showcase, with reporting years and public Hackster project links." />
    <PageHero title="Projects and prototypes" subtitle="See how software, firmware and hardware come together in practical computing projects." />
    <Section>
      <Link className="text-link inline-flex min-h-11 items-center" to="/our-work">What we do</Link>
      <SectionHeader title="Explore the project showcase" subtitle="Browse the department-supplied project collection. Each entry links to its documentation and creator credits on Hackster." className="mb-5 mt-6" />
      <p className="mb-6 max-w-3xl leading-7 text-muted-foreground">Years are department reporting years. These examples showcase project design and implementation; they are listed separately from research publications.</p>
      {isLoading ? <p role="status">Loading projects…</p> : isError ? <p role="status">Projects could not be loaded. <Link className="text-link" to="/about/contact">Ask the department about project examples.</Link></p> : !data.length ? <p>No projects are currently listed.</p> : <>
        <div className="grid max-w-xl gap-4 sm:grid-cols-2">
          <div><label className="mb-2 block font-semibold" htmlFor="prototype-year">Reporting year</label><select id="prototype-year" className="min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground" value={year} onChange={event => setYear(event.target.value)}><option value="all">All years</option>{years.map(value => <option key={value} value={value}>{value}</option>)}</select></div>
          <div><label className="mb-2 block font-semibold" htmlFor="prototype-kind">Project type</label><select id="prototype-kind" className="min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground" value={kind} onChange={event => setKind(event.target.value)}><option value="all">All types</option>{kinds.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
        </div>
        <p role="status" className="mb-6 mt-3 text-sm text-muted-foreground">{records.length} {records.length === 1 ? "project" : "projects"} shown.</p>
        {!records.length && <p>No projects match these filters. Choose another year or project type.</p>}
        <div className="grid gap-5 md:grid-cols-2">{records.map(project => <article id={project.slug} key={project.slug} className="flex scroll-mt-24 flex-col rounded-md border border-border p-5 md:p-6">
          <p className="mb-3 text-sm font-semibold">{project.reporting_year} · {project.kind_display}</p>
          <h3 className="text-lg font-semibold leading-7 text-primary">{project.title}</h3>
          <p className="mt-3 leading-7">{project.summary}</p>
          <p className="mb-3 mt-4 text-sm leading-6 text-muted-foreground">{project.creator_credits ? `Credits listed on Hackster: ${project.creator_credits}` : "See the project page for creator credits."}</p>
          <a className="text-link mt-auto inline-flex min-h-11 items-center" href={project.source_url}>View project on Hackster<span className="sr-only"> for {project.title}</span></a>
        </article>)}</div>
      </>}
    </Section>
  </>;
}

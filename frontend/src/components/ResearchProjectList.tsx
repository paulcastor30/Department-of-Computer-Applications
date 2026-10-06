import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useResearchProjects, type ResearchProject } from "@/hooks/useResearch";
import { Section, SectionHeader } from "@/components/ui/section";

export function ResearchProjectList({ preview = false }: { preview?: boolean }) {
  const { data = [], isLoading, isError } = useResearchProjects();
  const [year, setYear] = useState("all");
  const { hash } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!preview || !hash) return;
    let slug = hash.slice(1);
    try { slug = decodeURIComponent(slug); } catch { return; }
    if (data.some(project => project.slug === slug)) navigate(`/research/projects#${encodeURIComponent(slug)}`, { replace: true });
  }, [preview, hash, data, navigate]);
  const years = [...new Set(data.map(project => project.reporting_year))].sort((a, b) => b.localeCompare(a));
  const records = preview ? data.slice(0, 3) : data.filter(project => year === "all" || project.reporting_year === year);
  const visibleYears = [...new Set(records.map(project => project.reporting_year))];
  return <Section id="department-projects">
    <SectionHeader title={preview ? "Research project highlights" : "Department research projects"} subtitle={preview ? "A short selection from the latest reporting years. Explore the complete list for more projects and their teams." : "Research involving department researchers and their collaborators."} className="mb-5" />
    <p className="mb-6 max-w-3xl leading-7 text-muted-foreground">Years below are reporting years and do not indicate whether a project is ongoing or completed. Plain-language summaries describe the intended focus, not measured results.</p>
    {isLoading ? <p role="status">Loading research projects…</p> : isError ? <p role="status">Research projects could not be loaded. <Link className="text-link" to="/about/contact">Contact the department for research information.</Link></p> : !data.length ? <p>No research projects are currently listed.</p> : <>
      {!preview && <div className="mb-6 max-w-xs">
        <label htmlFor="research-reporting-year" className="mb-2 block font-semibold">Reporting year</label>
        <select id="research-reporting-year" value={year} onChange={event => setYear(event.target.value)} className="min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground">
          <option value="all">All years</option>{years.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
        <p role="status" className="mt-3 text-sm text-muted-foreground">{records.length} {records.length === 1 ? "project" : "projects"} shown.</p>
      </div>}
      <div className="space-y-8">
        {preview ? <div className="grid gap-5 lg:grid-cols-3">{records.map(project => <ProjectCard key={project.slug} project={project} showYear />)}</div> : visibleYears.map(value => <section key={value} aria-labelledby={`research-year-${value}`}>
          <h3 id={`research-year-${value}`} className="mb-4 text-lg font-semibold text-primary">Reporting year: {value}</h3>
          <div className="space-y-5">{records.filter(project => project.reporting_year === value).map(project => <ProjectCard key={project.slug} project={project} />)}</div>
        </section>)}
      </div>
      {preview && <Link className="action-link mt-6" to="/research/projects">View all {data.length} research projects</Link>}
    </>}
  </Section>;
}


function ProjectCard({ project, showYear = false }: { project: ResearchProject; showYear?: boolean }) {
  const Heading = showYear ? "h3" : "h4";
  return <article id={project.slug} className="scroll-mt-24 rounded-md border border-border p-5 md:p-6">
            {showYear && <p className="mb-3 text-sm font-semibold text-muted-foreground">Reporting year: {project.reporting_year}</p>}
            <Heading className="text-lg font-semibold leading-7 text-primary">{project.title}</Heading>
            {project.plain_language_summary && <p className="mt-3 leading-7">{project.plain_language_summary}</p>}
            {project.intended_audience && <p className="mt-3 text-sm leading-6"><strong>Intended users or audience:</strong> {project.intended_audience}</p>}
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-sm font-semibold">Research leader</dt><dd className="mt-1 leading-7">{project.research_leader}</dd></div>
              <div><dt className="text-sm font-semibold">Funding</dt><dd className="mt-1 leading-7 text-muted-foreground">{project.funding_display}</dd></div>
            </dl>
            {project.team_members.length > 0 && <details className="mt-4 border-t border-border pt-3">
              <summary className="min-h-11 cursor-pointer py-2 font-semibold text-primary">View research team<span className="sr-only"> for {project.title}</span></summary>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">{project.team_members.map(name => <li key={name}>{name}</li>)}</ul>
            </details>}
          </article>;
}

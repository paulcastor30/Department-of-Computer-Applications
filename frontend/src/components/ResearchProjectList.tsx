import { Link } from "react-router-dom";
import { useResearchProjects } from "@/hooks/useResearch";
import { Section, SectionHeader } from "@/components/ui/section";

export function ResearchProjectList() {
  const { data = [], isLoading, isError } = useResearchProjects();
  const years = [...new Set(data.map(project => project.reporting_year))];
  return <Section id="department-projects">
    <SectionHeader title="Department research projects" subtitle="Research involving department researchers and their collaborators. Years below are reporting years and do not indicate whether a project is ongoing or completed." className="mb-6" />
    {isLoading ? <p role="status">Loading research projects…</p> : isError ? <p role="status">Research projects could not be loaded. <Link className="text-link" to="/about/contact">Contact the department for research information.</Link></p> : !data.length ? <p>No research projects are currently listed.</p> : <div className="space-y-10">
      {years.map(year => <section key={year} aria-labelledby={`research-year-${year}`}>
        <h3 id={`research-year-${year}`} className="mb-5 text-xl font-semibold text-primary">Reporting year: {year}</h3>
        <div className="space-y-5">{data.filter(project => project.reporting_year === year).map(project => <article id={project.slug} key={project.slug} className="rounded-md border border-border p-5 md:p-6">
          <h4 className="text-lg font-semibold leading-7 text-primary">{project.title}</h4>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><dt className="text-sm font-semibold">Research leader</dt><dd className="mt-1 leading-7">{project.research_leader}</dd></div>
            <div><dt className="text-sm font-semibold">Funding</dt><dd className="mt-1 leading-7 text-muted-foreground">{project.funding_display}</dd></div>
          </dl>
          {project.team_members.length > 0 && <details className="mt-4 border-t border-border pt-3">
            <summary className="min-h-11 cursor-pointer py-2 font-semibold text-primary">View research team<span className="sr-only"> for {project.title}</span></summary>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">{project.team_members.map(name => <li key={name}>{name}</li>)}</ul>
          </details>}
        </article>)}</div>
      </section>)}
    </div>}
  </Section>;
}

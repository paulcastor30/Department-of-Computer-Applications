import { Link } from "react-router-dom";
import { usePrototypes } from "@/hooks/usePrototypes";
import { useResearchProjects } from "@/hooks/useResearch";

/** Display only published CMS records. No invented examples when an API is unavailable. */
export function RealDepartmentWork() {
  const prototypes = usePrototypes();
  const research = useResearchProjects();
  const student = prototypes.data?.find(item => item.kind === "SENSING") || prototypes.data?.[0];
  const project = research.data?.find(item => item.slug === "aphids-detection") || research.data?.find(item => item.plain_language_summary);
  const hasExamples = !!student || !!project;
  return <section className="container home-content home-section border-b border-border" aria-labelledby="home-real-work-title">
    <h2 id="home-real-work-title">Computer Applications in practice</h2>
    <p className="home-section-description">See what students and researchers work on. These examples come from the department’s published records.</p>
    {hasExamples && <ul className="home-degree-grid mt-5">
      {student && <li className="rounded-md border border-border bg-background p-5"><p className="font-medium text-secondary">BSCA student output</p><h3 className="mt-2 text-lg font-semibold text-primary">{student.title}</h3><p className="mt-3 leading-7">{student.summary}</p><Link className="text-link inline-flex min-h-11 items-center mt-3" to={`/projects#${student.slug}`}>Explore student projects</Link></li>}
      {project && <li className="rounded-md border border-border bg-background p-5"><p className="font-medium text-secondary">Research involving DCA</p><h3 className="mt-2 text-lg font-semibold text-primary">{project.title}</h3><p className="mt-3 leading-7">{project.plain_language_summary}</p><Link className="text-link inline-flex min-h-11 items-center mt-3" to={`/research/projects#${project.slug}`}>Read about this research and its team</Link></li>}
    </ul>}
    {!hasExamples && <p className="mt-4 leading-7">{prototypes.isLoading || research.isLoading ? "Loading department examples. You can still explore the records below." : "Explore the project collections below, or contact the department for help finding an example."}</p>}
    <p className="mt-4 max-w-prose leading-7 text-muted-foreground">Research summaries describe intended work, not proof of completed results or measured impact.</p>
    <nav aria-label="Explore actual department work" className="mt-3 flex flex-wrap gap-x-6 gap-y-2"><Link className="text-link inline-flex min-h-11 items-center" to="/projects">All BSCA student projects</Link><Link className="text-link inline-flex min-h-11 items-center" to="/research/publications">Research publications</Link><Link className="text-link inline-flex min-h-11 items-center" to="/extension">Community projects</Link><Link className="text-link inline-flex min-h-11 items-center" to="/facilities">Teaching and laboratory spaces</Link></nav>
  </section>;
}

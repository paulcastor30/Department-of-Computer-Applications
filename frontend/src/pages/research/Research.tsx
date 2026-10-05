import { ResearchProjectList } from "@/components/ResearchProjectList";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { usePrograms } from "@/hooks/useAcademics";
import { availableProgramItems, normalizePrograms } from "../programs/programData";
import { DepartmentWorkExample } from "@/components/DepartmentWorkExample";

export default function Research() {
  const { data } = usePrograms();
  const programs = normalizePrograms(data);
  return <>
    <Seo title="Research" description="Explore department research projects, research teams and funding, computing study areas, and collaboration enquiries." />
    <PageHero title="Research" subtitle="Explore department research projects, the people involved and computing study areas." />
    <ResearchProjectList />
    <DepartmentWorkExample slug="vermisense-rcite-2026" heading="Research in practice" />
    <Section>
      <SectionHeader title="Computing areas in our programs" subtitle="These are curriculum-based learning areas, rather than a statement of an approved departmental research agenda." className="mb-6" />
      <div className="grid gap-8 md:grid-cols-2">{programs.map(program => <section key={program.code}>
        <h3 className="mb-4 text-xl font-semibold text-primary">{program.code}</h3>
        <ul className="list-disc space-y-3 pl-5 leading-7 text-muted-foreground">{availableProgramItems(program.academicAreas).map(area => <li key={area}>{area}</li>)}</ul>
        <Link className="text-link mt-5 inline-flex min-h-11 items-center" to={program.route}>Explore {program.code}</Link>
      </section>)}</div>
    </Section>
    <Section variant="muted">
      <SectionHeader title="Research enquiries" className="mb-5" />
      <p className="max-w-3xl leading-7">For current research topics, project participation, publications or collaboration, contact the department and describe your interest.</p>
      <div className="mt-5 flex flex-wrap gap-4"><Link className="action-link" to="/about/contact">Ask about research</Link><Link className="outline-link" to="/faculty">Find faculty and their expertise</Link><Link className="text-link inline-flex min-h-11 items-center" to="/resources">Thesis guidance</Link></div>
    </Section>
  </>;
}

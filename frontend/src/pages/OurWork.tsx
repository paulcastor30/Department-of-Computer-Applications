import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { usePrograms } from "@/hooks/useAcademics";
import { normalizePrograms } from "./programs/programData";

export default function OurWork() {
  const { data } = usePrograms();
  const programs = normalizePrograms(data);
  return (
    <>
      <Seo title="What we do" description="Understand the department's teaching, degree programs, research information, and community work." />
      <PageHero title="What we do" subtitle="Start with our degree programs, then explore research and community information." />
      <div className="container max-w-5xl space-y-10 py-12">
        <section aria-labelledby="work-teaching">
          <h2 id="work-teaching" className="section-title">Teaching and learning</h2>
          <p className="mt-4">The department offers two degrees in Computer Applications. Computer applications means using computing to meet practical needs.</p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">{programs.map(program => <li key={program.code} className="notice">
            <h3 className="text-lg font-semibold">{program.title}</h3>
            <p className="mt-2">{program.level} · {program.code}</p>
            <p className="mt-2">Thesis requirement: {program.culminatingRequirement}.</p>
            <Link className="text-link inline-flex min-h-11 items-center mt-3" to={program.route}>Explore {program.code}</Link>
          </li>)}</ul>
        </section>
        <section aria-labelledby="work-prototypes">
          <h2 id="work-prototypes" className="section-title">Projects and prototypes</h2>
          <p className="mt-4">Explore games, sensors, displays and controllers that bring software, firmware and hardware together. Open the project documentation to see how they were built and who is credited.</p>
          <Link className="text-link inline-flex min-h-11 items-center mt-3" to="/projects">Explore projects and prototypes</Link>
        </section>
        <section aria-labelledby="work-research">
          <h2 id="work-research" className="section-title">Research</h2>
          <p className="mt-4">Explore a documented Computer Applications research example and the computing areas studied in our programs. Contact the department about current projects, publications or collaboration.</p>
          <Link className="text-link inline-flex min-h-11 items-center mt-3" to="/research">Find research information</Link>
        </section>
        <section aria-labelledby="work-community">
          <h2 id="work-community" className="section-title">Community work</h2>
          <p className="mt-4">Community work shares knowledge beyond the classroom. Read about a past my.ComApps workshop, then ask the department about current activities and participation.</p>
          <Link className="text-link inline-flex min-h-11 items-center mt-3" to="/extension">Find community information</Link>
        </section>
        <section className="notice" aria-labelledby="work-connect">
          <h2 id="work-connect" className="text-xl font-semibold">Interested in our work?</h2>
          <p className="mt-3 mb-4">Tell the department whether you are asking about a degree, research, or a community activity. Ask for current details and who can help.</p>
          <Link className="action-link" to="/about/contact">Ask about our work</Link>
        </section>
      </div>
    </>
  );
}

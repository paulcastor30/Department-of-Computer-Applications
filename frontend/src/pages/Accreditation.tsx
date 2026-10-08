import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { usePrograms } from "@/hooks/useAcademics";
import { bscaProgram, normalizeProgram } from "@/pages/programs/programData";

export default function Page() {
  const { data: programs } = usePrograms();
  const data = programs?.find(program => program.code === "BSCA" || program.slug === "bsca");
  const program = normalizeProgram(data, bscaProgram);

  return (
    <>
      <Seo title="Quality assurance" description={program.recognition} />
      <PageHero
        title="Quality assurance"
        subtitle="How the department reviews and improves its academic work."
      />
      <div className="container max-w-4xl space-y-8 py-12">
        <section className="notice" aria-labelledby="bsca-accreditation">
          <h2 id="bsca-accreditation" className="mb-3 text-xl font-semibold">BSCA accreditation</h2>
          <p className="leading-7"><strong>{program.recognition}</strong></p>
          <Link className="outline-link mt-5" to="/programs/bsca">Explore BS in Computer Applications</Link>
        </section>
        <nav aria-label="Related information">
          <h2 className="mb-4 text-xl font-semibold">You may also need</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            <li><Link className="outline-link w-full" to="/programs">Academic programs</Link></li>
            <li><Link className="outline-link w-full" to="/faculty">Faculty directory</Link></li>
          </ul>
        </nav>
      </div>
    </>
  );
}

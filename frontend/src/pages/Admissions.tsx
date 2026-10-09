import { TransferEvaluation } from "@/components/TransferEvaluation";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { usePrograms } from "@/hooks/useAcademics";
import { normalizePrograms } from "./programs/programData";
import { ProgramInquiry } from "./programs/ProgramInquiry";

export default function Admissions() {
  const { data, isError } = usePrograms();
  const programs = normalizePrograms(data);
  return <>
    <Seo canonicalUrl="https://msuiit-comapps.vercel.app/admissions" title="How to apply" description="Choose BSCA undergraduate or MSCA graduate study and follow the official MSU-IIT application and admission guidance." />
    <PageHero title="How to apply" subtitle="Choose your degree, review the official requirements, then follow the university application process." />
    <Section>
      {isError && <p className="notice mb-6" role="status">The latest program updates could not be loaded. Reference admissions links are shown; confirm current instructions with the university.</p>}
      <div className="grid gap-6 md:grid-cols-2">{programs.map(program => <article key={program.code} className="rounded-md border border-border p-6 md:p-8">
        <p className="mb-2 text-sm font-semibold text-secondary">{program.level} · {program.code}</p>
        <h2 className="text-2xl font-semibold leading-snug text-primary">{program.title}</h2>
        <ol className="mt-5 list-decimal space-y-4 pl-5 leading-7">
          <li>Review the <Link className="text-link" to={program.route}>{program.code} program and study requirements</Link>.</li>
          <li>{program.admissionsUrl ? <a className="text-link" href={program.admissionsUrl}>{program.code === "BSCA" ? "Read the official undergraduate admission requirements" : "Read the CCS graduate application and admission guide"}</a> : "Ask the department for the current official admissions guide."}</li>
          <li>{program.admissionsPortalUrl ? <><a className="text-link" href={program.admissionsPortalUrl}>Visit the MSU-IIT Admission Portal</a> when applications open.</> : "Follow the graduate guide for program acceptance, university admission and enrolment."}</li>
        </ol>
        <TransferEvaluation program={program} />
      </article>)}</div>
      <p className="mt-6 max-w-3xl leading-7 text-muted-foreground">Use the official university or college guide for current eligibility, documents, fees and dates. BSCA shifting and transfer evaluation requests can be submitted here. University admission and enrollment follow the official process; an evaluation request does not guarantee admission.</p>
    </Section>
    <Section variant="muted">
      <SectionHeader title="Need help choosing your next step?" className="mb-5" />
      <ProgramInquiry compact />
    </Section>
  </>;
}

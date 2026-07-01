import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { usePrograms } from "@/hooks/useAcademics";
import { evidenceMatrix, normalizePrograms, qaStandards } from "./programData";

export default function Programs() {
  const { data, isError } = usePrograms();
  const displayedPrograms = normalizePrograms(data);

  return (
    <>
      <PageHero
        title="Academic Program Information"
        subtitle="Official undergraduate and graduate program information structured for curriculum review, accreditation, and quality-assurance documentation."
      />

      <Section>
        <SectionHeader
          title="Program Catalogue"
          subtitle="The information below identifies each program by level, curriculum load, approval or recognition basis, and documented program requirements."
        />

        {isError && (
          <p className="mx-auto mb-6 max-w-3xl rounded-md border border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
            Built-in program information is shown because the live Django academic-program records could not be reached.
          </p>
        )}

        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-primary">
              <tr>
                <th className="border-b border-border p-4 font-semibold">Program</th>
                <th className="border-b border-border p-4 font-semibold">Level</th>
                <th className="border-b border-border p-4 font-semibold">Curriculum Load</th>
                <th className="border-b border-border p-4 font-semibold">Recognition Basis</th>
                <th className="border-b border-border p-4 font-semibold">Record</th>
              </tr>
            </thead>
            <tbody>
              {displayedPrograms.map((program) => (
                <tr key={program.slug} className="align-top">
                  <td className="border-b border-border p-4">
                    <p className="font-semibold text-primary">{program.code}</p>
                    <p className="mt-1 text-muted-foreground">{program.title}</p>
                  </td>
                  <td className="border-b border-border p-4 text-muted-foreground">{program.level}</td>
                  <td className="border-b border-border p-4 text-muted-foreground">{program.units}</td>
                  <td className="border-b border-border p-4 text-muted-foreground">{program.recognition}</td>
                  <td className="border-b border-border p-4">
                    <Link
                      to={program.route}
                      className="inline-flex items-center gap-2 font-semibold text-accent transition-colors hover:text-secondary"
                    >
                      View details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader
          title="Quality-Assurance Alignment"
          subtitle="The Programs area is organized around the documentary expectations commonly examined in program compliance, accreditation, and quality-assurance reviews."
        />
        <div className="grid gap-4">
          {qaStandards.map((standard) => (
            <div key={standard} className="rounded-md border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
              {standard}
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Program Evidence Matrix"
          subtitle="Each academic program record should be maintained with current, dated, and verifiable evidence for the following areas."
          align="left"
        />
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-primary">
              <tr>
                <th className="border-b border-border p-4 font-semibold">Framework</th>
                <th className="border-b border-border p-4 font-semibold">Required Evidence Area</th>
              </tr>
            </thead>
            <tbody>
              {evidenceMatrix.map((item) => (
                <tr key={item.framework} className="align-top">
                  <td className="border-b border-border p-4 font-semibold text-primary">{item.framework}</td>
                  <td className="border-b border-border p-4 leading-6 text-muted-foreground">{item.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}

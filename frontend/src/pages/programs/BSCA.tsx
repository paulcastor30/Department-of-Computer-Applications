import { usePrograms } from "@/hooks/useAcademics";
import { ProgramDetailPage } from "./ProgramDetailPage";
import { normalizeProgram } from "./programData";
import { ProgramContentState } from "./ProgramContentState";

export default function BSCA() {
  const { data: programs, isError, isLoading } = usePrograms();
  const data = programs?.find(program => program.code === "BSCA" || program.slug === "bsca");
  if (!data || data.is_published !== true) return <ProgramContentState isLoading={isLoading} isError={isError} />;
  const program = normalizeProgram(data);

  return (
    <ProgramDetailPage
      program={program}
      isError={isError}
      pageSubtitle="Explore the undergraduate degree, its learning areas, and Undergraduate Thesis requirement."
      goalsTitle="Program Goals"
      outcomesTitle="Program learning outcomes"
      areasTitle="Learning areas"
      thesisTitle="Undergraduate Thesis"
      pathwaysTitle="Career and Further Study Pathways"
      advisingTitle="Student Support and Facilities"
    />
  );
}

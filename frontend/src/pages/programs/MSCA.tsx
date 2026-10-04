import { usePrograms } from "@/hooks/useAcademics";
import { ProgramDetailPage } from "./ProgramDetailPage";
import { mscaProgram, normalizeProgram } from "./programData";

export default function MSCA() {
  const { data: programs, isError } = usePrograms();
  const data = programs?.find(program => program.code === "MSCA" || program.slug === "msca");
  const program = normalizeProgram(data, mscaProgram);

  return (
    <ProgramDetailPage
      program={program}
      isError={isError}
      pageSubtitle="Explore the graduate degree, research areas, and Master’s Thesis or Graduate Thesis requirement."
      goalsTitle="Graduate Program Goals"
      outcomesTitle="Graduate Learning Outcomes"
      areasTitle="Research Areas"
      thesisTitle="Master’s Thesis or Graduate Thesis"
      pathwaysTitle="Graduate Pathways"
      advisingTitle="Graduate Advising and Faculty"
    />
  );
}

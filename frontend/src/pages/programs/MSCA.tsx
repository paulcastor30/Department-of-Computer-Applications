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
      pageSubtitle="Explore advanced study and research in Computer Applications, including the Master’s Thesis requirement."
      goalsTitle="Graduate Program Goals"
      outcomesTitle="Graduate Learning Outcomes"
      areasTitle="Specialized study areas"
      thesisTitle="Master’s Thesis or Graduate Thesis"
      pathwaysTitle="Graduate Pathways"
      advisingTitle="Graduate Advising and Faculty"
    />
  );
}

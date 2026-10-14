import { usePrograms } from "@/hooks/useAcademics";
import { ProgramDetailPage } from "./ProgramDetailPage";
import { normalizeProgram } from "./programData";
import { ProgramContentState } from "./ProgramContentState";

export default function MSCA() {
  const { data: programs, isError, isLoading } = usePrograms();
  const data = programs?.find(program => program.code === "MSCA" || program.slug === "msca");
  if (!data || data.is_published !== true) return <ProgramContentState isLoading={isLoading} isError={isError} />;
  const program = normalizeProgram(data);

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

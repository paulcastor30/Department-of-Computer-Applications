import { useProgram } from "@/hooks/useAcademics";
import { ProgramDetailPage } from "./ProgramDetailPage";
import { mscaProgram, normalizeProgram } from "./programData";

export default function MSCA() {
  const { data, isError } = useProgram("msca");
  const program = normalizeProgram(data, mscaProgram);

  return (
    <ProgramDetailPage
      program={program}
      isError={isError}
      pageSubtitle="A graduate program focused on advanced computer applications, applied computing research, and a culminating Master’s Thesis."
      goalsTitle="Graduate Program Goals"
      outcomesTitle="Graduate Learning Outcomes"
      areasTitle="Research Areas"
      thesisTitle="Master’s Thesis"
      pathwaysTitle="Graduate Pathways"
      advisingTitle="Graduate Advising and Faculty"
    />
  );
}

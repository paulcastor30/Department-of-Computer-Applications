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
      pageSubtitle="Formal graduate program information prepared for official Department content, with Master’s Thesis or Graduate Thesis as the culminating academic requirement."
      goalsTitle="Graduate Program Goals"
      outcomesTitle="Graduate Learning Outcomes"
      areasTitle="Research Areas"
      thesisTitle="Master’s Thesis or Graduate Thesis"
      pathwaysTitle="Graduate Pathways"
      advisingTitle="Graduate Advising and Faculty"
    />
  );
}

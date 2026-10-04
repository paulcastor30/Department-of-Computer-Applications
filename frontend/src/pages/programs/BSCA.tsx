import { usePrograms } from "@/hooks/useAcademics";
import { ProgramDetailPage } from "./ProgramDetailPage";
import { bscaProgram, normalizeProgram } from "./programData";

export default function BSCA() {
  const { data: programs, isError } = usePrograms();
  const data = programs?.find(program => program.code === "BSCA" || program.slug === "bsca");
  const program = normalizeProgram(data, bscaProgram);

  return (
    <ProgramDetailPage
      program={program}
      isError={isError}
      pageSubtitle="Explore the undergraduate degree, its learning areas, and Undergraduate Thesis requirement."
      goalsTitle="Program Goals"
      outcomesTitle="Expected Learning Outcomes / Program Outcomes"
      areasTitle="Major Academic Areas"
      thesisTitle="Undergraduate Thesis"
      pathwaysTitle="Career and Further Study Pathways"
      advisingTitle="Student Support and Facilities"
    />
  );
}

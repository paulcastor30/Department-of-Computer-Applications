import { useProgram } from "@/hooks/useAcademics";
import { ProgramDetailPage } from "./ProgramDetailPage";
import { bscaProgram, normalizeProgram } from "./programData";

export default function BSCA() {
  const { data, isError } = useProgram("bsca");
  const program = normalizeProgram(data, bscaProgram);

  return (
    <ProgramDetailPage
      program={program}
      isError={isError}
      pageSubtitle="Formal undergraduate program information prepared for official Department content, with Undergraduate Thesis as the culminating academic requirement."
      goalsTitle="Program Goals"
      outcomesTitle="Expected Learning Outcomes / Program Outcomes"
      areasTitle="Major Academic Areas"
      thesisTitle="Undergraduate Thesis"
      pathwaysTitle="Career and Further Study Pathways"
      advisingTitle="Student Support and Facilities"
    />
  );
}

import { createContext, useContext } from "react";

export type FormCollection = "BSCA" | "MSCA" | "REGISTRAR";
export type CommonDetails = Record<string, string>;
export const commonDetailKeys = new Set([
  "student_name", "student_1", "student_2", "student_3", "last_name", "first_name", "middle_initial",
  "student_id", "degree", "college_name", "thesis_title", "research_title", "adviser", "co_adviser",
  "department_chair_name", "research_instructor_name", "college_dean_name",
  "graduate_program_coordinator_name", "graduate_college_coordinator_name", "program_coordinator_name",
]);
export type VisitState = { enabled: boolean; values: CommonDetails };
export type FormVisit = {
  drafts: Record<string, CommonDetails>;
  saveDraft: (key: string, values: CommonDetails) => void;
  program: "BSCA" | "MSCA" | "";
  chooseProgram: (program: "BSCA" | "MSCA") => void;
  collections: Partial<Record<FormCollection, VisitState>>;
  remember: (collection: FormCollection, values: CommonDetails, enabled?: boolean) => void;
};
export const FormVisitContext = createContext<FormVisit>({ drafts: {}, saveDraft: () => {}, program: "", chooseProgram: () => {}, collections: {}, remember: () => {} });
export function useFormVisit() { return useContext(FormVisitContext); }

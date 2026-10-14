import { expect, it } from "vitest";
import { normalizeProgram, normalizePrograms } from "../pages/programs/programData";
import type { Program } from "../types/api";
it("does not restore missing, empty or unpublished programs", () => {
  expect(normalizePrograms(undefined)).toEqual([]);
  expect(normalizePrograms([])).toEqual([]);
  expect(normalizePrograms([{code: "BSCA", is_published: false} as Program])).toEqual([]);
});
it("keeps route identity when the CMS slug changes", () => {
  expect(normalizeProgram({code: "MSCA", slug: "masters"} as Program).route).toBe("/programs/msca");
});
it("omits placeholders and blank academic fields without inserting claims", () => {
  const program = normalizeProgram({code: "BSCA", formal_description: "To be provided by the Department.",
    academic_areas_list: ["To be validated by the Department"], recognition: "", documents: []} as Program);
  expect(program.summary).toBe(""); expect(program.academicAreas).toEqual([]);
  expect(program.recognition).toBe(""); expect(program.documents).toEqual([]);
});
it("preserves approved CMS wording and usable documents", () => {
  const program = normalizeProgram({code: "BSCA", formal_description: "Approved introduction", outcomes_list: ["Approved outcome"],
    documents: [{title: "Current prospectus", href: "/media/current.pdf", note: "Approved guide"}]} as Program);
  expect(program.summary).toBe("Approved introduction"); expect(program.outcomes).toEqual(["Approved outcome"]);
  expect(program.documents[0].href).toBe("/media/current.pdf");
});
it("does not resurrect a removed prospectus or promote unavailable documents", () => {
  const program = normalizeProgram({code: "BSCA", documents: [{title: "Prospectus", href: "", note: "To be provided by the Department"}]} as Program);
  expect(program.documents).toEqual([]);
});

it("retains a curriculum attached directly to the published CMS program without duplication", () => {
  const program = normalizeProgram({code: "MSCA", curriculum_pdf_url: "/media/curriculum.pdf", documents: []} as Program);
  expect(program.documents).toEqual([{label: "MSCA curriculum", documentType: "CURRICULUM", href: "/media/curriculum.pdf"}]);
  const withDocument = normalizeProgram({code: "MSCA", curriculum_pdf_url: "/media/curriculum.pdf", documents: [{title: "Published curriculum", href: "/media/curriculum.pdf"}]} as Program);
  expect(withDocument.documents).toHaveLength(1);
});

import { expect, it } from "vitest";
import { normalizeProgram } from "../pages/programs/programData";
import type { Program } from "../types/api";

it("removes the BSCA curriculum link from CMS files and documents while retaining the prospectus", () => {
  const program = normalizeProgram({
    code: "BSCA", slug: "bsca", curriculum_pdf_url: "/media/curriculum.pdf",
    documents: [{ title: "BSCA curriculum", href: "/media/old-curriculum.pdf", note: "" }],
  } as Program);
  expect(program.documents.some(document => /curriculum/i.test(document.label))).toBe(false);
  expect(program.documents.find(document => document.href)?.href).toBe("/curricula/bsca-prospectus.pdf");
});

it("keeps program links on supported pages when an editor changes the CMS slug", () => {
  const program = normalizeProgram({ code: "MSCA", slug: "masters-in-computer-applications" } as Program);
  expect(program.route).toBe("/programs/msca");
});


it("uses the supplied BSCA reference when CMS fields contain only placeholders", () => {
  const program = normalizeProgram({ code: "BSCA", overview: "To be provided by the Department.",
    formal_description: "To be provided by the Department", academic_areas_list: ["To be provided by the Department."],
  } as Program);
  expect(program.summary).toContain("software, firmware, and hardware");
  expect(program.academicAreas[0]).toContain("Software");
});

it("preserves substantive CMS content ahead of the BSCA reference", () => {
  const program = normalizeProgram({ code: "BSCA", formal_description: "Updated department introduction",
    academic_areas_list: ["Department-approved learning area"], outcomes_list: ["Updated official outcome"],
  } as Program);
  expect(program.summary).toBe("Updated department introduction");
  expect(program.academicAreas).toEqual(["Department-approved learning area"]);
  expect(program.outcomes).toEqual(["Updated official outcome"]);
});


it("makes the supplied prospectus available while CMS documents are still placeholders", () => {
  const program = normalizeProgram({ code: "BSCA", documents: [
    { title: "BSCA curriculum", document_type: "CURRICULUM", href: "", note: "To be provided by the Department." },
  ] } as Program);
  expect(program.documents.find(document => document.label.includes("prospectus"))?.href).toBe("/curricula/bsca-prospectus.pdf");
});

it("keeps a newer published CMS curriculum ahead of the supplied fallback prospectus", () => {
  const program = normalizeProgram({ code: "MSCA", documents: [
    { title: "Updated curriculum", document_type: "CURRICULUM", href: "/media/current.pdf", note: "Current department version" },
  ] } as Program);
  expect(program.documents).toHaveLength(1);
  expect(program.documents[0].href).toBe("/media/current.pdf");
});

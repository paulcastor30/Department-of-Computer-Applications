import { expect, it } from "vitest";
import { normalizeProgram } from "../pages/programs/programData";
import type { Program } from "../types/api";

it("keeps a published curriculum downloadable even when a placeholder document exists", () => {
  const program = normalizeProgram({
    code: "BSCA", slug: "bsca", curriculum_pdf_url: "/media/curriculum.pdf",
    documents: [{ title: "BSCA curriculum", href: "", note: "To be provided by the Department." }],
  } as Program);
  expect(program.documents.find(document => document.href)?.href).toBe("/media/curriculum.pdf");
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

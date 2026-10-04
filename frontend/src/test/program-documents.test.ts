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

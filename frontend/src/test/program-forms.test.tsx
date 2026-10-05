import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { ProgramForms } from "@/components/ProgramForms";
import { normalizeProgram } from "@/pages/programs/programData";
import type { Program } from "@/types/api";

afterEach(cleanup);
it.each(["BSCA", "MSCA"])("uses only the %s document collection with labelled file formats", code => {
  const program = normalizeProgram({ code, documents: [
    { title: "Form 019 — Proposal hearing", href: `/thesis-forms/${code.toLowerCase()}/proposal.docx`, form_group: "PROPOSAL", note: "Confirm signatures." },
    { title: "Prospectus", href: "/curricula/prospectus.pdf", form_group: "" },
  ] } as Program);
  render(<ProgramForms program={program} />);
  expect(screen.getByRole("link", { name: "Download Form 019 — Proposal hearing (DOCX)" })).toHaveAttribute("href", `/thesis-forms/${code.toLowerCase()}/proposal.docx`);
  expect(screen.queryByRole("link", { name: /Prospectus/ })).not.toBeInTheDocument();
  expect(screen.getByText("Confirm signatures.")).toBeInTheDocument();
  if (code === "MSCA") expect(screen.getByText(/not a complete list of requirements/)).toBeInTheDocument();
});

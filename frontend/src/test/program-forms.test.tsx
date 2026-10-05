import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ProgramForms, ProgramFormPicker } from "@/components/ProgramForms";
import { normalizeProgram } from "@/pages/programs/programData";
import type { Program } from "@/types/api";

afterEach(cleanup);
it.each(["BSCA", "MSCA"])("uses only the %s document collection with labelled file formats", code => {
  const program = normalizeProgram({ code, documents: [
    { title: "Form 019 — Proposal hearing", href: `/thesis-forms/${code.toLowerCase()}/proposal.docx`, form_group: "PROPOSAL", note: "Confirm signatures." },
    { title: "Prospectus", href: "/curricula/prospectus.pdf", form_group: "" },
  ] } as Program);
  render(<ProgramForms program={program} />);
  expect(screen.getByRole("link", { name: new RegExp(`Download form: Request approval for your proposal hearing.*${code}.*Form 019`) })).toHaveAttribute("href", `/thesis-forms/${code.toLowerCase()}/proposal.docx`);
  expect(screen.queryByRole("link", { name: /Prospectus/ })).not.toBeInTheDocument();
  expect(screen.getByText("Confirm signatures.")).toBeInTheDocument();
  if (code === "MSCA") expect(screen.getByText(/not a complete list of requirements/)).toBeInTheDocument();
});


it("requires a program choice and does not mix the undergraduate and graduate forms", () => {
  const programs = ["BSCA", "MSCA"].map(code => normalizeProgram({ code, documents: [
    { title: "Form 019 — Approval for proposal hearing", href: `/thesis-forms/${code.toLowerCase()}/proposal.docx`, form_group: "PROPOSAL" },
  ] } as Program));
  render(<MemoryRouter><ProgramFormPicker programs={programs} /></MemoryRouter>);
  expect(screen.queryAllByRole("link")).toHaveLength(0);
  fireEvent.click(screen.getByRole("radio", { name: /BSCA/ }));
  expect(screen.getByRole("link").getAttribute("href")).toContain("/bsca/");
  fireEvent.click(screen.getByRole("radio", { name: /MSCA/ }));
  expect(screen.getAllByRole("link")).toHaveLength(1);
  expect(screen.getByRole("link").getAttribute("href")).toContain("/msca/");
});

it("selects the requested program for saved and search links", () => {
  const program = normalizeProgram({ code: "MSCA", documents: [
    { title: "Form 019 — Approval for proposal hearing", href: "/thesis-forms/msca/proposal.docx", form_group: "PROPOSAL" },
  ] } as Program);
  Element.prototype.scrollIntoView = () => {};
  render(<MemoryRouter initialEntries={["/resources#msca-forms"]}><ProgramFormPicker programs={[program]} /></MemoryRouter>);
  expect(screen.getByRole("radio", { name: /MSCA/ })).toBeChecked();
  expect(screen.getByRole("link").getAttribute("href")).toContain("/msca/");
});

it("distinguishes shared form numbers and explains alternative examination versions", () => {
  const program = normalizeProgram({ code: "MSCA", documents: [
    { title: "Form 025 — Approval for binding", href: "/binding.docx", form_group: "COMPLETION" },
    { title: "Form 025 — Requirements submission", href: "/submission.docx", form_group: "COMPLETION" },
    { title: "CCS Form 10 — Application for written examination", href: "/ccs10.docx", form_group: "EXAMINATION" },
    { title: "Form 026 — Application for written examination", href: "/form026.docx", form_group: "EXAMINATION" },
  ] } as Program);
  render(<ProgramForms program={program} />);
  expect(screen.getByText(/Download form: Request approval to bind your thesis/)).toBeInTheDocument();
  expect(screen.getByText(/Download form: Submit thesis completion requirements/)).toBeInTheDocument();
  expect(screen.getByText(/both are not automatically required/)).toBeInTheDocument();
  expect(screen.getByText(/Download CCS Form 10/)).toBeInTheDocument();
  expect(screen.getByText(/Download Form 026/)).toBeInTheDocument();
});

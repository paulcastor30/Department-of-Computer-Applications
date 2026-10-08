import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ThesisFormFill } from "@/components/ThesisFormFill";
import { ProgramForms } from "@/components/ProgramForms";
import { normalizeProgram } from "@/pages/programs/programData";
import type { Program } from "@/types/api";
import { fetchJSON, FormDownloadError, prepareFormPDF } from "@/lib/api";

vi.mock("@/lib/api", async importOriginal => ({
  ...await importOriginal<typeof import("@/lib/api")>(), fetchJSON: vi.fn(), prepareFormPDF: vi.fn(),
}));
const schema = { id: "019", title: "Approval for proposal hearing", paper_size: "A4", filename: "BSCA-019-filled.pdf", fields: [
  { key: "student_1", label: "Student 1 full name", max_length: 60, multiline: false },
  { key: "thesis_selection", label: "Thesis selection", max_length: 30, multiline: false, choices: [{ value: "", label: "Leave unmarked" }, { value: "thesis", label: "Mark Thesis (BSCA)" }] },
] };
beforeEach(() => {
  vi.mocked(fetchJSON).mockResolvedValue(schema);
  vi.mocked(prepareFormPDF).mockResolvedValue(new Blob(["%PDF-1.7 test"], { type: "application/pdf" }));
  URL.createObjectURL = vi.fn().mockReturnValue("blob:filled-form");
  URL.revokeObjectURL = vi.fn();
});
afterEach(() => { cleanup(); vi.resetAllMocks(); });

it("loads fields on demand, prepares a reviewable PDF and invalidates it when entries change", async () => {
  render(<ThesisFormFill programCode="BSCA" formId="019" label="Proposal hearing" />);
  expect(fetchJSON).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: /Fill out online/ }));
  const input = await screen.findByLabelText("Student 1 full name");
  expect(screen.getByRole("button", { name: "Prepare filled PDF" })).toBeDisabled();
  fireEvent.change(input, { target: { value: "Maria Santos" } });
  fireEvent.change(screen.getByLabelText("Thesis selection"), { target: { value: "thesis" } });
  fireEvent.click(screen.getByRole("button", { name: "Prepare filled PDF" }));
  expect(await screen.findByRole("link", { name: "Download filled PDF" })).toHaveAttribute("download", "BSCA-019-filled.pdf");
  expect(prepareFormPDF).toHaveBeenCalledWith("/api/academics/forms/bsca/019/", { student_1: "Maria Santos", thesis_selection: "thesis" });
  expect(screen.getByRole("link", { name: /Review filled PDF/ })).toHaveAttribute("href", "blob:filled-form");
  expect(screen.getByText(/Downloading does not submit the form/)).toBeInTheDocument();
  fireEvent.change(input, { target: { value: "Jose Reyes" } });
  expect(screen.queryByRole("link", { name: "Download filled PDF" })).not.toBeInTheDocument();
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:filled-form");
  fireEvent.click(screen.getByRole("button", { name: "Clear entries" }));
  expect(input).toHaveValue("");
});

it("shows field-specific overflow errors and focuses the error message", async () => {
  vi.mocked(prepareFormPDF).mockRejectedValue(new FormDownloadError("Check the highlighted entries.", { student_1: "This entry is too wide for the original blank." }));
  render(<ThesisFormFill programCode="BSCA" formId="019" label="Proposal hearing" />);
  fireEvent.click(screen.getByRole("button", { name: /Fill out online/ }));
  const input = await screen.findByLabelText("Student 1 full name");
  fireEvent.change(input, { target: { value: "A long name" } });
  fireEvent.click(screen.getByRole("button", { name: "Prepare filled PDF" }));
  expect(await screen.findByRole("alert")).toHaveFocus();
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("This entry is too wide for the original blank.")).toBeInTheDocument();
});

it("recovers from a schema-loading failure by closing and reopening the editor", async () => {
  vi.mocked(fetchJSON).mockRejectedValueOnce(new Error("Unavailable"));
  render(<ThesisFormFill programCode="BSCA" formId="019" label="Proposal hearing" />);
  fireEvent.click(screen.getByRole("button", { name: /Fill out online/ }));
  expect(await screen.findByRole("alert")).toHaveTextContent("download the blank Word form");
  fireEvent.click(screen.getByRole("button", { name: /Close online form/ }));
  fireEvent.click(screen.getByRole("button", { name: /Fill out online/ }));
  expect(await screen.findByLabelText("Student 1 full name")).toBeInTheDocument();
});

it.each(["BSCA", "MSCA"])("offers online filling only for supported documents in %s", code => {
  const program = normalizeProgram({ code, documents: [
    { title: "Form 019 — Approval for proposal hearing", href: "/proposal.docx", form_group: "PROPOSAL", fillable_form_id: "019" },
    { title: "Form 018 — Request for change of adviser", href: "/change.docx", form_group: "PROPOSAL" },
  ] } as Program);
  render(<ProgramForms program={program} />);
  expect(screen.getByRole("link", { name: /proposal hearing/ })).toHaveAttribute("href", "/proposal.docx");
  expect(screen.queryAllByRole("button", { name: /Fill out online/ })).toHaveLength(1);
});

it("uses the MSCA endpoint, filename and original Legal paper size", async () => {
  vi.mocked(fetchJSON).mockResolvedValue({ ...schema, id: "ccs-13", paper_size: "Legal (8.5 × 14 inches)", filename: "MSCA-ccs-13-filled.pdf" });
  render(<ThesisFormFill programCode="MSCA" formId="ccs-13" label="Intention to graduate" />);
  fireEvent.click(screen.getByRole("button", { name: /Fill out online/ }));
  fireEvent.change(await screen.findByLabelText("Student 1 full name"), { target: { value: "Maria Santos" } });
  expect(fetchJSON).toHaveBeenCalledWith("/api/academics/forms/msca/ccs-13/");
  expect(screen.getByText(/Print on Legal \(8.5 × 14 inches\)/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Prepare filled PDF" }));
  expect(await screen.findByRole("link", { name: "Download filled PDF" })).toHaveAttribute("download", "MSCA-ccs-13-filled.pdf");
  expect(prepareFormPDF).toHaveBeenCalledWith("/api/academics/forms/msca/ccs-13/", { student_1: "Maria Santos" });
});

it("clears the editor and prepared PDF when switching between programs with the same form code", async () => {
  const program = (code: string) => normalizeProgram({ code, documents: [
    { title: "Form 019 — Approval for proposal hearing", href: "/proposal.docx", form_group: "PROPOSAL", fillable_form_id: "019" },
  ] } as Program);
  const view = render(<ProgramForms program={program("BSCA")} />);
  fireEvent.click(screen.getByRole("button", { name: /Fill out online/ }));
  fireEvent.change(await screen.findByLabelText("Student 1 full name"), { target: { value: "Maria Santos" } });
  fireEvent.click(screen.getByRole("button", { name: "Prepare filled PDF" }));
  await screen.findByRole("link", { name: "Download filled PDF" });
  view.rerender(<ProgramForms program={program("MSCA")} />);
  expect(screen.queryByRole("link", { name: "Download filled PDF" })).not.toBeInTheDocument();
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:filled-form");
  fireEvent.click(screen.getByRole("button", { name: /Fill out online/ }));
  expect(await screen.findByLabelText("Student 1 full name")).toHaveValue("");
  expect(fetchJSON).toHaveBeenLastCalledWith("/api/academics/forms/msca/019/");
});


it("uses the registrar endpoint and Letter paper guidance for completion forms", async () => {
  vi.mocked(fetchJSON).mockResolvedValue({ ...schema, id: "011", paper_size: "Letter (8.5 × 11 inches)", filename: "REGISTRAR-011-filled.pdf" });
  render(<ThesisFormFill programCode="REGISTRAR" formId="011" label="Grade completion form" />);
  fireEvent.click(screen.getByRole("button", { name: /Fill out online/ }));
  fireEvent.change(await screen.findByLabelText("Student 1 full name"), { target: { value: "Maria Santos" } });
  expect(fetchJSON).toHaveBeenCalledWith("/api/academics/forms/registrar/011/");
  expect(screen.getByText(/Print on Letter/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Prepare filled PDF" }));
  expect(await screen.findByRole("link", { name: "Download filled PDF" })).toHaveAttribute("download", "REGISTRAR-011-filled.pdf");
  expect(prepareFormPDF).toHaveBeenCalledWith("/api/academics/forms/registrar/011/", { student_1: "Maria Santos" });
});

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { RegistrarForms } from "@/components/RegistrarForms";
import { FormVisitProvider } from "@/components/FormVisitProvider";

vi.mock("@/hooks/useAcademics", () => ({ useRegistrarForms: () => ({ data: [
  { form_id: "002", title: "Application for leave of absence", href: "/leave.docx", fillable_form_id: "002" },
  { form_id: "006", title: "Shifters application form", href: "/shift.docx", fillable_form_id: "006" },
], isPending: false, isError: false }) }));
vi.mock("@/lib/api", () => ({ fetchJSON: vi.fn(async () => ({ title: "Leave of absence", fields: [{ key: "student_name", label: "Student full name", max_length: 90, multiline: false }] })), prepareFormPDF: vi.fn(), FormDownloadError: class extends Error {} }));
afterEach(cleanup);
it("filters registrar tasks and preserves entries when a form is hidden and shown again", async () => {
  render(<FormVisitProvider><MemoryRouter><RegistrarForms /></MemoryRouter></FormVisitProvider>);
  const search = screen.getByLabelText("Find a registrar form");
  fireEvent.change(search, { target: { value: "leave" } });
  expect(screen.queryByRole("heading", { name: "Shifters application form" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Fill out online/ }));
  fireEvent.change(await screen.findByLabelText("Student full name"), { target: { value: "Maria Santos" } });
  fireEvent.change(search, { target: { value: "006" } });
  expect(screen.getByRole("heading", { name: "Shifters application form" })).toBeVisible();
  expect(screen.queryByRole("region")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
  expect(within(screen.getByRole("region")).getByLabelText("Student full name")).toHaveValue("Maria Santos");
});

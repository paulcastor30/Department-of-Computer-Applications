import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import BSCA from "@/pages/programs/BSCA";
import Accreditation from "@/pages/Accreditation";
import { publishedPrograms } from "./program-fixtures";
const query = vi.hoisted(() => ({ data: undefined as unknown, isLoading: false, isError: false }));
vi.mock("@/hooks/useAcademics", () => ({ usePrograms: () => query }));
vi.mock("@/hooks/useCore", () => ({ useSiteSettings: () => ({ data: undefined }) }));
afterEach(() => { cleanup(); query.data = undefined; query.isLoading = false; query.isError = false; });
it("keeps withdrawn program requirements and documents off the public detail page", () => {
  query.data = [{...publishedPrograms[0], is_published: false}];
  render(<MemoryRouter><BSCA /></MemoryRouter>);
  expect(screen.queryByText(/153 units/)).not.toBeInTheDocument();
  expect(screen.queryByRole("link", {name: /prospectus/})).not.toBeInTheDocument();
  expect(screen.getByRole("link", {name: "Contact the department about academic programs"})).toBeInTheDocument();
});
it("shows loading and failure states without inserting academic content", () => {
  query.isLoading = true;
  const {rerender} = render(<MemoryRouter><BSCA /></MemoryRouter>);
  expect(screen.getByRole("status")).toHaveTextContent("Loading program information");
  query.isLoading = false; query.isError = true;
  rerender(<MemoryRouter><BSCA /></MemoryRouter>);
  expect(screen.getByRole("status")).toHaveTextContent("Program information could not be loaded");
  expect(screen.queryByText(/153 units/)).not.toBeInTheDocument();
});
it("does not recreate cleared accreditation text", () => {
  query.data = [{...publishedPrograms[0], recognition: ""}];
  render(<MemoryRouter><Accreditation /></MemoryRouter>);
  expect(screen.queryByRole("heading", {name: "BSCA accreditation"})).not.toBeInTheDocument();
  expect(screen.queryByText(/Level III/)).not.toBeInTheDocument();
});
it("omits optional program sections and administrative placeholders", () => {
  query.data = [{...publishedPrograms[0], formal_description: "To be provided by the Department", outcomes_list: [],
    academic_areas_list: [], curriculum_structure_list: [], completion_requirements_list: [], study_plan_guidance_list: [], documents: []}];
  const {container} = render(<MemoryRouter><BSCA /></MemoryRouter>);
  expect(container.textContent).not.toMatch(/to be (provided|validated)|website summary reviewed/i);
  expect(screen.queryByRole("heading", {name: "Program documents"})).not.toBeInTheDocument();
  expect(screen.queryByRole("link", {name: "Key requirements"})).not.toBeInTheDocument();
});

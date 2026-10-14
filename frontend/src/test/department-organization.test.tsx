import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import Organization from "@/pages/about/Organization";
const hooks = vi.hoisted(() => ({ useDepartmentOrganization: vi.fn(), useFaculty: vi.fn() }));
vi.mock("@/hooks/usePeople", () => hooks);
afterEach(cleanup);
it("shows current department personnel once in the correct chart branches", () => {
  const member = (slug: string, classification = "active_dca_faculty", extra = {}) => ({slug, title: slug, service_classification: classification, active_affiliation: true, faculty_category: "Core faculty", transferred_from_dca: false, ...extra});
  hooks.useDepartmentOrganization.mockReturnValue({data: [{role: "chairperson", slug: "chair", name: "Chairperson", email: "chair@example.edu"}], isPending: false});
  hooks.useFaculty.mockReturnValue({data: [member("chair"), member("faculty"), member("lecturer", undefined, {faculty_category: "Lecturer"}), member("staff", "academic_staff"), member("technician", "laboratory_personnel"), member("affiliate", "affiliated_msca_faculty"), member("former", "retired_dca_faculty"), member("transferred", undefined, {transferred_from_dca: true}), member("inactive", undefined, {active_affiliation: false})], isPending: false});
  render(<MemoryRouter><Organization /></MemoryRouter>);
  expect(screen.getAllByRole("link", {name: "Chairperson"})).toHaveLength(1);
  expect(within(screen.getByRole("region", {name: "Staff"})).getByRole("link", {name: "technician"})).toHaveAttribute("href", "/faculty/technician");
  expect(within(screen.getByRole("region", {name: "Lecturers"})).getByRole("link", {name: "lecturer"})).toBeInTheDocument();
  expect(within(screen.getByRole("region", {name: "Faculty"})).getByRole("link", {name: "faculty"})).toBeInTheDocument();
  for (const name of ["affiliate", "former", "transferred", "inactive"]) expect(screen.queryByRole("link", {name})).not.toBeInTheDocument();
});

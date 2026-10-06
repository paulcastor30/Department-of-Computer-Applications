import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { WhatIsComputerApplications, ChoosingComputerApplications, WhatStudentsBuild } from "@/components/HomeOrientation";
import { RealDepartmentWork } from "@/components/RealDepartmentWork";
const records = vi.hoisted(() => ({ prototypes: [] as unknown[], projects: [] as unknown[], loading: false }));
vi.mock("@/hooks/usePrototypes", () => ({ usePrototypes: () => ({ data: records.prototypes, isLoading: records.loading }) }));
vi.mock("@/hooks/useResearch", () => ({ useResearchProjects: () => ({ data: records.projects, isLoading: records.loading }) }));
afterEach(() => { cleanup(); records.prototypes = []; records.projects = []; records.loading = false; });
it("introduces technical words with plain-language explanations in a semantic system flow", () => {
  render(<MemoryRouter><WhatIsComputerApplications /><WhatStudentsBuild /></MemoryRouter>);
  const flow = screen.getByRole("list", { name: "Example: from sensing to useful information" });
  expect(within(flow).getAllByRole("listitem")).toHaveLength(6);
  expect(screen.getByText(/Small computers inside devices receive sensor readings/)).toBeInTheDocument();
  expect(screen.getByText(/Software running on the device tells it what to do/)).toBeInTheDocument();
  expect(screen.getByText(/Not every system needs a network, cloud service or artificial intelligence/)).toBeInTheDocument();
});
it("keeps the program comparison and career directions optional and avoids absolute boundaries or guarantees", () => {
  render(<MemoryRouter><ChoosingComputerApplications /></MemoryRouter>);
  const compare = screen.getByText("How does BSCA differ from related computing programs?").closest("details");
  expect(compare).not.toHaveAttribute("open");
  expect(within(compare!).getByText(/These fields overlap/)).toBeInTheDocument();
  expect(within(compare!).getAllByRole("term")).toHaveLength(5);
  expect(screen.getByText(/not guaranteed jobs/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "BSCA prospectus and admission information" })).toHaveAttribute("href", "/programs/bsca#before-applying");
});
it("uses published CMS work and its own wording, with working in-site destinations", () => {
  records.prototypes = [{ slug: "sensor-test", title: "Editor-approved sensor title", kind: "SENSING", summary: "Editor-approved student explanation." }];
  records.projects = [{ slug: "aphids-detection", title: "Editor-approved research title", plain_language_summary: "Editor-approved research explanation." }];
  render(<MemoryRouter><RealDepartmentWork /></MemoryRouter>);
  expect(screen.getByText("Editor-approved student explanation.")).toBeInTheDocument();
  expect(screen.getByText("Editor-approved research explanation.")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Explore student projects" })).toHaveAttribute("href", "/projects#sensor-test");
  expect(screen.getByRole("link", { name: "Read about this research and its team" })).toHaveAttribute("href", "/research/projects#aphids-detection");
  expect(screen.getByRole("link", { name: "Teaching and laboratory spaces" })).toHaveAttribute("href", "/facilities");
});
it("keeps useful collection links without inventing work when records are unavailable", () => {
  render(<MemoryRouter><RealDepartmentWork /></MemoryRouter>);
  expect(screen.queryByText("BSCA student output")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "All BSCA student projects" })).toBeInTheDocument();
  expect(screen.getByText(/contact the department for help finding an example/)).toBeInTheDocument();
});

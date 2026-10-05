import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { ResearchProjectList } from "@/components/ResearchProjectList";

const query = vi.hoisted(() => ({ data: [{ id: 1, slug: "gakit", title: "GAKIT", reporting_year: "2026", research_leader: "Research leader", team_members: ["Team member"], funding_display: "Internally funded research" }], isLoading: false, isError: false }));
vi.mock("@/hooks/useResearch", () => ({ useResearchProjects: () => query }));
const original = [...query.data];
afterEach(() => { cleanup(); query.data = [...original]; query.isError = false; });

it("separates reporting years from status and identifies the leader, funding and team", () => {
  render(<MemoryRouter><ResearchProjectList /></MemoryRouter>);
  expect(screen.getByRole("heading", { name: "Reporting year: 2026" })).toBeInTheDocument();
  expect(screen.getByText(/do not indicate whether a project is ongoing or completed/)).toBeInTheDocument();
  expect(screen.getByText("Research leader", { selector: "dd" })).toBeInTheDocument();
  expect(screen.getByText("Internally funded research")).toBeInTheDocument();
  expect(screen.getByText("Team member").closest("details")).not.toHaveAttribute("open");
});

it("offers a contact route when the research records cannot be loaded", () => {
  query.isError = true;
  render(<MemoryRouter><ResearchProjectList /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "Contact the department for research information." })).toHaveAttribute("href", "/about/contact");
  query.isError = false;
});

function fourProjects() {
  query.data = Array.from({ length: 4 }, (_, index) => ({ ...original[0], id: index + 1, slug: `project-${index + 1}`, title: `Project ${index + 1}`, reporting_year: index < 2 ? "2026" : "2025" }));
}

it("previews only three projects and links to the complete list", () => {
  fourProjects();
  render(<MemoryRouter><ResearchProjectList preview /></MemoryRouter>);
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
  expect(screen.queryByText("Project 4")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View all 4 research projects" })).toHaveAttribute("href", "/research/projects");
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
});

it("filters the complete list by reporting year and restores all records", () => {
  fourProjects();
  render(<MemoryRouter><ResearchProjectList /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("Reporting year"), { target: { value: "2025" } });
  expect(screen.getByRole("status")).toHaveTextContent("2 projects shown");
  expect(screen.queryByText("Project 1")).not.toBeInTheDocument();
  expect(screen.getByText("Project 4")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Reporting year"), { target: { value: "all" } });
  expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(4);
});

function Destination() { const location = useLocation(); return <p>{location.pathname}{location.hash}</p>; }
it("preserves saved project anchors by opening the full list", async () => {
  fourProjects();
  render(<MemoryRouter initialEntries={["/research#project-4"]}><Routes><Route path="/research" element={<ResearchProjectList preview />} /><Route path="/research/projects" element={<Destination />} /></Routes></MemoryRouter>);
  expect(await screen.findByText("/research/projects#project-4")).toBeInTheDocument();
});

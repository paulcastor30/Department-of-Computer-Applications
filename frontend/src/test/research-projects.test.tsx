import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { ResearchProjectList } from "@/components/ResearchProjectList";

const query = vi.hoisted(() => ({ data: [{ id: 1, slug: "gakit", title: "GAKIT", reporting_year: "2026", research_leader: "Research leader", team_members: ["Team member"], funding_display: "Internally funded research" }], isLoading: false, isError: false }));
vi.mock("@/hooks/useResearch", () => ({ useResearchProjects: () => query }));
afterEach(cleanup);

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

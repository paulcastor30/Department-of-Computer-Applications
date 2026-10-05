import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import Projects from "@/pages/Projects";

vi.mock("@/hooks/usePrototypes", () => ({ usePrototypes: () => ({ isLoading: false, isError: false, data: [
  { id: 1, slug: "timer", title: "Response timer", reporting_year: 2026, summary: "A timer project.", kind: "TIMING", kind_display: "Clocks and timers", creator_credits: "Creator A", source_url: "https://www.hackster.io/example/timer" },
  { id: 2, slug: "snake", title: "Snake game", reporting_year: 2025, summary: "A game project.", kind: "GAME", kind_display: "Games and learning", creator_credits: "", source_url: "https://www.hackster.io/example/snake" },
] }) }));
afterEach(cleanup);

it("links to public projects with specific accessible names and preserves confirmed credits", () => {
  render(<MemoryRouter><Projects /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "View project on Hackster for Snake game" })).toHaveAttribute("href", "https://www.hackster.io/example/snake");
  expect(screen.getByText("Credits listed on Hackster: Creator A")).toBeInTheDocument();
  expect(screen.getByText("See the project page for creator credits.")).toBeInTheDocument();
});

it("combines reporting year and project type filters with clear recovery", () => {
  render(<MemoryRouter><Projects /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("Reporting year"), { target: { value: "2026" } });
  expect(screen.getByRole("status")).toHaveTextContent("1 project shown.");
  expect(screen.queryByText("Snake game")).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Project type"), { target: { value: "GAME" } });
  expect(screen.getByRole("status")).toHaveTextContent("0 projects shown.");
  expect(screen.getByText("No projects match these filters. Choose another year or project type.")).toBeInTheDocument();
});

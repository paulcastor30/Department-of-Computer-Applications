import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import Index from "@/pages/Index";
import { homeOrientation } from "@/content/homeOrientation";
const content = vi.hoisted(() => ({ programs: [{ code: "BSCA", formal_description: "Approved undergraduate summary." }, { code: "MSCA", formal_description: "Approved graduate summary." }], news: Array.from({length: 4}, (_, i) => ({id: i, title: `Approved news ${i}`, slug: `news-${i}`, category: "NEWS", published_at: "2026-10-08T00:00:00Z"})) }));
vi.mock("@/hooks/useAcademics", () => ({ usePrograms: () => ({ data: content.programs }) }));
vi.mock("@/hooks/useCore", () => ({ useDepartmentProfile: () => ({ data: {overview: "Approved department introduction."} }), useSiteSettings: () => ({ data: {primary_email: "verified@example.edu", primary_phone: "Verified phone", address: "Verified office address"} }) }));
vi.mock("@/hooks/usePrototypes", () => ({ usePrototypes: () => ({ data: [] }) }));
vi.mock("@/hooks/useResearch", () => ({ useResearchProjects: () => ({ data: [] }) }));
vi.mock("@/hooks/useCommunications", () => ({ useNews: () => ({ data: content.news }) }));
afterEach(cleanup);
it("presents exactly seven labelled homepage sections in the requested order with one primary heading", () => {
  const { container } = render(<MemoryRouter><Index /></MemoryRouter>);
  const sections = Array.from(container.querySelectorAll(".home-page > section"));
  expect(sections.map(section => section.querySelector("h1,h2")?.textContent)).toEqual([
    "Department of Computer Applications", "Explore Our Academic Programs", "What is Computer Applications?", "Discover Our Work", "Research and International Collaboration", "Department News", "Connect With Us",
  ]);
  expect(screen.getAllByRole("heading", {level: 1})).toHaveLength(1);
  sections.forEach(section => expect(section.querySelector(`#${section.getAttribute("aria-labelledby")}`)).not.toBeNull());
  expect(within(sections[0] as HTMLElement).getByText(homeOrientation.tagline)).toBeInTheDocument();
  expect(screen.getByText(/Proposed departmental positioning/)).toBeInTheDocument();
  homeOrientation.specializations.forEach(area => expect(screen.getByText(area.title)).toBeInTheDocument());
});
it("retains CMS program and contact wording and limits published news to three", () => {
  render(<MemoryRouter><Index /></MemoryRouter>);
  expect(screen.getByText("Approved undergraduate summary.")).toBeInTheDocument();
  expect(screen.getByText("Approved graduate summary.")).toBeInTheDocument();
  expect(screen.getByText("Verified office address")).toBeInTheDocument();
  expect(screen.getByRole("link", {name: "verified@example.edu"})).toHaveAttribute("href", "mailto:verified@example.edu");
  expect(screen.getAllByRole("article")).toHaveLength(3);
  expect(screen.queryByText("Approved news 3")).not.toBeInTheDocument();
  expect(screen.getByRole("link", {name: /Explore BSCA/})).toHaveAttribute("href", "/programs/bsca");
  expect(screen.getByRole("link", {name: /Explore MSCA/})).toHaveAttribute("href", "/programs/msca");
  expect(screen.getByRole("link", {name: "International collaborations"})).toHaveAttribute("href", "/international-linkages");
  expect(screen.getByRole("link", {name: "Website Accessibility Assistance"})).toHaveAttribute("href", "/accessibility");
});

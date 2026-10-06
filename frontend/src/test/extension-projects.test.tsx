import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { ExtensionProjectList } from "@/components/ExtensionProjectList";

vi.mock("@/hooks/useExtension", () => ({ useExtensionProjects: () => ({ isLoading: false, isError: false, data: [
  { id: 1, slug: "2026-training", title: "Community training", plain_language_summary: "Microcontroller training for out-of-school youth.", intended_audience: "Out-of-school youth", reporting_year: 2026, extension_leader: "Leader A", participant_groups: [{ label: "MSU-IIT faculty", members: ["Faculty A"] }, { label: "Students", members: ["Student A"] }] },
  { id: 2, slug: "2024-training", title: "Community training", reporting_year: 2024, extension_leader: "Leader B", participant_groups: [{ label: "Lecturers", members: ["Lecturer A"] }] },
] }) }));
afterEach(cleanup);

it("keeps yearly records distinct and filters their reporting year", () => {
  render(<MemoryRouter><ExtensionProjectList /></MemoryRouter>);
  expect(screen.getAllByText("Community training")).toHaveLength(2);
  expect(screen.getByText("Microcontroller training for out-of-school youth.")).toBeInTheDocument();
  expect(screen.getByText("Out-of-school youth")).toBeInTheDocument();
  expect(screen.getByText("Leader A")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Reporting year"), { target: { value: "2024" } });
  expect(screen.queryByText("Leader A")).not.toBeInTheDocument();
  expect(screen.getByText("Leader B")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("1 extension record shown.");
});

it("preserves reported participant groups without inventing empty groups or current roles", () => {
  render(<MemoryRouter><ExtensionProjectList /></MemoryRouter>);
  expect(screen.getByRole("heading", { name: "Students" })).toBeInTheDocument();
  expect(screen.getByText("Student A")).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Staff" })).not.toBeInTheDocument();
  expect(screen.getAllByText("Participant groups are as reported for this record and may differ from current appointments.")).toHaveLength(2);
});

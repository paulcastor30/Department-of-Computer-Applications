import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import Events from "@/pages/Events";
const events = vi.hoisted(() => ({ useEvents: vi.fn() }));
vi.mock("@/hooks/useCommunications", () => events);
afterEach(cleanup);
it("shows actual dates, category, cancellation and conference record destinations", () => {
  events.useEvents.mockReturnValue({ data: {today: "2026-10-15", results: [{id: "deadline", kind: "deadlines", label: "Deadline", title: "Application deadline", starts_on: "2026-10-20", ends_on: "2026-10-20", starts_at: "", location: "", status: "", href: "/news/application"}, {id: "conference", kind: "conferences", label: "Research conference dates", title: "Research paper", starts_on: "2026-11-01", ends_on: "2026-11-03", starts_at: "", location: "Iligan", status: "Cancelled", href: "/research/conferences#paper"}]}, isPending: false, isError: false });
  const {container} = render(<MemoryRouter><Events /></MemoryRouter>);
  expect(container.querySelector('time[datetime="2026-10-20"]')).toBeInTheDocument();
  expect(screen.getByText("Research conference dates · Cancelled")).toBeInTheDocument();
  expect(screen.getByRole("link", {name: "Research paper"})).toHaveAttribute("href", "/research/conferences#paper");
  fireEvent.change(screen.getByLabelText("Date view"), {target: {value: "past"}});
  fireEvent.change(screen.getByLabelText("Show"), {target: {value: "deadlines"}});
  expect(events.useEvents).toHaveBeenLastCalledWith("past", "deadlines");
});
it("provides useful empty and error states without supplying dates", () => {
  events.useEvents.mockReturnValue({data: {today: "2026-10-15", results: []}, isPending: false, isError: false});
  const {rerender} = render(<MemoryRouter><Events /></MemoryRouter>);
  expect(screen.getByText("No upcoming dates are listed for this view.")).toBeInTheDocument();
  expect(screen.getByRole("link", {name: "Ask about department dates"})).toBeInTheDocument();
  const refetch = vi.fn(); events.useEvents.mockReturnValue({isError: true, isPending: false, refetch});
  rerender(<MemoryRouter><Events /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", {name: "Try again"})); expect(refetch).toHaveBeenCalledOnce();
});

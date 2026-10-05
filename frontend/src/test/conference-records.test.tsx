import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { ConferenceRecordList } from "@/components/ConferenceRecordList";

vi.mock("@/hooks/useResearch", () => ({ useConferenceRecords: () => ({ isLoading: false, isError: false, data: [
  { id: 1, slug: "withdrawn-entry", title: "Withdrawn paper", year: 2026, authors: "First Author, Second Author", conference: "Conference A", date_label: "August 5, 2026", location: "Indonesia", scope_display: "International", withdrawn: true },
  { id: 2, slug: "other-entry", title: "Earlier paper", year: 2025, authors: "Third Author", conference: "Conference B", date_label: "August 4–6, 2025", location: "Bali", scope_display: "International", withdrawn: false },
] }) }));
afterEach(cleanup);

it("retains withdrawals in the complete list and filters by year", () => {
  render(<MemoryRouter><ConferenceRecordList /></MemoryRouter>);
  expect(screen.getByText("Withdrawn")).toBeInTheDocument();
  expect(screen.getByText("First Author, Second Author")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Conference year"), { target: { value: "2025" } });
  expect(screen.queryByText("Withdrawn paper")).not.toBeInTheDocument();
  expect(screen.getByText("Earlier paper")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("1 conference record for 2025");
});

it("does not feature withdrawn records in the research overview preview", () => {
  render(<MemoryRouter><ConferenceRecordList preview /></MemoryRouter>);
  expect(screen.queryByText("Withdrawn paper")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View all conference records" })).toHaveAttribute("href", "/research/conferences");
});

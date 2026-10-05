import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { PublicationRecordList } from "@/components/PublicationRecordList";

vi.mock("@/hooks/useResearch", () => ({ usePublicationRecords: () => ({ isLoading: false, isError: false, data: [
  { id: 1, slug: "journal", title: "Journal paper", year: 2025, authors: "Author A; Author B", venue: "Journal A", kind: "JOURNAL", kind_display: "Journal article", citation_details: "Volume 10", date_label: "2025", publisher: "Publisher A", doi: "10.1234/example", source_url: "https://doi.org/10.1234/example" },
  { id: 2, slug: "preprint", title: "Preprint paper", year: 2023, authors: "Author C", venue: "SSRN", kind: "PREPRINT", kind_display: "Preprint", citation_details: "22 pages", date_label: "Posted 19 April 2023", publisher: "SSRN", doi: "10.2139/example", source_url: "https://doi.org/10.2139/example" },
] }) }));
afterEach(cleanup);

it("distinguishes preprints and retains full authors and publisher links", () => {
  render(<MemoryRouter><PublicationRecordList /></MemoryRouter>);
  expect(screen.getByText("Preprint: this record does not establish peer-reviewed publication.")).toBeInTheDocument();
  expect(screen.getByText("Author A; Author B")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Open publication record for Journal paper" })).toHaveAttribute("href", "https://doi.org/10.1234/example");
  fireEvent.change(screen.getByLabelText("Publication type"), { target: { value: "PREPRINT" } });
  expect(screen.queryByText("Journal paper")).not.toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("1 publication shown.");
});

it("combines year and type filters with a clear empty result", () => {
  render(<MemoryRouter><PublicationRecordList /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("Publication year"), { target: { value: "2025" } });
  fireEvent.change(screen.getByLabelText("Publication type"), { target: { value: "PREPRINT" } });
  expect(screen.getByRole("status")).toHaveTextContent("0 publications shown.");
  expect(screen.getByText("No publications match these filters. Choose another year or publication type.")).toBeInTheDocument();
});

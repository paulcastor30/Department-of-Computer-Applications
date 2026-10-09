import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { LearningResourceCatalogue } from "@/components/LearningResourceCatalogue";
import { LearningResourceCredits } from "@/components/LearningResourceCredits";
import type { LearningResource } from "@/hooks/useAcademics";

afterEach(cleanup);
const data: LearningResource[] = Array.from({ length: 30 }, (_, index) => ({
  slug: `item-${index}`, title: `Learning item ${index}`, topic: index < 25 ? "PROGRAMMING" : "IOT",
  topic_label: index < 25 ? "Programming" : "IoT & connectivity", provider: "example.org",
  description: "", url: `https://example.org/${index}`, level_label: index < 25 ? "All levels" : "Beginner",
  resource_type: index < 25 ? "Book" : "Article", access_note: "Check provider", activity: "", start_here: false,
  source_collection: "ROADMAP", source_section: index < 25 ? "Programming / Python" : "Wireless / MQTT", source_url: "https://github.com/example",
}));

it("lets students reach the entire collection and resets pagination when narrowing to IoT", () => {
  render(<LearningResourceCatalogue data={data} />);
  expect(screen.getByRole("status")).toHaveTextContent("30 resources found · Showing 1–24");
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.getByRole("link", { name: "Learning item 29 (external resource)" })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Browse by topic"), { target: { value: "IOT" } });
  expect(screen.getByRole("status")).toHaveTextContent("5 resources found · Showing 1–5");
  expect(screen.queryByRole("link", { name: "Learning item 0 (external resource)" })).not.toBeInTheDocument();
});

it("searches original subtopics, combines format and beginner filters, and recovers from no matches", () => {
  render(<LearningResourceCatalogue data={data} />);
  fireEvent.change(screen.getByLabelText("Search learning resources"), { target: { value: "MQTT" } });
  fireEvent.click(screen.getByLabelText("Show beginner resources"));
  expect(screen.getByRole("status")).toHaveTextContent("5 resources found");
  fireEvent.change(screen.getByLabelText("Resource format"), { target: { value: "Book" } });
  expect(screen.getByText(/No matching resources/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
  expect(screen.getByRole("status")).toHaveTextContent("30 resources found");
});

it("provides source attribution, adaptation terms, and local license downloads", () => {
  render(<LearningResourceCredits />);
  expect(screen.getByRole("link", { name: /by m3y54m and contributors/ })).toHaveAttribute("href", expect.stringContaining("0738fcbd"));
  expect(screen.getByRole("link", { name: "Read the full license" })).toHaveAttribute("href", "/learning-resources/LICENSE.txt");
  expect(screen.getByText(/This adaptation is also available under CC BY-SA/)).toBeInTheDocument();
});

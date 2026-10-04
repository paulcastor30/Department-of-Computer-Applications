import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { NewsList } from "../pages/News";

const news = vi.hoisted(() => ({ useNews: vi.fn() }));
vi.mock("@/hooks/useCommunications", () => news);
afterEach(cleanup);

it("shows published announcements with descriptive links and optional cover images", () => {
  news.useNews.mockReturnValue({ data: [{ id: 1, title: "Department open day", slug: "open-day", category: "EVENT", summary: "See the announcement for participation details.", published_at: "2026-10-05T01:00:00Z", featured_image: "/media/open-day.jpg" }], isLoading: false, isError: false });
  const { container } = render(<MemoryRouter><NewsList /></MemoryRouter>);
  expect(screen.getByText("Event announcement")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Read announcement.*Department open day/ })).toHaveAttribute("href", "/news/open-day");
  expect(container.querySelector("time")).toHaveAttribute("datetime", "2026-10-05T01:00:00Z");
  expect(container.querySelector("time")).toHaveTextContent(/^Posted/);
  expect(container.querySelector("img")).toHaveAttribute("alt", "");
  expect(container.querySelector("img")).toHaveAttribute("loading", "lazy");
});

it("keeps retry and contact available when announcements fail to load", () => {
  const refetch = vi.fn();
  news.useNews.mockReturnValue({ data: [], isLoading: false, isError: true, refetch });
  render(<MemoryRouter><NewsList /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(refetch).toHaveBeenCalledOnce();
  expect(screen.getByRole("link", { name: "Ask about announcements" })).toHaveAttribute("href", "/about/contact");
});

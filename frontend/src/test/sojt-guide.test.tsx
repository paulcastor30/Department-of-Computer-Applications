import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SOJTGuide from "@/pages/SOJTGuide";
import { sojtStepIds, sojtStatuses, isSOJTContent } from "@/content/sojtProcess";
import sojtReference from "@/content/sojtGuide.json";
import { fetchJSON } from "@/lib/api";
import { searchPages } from "@/content/siteContent";
import { Header } from "@/components/layout/Header";
import { readFileSync } from "node:fs";

vi.mock("@/lib/api", () => ({ fetchJSON: vi.fn() }));
beforeEach(() => { window.history.replaceState({}, "", "/sojt-guide"); Element.prototype.scrollIntoView = vi.fn(); const content = structuredClone(sojtReference); content.sources.forEach(s => { s.status = "verified"; }); vi.mocked(fetchJSON).mockResolvedValue({ slug: "bsca", content, reviewed_on: "2026-10-06", updated_at: "2026-10-06" }); });
afterEach(cleanup);
async function guide() { const result = render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><MemoryRouter><SOJTGuide /></MemoryRouter></QueryClientProvider>); await screen.findByText(/^SOJT Coordinator:|^Contact the department for current internship/); return result; }
it("renders all ten ordered steps once, with native disclosures closed and source traceability", async () => {
  await guide();
  const list = screen.getByRole("list", { name: "BSCA SOJT process" });
  const steps = Array.from(list.children);
  expect(steps).toHaveLength(10);
  expect(sojtReference.steps.map(s => s.id)).toEqual(sojtStepIds);
  steps.forEach((step, i) => { expect(within(step as HTMLElement).getByRole("heading", { level: 2, name: sojtReference.steps[i].title })).toBeInTheDocument(); expect(step.querySelector("details")).not.toHaveAttribute("open"); expect(step.querySelector("summary")).toBeInTheDocument(); });
  const ids = new Set(sojtReference.sources.map(s => s.id));
  sojtReference.steps.forEach(step => [step.purpose, step.gate, ...step.documents, ...step.groups.flatMap(g => g.items)].forEach(item => { expect(item.sources.length).toBeGreaterThan(0); expect(item.sources.every(id => ids.has(id))).toBe(true); }));
  const publicContent = structuredClone(sojtReference); publicContent.sources.forEach(s => { s.status = "verified"; });
  expect(isSOJTContent(publicContent)).toBe(true);
});
it("places orientation, HTE approval, a distinct learning plan and the mandatory gate before deployment", () => {
  expect(sojtStepIds.indexOf("orientation")).toBeLessThan(sojtStepIds.indexOf("deployment"));
  expect(sojtStepIds.indexOf("hte-approval")).toBeLessThan(sojtStepIds.indexOf("internship-plan"));
  expect(sojtReference.steps[4].gate.text).toMatch(/No student shall be deployed.*all mandatory.*verified/);
  expect(sojtReference.steps[5].gate.text).toMatch(/Step 5 is verified complete/);
  const orientation = sojtReference.steps[1].groups.flatMap(g => g.items).map(x => x.text).join(" ");
  expect(orientation).toMatch(/make-up orientation before endorsement or deployment/);
  expect(orientation).toMatch(/do not automatically replace orientation/);
  const checklist = sojtReference.checklist.map(i => i.text).join(" ");
  for (const term of ["MOA", "insurance", "Medical", "consent", "enrollment", "Internship Plan", "contract"]) expect(checklist).toContain(term);
});
it("monitors welfare, tasks and competencies, requires exit assessment and institutional reporting", () => {
  const monitoring = sojtReference.steps[6].groups.flatMap(g => g.items).map(i => i.text).join(" ");
  for (const term of ["competencies", "harassment", "monthly", "visits", "corrective", "regular employees"]) expect(monitoring).toContain(term);
  expect(sojtReference.steps[7].gate.text).toMatch(/hours.*Plan.*outputs.*evaluation.*certificate/);
  expect(sojtReference.steps[8].gate.text).toMatch(/Exit assessment/);
  expect(JSON.stringify(sojtReference.steps[9])).toContain("CHEDRO");
});
it("opens a selected stage and moves keyboard focus without recording progress", async () => {
  await guide();
  fireEvent.change(screen.getByLabelText("Your informational SOJT status"), { target: { value: "Internship Plan approved" } });
  fireEvent.click(screen.getByRole("button", { name: "Go to the relevant step" }));
  const heading = screen.getByRole("heading", { name: sojtReference.steps[4].title });
  expect(heading).toHaveFocus();
  expect(heading.closest("li")!.querySelector("details")).toHaveAttribute("open");
  expect(screen.getByText(/navigation aid. No student records/)).toBeInTheDocument();
  expect(sojtStatuses).toHaveLength(12);
});
it("finds topics without hiding the sequence and honors deep links", async () => {
  window.history.replaceState({}, "", "/sojt-guide#internship-plan"); await guide();
  expect(screen.getByRole("heading", { name: sojtReference.steps[3].title })).toHaveFocus();
  fireEvent.change(screen.getByLabelText("Find an SOJT topic"), { target: { value: "MOA" } });
  expect(screen.getByRole("button", { name: sojtReference.steps[4].title })).toBeInTheDocument();
  expect(screen.getByRole("list", { name: "BSCA SOJT process" }).children).toHaveLength(10);
});
it("displays the requested coordinator, private support and no invented downloads or collection fields", async () => {
  await guide();
  expect(screen.getByText("SOJT Coordinator: Excel Van Jondonero")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Email the SOJT Coordinator/ })).toHaveAttribute("href", "mailto:excelvan.jondonero@g.msuiit.edu.ph");
  expect(screen.getByRole("link", { name: /Read the BSCA prospectus/ })).toHaveAttribute("href", "/curricula/bsca-prospectus.pdf");
  expect(screen.getByRole("link", { name: "Contact the Department office for SOJT support" })).toHaveAttribute("href", "/about/contact");
  expect(screen.getByText(/Keep reports private/)).toBeInTheDocument();
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  expect(document.querySelector('input[type="file"]')).toBeNull();
  expect(screen.queryByRole("link", { name: /Download/ })).not.toBeInTheDocument();
  expect(screen.queryByText("Draft for Department validation")).not.toBeInTheDocument();
});
it("uses Department-reviewed CMS content instead of the reference draft", async () => {
  const content = structuredClone(sojtReference); content.intro = "Reviewed institutional learning guidance"; content.sources.forEach(s => { s.status = "verified"; });
  vi.mocked(fetchJSON).mockResolvedValue({ slug: "bsca", content, reviewed_on: "2026-10-06", updated_at: "2026-10-06" });
  await guide(); expect(await screen.findByText("Reviewed institutional learning guidance")).toBeInTheDocument();
  expect(screen.queryByText("Department-reviewed guide")).not.toBeInTheDocument();
  expect(screen.queryByText("Draft for Department validation")).not.toBeInTheDocument();
});
it.each(["unavailable", "invalid", "unapproved"])("keeps %s CMS guidance internal and offers contact help", async state => {
  if (state === "unavailable") vi.mocked(fetchJSON).mockRejectedValue(new Error("No published guide"));
  else vi.mocked(fetchJSON).mockResolvedValue({ content: state === "invalid" ? { ...sojtReference, steps: [] } : sojtReference, reviewed_on: "2026-10-06" });
  await guide();
  expect(screen.getByRole("link", { name: "Contact the department" })).toHaveAttribute("href", "/about/contact");
  expect(screen.queryByRole("list", { name: "BSCA SOJT process" })).not.toBeInTheDocument();
  expect(screen.queryByText("Draft for Department validation")).not.toBeInTheDocument();
  expect(screen.queryByText(/Completion gate:/)).not.toBeInTheDocument();
});
it.each(["SOJT", "OJT", "internship", "practicum", "HTE", "MOA", "Internship Plan", "training hours", "SOJT Coordinator"])("discovers the guide in actual site search for %s", term => {
  render(<MemoryRouter><Header /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: "Search site" }));
  fireEvent.change(screen.getByLabelText("Find a page"), { target: { value: term } });
  expect(screen.getByRole("link", { name: "SOJT Process Guide" })).toHaveAttribute("href", "/sojt-guide");
  expect(searchPages.some(p => p.href === "/sojt-guide")).toBe(true);
});
it("keeps the migration snapshot in sync and uses the documented qualitative severity scale", () => {
  const seed = JSON.parse(readFileSync("../backend/apps/academics/data/sojt-guide-v1.json", "utf8"));
  expect(seed).toEqual(sojtReference);
  expect(new Set(seed.risks.map(r => r.severity))).toEqual(new Set(["High", "Moderate", "Low"]));
});

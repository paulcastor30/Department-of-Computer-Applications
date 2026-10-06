import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ThesisGuide from "@/pages/ThesisGuide";
import { formUrl, thesisForms, thesisFormSources, thesisStages } from "@/content/thesisProcess";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

afterEach(cleanup);
function guide(program = "BSCA") { return render(<MemoryRouter initialEntries={[`/thesis-guide?program=${program}`]}><ThesisGuide /></MemoryRouter>); }
it("separates mandatory stages, conditional panel changes and graduate examinations", () => {
  guide();
  expect(thesisStages).toHaveLength(8);
  expect(thesisStages.flatMap(stage => stage.forms)).not.toContain("018");
  expect(thesisStages.flatMap(stage => stage.forms)).not.toContain("027");
  expect(screen.getByText(/Need to change your Adviser/).closest("details")).not.toHaveAttribute("open");
  expect(screen.queryByRole("heading", { name: "Other graduate academic processes" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("radio", { name: /MSCA/ }));
  expect(screen.getByRole("heading", { name: "Other graduate academic processes" })).toBeInTheDocument();
});
it("jumps to and opens the selected step without implying official completion", () => {
  Element.prototype.scrollIntoView = () => {};
  guide();
  fireEvent.change(screen.getByLabelText("Your current thesis situation"), { target: { value: "defense-preparation" } });
  fireEvent.click(screen.getByRole("button", { name: "Go to this step" }));
  const heading = screen.getByRole("heading", { name: "Preparation for final defense" });
  expect(heading).toHaveFocus();
  expect(heading.closest("li")?.querySelector("details")).toHaveAttribute("open");
  expect(within(heading.closest("li")!).getByLabelText("Deadline")).toHaveTextContent("at least one month before grade locking");
});
it("uses the department-confirmed final checklist for both programs without a false MSCA download", () => {
  guide("MSCA");
  expect(screen.getByText("Two hard copies of the research article / journal-type paper.")).toBeInTheDocument();
  expect(screen.getByText("One printed research poster: 33 × 48.5 cm or 13 × 19 inches.")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Request the current MSCA submission form" })).toHaveAttribute("href", expect.stringContaining("ccs.gs@g.msuiit.edu.ph"));
  expect(screen.queryByRole("link", { name: "Download Final requirements submission (MSCA, Word)" })).not.toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: /Download Form/ }).every(link => link.getAttribute("href")?.includes("/msca/"))).toBe(true);
});
it("finds forms without hiding the sequence, and clearly distinguishes examiner and panel results", () => {
  guide();
  fireEvent.change(screen.getByLabelText("Find a form or step"), { target: { value: "019" } });
  expect(screen.getByRole("button", { name: "Proposal hearing application · Form 019" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Approval for binding" })).toBeInTheDocument();
  expect(screen.getByText(/Individual examiner evaluation —/)).toBeInTheDocument();
  expect(screen.getByText(/Official panel result —/)).toBeInTheDocument();
});
it("keeps original duplicate codes and links only to existing official source files", () => {
  expect(thesisFormSources.BSCA025.code).toBe(thesisFormSources.BSCAsubmission.code);
  expect(thesisFormSources.BSCAsubmission.verificationNote).toBe("Verify official document code with the department before publication.");
  for (const source of Object.values(thesisFormSources)) {
    expect(existsSync(resolve("public", decodeURIComponent(formUrl(source)).slice(1)))).toBe(true);
  }
});

it.each(["BSCA", "MSCA"])("shows department photo requirements for both %s hearing applications and calendar reminders without attributing them to the official forms", program => {
  guide(program);
  const notices = screen.getAllByRole("group", { name: "Department booking requirements · Announcement and calendar" });
  expect(notices).toHaveLength(2);
  for (const notice of notices) {
    expect(within(notice).getByRole("checkbox", { name: /Submit a personal photo of each student/ })).toBeInTheDocument();
    expect(within(notice).getByRole("checkbox", { name: /approved hearing date, start and end times, and room.*Google Calendar/ })).toBeInTheDocument();
    expect(within(notice).getByRole("checkbox", { name: /participating faculty.*calendar invitation.*reminders/ })).toBeInTheDocument();
  }
  expect(screen.getAllByText(/not stated in Forms 019 or 022/)).toHaveLength(2);
  expect(thesisForms["019"].requirements.join(" ")).not.toMatch(/photo/i);
  expect(thesisForms["022"].requirements.join(" ")).not.toMatch(/photo/i);
});

it("presents one concise workflow with closed details until a student chooses a step", () => {
  window.history.replaceState({}, "", "/thesis-guide");
  guide();
  const workflows = screen.getAllByRole("list", { name: "BSCA thesis process" });
  expect(workflows).toHaveLength(1);
  const stages = Array.from(workflows[0].children);
  expect(stages).toHaveLength(8);
  expect(stages.every(stage => !stage.querySelector("details")?.open)).toBe(true);
  const sourceNotes = screen.getByText("Source notes and items requiring verification").closest("details");
  expect(sourceNotes).not.toHaveAttribute("open");
});

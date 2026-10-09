import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import TransferEvaluationPortal from "@/pages/TransferEvaluationPortal";
import { evaluationRequest } from "@/lib/api";

vi.mock("@/lib/api", () => ({ evaluationRequest: vi.fn() }));
const configuration = { curricula: [{ id: 1, name: "BSCA test prospectus" }], campuses: [{ id: 1, name: "MSU-IIT" }] };
const row = { record_id: 0, code: "CCC101", title: "Computer Programming 1", units: "3", grade: "3.00", original_grade: "3.00", completion_grade: "", semester: "First semester", source_page: 1, requires_review: false, source_note: "" };
const draft = { curriculum: "BSCA test prospectus", rows: [{ ...row, result: "proposed_credit", reason: "Exact match and passing grade" }], remaining: [], elective_note: "Electives require review." };
const review = { draft, campus_id: 1, extraction: { format: "Department report", complete: true, pages: 1, rows: [row], issues: [], metadata: { full_name: "Test Student", current_program: "Test program", school: "MSU-IIT" } } };
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(evaluationRequest).mockImplementation(async endpoint => {
    if (endpoint === "configuration") return configuration;
    if (endpoint === "extract") return review;
    if (endpoint === "submit") return { reference: "reference-test", access_key: "secret-test", status: "Adviser review", draft };
    throw new Error("Reference or access key is incorrect.");
  });
});
afterEach(cleanup);
function portal() { render(<MemoryRouter><TransferEvaluationPortal /></MemoryRouter>); }
async function upload() {
  const input = await screen.findByLabelText("Evaluation PDF");
  fireEvent.change(input, { target: { files: [new File(["%PDF-test"], "record.pdf", { type: "application/pdf" })] } });
  await screen.findByRole("heading", { name: "2. Review and submit" });
}
it("starts with one upload control and automatically reads, compares and fills details", async () => {
  portal(); await screen.findByLabelText("Evaluation PDF");
  expect(screen.queryByLabelText("Email address")).not.toBeInTheDocument();
  expect(screen.queryByText("Course number")).not.toBeInTheDocument();
  await upload();
  expect(screen.getByText("Test Student")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "2. Review and submit" })).toHaveFocus();
  expect(screen.getByText("View extracted subjects").closest("details")).not.toHaveAttribute("open");
  expect(screen.queryByRole("button", { name: /Generate draft/ })).not.toBeInTheDocument();
  expect(vi.mocked(evaluationRequest).mock.calls.filter(([endpoint]) => endpoint === "extract")).toHaveLength(1);
  expect(screen.getByRole("button", { name: "Submit for evaluation" })).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "student@example.invalid" } });
  fireEvent.change(screen.getByLabelText("Intended semester and academic year"), { target: { value: "Test term" } });
  fireEvent.click(screen.getByLabelText(/These are my records/));
  fireEvent.submit(screen.getByRole("button", { name: "Submit for evaluation" }).closest("form")!);
  await screen.findByText("Your request has been received");
  expect(screen.getByText("reference-test")).toBeInTheDocument();
  const call = vi.mocked(evaluationRequest).mock.calls.find(([endpoint]) => endpoint === "submit");
  const payload = JSON.parse((call?.[1] as FormData).get("payload") as string);
  expect(payload.full_name).toBe("Test Student"); expect(payload.rows[0].record_id).toBe(0);
});
it("requires an updated review after a correction and preserves all attempts", async () => {
  portal(); await upload();
  fireEvent.click(screen.getByRole("button", { name: "Something was read incorrectly?" }));
  fireEvent.change(screen.getByLabelText("Grade for entry 1"), { target: { value: "2.75" } });
  expect(screen.getByRole("button", { name: "Submit for evaluation" })).toBeDisabled();
  expect(screen.getByRole("status")).toHaveTextContent("Update the review");
  fireEvent.click(screen.getByRole("button", { name: "Update review" }));
  await waitFor(() => expect(vi.mocked(evaluationRequest).mock.calls.filter(([endpoint]) => endpoint === "extract")).toHaveLength(2));
  const body = vi.mocked(evaluationRequest).mock.calls.filter(([endpoint]) => endpoint === "extract")[1][1] as FormData;
  expect(JSON.parse(body.get("rows") as string)[0].grade).toBe("2.75");
  expect(screen.queryByRole("button", { name: /Remove subject/ })).not.toBeInTheDocument();
});
it("clears an old review when a replacement PDF cannot be read", async () => {
  portal(); await upload();
  vi.mocked(evaluationRequest).mockRejectedValue(new Error("Upload the complete original PDF."));
  fireEvent.change(screen.getByLabelText("Evaluation PDF"), { target: { files: [new File(["bad"], "bad.pdf", { type: "application/pdf" })] } });
  expect(await screen.findByRole("alert")).toHaveTextContent("complete original PDF");
  expect(screen.queryByRole("button", { name: "Submit for evaluation" })).not.toBeInTheDocument();
});
it("checks status by posting the private key and displays errors", async () => {
  portal(); fireEvent.click(screen.getByRole("button", { name: "Check an existing request" }));
  fireEvent.change(screen.getByLabelText("Reference number"), { target: { value: "test-reference" } });
  fireEvent.change(screen.getByLabelText("Private access key"), { target: { value: "wrong-key" } });
  const form = screen.getByRole("heading", { name: "Check your evaluation" }).closest("form")!;
  fireEvent.click(within(form).getByRole("button", { name: "Check status" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Reference or access key is incorrect.");
  expect(evaluationRequest).toHaveBeenCalledWith("status", { reference: "test-reference", access_key: "wrong-key" });
});
it("reports service unavailability without offering a local guess", async () => {
  vi.mocked(evaluationRequest).mockRejectedValue(new Error("Unavailable")); portal();
  expect(await screen.findByRole("alert")).toHaveTextContent("The evaluation service is unavailable");
  expect(screen.queryByLabelText("Evaluation PDF")).not.toBeInTheDocument();
});

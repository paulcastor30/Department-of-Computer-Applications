import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { AlumniUpdateForm } from "@/components/AlumniUpdateForm";
import type { AlumniConfiguration } from "@/hooks/useAlumni";
import { alumniRequest } from "@/lib/api";

vi.mock("@/lib/api", () => ({ alumniRequest: vi.fn() }));
const config: AlumniConfiguration = { accepting_updates: true, contact_label: "Department chairperson", contact_email: "chair@example.org", privacy_notice: "Test notice: private records and correction contact.", notice_version: "test-v1", retention_days: 365 };
afterEach(() => { cleanup(); vi.resetAllMocks(); window.history.replaceState(null, "", "/"); });

it("keeps submissions closed when department configuration is incomplete", () => {
  render(<MemoryRouter><AlumniUpdateForm config={{ ...config, accepting_updates: false }} /></MemoryRouter>);
  expect(screen.getByText(/Online alumni updates are not open yet/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Email me a secure update link" })).toBeDisabled();
  expect(screen.queryByLabelText("Full name")).not.toBeInTheDocument();
});

it("requests a link without implicitly opting into announcements", async () => {
  vi.mocked(alumniRequest).mockResolvedValue({ detail: "Check your inbox." });
  render(<MemoryRouter><AlumniUpdateForm config={config} /></MemoryRouter>);
  expect(screen.getByRole("button", { name: "Email me a secure update link" })).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Your email address"), { target: { value: "graduate@example.org" } });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Email me a secure update link" }));
  await waitFor(() => expect(alumniRequest).toHaveBeenCalledWith("request-link", { email: "graduate@example.org" }));
  expect(screen.getByRole("status")).toHaveTextContent("Check your inbox.");
});

it("removes the secret from the address, waits for confirmation, then saves both degrees with separate consent choices", async () => {
  const token = "t".repeat(43);
  window.history.replaceState(null, "", `/alumni#alumni-token=${token}`);
  vi.mocked(alumniRequest).mockResolvedValueOnce({ session_token: "private-session", email: "graduate@example.org", profile: null }).mockResolvedValueOnce({ detail: "Saved privately." });
  render(<MemoryRouter><AlumniUpdateForm config={config} /></MemoryRouter>);
  expect(window.location.hash).toBe("#alumni-update");
  expect(alumniRequest).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Verify email and continue" }));
  await screen.findByLabelText("Full name");
  fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Test Graduate" } });
  fireEvent.click(screen.getByLabelText("BSCA graduate"));
  fireEvent.click(screen.getByLabelText("MSCA graduate"));
  fireEvent.change(screen.getByLabelText("BSCA graduation year"), { target: { value: "2020" } });
  fireEvent.change(screen.getByLabelText("MSCA graduation year"), { target: { value: "2024" } });
  expect(screen.getByLabelText(/The department may contact me/)).not.toBeChecked();
  expect(screen.getByLabelText(/I am willing to be contacted/)).not.toBeChecked();
  expect(screen.getByRole("button", { name: "Save my private alumni update" })).toBeDisabled();
  fireEvent.click(screen.getByLabelText(/I am willing to be contacted/));
  fireEvent.click(screen.getByLabelText(/I have read the privacy notice/));
  fireEvent.click(screen.getByRole("button", { name: "Save my private alumni update" }));
  await waitFor(() => expect(alumniRequest).toHaveBeenLastCalledWith("profile", expect.objectContaining({ bsca_year: 2020, msca_year: 2024, receive_updates: false, willing_to_mentor: true, consent: true, notice_version: "test-v1" }), "private-session"));
  await screen.findByText("Saved privately.");
  expect(screen.queryByLabelText("Full name")).not.toBeInTheDocument();
});

it("requires another link after expiry without exposing a profile", async () => {
  window.history.replaceState(null, "", `/alumni#alumni-token=${"t".repeat(43)}`);
  vi.mocked(alumniRequest).mockRejectedValue(new Error("This link expired. Please request a new link."));
  render(<MemoryRouter><AlumniUpdateForm config={config} /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: "Verify email and continue" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("This link expired");
  expect(screen.getByLabelText("Your email address")).toBeInTheDocument();
  expect(screen.queryByLabelText("Full name")).not.toBeInTheDocument();
});

it("accepts an email link opened in the already-visible alumni page", async () => {
  render(<MemoryRouter><AlumniUpdateForm config={config} /></MemoryRouter>);
  window.history.replaceState(null, "", `/alumni#alumni-token=${"t".repeat(43)}`);
  fireEvent(window, new HashChangeEvent("hashchange"));
  expect(await screen.findByRole("button", { name: "Verify email and continue" })).toBeInTheDocument();
  expect(window.location.hash).toBe("#alumni-update");
  expect(alumniRequest).not.toHaveBeenCalled();
});

it("registers with consent and displays a private key without browser storage", async () => {
  const key = "k".repeat(43);
  vi.mocked(alumniRequest).mockResolvedValue({ detail: "Created privately.", access_key: key, email: "graduate@example.org" });
  render(<MemoryRouter><AlumniUpdateForm config={{ ...config, access_keys_enabled: true, retain_indefinitely: true, retention_days: null }} /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("Your email address"), { target: { value: "graduate@example.org" } });
  fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Test Graduate" } });
  fireEvent.click(screen.getByLabelText("BSCA graduate"));
  fireEvent.change(screen.getByLabelText("BSCA graduation year"), { target: { value: "2024" } });
  expect(screen.getByRole("button", { name: "Create my private alumni account" })).toBeDisabled();
  fireEvent.click(screen.getByLabelText(/I have read the privacy notice/));
  fireEvent.click(screen.getByRole("button", { name: "Create my private alumni account" }));
  await screen.findByText(key);
  expect(alumniRequest).toHaveBeenCalledWith("register", expect.objectContaining({ email: "graduate@example.org", consent: true, career_entry_mode: "CURRENT" }), "");
  expect(screen.getByRole("button", { name: "Download my access key" })).toBeInTheDocument();
  expect(window.localStorage.length).toBe(0);
  expect(window.sessionStorage.length).toBe(0);
  expect(window.location.href).not.toContain(key);
});

it("opens a private account and adds a past role while keeping the current activity", async () => {
  vi.mocked(alumniRequest).mockResolvedValueOnce({ session_token: "private-session", email: "graduate@example.org", profile: {
    full_name: "Test Graduate", bsca_year: 2024, msca_year: null, career_status: "EMPLOYED", job_title: "Current developer", employer: "Example workplace", interests: "", phone: "", preferred_contact: "EMAIL", receive_updates: false, willing_to_mentor: false,
    career_history: [{ id: 1, reported_at: "2026-10-09T00:00:00Z", entry_kind: "CURRENT", career_status: "EMPLOYED", job_title: "Current developer", employer: "Example workplace", duties: "Build applications", work_city: "Iligan", work_country: "Philippines" }],
  }}).mockResolvedValueOnce({ detail: "History added privately." });
  render(<MemoryRouter><AlumniUpdateForm config={{ ...config, access_keys_enabled: true, retain_indefinitely: true }} /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: "Return to my account" }));
  fireEvent.change(screen.getByLabelText("Registered email address"), { target: { value: "graduate@example.org" } });
  fireEvent.change(screen.getByLabelText("Private access key"), { target: { value: "k".repeat(43) } });
  fireEvent.click(screen.getByRole("button", { name: "Open my private account" }));
  await screen.findByLabelText("Full name");
  expect(screen.getByLabelText("Career history update")).toHaveValue("NO_CHANGE");
  fireEvent.change(screen.getByLabelText("Career history update"), { target: { value: "HISTORICAL" } });
  fireEvent.change(screen.getByLabelText("Job title or role (optional)"), { target: { value: "Previous internship" } });
  fireEvent.change(screen.getByLabelText("What work do you actually do? (optional)"), { target: { value: "Maintain laboratory equipment" } });
  fireEvent.click(screen.getByLabelText(/I have read the privacy notice/));
  fireEvent.click(screen.getByRole("button", { name: "Save my private alumni update" }));
  await screen.findByText("History added privately.");
  expect(alumniRequest).toHaveBeenLastCalledWith("profile", expect.objectContaining({ career_entry_mode: "HISTORICAL", job_title: "Previous internship", duties: "Maintain laboratory equipment" }), "private-session");
});

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ProgramInquiry } from "@/pages/programs/ProgramInquiry";

vi.mock("@/hooks/useCore", () => ({ useSiteSettings: () => ({ data: { primary_email: "ccs.ca@g.msuiit.edu.ph" } }) }));
afterEach(cleanup);

it("routes graduate enquiries to the coordinator while retaining the learning-support route", () => {
  render(<MemoryRouter><ProgramInquiry code="MSCA" compact contactInformation={"CCS Graduate Program Coordinator\nOffice of the Dean\nccs.gs@g.msuiit.edu.ph"} /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "Email about MSCA" }).getAttribute("href")).toMatch(/^mailto:ccs\.gs@g\.msuiit\.edu\.ph\?/);
  expect(screen.getByRole("link", { name: "Advising and learning support" })).toHaveAttribute("href", "/resources#learning-support");
});

it("keeps undergraduate enquiries with the department", () => {
  render(<MemoryRouter><ProgramInquiry code="BSCA" compact /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "Email about BSCA" }).getAttribute("href")).toMatch(/^mailto:ccs\.ca@g\.msuiit\.edu\.ph\?/);
});

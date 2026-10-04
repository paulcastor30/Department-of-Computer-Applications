import { expect, it } from "vitest";
import { departmentProfileText } from "../lib/departmentProfileText";

it("uses missing-content messages for the known keyboard test values", () => {
  for (const text of ["asdfasdfasdf", "asdfasdfasd", "fasdfasdf", "asdfasdf", " ", null, undefined]) {
    expect(departmentProfileText(text)).toBeUndefined();
  }
});
it("preserves meaningful published copy and its paragraph structure", () => {
  expect(departmentProfileText("  Official department overview.\nLearning and research.  ")).toBe("Official department overview.\nLearning and research.");
});

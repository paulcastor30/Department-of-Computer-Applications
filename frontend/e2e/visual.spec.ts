import { test, expect, openPage } from "./fixtures/site";

for (const [name, path] of [["home", "/"], ["students", "/students/current"], ["programs", "/programs"], ["contact", "/about/contact"]]) {
  test(`${name} visual baseline`, async ({ page }) => {
    await openPage(page, path);
    if (name === "programs") await expect(page.getByRole("link", { name: "Explore BSCA", exact: true })).toBeVisible();
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}

test("program failure visual baseline", async ({ page }) => {
  await page.route("**/api/academics/programs/", route => route.fulfill({ status: 503, json: { detail: "Test service unavailable" } }));
  await openPage(page, "/programs");
  await expect(page.getByText("The latest program updates could not be loaded. Contact the department for assistance.")).toBeVisible({ timeout: 15000 });
  await expect(page).toHaveScreenshot("programs-error.png", { fullPage: true });
});

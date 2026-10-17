import AxeBuilder from "@axe-core/playwright";
import { test, expect, openPage } from "./fixtures/site";

for (const path of ["/", "/programs", "/students/current", "/faculty", "/about/contact", "/resources", "/research", "/thesis-guide"]) {
  test(`accessible page ${path}`, async ({ page }) => {
    await openPage(page, path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("expanded search and menu are accessible", async ({ page }) => {
  await openPage(page, "/students/current");
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  if (await menu.isVisible()) {
    await menu.click();
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
  }
  await page.getByRole("button", { name: "Search site" }).click();
  await page.getByLabel("Search the website").fill("thesis");
  await expect(page.locator("#site-search").getByRole("link").first()).toBeVisible();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
});

test("student services reflows with enlarged text spacing", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await openPage(page, "/students/current");
  await page.addStyleTag({ content: "*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

import { test, expect, openPage } from "./fixtures/site";

test("keyboard skip, menu, search, route focus and breadcrumbs", async ({ page }) => {
  await openPage(page, "/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  const menu = page.getByRole("button", { name: "Menu", exact: true });
  if (await menu.isVisible()) {
    await menu.click();
    await expect(page.locator("#primary-nav")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await expect(page.locator("#primary-nav")).toBeHidden();
  }
  await page.getByRole("button", { name: "Search site" }).click();
  await expect(page.getByLabel("Search the website")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Search site" })).toBeFocused();
  if (await menu.isVisible()) await menu.click();
  await page.locator("#primary-nav").getByRole("link", { name: "Students", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Current student services" })).toBeFocused();
  const ancestors = page.getByRole("navigation", { name: "Breadcrumb", exact: true }).getByRole("link");
  const destinations = await ancestors.evaluateAll(links => links.map(link => link.getAttribute("href")!));
  for (const href of destinations) {
    await page.goto(href);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toHaveCount(0);
  }
});

test("student tasks retain resource anchors and degree query parameters", async ({ page }) => {
  await openPage(page, "/students/current");
  await expect(page.getByRole("link", { name: /Fill or download thesis and program forms/ })).toHaveAttribute("href", "/resources#student-forms");
  await expect(page.getByRole("link", { name: /Find registrar forms/ })).toHaveAttribute("href", "/resources#registrar-forms");
  await expect(page.getByRole("link", { name: "BSCA Thesis Process Guide", exact: true })).toHaveAttribute("href", "/thesis-guide?program=BSCA");
  await expect(page.getByRole("link", { name: "MSCA Thesis Process Guide", exact: true })).toHaveAttribute("href", "/thesis-guide?program=MSCA");
});

test("header switches consistently at the shared breakpoint", async ({ page }) => {
  for (const width of [320, 768, 1023, 1024, 1025]) {
    await page.setViewportSize({ width, height: 1000 });
    await openPage(page, "/students/current");
    const menu = page.getByRole("button", { name: "Menu", exact: true });
    if (width < 1024) {
      await expect(menu).toBeVisible();
      await expect(page.locator("#primary-nav")).toBeHidden();
    } else {
      await expect(menu).toBeHidden();
      await expect(page.locator("#primary-nav")).toBeVisible();
      expect(await page.locator("#primary-nav a").evaluateAll(links => new Set(links.map(link => Math.round(link.getBoundingClientRect().top))).size)).toBe(1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 768) expect(await page.locator("header").evaluate(header => header.getBoundingClientRect().height)).toBeLessThan(200);
  }
});

test("student breadcrumb ancestor leads to the existing service hub", async ({ page }) => {
  await openPage(page, "/students/prospective");
  const ancestor = page.getByRole("navigation", { name: "Breadcrumb", exact: true }).getByRole("link", { name: "Students", exact: true });
  await expect(ancestor).toHaveAttribute("href", "/students/current");
  await ancestor.click();
  await expect(page.getByRole("heading", { level: 1, name: "Current student services" })).toBeVisible();
});

test("a slow route chunk does not expose and then displace the footer", async ({ page }) => {
  let release: () => void;
  const ready = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/assets/CurrentStudents-*.js", async route => {
    await ready;
    await route.continue();
  });
  await page.goto("/students/current", { waitUntil: "domcontentloaded" });
  try {
    await expect(page.getByRole("status").filter({ hasText: "Loading page…" })).toBeVisible();
    expect(await page.locator("footer").evaluate(footer => footer.getBoundingClientRect().top >= innerHeight)).toBe(true);
  } finally {
    release!();
  }
  await expect(page.getByRole("heading", { level: 1, name: "Current student services" })).toBeVisible();
});

import { test as base, expect, type Page } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { publishedPrograms } from "../../src/test/program-fixtures";

// Synthetic content stays in test fixtures and is never imported by application code.
const responses: Record<string, unknown> = {
  "/api/core/site-settings/": { primary_email: "department@example.test" },
  "/api/academics/programs/": publishedPrograms,
  "/api/academics/learning-resources/": [],
  "/api/academics/forms/registrar/": [],
  "/api/communications/news/": [],
  "/api/communications/events/": { results: [] },
  "/api/core/prototypes/": [],
  "/api/research/projects/": [],
  "/api/research/publications/": [],
  "/api/research/conferences/": [],
  "/api/people/organization/": [],
  "/api/people/faculty/": [],
  "/api/core/search/": { results: [], has_more: false },
};

export const test = base.extend<{ site: void }>({
  site: [async ({ page }, use) => {
    await page.clock.setFixedTime(new Date("2026-10-18T08:00:00+08:00"));
    const font = fileURLToPath(new URL("./plus-jakarta-sans-latin.woff2", import.meta.url));
    await page.route("https://fonts.googleapis.com/**", route => route.fulfill({
      contentType: "text/css",
      body: "@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:200 800;font-display:swap;src:url(https://fonts.gstatic.com/dca-test-font.woff2) format('woff2')}",
    }));
    await page.route("https://fonts.gstatic.com/**", route => route.fulfill({ contentType: "font/woff2", path: font }));
    await page.route("**/_vercel/insights/**", route => route.fulfill({ contentType: "application/javascript", body: "" }));
    await page.route("**/api/**", route => {
      const path = new URL(route.request().url()).pathname;
      if (!(path in responses)) throw new Error(`Add an explicit test fixture for ${path}`);
      return route.fulfill({ json: responses[path] });
    });
    await use();
  }, { auto: true }],
});

export { expect };

export async function openPage(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator("main h1")).toBeVisible();
  await expect(page.getByText(/^Loading news/)).toHaveCount(0);
  await expect(page.getByText(/^Loading dates/)).toHaveCount(0);
  await expect(page.getByText(/^Loading department examples/)).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
}

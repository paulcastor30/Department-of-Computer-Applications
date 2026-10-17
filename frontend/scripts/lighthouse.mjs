import { mkdir, writeFile } from "node:fs/promises";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import { launch } from "chrome-launcher";

// Audit the real local build without API mocks. A running preview is required.
const output = new URL("../lighthouse-results/", import.meta.url);
await mkdir(output, { recursive: true });
const chrome = await launch({ chromeFlags: ["--headless", "--no-sandbox"], ...(process.env.CHROME_PATH ? { chromePath: process.env.CHROME_PATH } : {}) });
const results = [];
try {
  for (const [name, path] of [["home", "/"], ["students", "/students/current"]]) {
    for (const formFactor of ["mobile", "desktop"]) {
      const options = { port: chrome.port, output: ["json", "html"], logLevel: "error" };
      const result = await lighthouse(`http://127.0.0.1:4173${path}`, options, formFactor === "desktop" ? desktopConfig : undefined);
      if (!result || result.lhr.runtimeError) throw new Error(result?.lhr.runtimeError?.message || "Lighthouse did not return a report");
      await writeFile(new URL(`${name}-${formFactor}.json`, output), result.report[0]);
      await writeFile(new URL(`${name}-${formFactor}.html`, output), result.report[1]);
      const summary = { name, formFactor: result.lhr.configSettings.formFactor, scores: Object.fromEntries(Object.entries(result.lhr.categories).map(([key, value]) => [key, value.score])), lcp: result.lhr.audits["largest-contentful-paint"].numericValue, cls: result.lhr.audits["cumulative-layout-shift"].numericValue };
      results.push(summary);
      console.log(JSON.stringify(summary));
    }
  }
  await writeFile(new URL("summary.json", output), JSON.stringify(results, null, 2));
  if (results.some(result => result.scores.accessibility !== 1)) process.exitCode = 1;
} finally {
  await chrome.kill();
}

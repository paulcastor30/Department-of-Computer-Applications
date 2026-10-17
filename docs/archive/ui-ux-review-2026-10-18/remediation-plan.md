# Prioritized remediation and verification plan

18 October 2026 · Direction approved; stages 1–2 implemented locally. See [implementation status](implementation.md). Later stages remain separate increments.

## Incremental delivery

Each increment should be a small reviewable change with screenshots and relevant test results. Preserve all routes, approved content, integrations and local user work. Do not publish new academic records as part of a UI change.

| Stage | Scope and affected code | Why now | Exit criteria |
| --- | --- | --- | --- |
| 0 — Review | Review audit, token roles, typography, compact shell and student-services visual study | Establish the direction before touching application UI | Direction reviewed; any preferred adjustments recorded in the task |
| 1 — Baseline infrastructure | Add `@playwright/test`, `@axe-core/playwright`, a deterministic test content strategy, `playwright.config.ts`, browser tests and screenshot artifacts | Capture current behavior and renderings before shared changes | Baseline comparisons pass in pinned CI environment; fixtures cover success/error/empty states and contain no private data |
| 2 — Foundation and pilot | Consolidate tokens; repair breadcrumb ancestry; simplify `Header`, `PageHero`, `Section` and action presentation; pilot `/students/current` | Shared consistency and navigation issues have broad benefit | Desktop/tablet/mobile before/after review accepted; task destinations and focus behavior retained; existing tests green |
| 3 — Homepage and performance | Optimize existing official logo assets; font delivery; stable introduction geometry; restrained banner treatment; homepage task/update density | Largest measured mobile cost and strongest branding repetition | Repeated lab runs improve median mobile performance; no visual/content regression; connected CMS updates verified |
| 4 — Collection and profile templates | Faculty, publications, projects, news, events and program listings; unify metadata and state presentation | Apply proven list/comparison patterns to dynamic content | Realistic long records, missing optional fields, photos, dates and approved/unpublished boundaries verified |
| 5 — Forms and guides | Resources, thesis, SOJT, alumni and transfer evaluation presentation | These carry complex state and important user work; migrate with care | Existing data entry, validation, degree/query/hash state, PDF generation, consent and recovery flows pass end-to-end |
| 6 — Consolidation and acceptance | Remove confirmed unused decorative styles/components; finalize documentation and CI budgets; manual accessibility and cross-browser review | Clean up only after consumers have migrated | No disconnected styling system; reviewed visual baselines; documented manual findings resolved or explicitly tracked |

Stage 2 contains a shared-shell change, so every sampled route must be checked even though the content-layout pilot is limited to Students. Roll back an increment independently if it breaks a journey. Do not combine a redesign with dependency upgrades, schema changes or a routing rewrite.

## Playwright visual regression strategy

The browser captures in this audit are **reference screenshots**, not regression tests. Introduce true comparisons in stage 1 using [`expect(page).toHaveScreenshot()`](https://playwright.dev/docs/test-snapshots), with reviewed versioned expected images and failing diff artifacts.

Proposed repository layout:

```text
frontend/playwright.config.ts
frontend/e2e/navigation.spec.ts
frontend/e2e/accessibility.spec.ts
frontend/e2e/visual.spec.ts
frontend/e2e/forms.spec.ts
frontend/e2e/fixtures/
frontend/e2e/__screenshots__/
.github/workflows/browser-quality.yml
```

Explicitly exclude `e2e/` from Vitest discovery so browser specs are not collected as jsdom tests. Add `test:e2e` and `test:visual` scripts separately from the existing `test` script. Keep new dependencies in the existing package lock. Use a production build and local preview in browser CI; a passing dev-server render is insufficient.

### Matrix

| Group | Coverage |
| --- | --- |
| Visual core | `/`, `/programs`, `/students/current`, `/faculty`, a faculty profile, `/resources`, `/research`, `/about/contact`, `/news/events` at 1440×1000, 768×1024 and 390×844 |
| Narrow/reflow | Core routes at 320 CSS px; extra checks at 1023/1024/1025 for the shell breakpoint |
| State variants | CMS populated/empty/error; loading; no search matches; long titles, names/emails; missing image; expanded disclosures; invalid form and success confirmation |
| Functional browser | Mobile menu and search, skip link, route focus, breadcrumb validity, faculty filtering, resource anchors, degree selection, form generation and recovery |
| Cross-browser | Chromium visual baseline; Firefox/WebKit functional and responsive smoke tests; retain separate screenshot baselines if visual checks are later extended |

Use controlled public-only fixtures for deterministic rendering and a separate seeded Django test environment for browser → API → database → response verification. Fixtures may be synthetic and explicitly test-only, but must never be introduced as frontend production records or mistaken for approved institutional data.

Pin Playwright/browser and CI OS versions. Stabilize date/time in Asia/Manila, locale, timezone, font assets, network responses and viewport. Wait for actual content and `document.fonts.ready`, not arbitrary timeouts. Freeze or mock the clock for deadline views. Disable decorative animation during capture. Do not mask important record content or whole dynamic sections merely to make tests pass. Scope masks only to truly nondeterministic third-party material and explain them.

Capture both the initial viewport and key full-page templates; long resources/guides also need focused component screenshots. Use explicit small difference tolerances justified by the environment; do not raise thresholds to hide unexplained changes. On a failure, publish actual, expected, diff and HTML reports. Update baselines only after a person reviews the change. A baseline refresh is not a fix by itself.

## Accessibility validation

Run axe through Playwright using WCAG 2 A/AA, 2.1 A/AA and 2.2 AA tags on populated and error views. Open menus, search panels, dialogs and key disclosures before scanning those states. Fail CI for new confirmed violations of the selected rules; triage incomplete checks manually rather than silently ignoring them.

Add explicit behavior assertions: labelled fields; error message relationships and focus; keyboard reachability; Escape restoration; skip target; active section; route heading focus; no obscured focus; no horizontal page overflow. The screenshot suite must include wrapping long labels and emails. Form tests must verify that recoverable failures preserve entered data and do not create duplicate submissions.

Manual checks are release criteria: VoiceOver/Safari or NVDA/Firefox landmarks, headings, reading order, name/role/value and error announcements; keyboard-only journeys; 200% text/zoom; 320 CSS px reflow (including actual zoom equivalent); text spacing; reduced motion; forced colors; touch target spacing. Review any authentication/re-entry/dragging behavior against applicable WCAG 2.2 criteria rather than assuming axe covers it. PDFs and Word downloads require their own accessibility review.

## Lighthouse and performance validation

Add pinned `@lhci/cli` tooling in a dedicated job after stage 1. Run against the same production build with a correctly configured seeded test API, on Home, Students, Programs, Resources and a populated faculty profile. Use three mobile and three desktop runs per representative route, compare medians, retain HTML/JSON and record the commit, environment and API state. Avoid collecting performance benchmarks while other heavy audit jobs compete for CPU.

Initial targets are proposed engineering budgets, to be confirmed after representative connected-data runs:

| Metric | Proposed gate |
| --- | --- |
| Accessibility | Automated score 100 and no confirmed axe violations; manual review still required |
| Mobile performance | ≥90 on representative routes; do not silently lower the gate if current production data changes it |
| LCP / CLS / TBT | ≤2.5 s / ≤0.1 / ≤200 ms in the agreed mobile lab profile |
| Desktop performance | ≥90 with no unexplained material regression |
| Best practices / SEO | Investigate all failures; distinguish preview-only Analytics/protection behavior from production defects |
| Logo transfer | Target <30 KB for the required responsive variants, subject to faithful rendering of the approved mark |

The audit's 68/91 performance results are diagnostic baselines, not gate calibration. Render-blocking font delivery and the oversized logo are supported findings; exact savings and CLS attribution require isolated reruns. Use field measurements after deployment only when authorized and available; do not equate a lab score with users' real Core Web Vitals.

## Required preservation checks

- Existing primary and supporting URLs, fragment anchors and degree query parameters resolve.
- Published dynamic content still comes from Django; unpublished/unconfirmed academic records remain absent.
- Search covers existing pages and records; failed record search retains its recovery action.
- Student form selections, visit context, drafts and validation behavior survive UI-only changes.
- PDF/download requests use the same endpoints and data contracts; required human review and source distinctions remain visible where relevant.
- Faculty ordering, education deduplication/publication safeguards and contact wrapping remain intact.
- Alumni consent/account security and transfer-evaluation workflows retain their existing boundaries.
- Typecheck, lint, Vitest, build/sharing checks and applicable Django tests pass before a stage is called complete.

## Immediate next review

Review the compact shell, page-title treatment, flat task list, type scale and navy primary action in the isolated study. Adjust the design direction first. Then implement stage 1 and the stage 2 pilot as separate reviewable changes; keep the remaining templates scheduled behind that pilot review.

# First implementation increment

18 October 2026 · Local working tree · Not deployed

The approved direction has been applied to the shared presentation foundations and current student-services page. This increment does not replace the application or alter academic records.

## Changes

- Compact shared identity/utility header, with the same eight primary destinations. Mobile/tablet menu and desktop navigation now share a 1024 px breakpoint. Search, Escape handling, focus restoration and route focus are retained.
- Students breadcrumbs resolve to the existing `/students/current` hub. Redundant ancestors pointing to the current page are omitted.
- Interior page headers now show the page title and optional lead/actions, without the repeated department eyebrow or decorative gradient stripe.
- Lazy-route loading states reserve a viewport of content space while the chunk loads, preventing the footer from appearing near the top and then being displaced. A delayed-chunk browser test covers this behavior.
- Semantic color, spacing, type and content-width roles live in the existing CSS foundation. Tailwind containers share a 1200 px maximum with 16/24/32 px responsive gutters. Section headings have a consistent smaller scale and reduced default gaps.
- Native buttons and existing action links share navy primary emphasis, wrapping labels, and routine 44 px targets. Existing component APIs remain compatible.
- Current student services uses a reusable flat task list, retains all six task destinations, and keeps degree-query links, announcements, faculty contacts, office help and learning resources.
- Playwright comparisons, axe scans, navigation/focus/reflow checks, fixed test time and a licensed test font fixture were added. Expected images are platform-specific. Production components never import the fixtures.
- A separate browser-quality workflow and repeatable Lighthouse script retain artifacts. The browser job uses macOS baselines; hosted CI has not been run from this local task.

## Validation

| Check | Result |
| --- | --- |
| Existing Vitest suite | 177 tests passed across 28 files |
| New Playwright suite | 60 tests passed, including 15 screenshot comparisons across desktop/tablet/mobile |
| axe | No violations in the tested eight-route matrix, expanded menu/search and sampled reflow states |
| Responsive navigation | 320, 768, 1023, 1024 and 1025 px checks passed; desktop primary navigation stays on one row |
| Keyboard/focus | Skip target, menu Escape, search focus/restore and route heading focus passed |
| TypeScript | Application and tooling/browser-test configurations passed |
| ESLint | No errors; the two existing Fast Refresh export warnings remain |
| Production build and sharing metadata | Passed; existing Browserslist warning and unavailable program metadata fallback remain |

Before replacing expected images, the new screenshot comparison was run against the pre-change student page and correctly failed with changed geometry and pixels. Updated expected images were then visually inspected and the full suite passed without snapshot-update mode.

At 768 px, the real local student-page header measured approximately **123 px**, compared with **325 px** in the audit. The pilot was visually inspected at 1440, 768 and 390 px, with additional 320 and breakpoint checks. This measures the closed navigation state, not an expanded menu.

Final local Lighthouse results:

| Page | Mobile performance | Desktop performance | Accessibility, both modes | Mobile / desktop CLS |
| --- | --- | --- | --- | --- |
| Students | 86 | 97 | 100 | 0.011 / <0.001 |
| Home | 67 | 96 | 100 | 0.214 / <0.001 |

Lighthouse initially exposed a large shift caused by the lazy route's small loading placeholder, which let the footer enter the first viewport before the page content loaded. Reserving space during loading reduced Students CLS from 0.567 to 0.011 on mobile and from 0.514 to <0.001 on desktop in subsequent local runs. Web-font swap contributes to the remaining shift. The homepage still needs its planned logo/font/banner performance work; the mobile ≥90 target has not been reached. These are single-run local lab results with unavailable API data, not production field measurements or a broad performance acceptance claim. Best practices scores are 96 (including the missing local Analytics script); SEO scores are 100.

Evidence: [Lighthouse summary](evidence/implementation-lighthouse-summary.json), [Students mobile report](evidence/implemented-students-lighthouse-mobile.json), [Students desktop report](evidence/implemented-students-lighthouse-desktop.json). Full HTML reports remain in the ignored `frontend/lighthouse-results/` folder and are uploaded by CI when that workflow runs.

Actual local pilot screenshots: [desktop](evidence/implemented-students-1440.png), [tablet](evidence/implemented-students-768.png), [mobile](evidence/implemented-students-390.png). These show existing reference contact details where the API is unavailable; screenshot-test baselines separately use test-only API responses.

## Limits and next increment

The browser suite uses deterministic test-only API fixtures; the local runtime still lacks Django. It does not prove database-backed submissions, production records or connected API behavior. Manual screen-reader, actual zoom and document accessibility acceptance remain outstanding. No full WCAG conformance claim is made.

The homepage content arrangement, decorative banner, original logo file and remote production font delivery are retained for the separate performance/homepage increment. Faculty, collection and form layouts remain separate template migrations, apart from their inherited shared shell, page headers, tokens and controls. The large footer is also retained for a later layout increment.

Run instructions and baseline-review policy are in [the browser-test README](../../../frontend/e2e/README.md). No commit, push or deployment was performed.

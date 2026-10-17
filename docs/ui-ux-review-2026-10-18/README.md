# UI/UX audit and proposed direction

18 October 2026 · Review stage · Baseline commit `fbaf59b`

**Implementation update:** The direction was approved after this audit. The shared foundations and student-services pilot are now implemented locally. See [implementation and validation](implementation.md). Findings and measurements below describe the pre-change baseline.

## Recommendation

Refine the existing application into a compact, content-led institutional website. Keep React, Tailwind, Radix primitives, stable URLs, CMS integrations, and working student services. Establish one visual system, simplify the shared shell, and prove the approach on current student services before extending it.

The “AI-generated” impression is a design judgment, not an attribution of authorship. The strongest evidence is repeated institutional branding, equally emphasized navigation choices, decorative page-header treatments, inconsistent heading scales, and accumulated styling systems. A wholesale rebuild would add risk without resolving these issues by itself.

**No application source, dependencies, content records, routes, or CI workflows were changed for this review.** This folder contains the audit, proposed system, isolated visual study, and baseline evidence. Production was not changed.

- [Proposed design system](design-system.md)
- [Prioritized implementation and validation plan](remediation-plan.md)
- [Isolated visual study](direction.html) — illustrative student-services layout; not an implemented application page
- Proposed layout screenshots: [desktop](evidence/proposed-students-1440.png), [tablet](evidence/proposed-students-768.png), [mobile](evidence/proposed-students-390.png)

## Scope and evidence limits

Inspected application routing, styles, shared and domain components, data hooks, API publication boundaries, frontend tests, backend test inventory, and CI. Browser sampling covered eight representative routes at 1440, 768, 390, and 320 CSS pixels: **32 route/viewport states**.

| Template or journey | Route | Browser coverage |
| --- | --- | --- |
| Homepage | `/` | Shell, introduction, quick tasks, unavailable news/dates/programs, footer |
| Program landing | `/programs` | Page header, unavailable program data, support links |
| Student service hub | `/students/current` | Six tasks, supporting navigation, breadcrumbs |
| Faculty directory | `/faculty` | Search control and unavailable-directory state |
| Contact | `/about/contact` | Email actions, address, unavailable staff data |
| Resource catalogue | `/resources` | Jump links, available reference UI, unavailable CMS sections |
| Research landing | `/research` | Section navigation and unavailable collections |
| Process guide | `/thesis-guide` | Rendered guide and available controls; no form submission |

Used an unmodified local production build at `http://127.0.0.1:4173`, Chromium 141, Playwright browser automation, axe-core 4.10.3, and Lighthouse 12.8.2. The available Chromium executable came from the existing local browser cache. Screenshots use reduced motion; Lighthouse uses its default mobile configuration and desktop preset.

**Django was unavailable in the installed Python runtimes.** No production database or live deployment was queried. Local preview API URLs returned HTML instead of JSON, causing real fallback/error states. This is a local preview configuration limit, not evidence that the production API fails. Populated program cards, faculty records, publications, calendar entries, form downloads, submissions, and private workflows still require a connected test backend. No invented records were added to fill the gaps.

The local information flow was traced from page hooks → `fetchJSON` → `/api/…` → preview HTML response → query error UI. Backend source inspection confirmed Django/DRF endpoints and publication filtering, but does not establish current live data correctness.

## Existing architecture

| Area | Current implementation | Implication |
| --- | --- | --- |
| Frontend | React 18, TypeScript, Vite 5, React Router 6 | Preserve the SPA and lazy route loading |
| Styling | Tailwind 3, HSL CSS variables, global component classes, per-page utilities, later unlayered CSS overrides | Consolidate existing mechanisms rather than add another styling library |
| Components | Radix/shadcn-style primitives, CVA buttons, `PageHero`, `Section`, `SectionHeader`, layout shell, domain-specific record and form components | Reuse accessible primitives and domain behavior; standardize presentation APIs |
| Data | TanStack Query hooks and `lib/api.ts`; Django 6/DRF backend | Keep dynamic academic records authoritative in Django |
| Navigation | `content/siteContent.ts`; eight current primary destinations; linked identity opens Home; header search and Apply/Alumni utilities | Preserve current destinations and paths while improving layout |
| Routing | `App.tsx`; nested public URLs, legacy/supporting routes, catch-all page | Audit links and parent mappings without renaming URLs |
| Tests | Vitest + Testing Library/jsdom; 28 frontend test files; Django tests across academics, people, research, communications, alumni, extension, core, quality | Strong behavior baseline, little browser-rendering coverage |
| CI | `.github/workflows/ci.yml`: frontend typecheck/lint/tests/build/sharing; backend checks/migrations/tests | Add browser visual/a11y and Lighthouse jobs incrementally after review |

There is no checked-in Playwright test configuration, screenshot comparison suite, axe integration, or Lighthouse CI job. Existing browser-result documents do not constitute a maintained visual regression suite.

## Findings

Priorities: **P1** affects navigation, access to core tasks, or substantial performance; **P2** affects clarity and consistency; **P3** is maintenance cleanup. Each recommendation below is proposed, not implemented.

| ID / priority | Finding and evidence | User impact | Recommended change |
| --- | --- | --- | --- |
| UX-01 · P1 | Students breadcrumb constructs `/students` from URL segments, but `App.tsx` has no route for it. Browser activation reached **“Page not found.”** See [additional checks](evidence/additional-checks.json) and `components/layout/Breadcrumbs.tsx`. | A visible navigation aid sends users to a dead end. | Define meaningful breadcrumb ancestors explicitly; use the existing student hub as the destination or render a non-link ancestor. Add a browser assertion. |
| UX-02 · P1 | At 768 px, the header is about **325 px** high and primary navigation wraps into two rows. The identity uses `w-full` until `lg`, while the menu disappears at `md` (`Header.tsx`). Interior-page breadcrumbs raise the start of main content to about **370 px**. | Tablet users spend too much of the initial screen on navigation. | Align shell breakpoints at 1024 px; use a compact disclosure below that width and a single-row primary navigation above it. Validate the full eight-link set with enlarged text. |
| UX-03 · P1 | Mobile Lighthouse: performance **68**, FCP **4.0 s**, LCP **4.0 s**, CLS **0.183**. Logo request transfers **857,740 bytes** despite displaying at 48–64 px. Google font CSS blocks rendering; the banner is identified as LCP. | Users on slower connections wait for a largely decorative first screen. | Produce appropriately sized, faithful logo assets; reduce font requests; reserve stable image/text geometry. Investigate LCP priority only if the banner remains the true LCP after the layout changes. |
| UX-04 · P2 | `PageHero` repeats the full department name in uppercase beneath the shared department identity, plus a gradient accent rule. Homepage repeats college identity in the eyebrow and department identity within the banner; footer repeats the name in heading and copyright. | Repeated branding competes with the page's purpose and gives the site a templated feel. | Keep institutional identity in the shell; give interior pages a title, optional short lead, and relevant actions. Remove redundant visible labels while preserving institutional content and metadata. |
| UX-05 · P2 | Homepage title scales to 56 px; interior `PageHero` titles use 32/36 px; `SectionHeader` uses 30/36 px for section headings; homepage H2 is 24 px. Faculty uses a `SectionHeader` H1. See `index.css`, `hero-section.tsx`, `section.tsx`, `Faculty.tsx`. | Heading level is not reliably reflected by visual weight and size across routes. | Introduce semantic type roles with explicit H1/H2/H3 defaults. Use a common interior page header; preserve correct HTML heading order. |
| UX-06 · P2 | `SectionHeader` defaults to 48 px bottom margin; `Section` resolves to 48 px vertical padding via later CSS; pages add `py-8`, `py-10`, `py-12`, `mb-5`, `!mb-6`, and `!py-8`. Container maxima vary from 1200 px on home to Tailwind's 1400 px, 5xl and 4xl wrappers. | Rhythms and left edges change between pages; sparse error states amplify empty areas. | Standardize page, reading, and service widths and a small set of spacing roles. Replace important overrides at their source in the pilot. |
| UX-07 · P2 | CVA `Button` primary is teal; `.action-link` is hard-coded navy; `.btn-cta-primary` is another teal implementation. Button sizes span 36, 40 and 44 px; action links wrap but `Button` uses `whitespace-nowrap`. | Similar controls communicate different emphasis and behave differently with long labels. | One shared action-variant contract across buttons and links. Keep correct native semantics; allow wrapping; use a 44 px product target for routine controls. Smaller controls need explicit review. |
| UX-08 · P2 | The student hub encloses every task in an equal card and repeats thesis navigation beneath them. Resources repeats task links, form links, program guide links and a separate SOJT section. Homepage and research use many outline links of equal weight. | Repetition makes users rescan similar choices instead of moving confidently to the task. | Use flat task rows and grouped text navigation; retain cards for genuine comparisons. Preserve contextual deep links and form-state behavior. Do not remove useful links merely to lower a count. |
| UX-09 · P2 | `NewsList` uses H3 directly below the standalone news page's `news-announcements` H2, which is correct, but other reused components and headings differ by embedding context. Several reusable cards hard-code H3. | Future reuse can silently produce poor document structure. | Make heading level an intentional component contract; audit heading trees on each route and state. Current sampled axe checks found no violations. |
| UX-10 · P2 | Homepage banner contains tiny embedded text and decorative network imagery while its adjacent HTML already states the department's identity. Its `alt=""` is appropriate only while the image is redundant. | The banner uses attention and bytes without adding much readable information, especially on phones. | Review removing it from the pilot homepage treatment; retain approved identity assets. Use documentary imagery only when verified and useful, with suitable alt text and permission. Do not generate replacement institutional imagery. |
| UX-11 · P2 | Footer has two groups of eight links plus contact/identity content; on narrow screens all groups stack. In the 390 px homepage error-state capture the whole page is roughly 5,500 px high. | Persistent secondary navigation substantially extends mobile pages. | Keep all destinations available, but group compactly and reduce redundant labels and padding. Test wrapping without shrinking tap targets. A disclosure is optional, not the default solution. |
| UX-12 · P2 | In the local unavailable-data state, program choices disappear, multiple homepage sections show independent error/fallback messages, and a staff-contact heading can remain without staff entries (`Contact.tsx`). | The page still looks structurally complete while its main content is unavailable. | Design loading, empty, partial and failure states as part of each template. Provide concise recovery actions; show optional headings only with content. Never substitute fabricated academic records. Validate against a real test API. |
| UX-13 · P2 | “Extension” in primary navigation becomes “Community work” in several page/breadcrumb/footer contexts; “News & Events” and “News and events” vary. `/students/current` is presented as both “Students” and “Current Students.” | Institutional terms and plain-language explanations are not consistently paired. | Agree a small label map; retain the official term and explain it once where needed. Keep shortened navigation labels intentional rather than accidental. |
| UX-14 · P3 | Gradient heroes, patterned backgrounds, elevated/featured cards, stat tiles, image zoom, arrow movement and filter entrance animation remain in reusable source. Searches found no consuming imports for `HeroSection`, `ContentCard`, `StatTile`, `BrandPattern`, `FilterBar`, or the legacy `ui/faculty-card.tsx`. PageHero's network pseudo-elements are already disabled by later CSS. | Dormant patterns can be reintroduced inadvertently and obscure the intended system. | Treat these as legacy maintenance candidates, not evidence of pervasive animation in the current UI. Verify all consumers before deleting; retain purposeful disclosure/dialog transitions and loading indicators. |
| UX-15 · P3 | Token values are redeclared outside `@layer`; controls and home sections use hard-coded hex values; radii vary from roughly 4–12 px. Both unused serif loading and extended decorative palettes remain. | Future adjustments require chasing overrides and guessing which values matter. | Define one semantic token layer and map Tailwind/CVA to it. Keep temporary compatibility aliases while migrating consumers. |

## Accessibility assessment

**No axe violations were found in the 32 sampled route/viewport states** using WCAG 2 A/AA, 2.1 A/AA and 2.2 AA tags. Both homepage Lighthouse runs scored **100 accessibility**. This is a useful baseline, not a WCAG conformance claim. Populated CMS views, form validation, screen-reader output and actual browser zoom were not comprehensively tested.

Verified in the browser: skip link reaches `main-content`; mobile menu opens and Escape restores its trigger; search focuses its input and Escape restores its trigger; navigating from menu to Students focuses H1. At 320 px, the student hub had no horizontal overflow after text-spacing overrides. Forced-colors sampling confirmed a solid task-link border; contrast and focus visibility in that mode still require visual/manual review.

Retain the existing visible focus outline, reduced-motion override, native disclosure behavior, explicit labels, status messages, wrapping emails and route focus management. Current 36/40 px button variants are **not automatically WCAG failures**: WCAG 2.2 AA target size is 24×24 CSS px or an applicable exception. The proposed 44 px routine target is a usability choice. Essential component boundaries must meet non-text contrast requirements; decorative dividers need not.

Manual acceptance must include keyboard-only operation, screen reader landmarks/headings and error announcements, 200% zoom, reflow at 320 CSS px, text spacing, focus not obscured, dragging alternatives where applicable, and accessible generated/downloaded documents. See the [WCAG 2.2 standard](https://www.w3.org/TR/WCAG22/). [Lighthouse scoring documentation](https://developer.chrome.com/docs/lighthouse/accessibility/scoring/) explains why manual audits do not contribute to the automated score.

## Baseline validation

| Check | Result | Qualification |
| --- | --- | --- |
| Vitest | **177 passed**, 28 files | React Router future-flag warnings; no failures |
| TypeScript | Pass | Both application and Node configurations |
| ESLint | 0 errors, 2 warnings | Existing Fast Refresh export warnings in `button.tsx` and `sonner.tsx` |
| Production build | Pass | Warns Browserslist data is old; program metadata fetch unavailable; general descriptions generated |
| Sharing/route metadata check | Pass | Existing production route mapping verification |
| Playwright browser sample | 32 states, no horizontal overflow or uncaught page errors | Eight representative routes; not screenshot comparison tests |
| axe-core | 0 violations in sampled states | No connected CMS success views |
| Keyboard smoke check | Pass for sampled interactions | Not an exhaustive keyboard or assistive-technology audit |
| Django/backend tests | Not run | Django not installed in available runtimes |

| Homepage Lighthouse | Mobile | Desktop |
| --- | --- | --- |
| Performance | **68** | **91** |
| Accessibility | 100 | 100 |
| Best practices | 96 | 96 |
| SEO | 100 | 100 |
| First contentful paint | 4.0 s | 1.2 s |
| Largest contentful paint | 4.0 s | 1.6 s |
| Cumulative layout shift | 0.183 | 0.001 |

These are single-run local lab measurements, collected during audit activity, not field Core Web Vitals or production benchmarks. The best-practices deduction includes a missing local Vercel Analytics script. Lighthouse flags the banner sizing and web font among shift causes; the banner already has HTML width/height, so the correct response is to investigate actual geometry and font changes, not blindly add duplicate attributes.

## Evidence index

- [Browser measurements and axe results](evidence/browser-audit.json)
- [Keyboard results](evidence/keyboard.json) and [breadcrumb/text-spacing checks](evidence/additional-checks.json)
- [Lighthouse mobile HTML](evidence/lighthouse-home-mobile.report.html) and [JSON](evidence/lighthouse-home-mobile.report.json)
- [Lighthouse desktop HTML](evidence/lighthouse-home-desktop.report.html) and [JSON](evidence/lighthouse-home-desktop.report.json)
- Homepage screenshots: [desktop](evidence/home-1440.png), [tablet](evidence/home-768.png), [mobile](evidence/home-390.png)
- Student hub: [tablet](evidence/students-768.png), [mobile](evidence/students-390.png), [mobile first screen](evidence/students-mobile-first-screen.png)
- Other samples: [programs desktop](evidence/programs-1440.png), [faculty error state](evidence/faculty-1440.png), [contact at 320 px](evidence/contact-320.png), [resources tablet](evidence/resources-768.png), [research desktop](evidence/research-1440.png)
- [Isolated proposal checks](evidence/proposal-checks.json): no overflow or axe violations at 1440/768/390/320 px; image loading confirmed. These checks apply to the static study, not an implemented website change.

## Review decision

The proposed direction is: compact institutional shell; clear left-aligned page titles; a 1200 px page grid with narrower reading content; restrained navy/blue/teal roles; flat service and record lists; cards only where grouping or comparison warrants them; and no decorative entrance or hover movement.

Review the visual study and system specification before implementation. The recommended first increment is browser-test foundations, navigation repair, compact header, common page header and the current student-services pilot. Homepage, forms, faculty records and other templates follow in separate reviewable increments.

# Homepage beginner orientation

The homepage remains React/Vite/TypeScript with Django as the institutional content authority. No model, migration, dependency, route or existing record is replaced.

## Maintenance

- `frontend/src/content/homeOrientation.ts`: stable plain-language definitions, illustrative flow, interests and conservative program comparison. Edit explanatory language here; do not add institutional claims without evidence.
- `frontend/src/components/HomeOrientation.tsx`: semantic flow, learning examples and native expandable comparison/career explanations.
- `frontend/src/components/RealDepartmentWork.tsx`: previews published CMS student prototypes and research. Edit real titles/summaries/publication status in Django admin; this component never creates fallback project records. It prefers a sensing student project and the supplied aphid-detection research record, with another published summary if unavailable. No reporting year implies completion or impact.
- `frontend/src/pages/Index.tsx`: section ordering, existing CMS overview/contact/news/program flow, supplied banner and links.
- Home metadata is mirrored in `frontend/scripts/page-metadata.mjs` for crawler/social previews.

Programs continue through `usePrograms` → `/api/academics/programs/` → normalization, with approved references only during API fallback. The existing department overview, contact details and news remain CMS-driven. The new explanatory text is educational orientation, not additional program policy or a replacement for CMS program descriptions. Shared career directions are curriculum-based possibilities, not official employment outcomes.

## Sources and accuracy

Reviewed 6 October 2026:
- Department-supplied BSCA and MSCA prospectuses in `frontend/public/curricula`, and the existing approved curriculum summaries.
- https://www.msuiit.edu.ph/academics/colleges/ccs/ — official descriptions of BSCA, BSCS, BSIT and BSIS.
- https://msuiit.edu.ph/academics/colleges/coe/programs/ — Computer Engineering includes software and hardware design/integration, not hardware alone.
- https://www.msuiit.edu.ph/academics/colleges/ccs/programs/com-apps/bs-com-apps.php — embedded systems, microcontroller-based design and IoT orientation. Its legacy title/admissions details are not imported.
- Published CMS research and student-prototype records, which were previously supplied/confirmed by the department.

The conceptual flow is illustrative: firmware runs on the controller; not every system uses a network, cloud or AI. Software can also send commands back to devices. The comparison explicitly states that fields overlap. No prerequisites, admission cutoffs, accreditation, career guarantees, new facilities or measured project impact are inferred. MSCA is not presented as requiring a BSCA degree.

## Previous verification standard (6 October 2026)

The first screen gives the department identity, meaning, concrete sensor/device example and both degree abbreviations. Subsequent sections develop the idea progressively, then provide verified examples and study/application/contact routes. Native disclosures keep the comparison, additional terms and career directions available without making them mandatory reading.

Automated checks and developer task walkthroughs do not establish a measured 30-second comprehension rate or a 95/100 accessibility score. A first-time student/parent and assistive-technology user trial is the remaining human validation.

## Previous validation — 6 October 2026

- TypeScript, production build and page-specific crawler/sharing metadata checks passed (21 public pages).
- Frontend: 84 tests in 16 files passed, including CMS authority, orientation order, native disclosures and no invented project fallback.
- Lint: no errors; two existing Fast Refresh warnings in shared UI components remain.
- Backend: 20 relevant tests passed; Django system check passed; migration consistency check found no changes. No backend schema or migration is needed for this refinement.
- Production-build preview at 1280, 768, 390 and 320 pixels: no horizontal overflow, one main H1, and zero axe WCAG 2 A/AA and 2.1 A/AA violations or incomplete results on the homepage.
- Keyboard walkthrough: native terminology/comparison/career disclosures expand using Space; the student-project link opens and focuses its actual CMS record. Existing visible focus styling is preserved.
- CMS preview loaded the published wearable activity-tracker student project, aphid-detection research and current announcements.

These checks are developer verification, not WCAG certification or a measured beginner-comprehension score.

## Academic identity and seven-section homepage — 8 October 2026

The homepage now follows this sequence:

1. **Institutional introduction**: MSU-Iligan Institute of Technology, College of Computer Studies, Department of Computer Applications; the proposed tagline “Where Computing Meets the Physical World”; both full degree names and links; program and research actions. The introduction uses the existing short reference explanation; the CMS department overview remains available in an optional disclosure in section 5 to keep the first screen concise.
2. **Explore Our Academic Programs**: BSCA and MSCA cards render normalized Django descriptions, preserving approved reference fallback and both thesis requirements.
3. **What is Computer Applications?**: reused `HomeOrientation` with a five-step illustrative sensor → microcontroller → firmware → processing → application or connected system flow, four specialization explanations, and an optional fair comparison with CS, IT, IS and Computer Engineering. Internet, cloud and AI are optional.
4. **Discover Our Work**: at most one published student prototype and one published institutional research project, with original CMS titles/summaries and record anchors. A research record needs an available plain-language summary. Publications remain a separate collection.
5. **Research and International Collaboration**: existing projects, publications, laboratories and international routes. Formal partnerships, research collaboration, coauthorship and conference engagement are explicitly distinguished; no named partnership is asserted.
6. **Department News**: reused `NewsList`, limited to three published posts, ordered by the existing Django publication chronology. “Posted” dates remain distinct from event dates. Empty/error states retain contact and retry routes.
7. **Connect With Us**: CMS contact settings with existing verified reference fallback; admission, contact, location, alumni and accessibility routes; an invitation for students, researchers, industry collaborators and visitors.

The proposed positioning and four explanations have a single source in `homeOrientation.ts`. About reuses the specialization component and proposed-status label. BSCA/MSCA and Research link to the shared orientation without replacing CMS curricula or asserting that every program has the same specialization tracks. Faculty, laboratory, publication and project records retain their existing evidence and expertise; no new personal expertise, laboratory affiliation, partnership or outcome is inferred. Existing facilities identify IoT and embedded teaching spaces; the research-laboratory and international pages still request official details where unavailable.

The existing navy/teal design, banner, typography, routes and security remain in place, with restrained maroon accents for the homepage tagline and program-card borders. No database schema, stored records, dependencies, thesis workflows or SOJT workflows change.

### Verification for this revision

- Python 3.12.14 / Django 6.0.8 in a temporary environment using repository dependency constraints.
- TypeScript application and tooling checks passed.
- ESLint passed with zero errors and two pre-existing Fast Refresh warnings (`ui/button.tsx`, `ui/sonner.tsx`).
- Frontend: 111 tests passed in 18 files. Existing navigation assertions were updated for the requested labels/order while retaining destination and focus behavior. New coverage includes exact seven-section order, one H1, labelled sections, proposed identity, four areas, CMS summaries/contact details, three-news limit, no-news handling and summary fallback.
- Production build passed; crawler/sharing metadata and route-mapping checks passed for 22 public pages. Remote program metadata was unavailable in the restricted build environment, so the existing approved metadata fallback ran successfully. No claim of a live metadata refresh is made.
- Django system checks passed, migration consistency found no changes, and all 44 backend tests passed, including published-only content and a new publication-order regression test.
- Production browser preview connected to Django using a separate `/tmp` SQLite database seeded by existing migrations: two programs, 22 published prototypes, 15 research records, three news records and site settings loaded successfully. This verifies the local data flow, not current production database contents.
- Browser checks at 320, 390, 768 and 1280 pixels: no horizontal overflow with comparison collapsed or expanded; seven ordered sections; one main H1; no more than three news articles; all 25 distinct homepage destinations and record anchors resolved; no page errors.
- Keyboard: Space expands the native comparison disclosure; visible focus outline is solid and 3px wide.
- Axe 4.10.3 with WCAG 2 A/AA, 2.1 A/AA and 2.2 AA tags: no violations or incomplete results in the homepage region at all four widths. This is automated evidence, not WCAG certification or full assistive-technology validation.
- Existing Browserslist data warning remains; dependency maintenance is outside this content/layout change.

Repeat browser verification using `frontend/scripts/verify-homepage-browser.mjs` with a production preview connected to a local Django server. The script accepts `PLAYWRIGHT_MODULE`, `CHROMIUM_PATH`, `AXE_SOURCE`, `HOME_TEST_ORIGIN`, `HOME_TEST_API` and `HOME_TEST_OUTPUT`; Playwright and axe are verification tools supplied externally, not added runtime dependencies. Build locally with `VITE_API_BASE_URL=http://127.0.0.1:8000` for this standalone preview. Browser evidence is in `docs/homepage-browser-results.json`; screenshots were reviewed from the temporary verification output.

### Departmental confirmation and pending human verification

- Approve or revise the proposed tagline, specialization terminology and restrained maroon accent treatment; they are not represented as an approved mission or research agenda.
- Supply documentary evidence before naming international partnerships, research groups or research laboratories. Existing navigation is retained while those details remain unavailable.
- Review current CMS summaries and contact details through the existing editorial process.
- Pending, excluded from automated completion: first-time student comprehension, parent usability interviews, assistive-technology user testing, faculty content approval and official institutional branding approval. None is reported as completed.

### Exact files changed for this revision

- `frontend/src/pages/Index.tsx`
- `frontend/src/components/HomeOrientation.tsx`
- `frontend/src/components/RealDepartmentWork.tsx`
- `frontend/src/content/homeOrientation.ts`
- `frontend/src/index.css`
- `frontend/src/pages/about/About.tsx`
- `frontend/src/pages/programs/ProgramDetailPage.tsx`
- `frontend/src/pages/research/Research.tsx`
- `frontend/index.html`
- `frontend/scripts/page-metadata.mjs`
- `frontend/scripts/verify-homepage-browser.mjs`
- `frontend/src/test/homepage-identity.test.tsx`
- `frontend/src/test/home-orientation.test.tsx`
- `frontend/src/test/news-list.test.tsx`
- `frontend/src/test/public-navigation.test.tsx`
- `backend/apps/communications/tests.py`
- `docs/homepage-orientation.md`
- `docs/homepage-browser-results.json`

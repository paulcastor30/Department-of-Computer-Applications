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

## Verification standard

The first screen gives the department identity, meaning, concrete sensor/device example and both degree abbreviations. Subsequent sections develop the idea progressively, then provide verified examples and study/application/contact routes. Native disclosures keep the comparison, additional terms and career directions available without making them mandatory reading.

Automated checks and developer task walkthroughs do not establish a measured 30-second comprehension rate or a 95/100 accessibility score. A first-time student/parent and assistive-technology user trial is the remaining human validation.

## Validation — 6 October 2026

- TypeScript, production build and page-specific crawler/sharing metadata checks passed (21 public pages).
- Frontend: 84 tests in 16 files passed, including CMS authority, orientation order, native disclosures and no invented project fallback.
- Lint: no errors; two existing Fast Refresh warnings in shared UI components remain.
- Backend: 20 relevant tests passed; Django system check passed; migration consistency check found no changes. No backend schema or migration is needed for this refinement.
- Production-build preview at 1280, 768, 390 and 320 pixels: no horizontal overflow, one main H1, and zero axe WCAG 2 A/AA and 2.1 A/AA violations or incomplete results on the homepage.
- Keyboard walkthrough: native terminology/comparison/career disclosures expand using Space; the student-project link opens and focuses its actual CMS record. Existing visible focus styling is preserved.
- CMS preview loaded the published wearable activity-tracker student project, aphid-detection research and current announcements.

These checks are developer verification, not WCAG certification or a measured beginner-comprehension score.

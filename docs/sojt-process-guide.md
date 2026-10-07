# SOJT Process Guide: implementation and policy review

Implementation reviewed: 6 October 2026. This is a website implementation review, not a policy approval date.

## 1. Location and publication state

Route: `/sojt-guide`. Local preview: `http://127.0.0.1:8080/sojt-guide` while the development server runs. The change has not been deployed or pushed.

The page displays a **Draft for Department validation** when an approved CMS guide is unavailable. National policy text was checked against the official CHED-hosted scanned memorandum, including visual confirmation of the eligibility and safeguard clauses. The University/CCS SOJT manual and local authorization procedure were not supplied or located. The draft does not claim CHED compliance or establish eligibility, approval, deployment or clearance.

## 2. Final workflow and national mapping

| Step | Process | National source / proposed implementation |
| --- | --- | --- |
| 1 | Eligibility & Academic Load Assessment | Sections 11–13 and 16.1.1–16.1.4. Formal documented assessment is a proposed DCA gate. |
| 2 | Mandatory Pre-Internship Orientation | 14.2.1(j), 15.2.1–15.2.2, 16.2.4. Approved make-up orientation and completion records are proposed DCA controls. |
| 3 | HTE Identification, Screening & Approval | 14.1.2, 14.2.1(c), 17.1.1–17.1.5. No named HTE or unsupported accreditation claim. |
| 4 | Internship Plan Development & Approval | Article III definition 5, 14.1.3, 14.2.1(d–e), 17.2.1, Annex A. Distinct plan approval before deployment. |
| 5 | Pre-Deployment Compliance, MOA & Internship Contract | 14.2.1(f–j), 16.1.5–16.1.6, 16.2.1–16.2.4, 17.2.4–17.2.6, 19, 24.3–24.4, 24.7. Documented institutional authorization wording remains proposed. |
| 6 | Deployment & HTE Orientation | 16.2.4–16.2.8, 17.2.7, 17.2.10. The Step 5 gate precedes start. HTE rules orientation before contract signing is separately explained in Step 5. |
| 7 | Monitoring, Site Inspection, Student Welfare & Monthly Assessment | 14.2.2(a–f), 15.2.3–15.2.6, 16.2.9, 17.1.4, 17.2.9–17.2.14, 20, 22. No assumption that remote contact replaces required inspections. |
| 8 | Completion & HTE Evaluation | 15.2.7, 16.2.10, 17.2.16, 20.1–20.2. Hours, competencies, plan, outputs, evaluation and certificate are reviewed together. |
| 9 | Exit Assessment & Post-Training Review | 16.2.11, 14.2.2(f–g). Private review of learning, welfare and HTE suitability. |
| 10 | Clearance, Final Grade & Institutional/CHED Reporting | 14.2.2(i), 14.2.3, 20.2–20.3, Annexes C–D. Reporting is an institutional duty, not a public student upload. |

Primary reference: [CHED CMO No. 104, s. 2017](https://cms-cdn.e.gov.ph/CHED/pdf/2017-CMO-NO104.pdf). Source section IDs are kept on each requirement and rendered as `data-policy-sources`; the page includes a readable Policy and Sources disclosure. Clause references are grouped where a paragraph combines national and proposed local controls; they are not claims that every phrase is a direct CHED quotation.

## 3. University, College and Department evidence

The Department-supplied BSCA prospectus, page 4, lists **BCA197 On-The-Job-Training, six units, BCA198 prerequisite, 40 hours/week, 700 total hours**, fourth year, second semester. Its heading identifies BOR Resolution No. 129, Series of 2018. The guide links the actual PDF and presents these as supplied-prospectus facts, subject to the student's applicable approved study plan.

CHED section 12's major/professional-subject qualification and concurrent-load wording must be reconciled with that curriculum prerequisite. The guide does not assume BCA198 alone establishes CHED/institutional eligibility, nor that the six-unit concurrent limit is automatic permission. Section 11's duration and any program exception need current institutional confirmation.

The coordinator name **Excel Van Jondonero** comes from the request. The existing 2026 faculty migration and public faculty CMS record verify **excelvan.jondonero@g.msuiit.edu.ph**. No rank or extra designation is added. Formal SOJT designation evidence still needs Department confirmation.

No CCS SOJT manual, SOJT forms, approved HTE list or existing SOJT risk register was found in the repository or public program-document CMS. A new qualitative register is supplied for the ten-step process; High/Moderate/Low meanings are documented, with no numerical scoring.

The ten-step gates, status labels, make-up procedure and checklist reminder behavior are requested/proposed Department implementation controls. They are not presented as an already adopted University manual.

## 4. Architecture and entry points

A single `SOJTGuide` editorial document in Django stores structured public content with source references. Admin supports editing, an internal approval reference, review date and publication status. Migrations create the schema and seed an unpublished reference without overwriting existing editor content. The public read-only endpoint is `/api/academics/sojt-guide/bsca/`; unpublished guides return 404.

Ordinary admin/model saves validate the ten ordered stages, required gate/checklist structure, source references, permitted links and qualitative risk scale. Publication requires a review date, approval reference and verified source statuses. This protects the editorial workflow; it cannot authenticate documentary evidence or replace human institutional review. Editors must update the actual wording and sources, not simply flip statuses. Internal notes and approval references are excluded from API responses.

React loads published CMS content. If unavailable or structurally invalid, it shows a clearly labelled reference draft. The reference snapshot is not the source of approved institutional wording. Checkboxes and statuses exist only in component memory; no student tracking tables, complaint forms, uploads, localStorage records or student database workflow were introduced.

The page reuses PageHero, Seo, existing website styles, the thesis connector pattern, native details/summary, visible focus and heading focus on navigation. There is one ten-step sequence. Resources and `/students/current` share the resource page, which now includes the guide. BSCA current-student guidance links it; MSCA is not assigned an undergraduate SOJT requirement. Search includes SOJT/OJT/internship/practicum/HTE/MOA/Internship Plan/training hours/coordinator. Breadcrumbs, production rewrites and crawler metadata include the route. The homepage and main navigation were not redesigned; the Thesis Guide remains available.

## 5. Required Department confirmation before institutional publication

- Current CMO applicability, any superseding issuance and BSCA program-specific PSG/curriculum requirements, including duration and exceptions to section 11.
- Current MSU-IIT/CCS SOJT manual and curriculum applicability: reconcile the supplied BCA197 six-unit/700-hour entry and BCA198 prerequisite with CHED section 12, other prerequisites, concurrent load, thesis obligations, application window and eligibility evidence.
- Formal adoption of the ten-step procedure, make-up orientation and documented pre-deployment verification; exact authorized deployment wording and signatories.
- Formal coordinator designation record, approved HTE pool and screening instrument. The directory email is verified, but no approved HTE names were supplied.
- Current official forms, versions and signatories; endorsement, student identification, additional institutional requirements and medical/insurance arrangements.
- Monitoring frequency, site inspection arrangements, any permitted remote monitoring, monthly report/evaluation instruments, outputs and grade/clearance rules.
- Confidential grievance authority and channel (including a route when a complaint concerns the coordinator), emergency support, interruption/termination handling and reporting/retention rules.
- HTE certificate issuance within two weeks (17.2.16) and transmission to HEI within 10–15 working days (20.1): confirm how local scheduling implements both actions.

Also retain documentary evidence of program authorization/COPC where applicable under 14.1.1, HEI/HTE approvals, medical/dental provision, insurance, actual monitoring and authorized reporting. No compliance or accreditation claim is inferred from having a website guide.

Keep unpublished as approved instructions: the exact local deployment authorization wording, make-up procedure, applicability of the supplied hours/curriculum, additional local documents and signatures, grade/clearance procedure and grievance/reporting channels until validated. Never publish completed MOAs, student lists, medical records, individual evaluations or complaints. CHED sample annexes are reference material and are not fabricated CCS download forms.

## 6. Verification results

- Full frontend suite: **102 tests passed in 17 files**, including 18 SOJT tests and the existing Thesis Guide tests.
- Full Django suite: **37 tests passed**, including five SOJT publication/schema/privacy tests.
- Django system check and migration drift check: passed. Migrations applied successfully to a temporary database; existing data was not changed.
- TypeScript check: passed. Lint: zero errors, two existing Fast Refresh warnings in `button.tsx` and `sonner.tsx`.
- Production build and metadata/production route checks: passed. Existing Browserslist data warning remains.
- Browser: 320×800, 390×844, 768×1024 and 1440×1000; document widths equal viewport widths with disclosures closed and expanded. No horizontal overflow.
- Native summary: Enter opens, Space closes, visible 3px focus outline. Status navigation opens Step 5 and focuses its heading. Reminder checkboxes reset on reload.
- Screen-reader structure: one H1, ordered ten-step list, unique H2 step headings, descriptive summaries, labelled inputs, meaningful links and current-step indication. This checks browser accessibility structure; no human assistive-technology user study is claimed.
- Axe WCAG A/AA audit of the guide region: zero violations across all four widths. At tablet/desktop, decorative connector pseudo-elements cause contrast checks to require manual assessment. Separate computed foreground/background checks gave a **minimum text contrast of 7.13:1**, and visual inspection confirmed the connector lines sit outside text and number backgrounds are opaque.
- Resources and BSCA links, actual site search for SOJT/OJT/internship, and preservation of the eight-step Thesis Guide: passed. Unit tests cover all requested search terms.
- Real browser → Django API → temporary database → reviewed-content rendering: passed with an explicitly labelled test fixture; fixture removed and unpublished draft restored. This is engineering verification, not an institutional approval.
- Browser runtime errors: none. Expected unpublished-guide 404 is handled by the draft fallback.
- The locked dependency installation reported existing dependency vulnerabilities; this task did not change package dependencies or the lockfile. Dependency remediation is separate from the guide implementation.

The repeatable browser script is `frontend/scripts/verify-sojt-browser.mjs`. Run it with agent-browser available or `AGENT_BROWSER_BINARY`, `SOJT_TEST_ORIGIN`, optional `AXE_SOURCE` pointing to an installed axe-core source, and optional `SOJT_TEST_OUTPUT`. No browser/audit packages were added to the app. Test evidence is in `docs/sojt-browser-results.json`.

## 7. Maintainer workflow

1. Apply migrations 0022 and 0023 and run existing `setup_roles` to give program editors access to the guide.
2. In Django admin, open Academics → SOJT guides → BSCA. Edit `content` as a structured JSON document. Preserve the ten stable stage IDs and source IDs; all requirement objects carry `{text, sources}`. Groups are `{title, items}`; sources include `{id, title, level, status, url, note}`. Risks carry step, title, severity, control and sources. The schema validator rejects unsupported fields, unknown references or reordered/missing steps.
3. Obtain the applicable University/College manual, official forms, curriculum confirmation, designation and Department approval. Update proposed/missing wording and source metadata with actual evidence. Resolve or remove resolved confirmation notes.
4. Record `reviewed_on` and an internal `approval_reference`, then publish only when the requirements and applicability have been reviewed. Merely changing source status flags does not verify a policy.
5. Approved CMS content takes precedence. Do not repurpose the guide as storage for private individual records. Future form downloads should extend the schema with stage/purpose/completer/version metadata and use verified public documents only; none are fabricated now.
6. The migration-owned v1 snapshot is immutable after release. For a future reference-policy revision, add a new snapshot/migration and update the labelled frontend fallback deliberately; never overwrite editor content. The synchronization test protects this initial reference pair.

## 8. Strict CHED monitoring perspective

The implementation provides a strong student-facing structure and traceability: eligibility before placement, mandatory orientation, screened HTE, separate approved plan, verified deployment safeguards, welfare/competency monitoring, evidence-based completion, exit review and restricted reporting. It correctly prevents company acceptance and hours alone from being treated as authorization/completion.

A strict monitoring committee would still require the adopted institutional manual and actual signed/designated/insured/monitored/reported evidence. The website does not supply those records or prove operational compliance. The appropriate assessment is **technically implemented and suitable for Department review; institutional compliance and publication approval remain unverified**.

## 9. Created and modified files

- `backend/apps/academics/admin.py`
- `backend/apps/academics/api_urls.py`
- `backend/apps/academics/models.py`
- `backend/apps/academics/serializers.py`
- `backend/apps/academics/views.py`
- `backend/apps/core/management/commands/setup_roles.py`
- `frontend/scripts/page-metadata.mjs`
- `frontend/scripts/verify-page-metadata.mjs`
- `frontend/src/App.tsx`
- `frontend/src/components/layout/Breadcrumbs.tsx`
- `frontend/src/content/siteContent.ts`
- `frontend/src/index.css`
- `frontend/src/pages/Resources.tsx`
- `frontend/src/pages/programs/ProgramDetailPage.tsx`
- `frontend/tsconfig.app.json`
- `frontend/vercel.json`
- `backend/apps/academics/data/`
- `backend/apps/academics/migrations/0022_sojtguide.py`
- `backend/apps/academics/migrations/0023_sojt_guide_reference.py`
- `backend/apps/academics/sojt_schema.py`
- `backend/apps/academics/test_sojt.py`
- `frontend/scripts/verify-sojt-browser.mjs`
- `frontend/src/content/sojtGuide.json`
- `frontend/src/content/sojtProcess.ts`
- `frontend/src/hooks/useSOJTGuide.ts`
- `frontend/src/pages/SOJTGuide.tsx`
- `frontend/src/test/sojt-guide.test.tsx`

`backend/apps/academics/data/sojt-guide-v1.json` contains the migration snapshot. The pre-existing untracked BSCA Form 027 was preserved and is not part of this work.

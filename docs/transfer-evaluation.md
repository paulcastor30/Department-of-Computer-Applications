# BSCA shifting and transfer evaluation

The student page is `/admissions/transfer-evaluation`, linked from admissions and the BSCA page. It uses Django APIs under `/api/academics/evaluations/` and a private Django admin review queue.

## Matching rule

Within the MSU system, identical course numbers and titles plus any recognized passing grade produce a proposed credit. Capitalization, whitespace and punctuation are ignored; word changes and course-number digits are preserved. Different units, unknown grades and repeated matches require adviser review. Outside MSU, all entries require review. Drafts never confer credit or admission.

The initial course catalog is transcribed from the supplied BSCA prospectus, BOR Resolution No. 129, Series of 2018, pages 1–5. It contains 47 named required courses, eight suggested technical elective courses, and separate guidance about four elective slots. Suggested elective courses are not all treated as requirements. Verify applicability before opening intake; create a separate curriculum for a new version instead of editing a historical version.

MSU-IIT is initially configured with numeric grades 1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 2.75 and 3.00 as passing. Source: [MSU-IIT Faculty Handbook, C. Class Management / Grading System, Article 363](https://www.msuiit.edu.ph/about/facts/downloads/policy-documents/msuiit-faculty-handbook.pdf). Conditional, failure, incomplete, in-progress, repeat, dropped and withdrawn tokens do not automatically qualify. Historical or unrecognized notation, including waived and CST passing remarks, requires review. Other MSU campuses must have their own department-verified grade tokens and policy reference added in admin; IIT rules are not assumed for them.

## Student flow

1. Upload the original department evaluation or My.IIT evaluation PDF (maximum 5 MB / 25 pages). Upload immediately reads the known layout, checks page coverage, fills the detected name/program, and prepares the draft comparison. There is no separate Read or Generate button.
2. Review a compact summary: student details, number of attempts read, proposed credits, and adviser-review count. The complete course history and remaining requirements are collapsed by default. Enter email, applicant type and intended term; confirm and submit.
3. If an entry was read incorrectly, open corrections and update only that entry. The server re-reads the original PDF, requires every original attempt exactly once, and marks changes for adviser verification. Students cannot remove attempts or replace source history with a hand-entered subset.
4. Save the reference and private access key. The page can download them as a text file; it does not store them in browser storage or put them in URLs. Final feedback appears after the chairperson’s decision.

### Record reading and uncertainty

Dedicated readers use PDF text positions, not generic numeric regex matching or AI. The department report has separate final/completion/earned-unit columns. My.IIT has bracketed completion grades and no displayed course units. Wrapped titles are joined and original grades, completion grades, semesters and page locations are retained. Repeated attempts remain separate, blank grades remain blank, and graph/empty-summary pages are classified explicitly. Missing/duplicated/out-of-order printed pages and unfamiliar table columns block submission. Unsupported and image-only layouts ask for the original export or department assistance; this version does not use OCR.

A recorded completion grade is preserved as the candidate effective grade but always flagged for adviser verification; it is never silently treated as an automatically approved credit. Unfamiliar passing remarks such as P require verified campus configuration. Missing My.IIT units remain null and are not invented from the BSCA prospectus. Exact passing matches can be proposed under the department's code/title/grade rule, with the missing-unit limitation shown for staff verification. Blank grades are not passing grades. Earned units in the department report are not lecture/laboratory hours.

The submitted draft stores the original extraction and every student correction. Staff see the source record for each subject, including source page and original/completion grades. Only the finalized department decision confers the evaluation outcome.

No automatic email delivery, identity-provider login, document resubmission after submission, prerequisite-based placement, elective-slot allocation, or university enrollment integration is included. The email channel remains available for help.

### Sample validation

The local reader was exercised against 56 supplied PDFs, covering 2,735 subject attempts. All passed the implemented page/row coverage checks. An independent PDF decoder was used to compare the original-grade and completion-grade columns for all 2,735 attempts and earned-unit values for the 2,610 department-report attempts; no grade or earned-unit mismatches were found. It included 251 blank original grades and 43 completion-grade entries. One overlapping code/title cell was merged by the independent decoder; the separate embedded text spans were inspected for that case. This is automated source agreement on these samples, not a manually certified ground-truth set or a guarantee of every future upload. No student names, identities, grades or original sample files are committed to the repository. Synthetic anonymous fixtures test the same layouts and edge cases.

## Staff setup and review

Run database migrations and `python manage.py configure_evaluation_roles`. Create/choose staff accounts and assign one of the two groups in Django admin. Superusers can administer configuration and both stages. Adviser and chairperson permissions are distinct.

- Verify the curriculum and configure additional originating campuses under Academics.
- Create capacity records by entry term and year level. The usual capacity defaults to 80 but can be changed. `occupied` is the number of existing students, excluding portal acceptances. Portal acceptances reserve capacity immediately; update counts carefully to avoid double-counting. This first version has no reservation expiry or separate enrollment confirmation. The capacity term must exactly match the student's intended term.
- Assign each request to its year-level adviser. The adviser checks the original PDF and affiliation, checks `records_verified`, reviews the prefilled proposed credits and records credit / do not credit for every remaining row, and maps any manual credits to a course in the selected curriculum. Manual credits and changes to automatic proposals require review notes. Save, then use **Adviser: endorse selected evaluations** from the request list.
- The chairperson selects the capacity record and enters student feedback and next steps. Save, then use **Chairperson: accept** or **do not accept** from the request list. Full capacity requires an explicit exception reason to accept. Acceptance does not happen automatically.
- Final requests are read-only in admin. Standard Django admin history records saved edits and review transitions; approval actors/times and source/draft snapshots are retained. A superuser must handle corrections to finalized records deliberately; no public editing endpoint exists.

## Privacy and operations

Submitted PDFs are stored in the application database, never in public media storage. Only staff with request-view permission can download them through an authenticated admin route; downloads are attachments with no-store headers. Access keys are random 256-bit bearer credentials stored only as SHA-256 hashes. Losing an access key requires contacting the department; self-service recovery is not provided. Anyone holding both details can view the evaluation, so students must keep them private.

Public endpoints are rate limited and validate input lengths, course count, grade field lengths, document type, size and page count. Private responses are marked no-store/noindex. Configure production HTTPS, database access/backups and department retention procedures; deleting a request deletes its stored document and course entries. Database backups also contain student records. PDF processing is synchronous, so production request limits and timeout controls still apply. For high-volume intake, use a shared throttle cache and appropriate edge request limits; the default local cache throttle is per process.

The local feature needs deployment of both backend and frontend, with migrations applied before students use it. Do not expose student records through public program APIs or uploads. Production hosting remains the project's existing Vercel frontend / Railway backend setup.

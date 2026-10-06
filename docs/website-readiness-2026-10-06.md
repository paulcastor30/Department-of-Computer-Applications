# Website readiness review — 6 October 2026

## Assessment

Acceptable as a public information website with clearly qualified guidance; not yet fully finalized for all academic procedures or inclusive document use. The department identity and computing/device explanation are clear; both degrees have study/admissions/prospectus routes; faculty, research, news, resources, contact and access information are organized around visitor tasks. Existing source caveats are deliberate accuracy protections, not reasons to invent missing details or redesign the site.

This review inspected the current repository and live primary routes (Home, Programs, Faculty, Research, News, Contact and Resources), plus the changed Thesis Guide in a production-build preview. It is a scoped review, not a new exhaustive audit of every record, external link or screen-reader interaction.

## Required to finish the remaining guidance

1. Thesis document control: confirm the current MSCA Requirements Submission document and signatories; resolve the duplicate BSCA 025 code without changing it by guesswork. Binding approval and submission remain distinct.
2. Clearance handoff: the department confirms outstanding thesis liability can affect TOR/certifications. Confirm which office records/removes the hold, how students obtain confirmation, and which registrar documents are affected. Do not publish a processing time or claim every registrar service is blocked without authority.
3. Accessible documents: the recorded document audit identifies an untagged MSCA prospectus, legacy DOC files and an image payment slip. Obtain approved accessible/editable versions or a dependable equivalent assistance arrangement, then verify actual reading/editing with users. See `accessibility-review-2026-10-06.md`.
4. Learning support: identify the responsible office/contact, available services and request procedure. Keep the existing enquiry route until confirmed; building access does not establish academic accommodation services.
5. SOJT: the existing guide is a draft for Department validation. Confirm the institutional manual, eligibility/hours, official forms/signatories, deployment authorization, monitoring, grievance and clearance processes before presenting it as approved local instructions. See `sojt-process-guide.md`.
6. Graduate policy applicability: the current university policy is linked; the applicable MSCA track/evidence still needs coordinator confirmation.
7. Content stewardship and user acceptance: assign an update owner and review schedule; complete actual beginner and assistive-technology task trials. The faculty/record review notes retain specific unconfirmed education/appointment/name items for editorial verification.

## What is not a new blocker

The ramp-to-office route, vehicle drop-off and elevator have been department-confirmed. Ordinary toilets are described with their limitations; an elevator does not make the toilets wheelchair-accessible. Additional photography and cosmetic changes are optional refinements. No new top-level navigation or wholesale visual redesign is necessary.

## Implemented clearance clarification

Both thesis guides show a visible Required for clearance reminder in final submission. The notice is Department-confirmed rather than attributed to the form. Completion means submission acceptance and cleared thesis liability, confirmed by the applicable office. Checkboxes and this guide record no official submission, approval or clearance. TOR/clearance searches find the final step. BSCA and MSCA download sources stay separate.

## Validation

104 frontend tests passed, including both-program clearance regression checks and existing SOJT tests. TypeScript, production build and crawler/route metadata checks passed (22 pages). Lint has no errors and two existing shared UI Fast Refresh warnings. The changed guide was checked by keyboard and at 320 pixels with no horizontal overflow; its reminder remains visible when the checklist is collapsed. No backend model/migration change is introduced by this update. Earlier automated accessibility and document audit results are referenced, not represented as new WCAG certification or actual participant trials.

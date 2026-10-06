# Maintaining the Thesis Process Guide

The page is `/thesis-guide`; use `?program=BSCA` or `?program=MSCA` to link to a selected program. It is reachable through program pages, student resources, site search and the footer.

Edit `frontend/src/content/thesisProcess.ts` for all process content:
- `thesisStages`: sequence, plain-language descriptions, next steps and deadline callouts.
- `thesisForms`: form title, purpose, preparation checklist, program-specific signatories and notes. `departmentRequirements` keeps department booking requirements separate from what the university forms state.
- `thesisFormSources`: official code, revision, effective date, program, status and file path. `formUrl` safely encodes the path to an existing uploaded document. Set the optional `downloadUrl` to a verified official URL if external hosting is adopted.
- `thesisStartingPoints`: beginner-friendly jump choices.
- `thesisSourceNotes`: unresolved source issues and legacy items; keep these visible in the expandable source notes until resolved.

The interface in `frontend/src/pages/ThesisGuide.tsx` is a renderer, not the place to edit policies. Source files stay unchanged in `frontend/public/thesis-forms`. No database, authentication, dependency or backend change is required. Checkboxes last only during the current page visit and are personal reminders, never official submission or approval records.

## Document control — resolve with the department

Verify official document code with the department before publication.

Approval for Binding and BSCA Requirements Submission both carry FM-MSU-IIT-ACAD-025. Do not renumber either. The submission card uses its title, with original metadata available under Document information.

BSCA Form 017's title says Advisory Panel, but its body says Oral Examination Panel. Confirm intended wording. BSCA and MSCA signature layouts differ and must remain separate. The BSCA source has a Co-Adviser slot; MSCA does not.

The BSCA final-submission USB/printed-copy checklist is confirmed by its uploaded form. The MSCA OGS Form 14 (March 2018) specifies a CD-ROM and different quantities and names a different college. The department confirmed on 2026-10-06 that the USB, printed-copy and poster checklist applies to both BSCA and MSCA. Both guides now show this checklist. The current MSCA submission document and signatories still need verification: no download of the older form is presented as current. Add a separate MSCA submission source and verified signatories when supplied; do not relabel the BSCA document.

Form 018 is conditional. Form 027 is a separate graduate examination process. The newly uploaded Form 027 in the BSCA folder is headed Office of Graduate Studies and has different coordinator signature wording; its folder does not establish BSCA applicability. The guide links the existing MSCA variant, and notes the difference.

Legacy CCS Forms 13–14 and the Certificate of Authentic Authorship are outside the main checklist pending current verification. The department has separately confirmed the Certificate of Panel Approval requirement for the hardbound copies. No scholarship-receipt alternative, three-copy hearing requirement, invented calendar date or mandatory publication requirement is added from the old infographic.

## Verify changes

Run frontend lint, TypeScript validation, tests and production build. Verify every configured download exists, inspect BSCA and MSCA on desktop and a narrow phone, operate the program selector, stage chooser, native disclosures and checkboxes by keyboard, and follow program/resource links. Test with an actual screen-reader user and student volunteers before claiming human usability/accessibility certification. The HTML guide makes instructions readable but does not repair accessibility limitations of official Word documents.

## Public hearing announcements

On 6 October 2026, the department instructed that each student supply a personal photo with the proposal/final-defense booking and approval materials, for the department’s public Facebook announcements. This applies to BSCA and MSCA. `hearingBookingRequirements` centrally maintains the requirements and is attached to Forms 019 and 022 through `departmentRequirements`; it is not attributed to the forms themselves. Photo format, resolution, delivery channel, staff recipient and an additional photo deadline were not specified, so none are invented. Students are directed to confirm the format and submission method with the department. No website photo-upload feature, Facebook publishing action or additional policy is introduced.

## Timeline presentation

There is one eight-step workflow. Requirements start collapsed on a normal visit; choosing a step or following a stage link opens the relevant details. Desktop uses connected numbered markers; phones retain full-width cards with inline numbers. Form 018 stays inside an optional disclosure, and document-code issues remain under expandable document information/source notes. Do not add a second summary timeline that repeats this sequence.

## Faculty calendar reminders

The department also requires the approved proposal/final-defense schedule and room to be added to Google Calendar for faculty reminders, for both BSCA and MSCA. The same shared `hearingBookingRequirements` data supplies the checklist beside Forms 019 and 022: date, start/end times and room; participating faculty invitations; and reminders. The calendar owner, event creator and reminder interval were not supplied, so students are directed to confirm these with the department. Calendar details must stay consistent with the approved schedule. This website change documents the process; it creates no calendar events or invitations.

## Required CCS room booking

The department confirmed room booking is mandatory for both BSCA and MSCA proposal hearings and final defenses. Forms 019 and 022 share `roomBookingRequirements` in `frontend/src/content/thesisProcess.ts`. Edit the URL, checklist, deadline and notes there. The official portal is https://one.msuiit.edu.ph/ccs/facility/. Source: department-supplied CCS Office Memorandum No. 002-EBBP, series of 2025, dated 4 August 2025. A separate online request is required per event, at least two working days before it; submission does not guarantee approval. Dean approval and room availability apply, with CCS classes taking priority. This deadline does not supersede the thesis forms’ one-week deadline or the final-defense grade-locking deadline. Google Calendar entries and public announcements are reminders/information, not room reservations. No room request is submitted by this guide.

## Separate program forms

BSCA sources resolve only from `frontend/public/thesis-forms/bsca`; MSCA sources resolve only from `frontend/public/thesis-forms/msca`. `getThesisFormSource` rejects a mismatched program/folder and provides no cross-program fallback. Matching form codes are not interchangeable. `programFormOverrides` centralizes the source-supported requester, panel and signature differences; `getThesisForm` selects the appropriate wording. The department-confirmed common final checklist does not authorize substituting a BSCA submission document for MSCA: the current MSCA form enquiry remains until that form is verified. Program-specific source notes follow the selected program.

## Final submission and clearance

On 6 October 2026, the department confirmed that incomplete or unsubmitted final thesis requirements create an outstanding thesis liability affecting TOR and other registrar certifications. `thesisClearance` centralizes the notice, enquiry instruction and completion milestone; the final-submission stage displays it without needing to expand details. It is attributed to departmental confirmation, not to Form 025 itself. Approval for Binding is distinct from Requirements Submission despite the duplicate code. The wording says documents **may** be withheld: the exact affected registrar services, office recording/removing the hold, evidence of clearance and processing time are not specified. Do not invent these. Completion means acceptance and cleared liability confirmed by the responsible office, never checking boxes on this guide. Searching TOR or clearance finds final submission. Both BSCA and MSCA receive the reminder.

## Three hardbound thesis copies

The department additionally confirms three printed hardbound thesis copies for both programs: one for the Department of Computer Applications, one for the College Dean’s Office, and one for the University Library. Each copy must have the fully signed Certificate of Panel Approval bound inside the thesis; it is not a separate submission. `hardboundSubmissionRequirements` keeps this departmental instruction separate from the uploaded submission-form checklist. It is additional to the USB, abstract/article copies and poster, and included in the clearance reminder. No certificate template, new signatory, OGS collection procedure, delivery deadline or binding specification is invented.

# Maintaining the Thesis Process Guide

The page is `/thesis-guide`; use `?program=BSCA` or `?program=MSCA` to link to a selected program. It is reachable through program pages, student resources, site search and the footer.

Edit `frontend/src/content/thesisProcess.ts` for all process content:
- `thesisStages`: sequence, plain-language descriptions, next steps and deadline callouts.
- `thesisForms`: form title, purpose, preparation checklist, program-specific signatories and notes.
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

Legacy CCS Forms 13–14 and certificates are outside the main checklist pending current verification. No scholarship-receipt alternative, three-copy hearing requirement, invented calendar date or mandatory publication requirement is added from the old infographic.

## Verify changes

Run frontend lint, TypeScript validation, tests and production build. Verify every configured download exists, inspect BSCA and MSCA on desktop and a narrow phone, operate the program selector, stage chooser, native disclosures and checkboxes by keyboard, and follow program/resource links. Test with an actual screen-reader user and student volunteers before claiming human usability/accessibility certification. The HTML guide makes instructions readable but does not repair accessibility limitations of official Word documents.

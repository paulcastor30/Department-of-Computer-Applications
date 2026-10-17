# Accessibility review and remaining acceptance checks

Reviewed: 6 October 2026. This is a scoped check, not a WCAG conformance certification.

## Completed browser checks

Live site: https://msuiit-comapps.vercel.app

- Desktop keyboard, Home: first Tab reaches Skip to main content; Enter moves focus to the main element.
- Home search: Tab reaches Search; Enter opens it and focuses the labelled input. Searching for thesis exposes four relevant page links and a result-count status. Escape closes search and restores focus to its trigger.
- Resources: Tab from main content follows the document links and reaches the labelled BSCA/MSCA radio group. Space selects BSCA and Right selects MSCA. The visible form set and status change to MSCA.
- Resources: Tab reaches the proposal-group disclosure; Space closes it. Its focused control has a visible 3px outline.
- Mobile, 320px wide: Tab reaches Menu; Enter opens navigation. Tab enters navigation; Escape closes it and restores focus to Menu. Home has no horizontal overflow in this check.
- Accessibility-tree inspection exposes labelled links, headings, radio choices, disclosure states and main/navigation landmarks. This does not establish what VoiceOver or NVDA actually speaks.

These were keyboard interactions and accessibility-tree inspections through the browser tool. No actual screen-reader session or participant trial has been completed.

## Downloaded-document structure audit

The audit includes 40 tracked public files: two prospectuses and 38 student-form files. The additional untracked BSCA written-exam document was excluded because it is not part of the deployed collection.

See `document-accessibility-audit.json` for per-file observations.

- BSCA prospectus: five pages, extractable text, PDF structure tags and document language present. Reading order, course-table relationships and spoken output still need testing.
- MSCA prospectus: four pages, extractable text, no PDF structure tree and no document language. This is a concrete remediation item; text extraction alone does not establish accessible reading order.
- Two PDF registrar forms: tags and language present; neither has interactive form fields. Their print layouts are not equivalent to keyboard-fillable PDF forms.
- 33 DOCX forms: all contain text. Ten use heading styles; 22 contain tables; none marks repeating table-header rows. These flags require visual and screen-reader review: some tables are layout tables, so absence of header markup is not itself proof of a defect.
- Two legacy DOC files were inventoried but their structure was not assessed by the XML/PDF audit.
- One JPG payment-slip template is an image. A screen reader cannot read its printed fields through the image itself.

The original official documents have not been rewritten or relabelled as accessible. Document-access help is now beside program/resource downloads and on Using this website. The request supplies document name, program, task, preferred format and relevant date. It asks for assistance without promising a service that has not been confirmed.

## Document remediation acceptance tasks

Ask the document owner to provide or approve these replacements, then test the exact downloadable version:

1. Export the MSCA prospectus from its editable source with real headings, accessible course tables, reading order and document language. Check it with a screen reader before replacing the PDF.
2. For each form, verify labels, field order, instructions and signature requirements. Provide an approved keyboard-editable version or equivalent assistance route. Adding empty PDF fields or guessed labels is not sufficient.
3. Obtain approved DOCX replacements for the legacy DOC templates and an approved text/editable version of the payment slip. Preserve official form codes and requirements.
4. Check tagged PDFs and DOCX templates with the reader/editor students actually use. Do not treat tags, text extraction or heading counts as a pass on their own.

## Screen-reader trial — pending, not passed

Use a real screen reader with its usual browser, for example VoiceOver/Safari or NVDA/Firefox. Let the tester use their familiar setup. Record the exact reader, browser and version.

- From Home, use landmarks/headings to identify the department, programs and contact information.
- Open and close Search; search thesis. Check the input name, result count, links, and restored focus.
- On Resources, identify the BSCA/MSCA group; switch programs. Confirm names, selected state and status are understandable.
- Expand a form group. Identify the correct task, program, form code and file type before downloading.
- Read Research/Extension project titles, purpose summaries and intended-audience labels; open a team list and use a year filter. Confirm states and changed result counts.
- Open both prospectuses and one proposal and one defense form for each degree. Check reading order, table meaning and ability to read/edit fields.
- Find Directions and access assistance and request document help without submitting any personal or medical information.

Pass only when tasks can be completed without an unresolved trap, missing name, lost focus or unreadable essential information. Capture actual spoken-output problems, fix them and repeat the affected task.

## Beginner and disability usability trials — pending, not passed

Invite willing volunteers, including a beginner and people who use relevant assistive technology. One small round is useful feedback, not a representative study or universal accessibility proof. Do not ask for diagnoses or medical documents.

Give each task without demonstrating its answer:

1. Explain in your own words what the department studies.
2. Find which program is undergraduate and how to apply.
3. Find the correct BSCA proposal form and MSCA defense form.
4. Find a faculty member and a related research record.
5. Explain one research/extension project and whom it is intended to help.
6. Find the ramp, elevator, toilet limitations, office hours and contact details.
7. Request help with a document without sending the email.

Record anonymous participant labels, task success (independent / needed help / blocked), confusing words, navigation mistakes, keyboard/reader barriers and the tester's comments. Avoid coaching until the attempt is recorded. Fix blockers first; repeat failed tasks with the affected users. Keep status pending until actual participants have completed the round.

## Maintaining explanations

ResearchProject and ExtensionProject have editable plain-language summary and intended-audience fields in Django admin. The seeded wording paraphrases the reported titles and does not establish implementation status, attendance, effectiveness or measured impact. Missing audience groups remain blank. Department editors should replace general wording with verified problems, users and outcomes as evidence becomes available. The import does not overwrite subsequent editorial changes.

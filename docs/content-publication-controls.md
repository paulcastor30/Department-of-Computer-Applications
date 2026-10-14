# Public content controls

Django is the source of academic program content. The frontend no longer supplies a second set of program descriptions, requirements, recognition claims or documents. Empty optional fields are omitted. Unpublished programs remain absent; unavailable API responses provide a contact route without restoring academic information.

## Faculty activities

New expertise, supervised work, publication, conference, research, extension, creative work, training, achievement and contribution records start unpublished. Before publishing through Django admin, enter an internal approval reference identifying the approving authority, date and supporting source. The public API requires both publication and a nonblank approval reference and does not return the reference. Education continues to use its existing academic status and verification reference controls.

Migration `people.0021_faculty_record_publication_approval` retains existing records and their publication flags. Previously published activities receive an internal note recording the retained publication decision; this does not assert new verification or approval. Drafts remain unpublished. Reviewers can replace this note with the actual approval reference as records are reviewed.

Run `python manage.py migrate` when deploying the backend before serving requests with the updated API. The schema adds approval fields without deleting academic records.

## Internship guidance

Resource and program links describe internship guidance and department contacts. The full SOJT guide appears only when Django supplies published, authorized guidance. The project user authorized the existing text unchanged on 2026-10-15; a migration records that authorization and exact content digest without relabelling source-review statuses. No content is automatically approved by the frontend, and public pages do not ask visitors to assess internal verification status.

## Checks

Regression tests cover removed and unpublished programs, cleared accreditation, unavailable documents, news without dates or summaries, admin approval validation, draft defaults, publication preservation, and API withholding of records without an approval reference. Browser checks should include desktop, narrow mobile and intermediate header widths.

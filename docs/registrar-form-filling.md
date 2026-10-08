# Registrar forms

Resources (`/resources#registrar-forms`, also current-student resources) lists eleven Registrar forms through the public Django API. `RegistrarForm` in admin controls visibility, order, title, note and original download. Migration 0028 seeds the supplied originals, retaining the uploaded `registar-forms` directory spelling.

The shared form editor loads the schema on demand, prepares an in-memory PDF, and offers review and download. Inputs are never stored in database, files or browser storage. Downloading does not submit a request. Signatures, certification, approval, fee assessment and completion grades remain manual official sections.

Reviewed PDF templates, source originals, SHA-256 hashes and field maps live in `backend/apps/academics/form_templates/registrar`. Original wording, vector text, page geometry and all 14 pages are preserved. Form 011 is Letter; the other ten are A4. Entry fonts are embedded using the existing licensed Liberation fonts. Existing raster logos retain source quality. Templates are rendered from supplied Word documents with LibreOffice; Word rendering can differ, so the original download is always retained.

Form 009’s supplied student-name blank is only about 27 points wide. It is intentionally left for the Registrar or the original Word workflow; do not silently resize or move it. The UI explains this limitation.

The API uses the same validation, rate limit, request-size limit and private/no-store PDF responses as thesis forms. Changing an original URL or replacing a file removes the fill action until the matching template and coordinate map are reviewed. The backend carries original copies so integrity checks work on backend-only deployments; frontend originals are also checked when available. When updating a source, rerender all pages, review coordinates and fillable scope, update hashes and test rendered output. Do not use scanned page images as PDF backgrounds.

Apply migrations and deploy both frontend assets and backend code/templates together. Keep the registrar directory in the static build. No student submission or email sending is added.

# BSCA and MSCA filled form downloads

The 11 owner-supplied BSCA Word documents listed in `backend/apps/academics/form_templates/bsca/catalog.json` and the ten selected MSCA documents in `backend/apps/academics/form_templates/msca/catalog.json` support **Fill out online**, alongside the original blank Word download. Other documents retain their existing downloads.

MSCA filling is enabled only for Forms 017, 019, 020, 021, 022, 023, 024, 025, CCS Form 13 and CCS Form 14. These use their own original files and field maps; matching form numbers do not share templates between programs. The existing Django document records already include these ten forms, so the MSCA extension needs no database migration.

Students enter known details, prepare a PDF, review it in a new tab and download it. Editing any entry invalidates the prepared download. A download is not a submission; no signatures, examiner assessments, approval decisions or staff dates are generated. Thesis and publication checkboxes are marked only when the student explicitly selects an option.

## Fidelity and print quality

Each original DOCX was rendered once using bundled LibreOffice into a checked, static PDF. The PDF keeps selectable text, embedded fonts and source images; it is not a screenshot of a form. The original Word downloads remain byte-for-byte unchanged. Source images retain their existing quality.

At request time, ReportLab creates only a text overlay, using embedded Liberation fonts, and pypdf adds it to the checked PDF pages. Original wording, drawings, headers, footers, page count and page sizes stay fixed. No Word conversion or document layout engine runs on the server. Original serif and sans-serif styles use corresponding entry fonts. Both collections share the licensed entry fonts bundled in the BSCA assets directory. Print at actual size (100%) using the paper size shown by the editor: A4 for the numbered forms, Legal (8.5 × 14 inches) for MSCA CCS Form 13, and Letter (8.5 × 11 inches) for MSCA CCS Form 14.

The Word-to-PDF baseline uses LibreOffice's metric-compatible Liberation, Carlito and other bundled fonts where the source names Microsoft fonts. Visual QA checks the rendered source and filled PDFs. It does not establish pixel-identical rendering against every Microsoft Word version or printer. The original files remain available when a workflow requires Word itself.

Each text slot has a fixed page, baseline, width and font size. The server checks character coverage, available line width and line count. Long values produce field-specific errors rather than clipped text, unreadable shrinking or new pages. Repeated details on the two-page forms are filled on both pages. Students can leave fields empty, but must enter at least one detail to prepare a filled PDF.

Form 027 is included because the owner explicitly selected it. Its graduate-studies wording is retained, with an applicability note shown in the editor. It is not rewritten as an undergraduate examination policy.

The MSCA CCS Form 13 and 14 filenames are retained even though their headings say OGS Form 13 and OGS Form 14, dated March 2018. Form 14's original addressee names the College of Arts & Social Sciences; the editor flags this without changing the document. The second, otherwise blank page of MSCA Form 024 is preserved, including its repeated header. MSCA Form 13 exposes its existing three-row cross-registration and transfer-of-credit tables; MSU equivalent, grade and unit entries are labelled as officially confirmed values. The site does not calculate equivalencies or grades. Signatures, examiner ratings, recommendations and approval decisions remain for the responsible people.

## Data flow and deployment

- The program document API exposes `fillable_form_id` only for public BSCA or MSCA records pointing to an exact selected canonical document path for that program on the existing site (or a relative URL). Arbitrary URLs, uploaded replacements and unselected documents are excluded.
- `GET /api/academics/forms/bsca/<id>/` and `GET /api/academics/forms/msca/<id>/` return the field labels and limits; `POST` to the same URL accepts a JSON object of field values and returns `application/pdf`.
- Each route requires an associated public document under its own published program. The endpoint does not fetch arbitrary remote files. Filenames include the program code to distinguish identically numbered forms.
- Student entries and generated documents stay in request memory. They are not saved to the database, disk, browser storage or a student account. Responses use `private, no-store`. POSTs are rate limited and request bodies are capped.
- The browser keeps a temporary object URL for review/download and releases it when entries change, are cleared, or the component unmounts. Closing the editor keeps its entries in page memory until cleared or the page is left. An optional, unchecked-by-default checkbox allows a whitelist of common names, student ID, degree and thesis details to be reused in other forms of the same collection during this tab visit. This is React memory only; refresh or tab closure clears it, and disabling reuse clears the reusable profile. BSCA, MSCA and Registrar profiles are separate.
- Switching programs resets the editors and prepared downloads, including when form numbers match. Opted-in common details remain available only within their own collection during this visit. Program choice is remembered across site navigation in the same tab.
- The backend includes all reviewed PDFs, source DOCX copies, field maps and licensed entry fonts. Railway's backend-only deployment does not need access to the separate frontend directory or LibreOffice. Install the updated `backend/requirements.txt` and run migrations. Migration 0026 adds the owner-selected Form 027 to the BSCA collection without changing existing document records. Deploy frontend and backend together for the new action to appear.

## Updating a form

1. Keep the supplied source unchanged. Replace both the public Word file and its backend `originals/` copy when the department provides a new version.
2. Render the new DOCX to PDF and inspect every page. Replace the corresponding checked PDF, map each intended blank again and update both SHA-256 values in the catalog.
3. Use representative filled values and long entries. Render all filled pages and compare against the baseline, including pixels outside the mapped blanks. Check page geometry, page count, embedded fonts, text extraction and signature/assessment areas.
4. Run the backend form tests and frontend checks. Never reuse a previous coordinate map without checking the new template. Restart after catalog changes because the immutable catalog is cached per worker.

An integrity mismatch disables online filling for that template. The original Word download remains available. In a combined checkout, the public Word file is checked too, preventing a changed frontend template from silently receiving an old field map. In separate deployments, keep the frontend and backend template revisions in the same release.

## Printed names and connected thesis steps

All 32 supported BSCA, MSCA and Registrar forms use the same editor. Existing printed-name blanks now accept signatory names, including department chairperson, research instructor/adviser, dean, graduate coordinators, panel members and other roles actually present in each original. Department chairperson, research instructor/adviser and dean names are centered horizontally within their mapped printed blanks. Corresponding recommending-adviser blanks also center the repeated name without changing the inline adviser detail. Other entries keep their existing alignment. No new roles or blanks are inserted into a source form. Names repeat in corresponding printed-name blanks where the original repeats the role. Signatures, signing dates and approval decisions remain manual. Registrar Form 003 has no matching official name blank.

The thesis guide exposes this editor directly within the applicable step when the public program API confirms an exact selected original. Resource forms link back to the relevant thesis step. Legacy MSCA CCS Forms 13/14 remain available in resources; the guide still requests the current MSCA submission form from the coordinator instead of treating the older supplied Form 14 as current.

Fields are grouped into form details and optional signatory names, followed by review/print instructions. Controls have visible labels, keyboard focus and touch-sized targets. Errors are announced and offer buttons to focus the affected field; loading failures can be retried directly. Ready PDFs receive focus and offer both review and download. All fields are optional; at least one entry is needed to prepare a filled PDF. Accessibility checks cover keyboard interaction, labels, mobile layout and enlarged text; they do not certify universal accessibility.

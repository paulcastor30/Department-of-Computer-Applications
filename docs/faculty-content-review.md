# Faculty content review — 5 October 2026

The current website structure is ready for maintaining faculty profiles through Django admin. The updated spreadsheet supplies 11 core faculty and two lecturers. All 13 institutional email addresses were verified through Gmail message headers during the authorized import. No private message bodies were published.

## Department confirmations still needed

- Confirm current ranks and appointments; retain existing service/leave status until explicitly corrected. Apple Rose Alce's live profile currently records study leave, which was preserved during import.
- Confirm completion status for Maria Fe Bahinting's two doctoral study records, Jerry Halibas's doctoral study, and Phoebe Ruth Alithea Sudaria's doctoral study. A missing year must not be treated as completion or ongoing study.
- Ernesto E. Empig: resolved by the supplied Special Order No. 00181-IIT, Series of 2026 (effective 13 February 2026) and owner confirmation of MSCA affiliation. He belongs under Transferred faculty and Affiliated graduate faculty, with SIS as his home unit, rather than Core faculty. One profile is retained.
- Review the eight existing affiliated graduate faculty and seven retired faculty, who are outside the updated spreadsheet. Do not remove them solely because the spreadsheet covers core faculty and lecturers.
- Confirm faculty office locations and consultation arrangements before publishing scheduled hours or an appointment policy.

## Official portraits

No individual portraits are currently available in the project or live directory. The existing faculty-media image is a college logo. Obtain approved individual photographs, then upload each through People → Faculty members → Photo. Use consistent square crops that retain the face and shoulders; a 600-pixel square is a practical delivery size. The portrait is optional: avoid substituting logos, unrelated images or invented faces.

## Education maintenance

Use the existing Education records in admin. Record completion years only when confirmed. Mark ongoing study explicitly in Notes. For unresolved entries retain “Completion status to be validated by the Department.” The website groups completed, ongoing and unconfirmed records separately. Update Highest degree to the highest completed qualification rather than a degree in progress.

## Selected professional work

Use existing published Publications, Research projects, Supervised works and other professional records. Add only verified titles, venues/years, roles and reliable public links; check which faculty member the record belongs to. Empty public sections remain hidden. The website's record counts are not a complete measure of someone's career and are not displayed as achievement totals.

## Contact guidance

The profile now explains how to request a consultation by email and asks visitors to confirm availability and meeting location. It supports enquiries about accessible meeting arrangements without promising unconfirmed services. Office hours and mandatory appointment requirements remain unasserted.

## Publishing and verification

The original faculty update is already live on Vercel and Railway. A read-only check of all 29 published profile endpoints returned success; 13 have institutional email addresses, and none currently contain published publication, research-project or extension-project records. The follow-up refinements are local until deployed. They do not change Django's schema or require a new migration. Existing roster records, photographs, professional records and profile URLs remain preserved. Check faculty search, degree-status headings, institutional mail links, full-name breadcrumbs, narrow-screen reflow and available professional records after publishing the follow-up.

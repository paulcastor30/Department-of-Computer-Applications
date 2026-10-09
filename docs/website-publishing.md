# Website publishing and remaining source material

The initial public routes are Home, About/college purpose, Programs, Faculty, Research, Community work, News, Admissions, Contact/Location, Resources and website-accessibility help. Unfinished legacy pages remain reachable through saved URLs but are not promoted in search, About or the footer.

## Updating public content

- Edit the department introduction and contact information in Django admin under Department profiles and Site settings. The college vision and mission must not be presented as separately approved department statements.
- Edit admissions URLs, requirements, thesis guidance, public documents and review dates under Programs. Link to the university authority for current procedures; do not copy unconfirmed deadlines or thresholds.
- Publish dated News posts when a verified announcement is available. Publication dates and activity dates are different; put the activity date/time/location in the announcement body.
- Keep faculty qualifications, appointments and contacts verified before publication. Preserve source notes and distinguish completed from ongoing study.
- Public page sharing metadata is generated at frontend build time. A frontend redeployment is required after editing program sharing metadata in Django. Builds use public CMS metadata when reachable and approved reference wording otherwise.
- Review keyboard navigation, 320-pixel reflow, document links and the complete visitor journey before publishing changes. Essential information should also be readable on the website when a PDF is difficult to use.

## Department confirmation still needed

1. Additional verified work examples and approved photographs. The research and community pages now show dated examples from official MSU-IIT reports: VermiSense (28 September 2026 report) and my.ComApps (24 May 2024 report). These are editable News posts with official source links; existing editor changes are preserved by the migration.
2. Maintain form availability and filling instructions according to docs/bsca-form-filling.md, and thesis requirements according to docs/thesis-process-guide.md. BSCA Form 027 is available as an additional supplied template; its graduate wording does not establish BSCA applicability. Retain the relevant version and applicability notices.
3. Named learning-support office/contact, available assistance and the actual request process.
4. MSCA graduate-track classification under the revised university publication policy.
5. A person responsible for updates and a practical review schedule. These have not been assigned by the website changes.

No research output, support service, staff appointment or announcement should be invented to fill an empty section.

## MSCA college references

MSCA links the CCS graduate application/admission guide, the college Resources page (Graduate Framework, Thesis Guide and forms), and the graduate coordinator Contact page. These are editable Program documents; HANDBOOK links appear beside thesis guidance and CONTACT links beside program enquiries. The confirmed coordinator email is stored in MSCA contact information and used for its enquiry button. Learning-support enquiries retain the department route; this graduate contact does not establish accommodation services. Keep local blank forms available, but use college guidance to identify the applicable version and procedure.

## Department research reporting list

Research projects are edited under Research projects in Django admin and published through `/api/research/projects/`. The owner supplied 15 entries on 6 October 2026, with reporting years from 2022 to 2027. Reporting years are not status or start/end dates. Fourteen are internally funded and ZCharMC is externally funded; no funding agency, amount, outcome or publication was inferred. Continuation-row names are grouped as additional research team members because the pasted table does not preserve reliable employment-role columns. The duplicate Apple Rose B. Alce entry in the prototypes project was removed; other supplied spellings are preserved, including zero characters in ZCharMC initials pending confirmation. Publication is independent of faculty employment status. Re-running the import preserves editor changes and unpublished records.

## Conference records

The owner supplied 45 records for 2022–2026 on 6 October 2026. Manage them under Conference records in Django admin. The research landing page previews three non-withdrawn entries; `/research/conferences` lists all published records with a year filter. Preserve the supplied author order and explicit Withdrawn flags (two ICITCOM entries). Repeat titles at different conferences are separate records. Neither past dates nor inclusion confirm completed presentation, acceptance or publication. Future conference dates are included neutrally. Athens, Greece was confirmed by the owner; obvious spacing and trailing punctuation were cleaned. Further author-name corrections, proceedings URLs, DOIs and presentation status require department evidence. The migration preserves editor changes and hidden records.


### Publications

The research publications list is managed in Django under **Publication records**. The initial import contains 29 department-supplied entries (28 DOI records and one AIS proceedings record without a DOI). Keep complete publisher author order, distinguish journal articles, conference papers and preprints, and preserve publication date precision. Use first online year when confirmed; otherwise use citation year. A proceedings event date is not necessarily the paper's online publication date. Do not infer dates from DOI suffixes. Internal `source_note` is not exposed by the public API.

The import is idempotent and preserves existing departmental edits and visibility settings. Verification and important corrections are recorded in `docs/publication-review.md`. Full texts are linked through publisher records rather than redistributed.

### Extension projects

13 department-supplied extension records (2023–2026) are editable in Django under **Extension projects** and appear at `/extension`. Reporting years do not establish completion or current availability. Participant groups retain the categories supplied for each record; they must not overwrite faculty profile appointments. Missing groups are omitted rather than inferred. Repeated initiatives in different reporting years remain separate, and the Sikyop assessment and system records remain distinct. The data migration preserves existing departmental edits and visibility.

Formatting cleanup: honorifics and extra line breaks were removed, `loT` was corrected to `IoT`, and `Apple Rose B. Alee` was corrected to `Apple Rose B. Alce` against the faculty roster. Other source name variants remain as supplied, including Maria Fe B. Bahinting in the 2025 myComApps record, Liezil/Liezel variants, Phoebe's differing surnames, and research-assistant name spellings. These should be confirmed by the department before standardizing them. No dates, outcomes, funding or beneficiary counts were inferred.

### Projects and prototypes

The 22 department-supplied Hackster project entries (2 for reporting year 2026 and 20 for 2025) are editable under **Project prototypes** and listed at `/projects`, with links from What we do, Research and site search. This showcase does not assert formal university recognition as creative works, research publication, original invention, completion status or current availability. Summaries describe the supplied titles and source descriptions without performance claims. Creator credits are included only where public Hackster pages explicitly identify them; other entries refer visitors to the original credits. The Department confirmed that all 22 uploaded projects and prototypes are BSCA student outputs. The showcase, navigation and sharing descriptions identify them accordingly. Individual adviser roles and course or thesis requirements are not inferred from co-credit. No photographs, code or full project text are redistributed.

All source URLs omit query parameters. The SNAKE OS clean public URL was confirmed through its public Hackster record. Hackster blocked direct automated HTTP checks with 403 responses for the collection; available browser/search records confirmed selected descriptions and credits. Other URLs are preserved from the department-supplied list without claiming independent access verification. The data migration preserves later departmental edits and publication settings.

### Allied and resigned faculty update

The department-supplied allied table updates the nine existing graduate-affiliated identities under **Allied faculty**, with home units, specializations and structured qualifications. Preserve existing URLs, photos, emails and research records. Ernesto Empig remains transferred to SIS and affiliated with MSCA; the older DCA home-unit entry does not reverse his confirmed transfer. Fellowships and internships are academic experience, not additional awarded degrees. Missing completion years remain unspecified. PRC numbers are displayed as supplied, not as confirmation of current license validity. `N/A` is left blank rather than interpreted as proof of no license. Drive personnel folders are not promoted as public profile links.

The owner confirmed Joel I. Miano is the intended identity and instructed retaining that name. He is grouped under **Resigned faculty**, with active affiliation disabled. No resignation date or reason is inferred; historical project/publication credits remain unchanged.


### Shared faculty contributions

Faculty profiles display confirmed credit links to the shared Research projects, Publications, Conference records and Extension projects. Titles, years, withdrawal flags and source URLs come from the original records, so corrections and publishing changes appear on profiles without copying content. Editors manage **Faculty contributions** in Django admin: select the faculty, exactly one source record and an evidence-supported role. New records require credit links; changes to an author or team list require reviewing these links. Hiding either a credit or its source removes it from public profiles. Credits remain when faculty transfer, resign or retire.

The initial import matches unique full given-name-and-surname identities, ignoring honorifics and middle initials and normalizing Ma. to Maria. It never matches by surname alone or guesses abbreviated given names, changed surnames, presenter roles or student-project advisers. Ambiguous or unmatched identities need departmental review before linking. Existing individual records remain available, with exact title/DOI duplicates suppressed in the profile display. Each category previews three shared records and offers an accessible disclosure for the rest.


The research landing page introduces the department’s documented work and previews three project records from the latest reporting years. The complete list at `/research/projects` offers a reporting-year filter; previews are not a ranking or a claim of current project status. Faculty research credit links point to individual anchors on the complete list. Saved `/research#project-slug` links redirect to the same project in the complete list once records load.

# Department website review

Updated 5 October 2026. The latest refinements are local; this task has not deployed them to Vercel.

## Public purpose and design

The site introduces the official Department of Computer Applications, College of Computer Studies, MSU-Iligan Institute of Technology. It welcomes people seeking information about its people, teaching, research, community work, dates, location, purpose, and ways to connect.

The homepage opens with the official department identity, a concise study introduction, and two clear actions: Explore programs and Contact us. The header retains the official college logo. At the owner’s request, a black photograph placeholder now balances the desktop introduction and follows the main actions on mobile; its caption identifies it as a photograph still to be added. Navy and teal colours, visible links, readable text, and consistent spacing keep the experience approachable. The main menu and footer remain available throughout the site.

The homepage now follows the introduction with Django-backed degree programs, a compact department overview and people/work links, announcements, and visiting/contact assistance. The six public questions continue to inform the information structure and remain searchable, without six competing cards at the top or repeated teaching sections. “What” now opens a dedicated explanation of the department's work instead of a degree-only page. The new /our-work page provides degree facts and thesis requirements, explains the categories of research and community work in ordinary language, and offers a direct enquiry route.

Contact options open email with a useful subject for study/application questions, research/community enquiries, or visits/access assistance. The address is also available to copy. News explains the distinction between an announcement's publication date and an actual activity date; visitors can find application and visiting help directly.

## Accessibility and content integrity

Keyboard navigation, skip links, visible focus, route-heading focus, hash destinations, descriptive links, generous targets, responsive layouts, and reduced-motion support are preserved. Search now understands the full wording of the six public questions. Missing information is marked “To be provided by the Department”. Program facts remain sourced from the existing Django architecture and approved fallback facts.

Read-only checks of the public Railway API found keyboard test text in the department overview, mission, vision, and goals; empty site settings; and no published news posts. The frontend now suppresses the known repeated keyboard-test values in department profile fields, retains meaningful CMS text, and displays known department identity or missing-content messages instead. The live database was not edited.

The site retains its existing official college logo. No unverified laboratory or department photographs were introduced. Published news may display its uploaded cover image; cover images are decorative and the article title, summary, dates, and full text must carry the essential information. Images load lazily, reserve their dimensions, and disappear if they fail to load. An actual department photograph can be added once its subject, permission, and appropriate alternative text are confirmed.

## Discoverability

Page titles identify Computer Applications and MSU-IIT. Descriptions, canonical page URLs, and social metadata are maintained as visitors change pages. The previously missing social-preview logo is now a real public asset. A sitemap lists the main public pages and is linked from robots.txt. Individual published faculty and news pages remain discoverable through links on their indexes; the static sitemap does not automatically enumerate CMS records. Metadata and sitemap URLs use the existing msuiit-comapps.vercel.app domain and should be updated if the production domain changes.

## Verification

- Twenty frontend tests passed, including the homepage program/contact routes and content order, natural-language search, menu dismissal, route and section focus, CMS contact and article responses, direct enquiry subjects, publication-date labelling, cover-image rendering, retry/contact actions, curriculum downloads, stable degree routes, and handling known CMS test text.
- Production build and TypeScript checks passed.
- ESLint passed with two existing Fast Refresh warnings in button.tsx and sonner.tsx.
- Browser axe-core checks reported zero violations or incomplete findings across Home, Our work, About, News, Contact, and Location at 320, 390, and 1280 pixels. Each tested page had one main heading and no page-wide horizontal overflow. Mission/vision/goals was also checked after the test-text fix.
- The homepage was rechecked with doubled text. Manual browser checks verified skip-link visibility and destination, the mobile menu's Escape/focus behaviour, the What link's destination and heading focus, and the Why section's hash focus.
- The revised preview was also exercised against the real public Railway API using a temporary local development proxy. That proxy is not included in the project changes. Known identity and missing-content messages rendered correctly after the test-text fix. No browser JavaScript errors were reported.
- Django check and backend tests were attempted but could not start because Django is absent from the local Python environment. No backend models or migrations changed.

Automated checks do not establish full WCAG conformance. Testing with screen readers and people with disabilities remains necessary, particularly for future photographs, videos, documents, and forms.

## Official content still needed

1. The user-supplied BSCA deck now provides the basis for the introductory fallback copy. Replace the test department overview in Django admin with this reviewed text so it is maintained centrally. No separate university-approved department mission and vision are available; the user-supplied CCS statements are now displayed and explicitly attributed to the college.
2. The owner supplied the department address, phone with local 4112, email, and Monday–Friday 8 AM–5 PM hours. Shared frontend reference details and Home/Contact/Location now show them; populate Django site settings to maintain the address, email, and phone centrally.
3. Publish application steps, requirements, fees, deadlines, curriculum files, and advising information.
4. Regular office hours and the first-floor building location are now supplied. Confirm closure exceptions and accessible routes, entrances, toilets, parking, and assistance arrangements.
5. Publish news and event announcements with actual dates, times, location, and participation instructions in readable text.
6. Supply approved research and community examples, projects, partnerships, facilities, and accreditation records.
7. Provide authentic photographs with permission and appropriate captions/alternative text.

After deployment, verify shared-link previews, sitemap availability, email/map/document actions, and the live program, people, news, purpose, and visiting journeys. Invite first-time visitors and people using assistive technology to try those tasks.


## College vision and mission

The website owner supplied the College of Computer Studies vision, mission, and four commitments. Their wording is preserved in one shared content source and displayed in the About page's purpose section and the existing /about/vmgo page. The page, search label, breadcrumb, and homepage college vision-and-mission link now explicitly refer to the college. The supplied statements are not stored in the department's mission/vision API fields, and the absence of separate university-approved department statements is explained.

The “Center of Excellence” wording is reproduced as part of the college's vision statement; this change adds no current accreditation or designation claim. Phone and desktop accessibility scans reported no violations or incomplete findings, and the page has one main heading without horizontal overflow at 320 pixels. Twenty frontend tests passed; build, type check, and lint also passed with the existing two warnings. No backend code changed. These changes remain local and require deployment.


## Latest homepage refinement

The homepage review found excessive emphasis on the question directory, repeated destinations, and generic teaching/research/community definitions. These were replaced with the simpler hierarchy described above. BSCA and MSCA cards now use the existing usePrograms/normalizePrograms flow instead of a separate static degree array. Known identity remains available while data loads or fails, and news failure does not block navigation. Existing placeholder campus/laboratory imagery was not treated as authentic department photography.

Twenty frontend tests, the production build, TypeScript, and lint passed (the same two existing warnings). The homepage was visually reviewed at 1440 and 320 pixels against the public Railway backend through a temporary preview-only proxy. Automated axe-core checks reported zero violations and zero incomplete findings at both widths. Mobile width was 320 pixels with no horizontal overflow and one main heading; keyboard checks verified the visible skip link and main-content focus. No browser runtime errors were reported. Django check and tests remain unavailable because the local Python environment has no Django installed. No backend code or models were changed.


## Homepage finality assessment

The homepage structure is suitable to retain as the final layout: identity and main actions, degree programs, department/people/work links, announcements, and visiting assistance. A black photograph placeholder replaces the duplicated large college logo in the opening, as requested by the owner. It is an interim design element, not finished public content. Use one approved photograph of actual department people, teaching, or activity with an appropriate caption and alternative text.

The page is not yet content-complete: the owner has now supplied an introduction source, office location, and regular hours. Access arrangements, current program/application information, and authentic imagery remain outstanding. No announcements is a valid empty state, but the available state currently indicates official information has yet to be supplied. Before declaring the public page final, verify the deployed links and seek task-based feedback from first-time visitors and people using assistive technology. Automated checks alone do not establish usability or full WCAG conformance.

After the placeholder change, twenty tests, build, type check, and lint passed with the same two existing warnings. Browser checks at 1440 and 320 pixels found no automated accessibility violations or incomplete findings, no horizontal overflow at 320 pixels, and no runtime errors. These findings supplement the previously recorded backend-check limitation; no backend changes were needed.


## Presentation-based introduction and contact details

The owner supplied “BS of Computer Applications.pptx”, dated 12 August 2026, and requested it as the basis for the department introduction. Slides 5–6 describe Computer Applications as connecting computing with the physical world and describe BSCA as integrating software, firmware, and hardware for embedded, connected, and intelligent systems. Shared introductory fallback copy now explains the embedded/connected focus in ordinary language, defines firmware and embedded systems, and explicitly attributes BSCA-specific content to BSCA. This evidence was not generalized into unprovided MSCA outcomes. Accreditation and comparison claims were not added in this change. The original presentation was read without changes.

The owner confirmed: 1st floor, College of Computer Studies, Mindanao State University-Iligan Institute of Technology, Andres Bonifacio Avenue, Tibanga, 9200 Iligan City, Philippines; +63 221 2002 local 4112; ccs.ca@g.msuiit.edu.ph; Monday–Friday, 8 AM–5 PM. The number is displayed as provided, with the extension separate in the shared source. No automatic dial sequence or extra digits were inferred. Hours are represented as the owner-supplied department schedule, not inferred from a universal government-university rule.

Home shows the full office address, hours, email, and telephone. Contact and Location use matching fallback information, retaining Django site settings when populated. Department introductory content remains editable through the existing DepartmentProfile API, with this supplied copy used when the existing value is missing or known test text. No live database content was modified. A first-floor location is not treated as proof of step-free access.

Remaining homepage content: the genuine photograph replacing the black box; current admissions steps, application dates and program details; selected verified project/community examples; office room and campus entry/access directions; closure exceptions; and usability feedback from first-time visitors and assistive-technology users. A BSCA presentation alone does not fully establish the department’s current research, extension, or MSCA scope.

Verification: 20 tests, build, type check, and lint passed (two existing warnings). Home at 1440 and 320 pixels and About/Contact/Location at 320 pixels reported zero automated accessibility violations or incomplete findings. The supplied fallback text and contact data rendered against the public Railway backend; no browser runtime errors or horizontal overflow on the checked mobile Home/Contact views were found. Django check and tests could not run because Django is absent from the local Python environment. No models or migrations changed.


## Scoped opening and visit-planning refinement

At the owner’s request, other missing information and the black photo placeholder were left for later. The opening now explains the subject directly: “Computer Applications brings software and electronic devices together to solve real-world problems.” The layout and program content flow are unchanged.

Home, Contact, and the website-help page link directly to /about/location#access. The Location page provides a short visit-planning sequence: give the visit date/time, ask for a suitable entrance/route/office room and any assistance, then confirm arrangements before travelling. It includes the existing confirmed address, office hours, email, and telephone. The map is described as a campus-location aid, not evidence of a suitable access route. The email action uses a visit/access-assistance subject and does not send a message automatically. Visitors can describe their needs without medical information.

The guidance is ready to use, but no physical-access claim was invented. Step-free routes, entrances, toilets, parking/drop-off, and office-room directions remain to be provided by the Department. A first-floor address does not establish a route without stairs. The earlier website-help reference to removed homepage question cards was corrected.

Verification: all 20 existing frontend tests, production build, TypeScript, and lint passed with the same two pre-existing warnings. Browser review confirmed Home’s link opens #access and focuses that section, with the email directed to the supplied department address. Automated accessibility scans found zero violations/incomplete findings for Home at desktop/mobile width, and Location/Contact at mobile width; Location reflowed without horizontal overflow at 320 pixels. No browser runtime errors were observed. Django checks/tests still cannot run because Django is absent from the local Python environment. No backend or model changes were needed.


## Approved final visiting wording

The owner approved the final “Directions to the department and access assistance” text. It now replaces the longer visit-planning checklist on Location. It gives the complete department address, identifies ICTC on the second floor as a landmark, states weekday office hours and contacts, and asks visitors to confirm access arrangements before travelling. It does not rely on the uploaded map being present on the website and does not claim unverified step-free facilities.

Home, Contact, and Using this website now label their direct #access link “Directions and access assistance.” Shared summary text matches the approved wording. Existing Django site settings remain authoritative when populated; otherwise the owner-supplied details render. The photograph placeholder and other deferred content are unchanged.

All 20 tests, build, type checks, and lint passed (the same two existing warnings). Browser checks verified the final text, #access focus, and contact links against the public backend. Accessibility scans at 1280 and 320 pixels reported zero violations/incomplete findings; the 320-pixel view had no horizontal overflow or browser runtime errors. Backend checks/tests still cannot start because Django is absent locally. Changes are local and not deployed by this task.


## Confirmed building entrance-to-office route

The owner clarified that the CCS entrance has stairs and an alternative ramp. Visitors can use the ramp to enter the first floor and continue to the Department of Computer Applications office without using stairs. The shared visiting summary now describes that entrance-to-office route, appearing on Home, Contact, and Location. The general statement that step-free access remains unconfirmed has been replaced. The ramp’s position relative to the stairs, dimensions, accessible toilets, and drop-off locations were not inferred. Toilet and suitable drop-off locations remain to be provided by the Department. This confirms the described building route, not compliance with an accessibility standard or a detailed route from a named campus gate.


## Supplied toilet and drop-off locations

The owner confirmed a permitted drop-off point between CSM and CCS, with a ramp from there into CCS. The guide now describes that location and the entrance route. The owner also supplied the women’s toilet location on the first floor near the Dean’s Office after the ramp, and the men’s toilet on the second floor above the Dean’s Office. These appear under Toilet locations. Toilet accessibility features remain to be validated; no elevator-to-toilet route, fixture specification, or wheelchair suitability was inferred. The old message asking for toilet/drop-off locations was removed.


## Toilet-location correction

The owner clarified that after the entrance ramp, stairs lead to the men’s toilet on the second floor next to the Dean’s Office. That description replaces the earlier “above the first-floor Dean’s Office” wording. The women’s toilet remains described as first floor after the ramp; its earlier Dean’s Office landmark was removed to avoid contradictory directions. The described route to the men’s toilet uses stairs and is not represented as step-free. No elevator-to-toilet route has been confirmed.


## Owner-supplied homepage banner

The owner supplied department-home.png (11938 × 4500 pixels, about 10 MB). It is a wide institutional graphic with the college/university logos, department name, and email, rather than a photograph. It now replaces the homepage black box and placeholder caption. The graphic is shown at its natural aspect ratio without cropping text or logos. Its text is duplicated by the accessible HTML department identity and contact details, so the image has empty alternative text to avoid repetition. A 1600-pixel web copy is used for delivery; the original remains unchanged.


## Academic programs refinement — 5 October 2026

Reworked /programs, /programs/bsca, and /programs/msca into restrained, accessible student-facing pages. The overview offers two clearly labelled degree choices. Detail pages prioritize the introduction, degree level, thesis requirement, learning areas when available, preparation before applying, actual documents, and a program-specific email enquiry. Removed the repeated empty comparison/quality panels and unavailable download controls. Full learning outcomes remain available through a native keyboard-operated disclosure. Published curriculum files remain linked even when placeholder document records exist.

BSCA reference content comes from the owner-supplied BS of Computer Applications.pptx: slides 5–6 (software, firmware, and hardware integration), 9 (nine program learning outcomes), and 14 (learning progression). Learning areas are explicitly an overview, not an official course catalog. No accreditation, employment, admissions, duration, unit, or thesis-policy claims were inferred. MSCA retains confirmed identity and thesis terminology; missing introduction, learning/research areas, and outcomes remain unpublished as substantive claims.

The existing Django models/admin/API remain authoritative. Migration 0007 fills only blank or “To be provided by the Department” BSCA fields and preserves editor content and publication status; it runs through the existing Railway migration startup. Matching frontend reference content provides a readable fallback when the API is unavailable or still contains placeholders. Both degree pages continue rendering current CMS content and real public documents. No live database or deployment was changed.

Validation: 25 frontend tests, TypeScript, production build, and lint passed (two existing fast-refresh warnings). Installed backend dependencies in an isolated temporary environment: Django checks, both backend regression tests, and migration consistency checks passed; all migrations applied successfully to a temporary SQLite database. Verified the API serves nine BSCA outcomes and the supplied introduction. Browser checks covered desktop/mobile layouts, degree links, keyboard expansion of outcomes, and automated WCAG scans with zero reported violations. These automated checks are not a certification of accessibility.

Still needed from the department: current curricula and program documents; MSCA description, study/research areas and outcomes; duration/required units; official admissions requirements, fees and dates; detailed thesis/advising procedures. Layout is ready for these additions through Django admin; academic information is not yet complete for independent application decisions.


## Owner-confirmed MSCA introduction

The owner clarified that MSCA is advanced study under the same Computer Applications umbrella as BSCA. The MSCA overview now explains that relationship and the field's bridge between computing and the physical world. This is not presented as an admission rule or an automatic progression route. The introduction is available in the frontend reference and Django migration 0008, which fills only blank/placeholder overview and formal-description fields while preserving department edits. Specific MSCA learning/research areas, outcomes, curricula and admissions details still require official information.


## Supplied curricula: study summaries and pending downloads

Refined /programs to explain the shared software–firmware–hardware field and the difference between bachelor's and master's study in plain language. MSCA now includes curriculum-supported specialization areas (embedded systems, IoT/security, machine learning/computer vision, cloud/IoT analytics), a core-to-specialization-to-research progression, and three summarized outcomes from Form 11. The learning sections identify their supplied revision basis. Proposed four-year BSCA and two-year MSCA sequences are qualified; exact unit totals and current applicability remain To be validated by the Department. Admissions policies, publication requirements, and conflicting totals were not presented as current rules.

Django migration 0009 fills blank/placeholder fields and replaces only the exact previous seeded MSCA introduction, preserving editor-authored content and publication state. Curriculum evidence notes are displayed separately from curriculum structure so a status note cannot become a study topic. Existing public document notes remain visible alongside their links.

Automatic approval review rejected publishing extracts of the supplied internal curriculum-review PDFs or creating public document records because authorization for those specific public extracts was unclear given their approval/unit inconsistencies. No PDF was added to frontend/public, no public document records were added, and nothing was deployed. Two review drafts were prepared only under /private/tmp/dca-curriculum-drafts: a validation cover plus BSCA PDF pages 23–27 and MSCA PDF pages 27–30. Originals were untouched. Public publication remains pending explicit owner approval.

Checks: all 25 frontend tests, four backend tests, Django system and migration checks, TypeScript and production build passed. Lint has two existing fast-refresh warnings. Migrations succeeded against the temporary SQLite database. Browser/API verification covered MSCA content, keyboard-operated outcomes, 320-pixel reflow on all three academic pages, and desktop MSCA. Automated WCAG scans reported zero violations or incomplete findings; no runtime errors were observed. Draft PDFs were rendered and visually reviewed; course-table pages and original pagination were retained.


## Replacement prospectuses authorized by the owner

The owner supplied bsca-prospectus.pdf and MSCA New Curriculum Prospectus (1).pdf and instructed “Use this instead” in response to the public-download approval question. The original PDFs are now copied unchanged to frontend/public/curricula/bsca-prospectus.pdf and msca-prospectus.pdf; earlier proposed extracts remain outside the project and are not published. Django migration 0010 adds public Curriculum document records for the replacement prospectuses and replaces only prior reference/placeholder duration, unit and evidence fields. Editor-authored values and publication status remain unchanged; rerunning the operation does not duplicate documents.

BSCA's five-page prospectus cites BOR Resolution No. 129, Series of 2018, and totals 147 units excluding NSTP / 153 including six NSTP units. MSCA's four-page prospectus visibly cites BOR Resolution No. 128, Series of 2023 (the added text is not captured by plain PDF text extraction); its plans total 31 units (non-scholar), 34 (ERDT scholarship) and 43 (bridging). Website notes identify these prospectuses, qualify duration as their study sequence, and ask visitors to confirm the applicable plan. Old revision-validation wording is superseded in these fields. The previous automatic approval rejection concerned different proposed extracts; the replacement files were explicitly authorized, and this update was approved.

Both the program overview and detail pages provide descriptive PDF links with page counts. The supplied fallback prospectus remains available while CMS records contain placeholder documents, but a newer public CMS curriculum takes precedence. Original files were rendered and visually reviewed; downloaded local copies match their source hashes. All 27 frontend tests, five backend tests, Django checks, migration checks, TypeScript, production build, and lint passed (two existing fast-refresh warnings). Desktop overview and 320-pixel program details were checked; no horizontal overflow, automated WCAG violations/incomplete findings, or runtime errors were observed. Changes remain local; Vercel must deploy the static PDFs and Railway must apply migration 0010 before production links and records are available.

## Academic-program clarity and support refinement — 5 October 2026

Completed the remaining student-facing refinements except the owner-deferred Before applying section. That section's component markup and existing admissions, thesis, duration and load values were preserved. Study sequence and load are also summarized near the introduction so visitors can understand the commitment early. Added plain-language explanations of units, NSTP, non-scholar/ERDT plans and bridging, plus short prospectus-based completion highlights (BSCA thesis and industry training; MSCA thesis, comprehensive examination and publication). These are summaries rather than replacements for the full prospectuses or university procedures.

Added a clear department enquiry route for subject choices, bridging, study plans and disability-related learning-support questions. This invites visitors to ask about available arrangements without promising unconfirmed services. Consolidated repeated prospectus confirmation notices outside Before applying and displayed a website-summary review date, explicitly identified as a content review rather than university approval.

The new guidance and review date are editable through Django admin and served by the existing programs API. Schema migration 0011 and data migration 0012 preserve department-authored content, admissions fields, publication status and existing review dates. Frontend references match the supplied sources while the API remains authoritative.

Verification: 28 frontend tests and six backend tests passed; Django system and migration-consistency checks, TypeScript, production build and lint completed (two pre-existing fast-refresh warnings). Migrations applied to the isolated temporary database. Browser checks used the API-backed preview, verified the program email address and keyboard section navigation, and found no horizontal overflow at 320 pixels or browser runtime errors. Automated WCAG scans of both degree pages at mobile width and BSCA at desktop width reported zero violations or incomplete findings; this is not accessibility certification. The Before applying component section was compared byte-for-byte against its previous version. Changes remain local; deployment was not performed.


## Faculty directory and profiles — 5 October 2026

Used the owner-supplied updated 2026 faculty workbook: 11 core faculty and two lecturers, with rank, stated highest completed qualification, education institutions/years and specialization. Gmail connector message headers provided matching institutional addresses for all 13; no private message content, unrelated contacts or full workbook were added to public assets. Doctoral study explicitly marked ongoing is identified as uncompleted; entries with “---” completion dates carry a departmental-validation note. The source does not establish study-leave status, appointment to leadership, office hours or publication totals, and these were not invented.

The directory now uses a single labelled name/specialization search, separate faculty/lecturer groups, distinct profile/email links, result announcements, clear-search control and retry guidance. Removed the empty metric counters and administrative filter overload. Individual profiles show available education, expertise and professional records, hide empty sections/navigation and absent portrait blocks, and include the supplied-data review note. Existing photos, profile slugs, publication status, service classifications and additional professional records remain preserved during import. Existing professional sections continue rendering when populated.

Django data migration people.0004 imports the supplied updates and education records without duplicating records on rerun; the existing admin and API remain the publishing system. There is no frontend-only faculty dataset. The academic-program files and content were left unchanged.

Verification: 29 frontend tests and eight backend tests passed. TypeScript, production build, Django checks and migration consistency checks passed; lint has the two existing fast-refresh warnings. All migrations applied to a temporary database. Regression tests cover import idempotence, existing profile links/photos/publications, uncertain degree status, unpublished API records, lecturer grouping and search/email behavior. Browser review covered desktop and 320-pixel directory/profile layouts against the actual API, search and mailto links, ongoing-degree notes and available-only sections; no runtime errors or horizontal overflow were found. Automated WCAG scans reported zero violations/incomplete findings on mobile directory/profile and desktop profile. These checks are not accessibility certification. Changes are local; Vercel/Railway deployment was not performed.


## Faculty follow-up: verification and contact guidance

Confirmed the previous faculty import is already live. The live directory contains 29 records: the 13 supplied profiles plus existing core, affiliated and retired records. Verified all 29 public profile endpoints respond successfully; 13 have email addresses, and none currently has published publication/research/extension records. Requested owner confirmation before changing the additional roster or uncertain degree/appointment facts. No unsupported record removals, degree completion dates, appointment hours or individual portraits were introduced. The project and live directory currently have no individual faculty portraits.

Refined profile education into completed qualifications, ongoing study and records awaiting confirmation, using supplied years and notes. Retired directory classification now takes precedence over a generic Active status in the public profile display; database facts remain unchanged. Existing non-active statuses such as study leave are visible on directory cards. Added consultation-request guidance, a faculty-specific email subject, accessible-meeting enquiries and department visiting links. Breadcrumbs now use the actual faculty name from the cached profile API. Existing professional records remain available; absent sections stay hidden. Department confirmations and photo/admin maintenance instructions are recorded in docs/faculty-content-review.md.

Validation: 31 frontend tests, TypeScript, production build and lint passed, with the same two existing lint warnings. New tests cover education grouping, retired status display and consultation links without invented hours. API-backed browser checks confirmed full-name navigation, contact guidance and ongoing study, zero horizontal overflow at 320 pixels and no automated WCAG violations/incomplete findings or runtime errors. No backend model change was needed; academic-program content was not changed. The follow-up is local and has not been deployed.


## Prof. Ernesto E. Empig: transfer and continued graduate affiliation

Reviewed the owner-supplied Special Order No. 00181-IIT, Series of 2026, dated 13 February 2026, visually and by text extraction. It transfers Prof. Empig from CCS to SIS effective immediately. Continued MSCA affiliation is based on the owner's separate confirmation; the order itself does not establish that affiliation. The order was used as reference and was not added as a public download.

Added the editable transferred_from_dca flag to the Faculty model, admin and existing directory/detail API. Schema migration people.0005 and data migration people.0006 update the existing Empig profile (or create it if absent), set SIS as home unit, record transfer/order details, and retain graduate affiliation. Existing profile URLs, email, photos, publications, publication state and other records are preserved. The data update is idempotent and rejects ambiguous multiple Empig profiles instead of silently choosing one.

The public directory adds Transferred faculty and displays the same Empig profile there and under Affiliated graduate faculty; transferred records are excluded from core/lecturer groups. The result count remains based on unique profiles. Cards explain transfer destination and continued graduate affiliation, while the profile shows the transfer relationship and assignment note. No specific MSCA instruction/advising role or academic rank was inferred from the transfer order. Academic programs remain unchanged.

Checks: 32 frontend tests and nine backend tests pass, along with TypeScript, production build, Django checks and migration consistency. Lint reports the same two existing fast-refresh warnings. Both migrations applied to a temporary database; tests verify one preserved profile, transfer metadata, retained academic records and API fields, dual group membership and unique result count. Mobile browser review verified both links use the same profile, Empig is absent from Core faculty, and the transfer note/home unit/supporting program appear on his profile; no horizontal overflow or runtime errors. Automated WCAG scan found no violations or incomplete findings. Changes are local and require frontend deployment plus backend migrations before appearing in production.


## Collien Princess C. Pepito: current appointment clarification

The owner confirmed she has been accepted as faculty, currently serves as Assistant Lecturer, and will receive an updated permanent position once her plantilla item is received. Data migration people.0007 records that distinction in the existing profile assignment note, retains the Lecturer directory grouping and faculty personnel type, and does not assign a future permanent rank or employment classification. Existing profile URL, publication state and professional records remain preserved. The note appears through the existing profile overview and API. Ten backend tests, Django checks, migration checks and temporary database migration passed; regression coverage verifies note idempotence, current title, preserved records and no inferred permanency. No frontend or academic-program changes were needed. This update is local pending deployment/migration.


## Official MSCA application/admission route

The owner supplied https://sites.google.com/g.msuiit.edu.ph/ccsg/applicationadmission as the MSCA admissions authority. Verified that the CCS Graduate page provides eligibility, documents, program acceptance, university admission/registration and subject-enrolment guidance. MSCA Before applying now provides a descriptive direct link and a brief process summary instead of a missing-instructions placeholder; no fees, thresholds or forms were copied into the department website. BSCA admissions remain unchanged.

Added an editable admissions_url to Program, admin, API and frontend normalization. Migrations academics.0013/0014 add the field and fill missing MSCA URL/text while preserving department-written instructions and existing URLs. Matching frontend reference keeps the approved link available during API fallback. All 32 frontend and seven academic backend tests pass, along with TypeScript, production build, Django checks and migration consistency; lint retains the two existing fast-refresh warnings. Changes are local pending frontend deployment and backend migrations.


## Completed BSCA and MSCA admissions routes

Completed both Before applying sections using official admissions sources. BSCA links to the university requirements page (https://www.msuiit.edu.ph/offices/admissions/requirements.php) and the MSU-IIT Admission Portal (https://admission.msuiit.edu.ph/). Its short guidance distinguishes first-year applications from transfer and second-degree enquiries, with selection and available slots governed by university procedures. MSCA retains the owner-supplied CCS Graduate application/admission guide. Unconfirmed SASE cutoffs, GPA thresholds and bridging admission rules were not published.

Added an editable admissions_portal_url alongside admissions_url in the model, admin, API and frontend. Migrations academics.0015/0016 add the field and fill missing BSCA links and placeholder guidance, preserving substantive department-authored instructions, existing URLs and the MSCA route. Both links remain available in frontend fallback content.

Validation: 33 frontend tests and eight academic backend tests passed, along with TypeScript, lint, production build, Django checks and migration consistency. Lint retains two existing fast-refresh warnings. Migrations applied to an isolated temporary database. API-backed browser checks confirmed both programs' correct destinations, no obsolete admissions placeholder, no horizontal overflow at 320 pixels and no runtime errors. Automated WCAG scans found zero violations or incomplete findings on both pages; this is not accessibility certification. Temporary preview servers were stopped. Changes remain local pending frontend deployment and backend migrations.


## Owner-supplied thesis procedure checklist

The owner supplied the proposal/final-defense/bound-manuscript instructions and subsequently confirmed that they apply to both BSCA and MSCA. Added the shared checklist to each program while retaining Undergraduate Thesis and Master’s/Graduate Thesis terminology respectively. It covers Forms 017–024, receipt/scholarship documentation, copy counts, one-week submission deadlines, the A4 research poster, one-month-before-grade-locking defense timing and bound-manuscript certificates. The supplied newer text allows printing the Certificate of Panel Approval; the older image’s instruction to obtain it from OGS was not copied. Form 025, CCS Forms 13–14, CD submission and graduation copy counts remain unconfirmed and were not published. No form files or shortened download URL were added.

Django data migration academics.0017 replaces only missing or exact seeded placeholder guidance, preserves authored instructions and publication state, and is idempotent. The existing thesis field remains editable through admin/API; frontend fallback mirrors the supplied steps. A native expandable checklist keeps program pages concise and keyboard operable. Backend regression verifies both program titles, imported steps, omitted unconfirmed CD requirement and preserved editor content. Nine academic backend tests, Django checks and migration consistency passed. Changes remain local pending deployment.


## Learning-support enquiry refinement

Separated academic advising, disability-related learning support and campus physical access in the shared BSCA/MSCA enquiry component. Added a dedicated learning-support email subject/button using the existing Django site-settings contact with department fallback; explains what to include and how to ask which office handles requests, what is available and how to apply. Students can enquire about the process before sharing medical documents. Added the official university Student Services information link. No assistance, approval process, response time or designated disability coordinator was promised.

Official university sources identify CLASS under the Student Services cluster, but a current accommodation request procedure for these programs was not verified. Requested departmental confirmation of the responsible contact, services and request process; these remain pending. The department address is an initial enquiry route, not a claim that the department approves accommodations. All 33 frontend tests, TypeScript, production build and lint passed (two existing fast-refresh warnings). No model or backend content change was necessary. Changes are local pending deployment.

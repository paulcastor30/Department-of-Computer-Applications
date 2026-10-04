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

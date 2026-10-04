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

1. Replace the test department overview in Django admin with department-approved text. No separate university-approved department mission and vision are available; the user-supplied CCS statements are now displayed and explicitly attributed to the college.
2. Populate site settings with current email, phone, campus office location, and confirmed contact details.
3. Publish application steps, requirements, fees, deadlines, curriculum files, and advising information.
4. Confirm opening hours and accessible routes, entrances, lifts, toilets, parking, and assistance arrangements.
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

The page is not yet content-complete: the approved department overview, accurate office location/hours and access arrangements, and current program/application information still require official content. No announcements is a valid empty state, but the available state currently indicates official information has yet to be supplied. Before declaring the public page final, verify the deployed links and seek task-based feedback from first-time visitors and people using assistive technology. Automated checks alone do not establish usability or full WCAG conformance.

After the placeholder change, twenty tests, build, type check, and lint passed with the same two existing warnings. Browser checks at 1440 and 320 pixels found no automated accessibility violations or incomplete findings, no horizontal overflow at 320 pixels, and no runtime errors. These findings supplement the previously recorded backend-check limitation; no backend changes were needed.

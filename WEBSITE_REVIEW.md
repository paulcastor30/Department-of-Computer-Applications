# Website usability and accessibility review

Reviewed and refined on 5 October 2026. Changes are local and require a Vercel deployment to appear on the public website.

## Purpose and experience

The homepage now directs visitors to six practical questions: Who we are, What you can study, When things happen, Where to find us, Why our work matters, and How to get started. The first screen explains the department, expands the degree names, and offers clear program and contact actions.

The layout uses readable text, restrained navy and teal colours, consistent spacing, and a header that stays in normal page flow. Primary navigation has seven clear choices; secondary information remains available through the footer and related links. Existing page URLs are preserved.

## Findings resolved

- Dense navigation, decorative spacing, and a blocking homepage loading screen made simple tasks harder. The revised layout keeps useful information available while news loads.
- Search now handles extra spaces, deduplicates page links, provides a labelled input and result count, and supports keyboard navigation. Search and mobile menu have visible labels and return focus when closed with Escape.
- Keyboard users have a visible skip link, strong focus indicators, heading focus after navigation, accessible hash destinations, and a keyboard-scrollable comparison table.
- Narrow-screen header overlap was fixed. The homepage was checked at 320, 390, and 1280 pixels; the final 320-pixel layout and doubled homepage text do not cause page-wide horizontal scrolling.
- Improved contrast, heading structure, and reduced-motion support. Removed a nested main landmark from faculty profiles and unsupported ARIA labels from document placeholders.
- News links now open full published CMS articles, with publication dates clearly labelled “Posted”. Publication dates are not represented as event dates.
- Contact and directions use CMS settings where available, explain email and map actions, and identify missing office and access details.
- Removed unsupported static statistics, accreditation claims, laboratory names, partnerships, and application requirements. Missing official content is marked “To be provided by the Department”. Published program, faculty, department, contact, and news records continue to use the existing Django API.
- Program pages show concise fallback information when official details are unavailable. Program links remain valid if an editor changes a CMS slug. A published curriculum PDF is no longer hidden by a placeholder document.
- Added a “Using this website” page with practical keyboard, reading, and assistance guidance.
- Existing Vercel Analytics integration is retained.

## Verification

- Production frontend build: passed.
- TypeScript check: passed.
- ESLint: passed with two existing Fast Refresh warnings in button.tsx and sonner.tsx.
- Ten tests: passed. Coverage includes the six questions, search, menu dismissal, route and section focus, CMS contact information, full news article display, curriculum downloads, and supported program routes.
- Browser accessibility audit: axe-core 4.12.1, WCAG 2 A/AA, 2.1 AA, and 2.2 AA rule tags. All 50 routes scanned at 320 pixels with zero reported violations or incomplete findings in their tested states. Open search and the homepage with doubled text were also checked.
- Manual browser checks: skip-link visibility and destination, mobile menu Escape/focus return, phone and desktop appearance.
- Django check and backend tests: attempted but unavailable because Django is not installed in the local Python environment. No backend models or migrations changed.

The browser preview did not have a live backend. It exercised loading, missing-content, and API-failure states. Frontend tests used clearly separated CMS fixtures for successful contact and article responses. Published faculty profiles, uploaded documents, real event announcements, and the live Vercel/Railway flow still require checking against the deployed backend. These checks do not establish full WCAG conformance or replace testing with people using assistive technology.

## Official information still needed

1. Office building, room, opening hours, current phone number, and visitor arrangements.
2. Confirmed accessible entrances, step-free routes, lifts, toilets, parking, and assistance contact.
3. Application steps, eligibility, fees, deadlines, official curriculum files, and advising information for both degrees.
4. Department mission, vision, and goals where not already published through the CMS.
5. Dated news and event announcements stating the actual event date, time, location, and how to participate.
6. Approved research, community work, facilities, partnerships, and accreditation records.

After deployment, check these pages with a screen reader and keyboard, verify email/map/document links, and invite a few first-time visitors and people with disabilities to try the six homepage tasks. Reference: [W3C WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/).

# Student experience review

Reviewed the homepage, resources, thesis guide, internship guide, admissions, contacts, website help, faculty, program overview, BSCA, MSCA, news, research and community work. The changes focus on reaching a task, finding the correct form, retaining entries when checking instructions, and obtaining a printable PDF.

## Refinements

- Homepage and resources offer direct task shortcuts. Frequently used form tools appear before supplementary documents on resources.
- BSCA/MSCA and Registrar collections can be searched by task or reference number. Each search matches all words and offers an explicit clear/no-results recovery. Hidden results remain mounted so filtering does not discard an open editor.
- Site search includes Registrar services, accepts multiple words and focuses results instead of opening an arbitrary first match. Search and the mobile menu close on page or anchor navigation.
- The shared editor offers keyboard-accessible section jumps, simpler wording, and a compact disclosure for detailed privacy/printing information. Hints remain visible to avoid shifting buttons during pointer interaction.
- Drafts remain in React memory by collection and form ID across internal navigation. Refresh, tab closure or Clear entries removes the applicable draft. Reusing details in different forms remains opt-in. PDFs must be prepared again after returning to a draft.
- Accent/error text and input boundaries have stronger contrast. Existing visible focus, labels, touch targets and reduced-motion styles remain in use.
- Development previews now resolve the uploaded thesis originals, curricula and department identity images before the SPA fallback. Production hosting behavior is unchanged.

## Validation

132 frontend tests and 63 backend tests passed. Frontend type checks, production build and lint passed; lint retains two existing Fast Refresh warnings in button/sonner components.

Browser checks covered desktop, 390-pixel and 320-pixel layouts; task shortcuts; filtering without losing entries; draft restoration between resources and thesis guidance; keyboard section navigation; PDF generation, review and download; correct original Word downloads; direct retry after an unavailable schema; mobile Escape focus; reduced motion and forced colors. Reflow was checked at 640 and 320 CSS pixels, corresponding to 200% and 400% browser zoom from a 1280-pixel viewport. Downloaded PDFs retained names and original page geometry. No horizontal overflow, missing input labels or broken images were found across the 14 reviewed pages at desktop and 320 pixels.

These checks do not constitute an accessibility certification or establish usability for every disability. Moderated task testing with students, including screen-reader users and people with limited technical experience, remains necessary. Supplied documents may still need an alternative accessible format; the assistance route remains available.

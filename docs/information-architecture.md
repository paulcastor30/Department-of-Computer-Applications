# Department information architecture

Home remains `/` and is accessible through the linked department identity/logo. The main menu has seven destinations. This structure preserves all existing routes and the Django-backed program, people, research, extension and communications content flows.

| Main section | Existing destination | Recommended contents |
| --- | --- | --- |
| About | `/about` | Overview; verified history; leadership; organization; approved college vision and mission; facilities; quality assurance |
| Programs | `/programs` | BSCA; MSCA; curriculum; academic focus; Undergraduate Thesis / Master’s Thesis requirements; admissions; careers and further study |
| Faculty & Staff | `/faculty` | Faculty and academic personnel directory; qualifications; specializations; research contributions; academic profiles; contact information |
| Research | `/research` | Focus areas; funded projects; publications; conferences; laboratories; student research; international research collaborations |
| Extension | `/extension` | Community engagement; extension programs; partnerships; technology transfer; documented outcomes |
| Students | `/students/current` | Student resources; thesis and SOJT guides; approved forms; academic assistance; recognized student organizations |
| Contact | `/about/contact` | Department contacts; location; office hours; accessible directions; enquiries; collaboration contacts |

## Supporting pages

Supporting pages are not additional main-menu destinations. Contextual discovery takes priority; the homepage, footer and search provide additional access where the content is ready.

| Supporting page | Stable URL | Discovery pathway | Readiness |
| --- | --- | --- | --- |
| News & Events | `/news` | Homepage, footer, search | Available |
| Admissions | `/admissions` | Programs, homepage application link, footer, search | Available |
| Alumni | `/alumni` | About, student community links, footer, search when ready | Official content pending |
| International Linkages | `/international-linkages` | Research, About, collaboration links, search when ready | Official content pending |
| Accreditation & Quality Assurance | `/accreditation` | About, Programs, homepage, footer, search | Existing program recognition content; no additional status claims |
| Facilities | `/facilities` | About, Programs, Research, homepage, footer, search | Existing rooms and access information |
| Thesis Process Guide | `/thesis-guide` | Students, BSCA/MSCA pages, footer, search | Available; retain the guide’s applicability notes |
| SOJT Process Guide | `/sojt-guide` | Students, BSCA page, footer, search | Available; retain the guide’s verification notes |
| Accessibility Help | `/accessibility` | Footer, Contact, homepage help, search | Available |

## Editorial readiness

Recommended contents are a publishing plan, not claims that every item is complete or approved. Do not fabricate history, leadership, policies, research agendas, partnerships or accreditation. Use “To be provided by the Department” for missing official content and “To be validated by the Department” where confirmation is needed.

The history, chair message, organization, alumni, international-linkages and student-organization routes currently show information-pending pages. Their URLs remain available, but they are not promoted until substantive content is ready. Add their contextual links and search entries when that content has been supplied and validated. Keep college statements attributed to the college.

Existing program pages already provide curriculum, thesis, admission and pathway information through the established API/reference flow. Continue maintaining official program information in Django. No model or route renaming is required for this navigation change.

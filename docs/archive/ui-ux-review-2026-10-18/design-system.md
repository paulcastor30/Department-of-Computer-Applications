# Proposed design system

18 October 2026 · Approved direction; shared foundations and student-services pilot applied locally. The remaining template migrations follow the remediation plan.

## Design intent

Use a restrained institutional style: a clear university identity, a predictable page grid, readable titles, compact task navigation and well-structured academic information. Visual distinction should come from hierarchy and the department's verified content rather than decorative surfaces.

Keep the existing React/Tailwind/CVA/Radix stack. Existing form logic, React Query behavior, routing, publication controls and official content remain intact. The [visual study](direction.html) demonstrates the proposed shell and a flat student-task list using existing task wording. It is a static review artifact, not a functional replacement for the site.

## Tokens

One semantic token source in `index.css`, mapped through `tailwind.config.ts`. During migration, retain existing variable names as aliases so individual pages can move incrementally. Do not add another unlayered override block.

| Role | Proposed value | Use |
| --- | --- | --- |
| `surface` | `#ffffff` | Main page and controls |
| `surface-subtle` | `#f5f7f9` | Restrained grouping and hover backgrounds |
| `text` | `#142138` | Body copy and core information |
| `text-muted` | `#526176` | Supporting text, never disabled essential content |
| `brand` | `#17264b` | Identity, headings, primary actions, footer |
| `link` | `#1b4f98` | Underlined content links |
| `accent` | `#176b6b` | Active navigation detail and limited meaningful labels |
| `border-subtle` | `#d5dde5` | Decorative dividers and nonessential grouping |
| `border-control` | `#7b8899` | Input and essential control boundaries |
| `focus` | `#1559b7` | 3 px outline, 3 px offset on light surfaces |
| `focus-inverse` | `#a5e9f0` | Outline on dark brand surfaces |
| `error` | `#b42318` | Error text/boundary plus an explicit message |
| `success` | `#24643b` | Successful outcomes plus an explicit message |

Validate every actual foreground/background pair, including hover and selected states. Text target: at least 4.5:1 for normal text, 3:1 for large text. Essential controls/graphics: at least 3:1 against adjacent colors. Do not apply a light decorative border as the sole indication of an input. Do not use color alone for status or active state. Color values are presentation choices, not a proposal to alter official marks.

Calculated specimen pairs: body on white 16.10:1; muted text on the subtle surface 5.87:1; link on white 8.02:1; teal on white 6.27:1; control boundary on white 3.61:1; focus on white 6.68:1; inverse focus on brand 10.96:1. These validate the proposed base pairs only, not every combination in the current site.

| Token family | Values |
| --- | --- |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 64 px; 4 px base |
| Inline icon gap | 8 px |
| Label → field | 8 px |
| Title → lead | 12 px |
| Heading → content | 16–24 px |
| Related items | 12–16 px |
| Component internal padding | 16 px mobile / 24 px larger layouts |
| Section separation | 32 px mobile / 48 px desktop; reserve 64 px for major homepage transitions |
| Radius | 4 px small controls, 6 px panels; circles only for genuine avatars/step markers |
| Borders | 1 px, selected controls may use 2 px |
| Elevation | None for ordinary content; one subtle shadow for floating menus/dialogs only |
| Motion | No page entrances, image zoom or moving arrows; optional 100–150 ms color/opacity feedback |

Reduce motion under the existing preference query. Loading indicators may retain meaningful motion with a text status and a reduced-motion presentation. Keep dialog/disclosure feedback functional and brief.

## Typography

Retain Plus Jakarta Sans with system-ui fallback; use 400, 600 and 700 weights as the default set. Verify actual usage before removing additional weights or Merriweather. Prefer locally served, licensed WOFF2 subsets if feasible; otherwise reduce the remote request and use appropriate connection hints. Ensure fonts do not create significant layout shift. The study uses system fonts so it opens without a network dependency; exact font metrics need review in the application pilot.

| Semantic role | Mobile | Desktop ≥1024 px | Weight / line height |
| --- | --- | --- | --- |
| Homepage title | 32 px | 40 px | 600 / 1.2 |
| Interior H1 | 28 px | 36 px | 600 / 1.2 |
| H2 | 24 px | 28 px | 600 / 1.3 |
| H3 | 20 px | 20 px | 600 / 1.4 |
| Body/field | 16 px | 16 px | 400 / 1.6 |
| Intro lead | 18 px | 18 px | 400 / 1.6 |
| Metadata | 14 px | 14 px | 400 / 1.5 |
| Action/nav | 16 px | 16 px | 600 / 1.5 |

HTML heading level follows document structure, independent of font size. One meaningful H1 per page. Avoid uppercase labels above every title, excessive tracking, and heavy bolding of whole paragraphs. Use a reading measure of about 65–70 characters for narrative content; full-width rows and tables may exceed it where necessary.

## Layout and responsive rules

| Role | Rule |
| --- | --- |
| Shared page frame | Max 1200 px including gutters, centered; same left edge for shell, breadcrumbs, page title and content |
| Reading column | Max 70ch inside the shared frame; start aligned, not independently centered without a reason |
| Service content | Max 960 px inside the shared frame |
| Gutters | 16 px below 768; 24 px at 768–1023; 32 px at ≥1024 |
| Grid gap | 16 px mobile / 24 px desktop |
| Below 640 | One content column; wrapped actions; mobile disclosure navigation |
| 640–1023 | Two columns only for content that remains readable; shared header stays compact with disclosure navigation |
| ≥1024 | Full primary navigation, split content only where it supports a task |

Use the existing Tailwind breakpoints. The new shell uses one 1024 px breakpoint for identity and navigation behavior; test 1023/1024/1025 explicitly. At enlarged text, allow a fallback to disclosure navigation rather than truncation or clipping. Avoid fixed content heights and hard-coded text offsets. Never hide overflow to conceal a layout defect.

The shared header should expose the university/college identity once, the linked department identity, Apply and Alumni utility links, Search, and the eight existing primary destinations. At 768 px, target a header around 200 px or less with navigation closed; verify real font metrics and long identity wrapping. Avoid sticky navigation initially so it cannot obscure headings or focus.

Breadcrumbs use an explicit label/destination map and omit meaningless URL ancestors. Preserve deep-link destinations and query parameters, including degree selection and process-guide links.

## Component contracts

| Component | Proposed behavior | Existing foundation |
| --- | --- | --- |
| `PageHeader` | One H1, optional short lead and actions; no repeated department eyebrow, gradient stripe or ornamental pattern | Simplify existing `PageHero` in place or alias its API |
| `Section` / `SectionHeader` | Shared section spacing, explicit heading level, compact spacing by default; no important overrides | Existing components and semantic sections |
| Action variants | `primary`, `secondary`, `text`, `destructive`; same styling for native button, Router Link and anchor; 44 px routine target; wrapped labels | CVA `Button` with `asChild`, compatible existing class aliases |
| `TaskList` | Flat divided list, task title and optional one-sentence description; normal link hit area; no nested interactive content | Current student task data; preserve its destinations |
| Program comparison | Two meaningful summaries with code, official title and program action; modest border allowed | Existing program cards and API normalization |
| Record list | Title, concise metadata, optional summary and clear action; dividers instead of a panel around every field | Publication/research/conference domain components |
| Faculty listing | Portrait only when available, full wrapping name, approved role/expertise and institutional contact; no invented initials artwork or inferred qualifications | Current page-local faculty card, not the unused legacy card |
| Field group | Persistent label, associated help/error, native type and autocomplete where useful, no placeholder-only labels | Existing native/Radix fields; keep form state and validations |
| `ContentState` | Loading/empty/error/partial presentation; concise message, relevant recovery action, appropriate status semantics | Existing query states and notices |
| Document action | Distinguish online fill, blank document and PDF; show known format and meaningful title; leave unknown size/version unspecified | Existing download/form components |
| Disclosure | Native `details` for long reference material; summary remains a clear keyboard-operable control; do not hide mandatory sequential instructions without a reason | Existing thesis/SOJT/resource guides |

Ordinary navigation should usually look like links. Primary actions indicate the next meaningful task, not every possible destination. Use a panel only when it creates a real unit of content or comparison; use spacing, headings and dividers for the rest.

All controls need consistent default, hover, active/selected, focus-visible, disabled, busy, success and error behavior as applicable. An async action retains its accessible name, prevents duplicate submission where needed, announces the result, and preserves entered data on recoverable failure. Error messages stay near the relevant field and are also discoverable from a summary for long forms. Disabled states must have a clear reason where the user needs it.

## Template families

1. **Homepage:** concise introduction and useful next actions, current updates, program choices, selected published work and practical contact help. Preserve existing sections and destinations during the first pass; review duplication before changing content order or visibility.
2. **Landing/service page:** page title, short lead, grouped task list and secondary help. Current student services is the first pilot.
3. **Directory/record collection:** title, labelled search/filter controls, result count, readable records and controlled pagination/show-more behavior where already supported.
4. **Profile/detail page:** title and essential metadata, only populated approved sections, anchor navigation where length warrants it.
5. **Process/form page:** concise task introduction, labelled steps, associated requirements/documents and a clear next action. Preserve official source distinctions, PDF generation and review steps.

Avoid forcing every template into the same hero/cards/CTA arrangement. Shared tokens and interaction contracts provide consistency while content structure determines layout.

## Governance and acceptance

Do not change approved qualification wording, appointments, expertise, partnerships, statuses or dates to suit a layout. Keep publication approval and hidden records in Django. Optional information remains omitted when unavailable. Distinguish an API failure from a valid empty response without displaying internal administrative metadata.

The pilot is acceptable when it looks coherent at desktop/tablet/mobile widths, tasks remain discoverable by keyboard and screen reader, breadcrumb ancestors resolve, no content is clipped under reflow/text spacing, and existing behavioral checks still pass. Review the before/after screenshots before approving rollout. Automated tests support this decision; they do not replace visual and assistive-technology review.

# Starter issue drafts

These are local drafts, not published GitHub issues. Before publishing, confirm each task is still needed, apply `good first issue` and the suggested area label, and identify a reviewer. Invite one focused pull request per task.

## 1. Document the Windows PowerShell setup experience

Suggested label: `documentation`.

Files: `README.md`, `docs/local-development.md`.

Task: Follow the quick start on Windows PowerShell and document any actual missing step, including virtual-environment activation and copying the frontend environment example. Preserve the macOS/Linux path.

Done when: the contributor records Python/Node versions, confirms migrations and both local servers run, and adds concise instructions for a verified obstacle. Do not recommend broadly disabling system security settings.

## 2. Review keyboard access in the site header

Suggested label: `accessibility`.

Files: locate the header/navigation components under `frontend/src/components/`.

Task: Follow header links and menus using Tab, Shift+Tab, Enter, and Escape on desktop and a narrow viewport. Report one reproducible issue and fix it, or submit a documented audit if all checks pass.

Done when: the PR includes reproduction steps, visible focus evidence, and keyboard behavior before/after; applicable frontend checks pass. Preserve existing routes and menu content.

## 3. Improve one empty news-list state

Suggested labels: `frontend`, `testing`.

Files: locate the news list under `frontend/src/pages/`; use `frontend/src/test/news-list.test.tsx` as a starting point.

Task: Inspect the existing empty-state behavior before proposing a small clarity or accessibility improvement. Use synthetic test data; distinguish an empty successful response from an API error.

Done when: the PR explains the observed gap, includes a meaningful test for the changed behavior, and passes frontend checks. Discuss the scope first if the current behavior already meets these criteria.

## 4. Audit alternative text for one page

Suggested label: `accessibility`.

Files: choose one existing page under `frontend/src/pages/` and its related components.

Task: Review informative versus decorative images. Fix one verified alternative-text issue; avoid inventing identities or descriptions of institutional activities.

Done when: informative images have evidence-based descriptions, decorative images avoid redundant announcements, and the PR documents a manual screen-reader or accessibility-tree check. Run applicable frontend checks.

## 5. Add one missing public API visibility regression test

Suggested labels: `backend`, `testing`.

Files: select one app's `tests.py`, `views.py`, and serializers under `backend/apps/`.

Task: Read existing tests and find one uncovered case where an unpublished record should stay out of a public list or detail response. Agree the case with the reviewer before writing a test.

Done when: a synthetic test creates published/unpublished records, verifies the public response, adds no duplicate test, and passes Django checks, migration consistency, and backend tests. If visibility is broken, explain the failure and propose the smallest fix.

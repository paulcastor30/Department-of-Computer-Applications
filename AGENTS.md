# AGENTS.md

## Project Context

This is the official website of the Department of Computer Applications, College of Computer Studies, MSU-Iligan Institute of Technology.

The website uses Django-backed data. Program content must not be implemented as static-only frontend content unless the current architecture explicitly requires it.

## Important Program Facts

Programs:
1. Bachelor of Science in Computer Applications (BSCA)
2. Master of Science in Computer Applications (MSCA)

Culminating academic requirements:
- BSCA: Undergraduate Thesis
- MSCA: Master’s Thesis or Graduate Thesis

Do not use capstone, project, or capstone/project as the culminating requirement.

## Content Rules

Do not invent:
- accreditation status
- CHED COE status
- AUN-QA status
- AACCUP status
- rankings
- statistics
- employment rates
- faculty counts
- laboratory names
- international partnerships
- course lists
- admission requirements
- thesis policies

Use:
- “To be provided by the Department” for missing official content.
- “To be validated by the Department” for content requiring confirmation.

## Page layout

- Keep headings, spacing, and navigation consistent with the existing pages.
- Use labelled form controls, visible keyboard focus, and readable contrast.
- Check layouts on narrow and wide screens.
- Present program information and documents without unsupported claims.

## Technical Direction

Before coding:
- inspect Django models, admin, serializers, views, URLs, templates, frontend components, API clients, and existing content flow;
- preserve existing architecture where reasonable;
- avoid unnecessary dependencies.

After coding:
- generate migrations if models change;
- run Django checks;
- run backend tests if available;
- run frontend lint/build/type checks if available;
- report commands that fail and why.

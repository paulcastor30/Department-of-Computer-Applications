# Browser checks

Run after installing dependencies and the pinned browser:

```sh
npm ci
npx playwright install chromium
npm run build
npm run test:e2e
```

Playwright starts a production preview on port 4173 or reuses it locally. Rebuild after source edits; a reused preview serves `dist`, not `src`. The suite covers navigation/focus, the student pilot, axe scans and screenshots at desktop/tablet/mobile sizes. API responses are test-only fixtures, including existing program test fixtures; this is not live Django integration verification. Unexpected API endpoints fail instead of silently returning fabricated records.

Screenshots use fixed Philippine time, locale, reduced motion and a pinned Plus Jakarta Sans Latin font fixture. The test-only Google-font responses avoid network-driven differences; production font delivery is unchanged. The font is distributed under the included SIL Open Font License (`fixtures/OFL.txt`), fetched from Google Fonts on 18 October 2026. The pinned WOFF2 comes from Google Fonts' Plus Jakarta Sans v12 Latin subset.

Expected images are versioned under `__screenshots__/<platform>/<project>/`. Current references were generated and visually inspected on macOS with Chromium 141 / Playwright 1.56.1. CI uses `macos-14`; its first run still needs confirmation because local execution cannot prove hosted-runner rendering. Any platform or browser change needs separately reviewed baselines. Do not copy macOS images to a Linux folder or automatically accept CI differences.

For intentional visual changes, inspect actual/expected/diff artifacts first, then update the affected baselines:

```sh
npm run test:visual -- --update-snapshots
npm run test:visual
```

The ordinary CI command never updates expected images. `npm run test:a11y` runs axe and responsive checks separately. Zero automated violations does not establish WCAG conformance; screen-reader, zoom, forced-colors and document accessibility checks remain manual release work.

For Lighthouse, start the production preview and run `npm run audit:lighthouse`. Reports go to ignored `lighthouse-results/`. The command audits Home and Students on mobile/desktop and fails on a non-100 automated accessibility score. Performance is recorded, with the ≥90 mobile goal deferred to the performance increment. It uses actual local responses, not Playwright fixtures: without a configured Django API, collection pages show fallback/error states. CI shares this limitation. It must not be described as connected-backend or production validation.

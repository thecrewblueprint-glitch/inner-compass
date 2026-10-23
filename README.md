# Inner Compass Beta

Inner Compass is a **local-first, deterministic reflection web app**. A user can describe a problem, receive a safety-aware category match, explore source-linked wisdom, save privacy-safe bookmarks, browse a research Wisdom Library, and explore a visual Suggested Reads directory.

The product is designed to support reflection and human agency. It is **not** a chatbot, therapist, diagnostic system, emergency service, or medical-treatment product.

## Current architecture

```text
Reflection text
  ↓
browser-only deterministic safety router
  ↓
browser-only 25-category classifier
  ↓
uncertainty / multi-issue gate
  ↓
clarification when needed
  ↓
canonical three-pillar retrieval
  ↓
source-linked deterministic affirmation
  ↓
display
```

**The runtime is deterministic-only.** There is no model/provider path, fallback generator, or external decision service. Raw reflection text is processed in the browser and is not sent to a model/provider or persisted in the local journal.

## Web product

Current surfaces:

- **Reflect** — deterministic safety, category matching, clarification, and canonical guidance
- **Taxonomy** — all 25 problem categories and the three canonical pillars
- **Wisdom** — a searchable 25-theme reflection archive of source-passage summaries, positive affirmations, and practical category guidance; exact quotation display remains rights-gated
- **Suggested Reads** — the deeper knowledge library for books, primary texts, scholarship, philosophical branches, traditions, historical context, pathways, and legal reading links
- **Health & Wellness** — a separate multi-page educational volume, *The Whole Life Field Guide*, with 12 traditions, 18 gentle practices, a 21-day optional path and 24 source references. It links back to Inner Compass home; no private Personality information is included.
- **Journal** — local bookmarks without raw reflection text
- **Privacy** — personalization toggle and clear-local-data controls
- **Legal & Safety** — Terms, Privacy, Consumer Health Data, Safety/Crisis, and Accessibility notices
- **Lifelines** — U.S.-scoped launch resources and safety routing

The current shared release is a **Beta** for adults 18+ in the United States. Public static deployment is supported through GitHub Pages with preview and debug UI disabled.

**Live Beta:** https://thecrewblueprint-glitch.github.io/inner-compass/

The clean Pages URL is canonical. Production assets are content-hashed by Vite, so normal deployments invalidate changed JavaScript/CSS without a share-link query string.

## Canonical production knowledge base

The original production KB remains structurally stable:

- 25 categories
- 4 existential roots
- 3 pillars per category
- 75 canonical entries

See:
- `docs/DETERMINISTIC_IMPLEMENTATION_CONTRACT.md`
- `docs/TAXONOMY_V1.0.md`
- `docs/KB_SCHEMA_V1.md`
- `content/knowledge-base/`

The broader research corpus is intentionally separate from this canonical production KB.

## Wisdom research corpus

`research/wisdom-corpus/` currently contains:

- 30 source records
- 71 wisdom records
- 75 source-linked affirmation candidates
- all 25 categories with at least 5 mapped wisdom records
- all 25 categories with at least 3 affirmation candidates
- phase reports for Stoicism, Early Buddhism, Classical Daoism, Indian philosophy, Confucian/classical Chinese sources, and later-review traditions
- source/translation/rights logs
- deterministic audit tooling

Exact quote wording is not enabled in the product until edition/translation rights are approved.

## Suggested Reads

`research/reading-directory/` contains:

- tradition/branch hierarchy
- 18 audited starter readings/resources
- curated pathways
- taxonomy links
- translation guidance
- rights metadata
- visual metadata/fallback-cover rules

The UI uses original metadata-driven visual cards when no approved cover artwork is available.

## Privacy and compliance

See `docs/legal/`:

- `COMPLIANCE_ARCHITECTURE_2026.md`
- `PRIVACY_DATA_MAP.md`
- `CONTENT_RIGHTS_POLICY.md`
- `PRODUCT_CLAIMS_POLICY.md`
- `CANONICAL_QUOTE_RIGHTS_INVENTORY.md`
- `LAUNCH_COMPLIANCE_CHECKLIST.md`

Engineering controls do not substitute for owner/counsel launch approval.

## Development

```bash
npm install
npm run lint
npm run audit:deterministic
npm run audit:wisdom
npm run dev
npm run test:e2e
```

Production build:

```bash
npm run build
NODE_ENV=production npm start
```

## Testing

Regression layers include:

- deterministic classifier baselines
- deterministic uncertainty tests
- grounding-validator adversarial tests
- 12,000-scenario human-style fuzz harness
- Playwright web E2E
- deterministic-only architecture guard
- wisdom-corpus referential/coverage audit

## Mobile track

A native React Native / Expo implementation remains a **separate future track**. The current authoritative product is the web app.


## GitHub Pages

A static Pages deployment workflow is included at `.github/workflows/pages.yml`.

For the public site build:
- preview UI is disabled;
- developer diagnostics UI is disabled;
- assets use a Pages-safe relative base path;
- deterministic, wisdom, reading, safety, release, and TypeScript audits run before deployment.

The default project-site URL will be:

`https://thecrewblueprint-glitch.github.io/inner-compass/`

A custom domain can later replace that URL without changing the application architecture.

## Health & Wellness volume library (public editorial content only)

`src/screens/WellnessGuideScreen.tsx` implements the in-app library with five pages:
**Overview · Traditions · Practices · 21-Day Journey · Sources**.
The section appears in the main navigation and on the Reflect home screen.
Every page keeps a return route to Inner Compass. It uses the existing
Beta eligibility gate, theme tokens and deterministic local-only runtime.

The separate guide content in `src/data/wellnessGuide.ts` is a hand-curated,
**public-safe editorial derivative** of general philosophy and health references.
No private Personality repository URL, personal record, therapy notes, personality
assessment or profile data is read, embedded, requested or imported at runtime.
The public app remains deployable without any credentials for Personality.
Only actual completed volumes should appear as published books. This first edition
is **Volume I**; future volumes can have their own content modules, chapter pages,
source inventory and regression tests without altering canonical guidance.

The 21-day optional checklist is stored locally under
`inner_compass_wellness_journey_v1`, so the existing clear-all-data flow removes it.
The library does not route freeform health input, alter the reflection safety router,
create health diagnoses, or claim spiritual practices provide medical treatments.

The `tests/e2e/app.spec.ts` suite checks navigation, content filtering, source-link
visibility, local persistence and return to the Reflect home screen.

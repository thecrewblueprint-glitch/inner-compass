# Inner Compass

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
- **Wisdom** — 71 research records across audited source traditions; exact direct-quote text is rights-gated
- **Suggested Reads** — visual curated library with 18 starter books/resources, traditions, pathways, levels, and legal reading links
- **Journal** — local bookmarks without raw reflection text
- **Privacy** — personalization toggle and clear-local-data controls
- **Lifelines** — U.S.-scoped launch resources and safety routing

The current shared release is 18+ and U.S.-only. Public static deployment is supported through GitHub Pages with preview and debug UI disabled.

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

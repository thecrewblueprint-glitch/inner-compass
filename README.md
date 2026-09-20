# Inner Compass

Inner Compass is a **web-based, deterministic guided-reflection product**. A user's reflection is processed locally in the browser, matched to one of 25 reflection themes, and answered with curated canonical material. The production app does not require an LLM, AI provider, cloud account, or reflection backend.

## Current architecture

```text
Reflection text
  -> local deterministic safety/scope router
  -> local deterministic 25-category classifier
  -> uncertainty / multi-issue gate
  -> local canonical KB retrieval
  -> deterministic synthesis
  -> display
```

### Privacy-by-design v1

- raw reflection text stays on the device;
- raw reflection text is not persisted;
- journal bookmarks store category-level material only;
- no production AI provider;
- no behavioral advertising;
- no third-party analytics or session replay;
- no account or cloud-journal sync;
- no connected health/wearable data;
- initial public launch is 18+ and U.S.-only.

See `docs/legal/COMPLIANCE_ARCHITECTURE_2026.md` and Issue #8 for the launch gate.

## Knowledge base

The production canonical KB contains 25 categories x 3 pillars = 75 entries. The separate `research/wisdom-corpus/` area is a staging corpus and is **not automatically promoted into the product**.

Research records distinguish:

1. verified direct quotations;
2. source paraphrases;
3. original Inner Compass affirmations.

Direct quotations are withheld from production display until the exact translation/edition receives explicit product-display rights approval.

## Testing

The production build is static Vite.

Synthetic deterministic regression testing uses `tools/eval/deterministic_eval_server.ts`, which is not part of the production build.

Key checks:
- deterministic baselines;
- uncertainty gate;
- 12,000-scenario human-flow fuzz;
- browser E2E;
- zero-network / zero-runtime-AI production policy.

## Product scope

Inner Compass is designed as a **general-wellness and educational reflection tool**. It is not medical care, psychotherapy, diagnosis, treatment, clinical decision support, or an emergency service.

## Build

```bash
npm install --legacy-peer-deps
npm run lint
npm run build
npm run dev
```

Developer-only deterministic evaluation server:

```bash
npm run dev:eval
```

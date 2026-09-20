# Inner Compass — Deterministic-Only Implementation Contract

**Effective:** September 20, 2026  
**Authority:** This document replaces the retired provider-capable implementation packet and kickoff instructions.

## Product rule

Inner Compass must work through application logic and audited static content only.

The product must not depend on:
- an LLM or generative model;
- OpenRouter, Gemini, OpenAI, Anthropic, or another generation provider;
- a free-tier or paid model fallback;
- prompt execution;
- model-assisted classification, safety routing, retrieval, clarification, phrasing, or affirmation generation.

If external generation is unavailable, nothing changes, because external generation is not part of the architecture.

## Authoritative flow

```text
reflection text
  -> browser-local deterministic safety router
  -> deterministic 25-category classifier
  -> uncertainty / multi-issue gate
  -> deterministic clarification when required
  -> canonical knowledge-base retrieval
  -> audited static synthesis / affirmation selection
  -> display
```

Raw reflection text stays in the browser during the production guidance flow.

## Source authority

The following remain authoritative:
- `docs/TAXONOMY_V1.0.md`
- `docs/KB_SCHEMA_V1.md`
- `content/knowledge-base/**`
- `research/wisdom-corpus/**`
- `research/reading-directory/**`

Research data does not silently redefine the canonical 25-category / three-pillar production KB.

## Runtime boundaries

Production may serve static/app data and health/category metadata. It must not expose an endpoint that sends reflection text to an external decision or generation service.

Development evaluation endpoints may exercise the same deterministic classifier, safety router, retrieval engine, and grounding checks. They may not invoke a model.

## Testing contract

Required regression layers:
- deterministic policy audit;
- TypeScript check;
- deterministic category/safety baselines;
- uncertainty-gate tests;
- grounding/source-integrity probes;
- large human-flow fuzzing;
- wisdom-corpus integrity audit;
- browser E2E;
- production build/health verification.

CI must fail if provider SDKs, provider credential variables, provider endpoints, or model execution code are reintroduced.

## Mobile track

A future React Native / Expo client must preserve this same deterministic-only contract. Native implementation work may change presentation, navigation, storage, and platform integration, but may not add a model/provider execution path without an explicit owner architecture decision that supersedes this document.

# Roadmap

## Phase 1 — Taxonomy (done, v0.1)

Draft problem taxonomy built from existing evidence-based frameworks (Yalom's four existential roots + Crisis Text Line / clinical intake / Plutchik presenting categories). See [`docs/TAXONOMY_V0.1.md`](docs/TAXONOMY_V0.1.md).

## Phase 2 — Category case-study research

Run scoped research per category in the v0.1 taxonomy to validate or refine it against real case studies, before locking in the category structure.

## Phase 3 — Refine taxonomy

Fold the case-study research back into the taxonomy: split, merge, or rename categories as the evidence warrants. Produces v1.0.

## Phase 4 — Map Eastern philosophy per category

For each refined category, map real, sourced Eastern philosophical/metaphysical teachings (source-verified, not LLM-generated) onto the existential root(s) it touches.

## Phase 5 — Build knowledge-base content

Turn the philosophy mapping into a structured, curated knowledge base: real teachings, tagged by category, ready for retrieval.

## Phase 6 — MVP app

- **App:** React Native
- **Backend/storage:** Firebase
- **Matching:** OpenRouter free-tier LLM does retrieval-augmented matching only — matches user input to knowledge-base entries and phrases the response from that grounded content, never generates philosophy from its own memory.

## v1 — Ship with static crisis redirect

Hardcoded crisis-resource redirect (988 Suicide & Crisis Lifeline, Crisis Text Line, 211.org, National DV Hotline, RAINN) triggered by crisis-content pattern matching on user input. No external API, no developer registration.

## v2 — Live resource-locator APIs

Replace the static redirect with a live resource-locator module: 211 National Data Platform, findhelp.org Programs API, SAMHSA FindTreatment.gov API, HUD homeless/housing resource locator. Deferred — architecture should leave the door open (a resources module these APIs can later plug into) but this is not built in v1.

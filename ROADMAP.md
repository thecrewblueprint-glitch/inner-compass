# Roadmap

## Phase 1 — Taxonomy (done, v0.1)

Draft problem taxonomy built from existing evidence-based frameworks (Yalom's four existential roots + Crisis Text Line / clinical intake / Plutchik presenting categories). See [`docs/TAXONOMY_V0.1.md`](docs/TAXONOMY_V0.1.md).

## Phase 2 — Category case-study research (done)

Scoped research pass validating/refining each v0.1 category against real clinical and psychological literature (Yalom, Frankl, DSM-5-TR, Gottman, Brené Brown, Freyd, Marcia/Erikson, Steger, and more). See [`docs/research/`](docs/research/) for the full sourced writeups.

## Phase 3 — Refine taxonomy (done, v1.0)

Folded the case-study research back into the taxonomy: 5 categories split, 2 renamed, 1 root mapping broadened, 12 kept as-is. 20 categories → 25. See [`docs/TAXONOMY_V1.0.md`](docs/TAXONOMY_V1.0.md).

**Deepened (done):** a second research pass hardened the clinical grounding behind all 25 categories — currency-checked against 2024–2026 literature, resolved as many "reasonable inference" flags as the evidence allows, added real-world clinical-practice and case grounding, and surfaced safety-relevant findings for the eventual crisis-redirect design. No taxonomy structure changes resulted; several root-mapping confidence levels were upgraded, a handful of gaps remain honestly flagged as unresolved. See [`docs/CLINICAL_KB_V1.0.md`](docs/CLINICAL_KB_V1.0.md) (index) and [`docs/research/kb-*.md`](docs/research/) (full detail).

## Phase 4 — Map wisdom content per category (done, expanded scope)

Originally scoped as "map Eastern philosophy per category." Expanded per direction to three sourced pillars: **Eastern philosophy/metaphysical teaching, Jungian/post-Jungian shadow work, and evidence-based non-clinical psychology methodology for building a better life** — each mapped onto the existential root(s) the category touches, complementing (not duplicating) `CLINICAL_KB_V1.0.md`'s clinical grounding. Every claim is source-verified, never LLM-generated; several unverifiable popular quotes (mostly misattributed to Jung) were caught and declined in favor of verified passages. See [`docs/WISDOM_MAPPING_V1.0.md`](docs/WISDOM_MAPPING_V1.0.md) (index, including safety carryovers and honestly-flagged gaps) and [`docs/wisdom-mapping/`](docs/wisdom-mapping/) (full detail).

## Phase 5 — Build knowledge-base content

Turn the wisdom mapping (one representative source per pillar per category so far) into fuller production-ready knowledge-base entries: more passages/teachings per category where useful, formatted and tagged for actual retrieval matching. This is a content-production pass, not a research pass — not yet started.

## Phase 6 — MVP app

- **App:** React Native
- **Backend/storage:** Firebase
- **Matching:** OpenRouter free-tier LLM does retrieval-augmented matching only — matches user input to knowledge-base entries and phrases the response from that grounded content, never generates philosophy from its own memory.

## v1 — Ship with static crisis redirect

Hardcoded crisis-resource redirect (988 Suicide & Crisis Lifeline, Crisis Text Line, 211.org, National DV Hotline, RAINN) triggered by crisis-content pattern matching on user input. No external API, no developer registration.

## v2 — Live resource-locator APIs

Replace the static redirect with a live resource-locator module: 211 National Data Platform, findhelp.org Programs API, SAMHSA FindTreatment.gov API, HUD homeless/housing resource locator. Deferred — architecture should leave the door open (a resources module these APIs can later plug into) but this is not built in v1.

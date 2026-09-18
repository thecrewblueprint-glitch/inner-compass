# Inner Compass

A mobile app that helps someone break down a problem they're facing and responds with real, sourced wisdom guidance plus an affirmation — drawing on Eastern philosophy, Jungian shadow work, and evidence-based psychology, not generic self-help or fabricated quotes. Guidance is retrieval-augmented: an LLM matches a user's problem to a curated, human/research-verified knowledge base of real teachings, and only phrases the response using that grounded content rather than generating content from its own training-data memory.

## Status

Pre-MVP. The problem taxonomy is refined to v1.0 (see [`docs/TAXONOMY_V1.0.md`](docs/TAXONOMY_V1.0.md)), validated against real clinical/psychological literature (see [`docs/CLINICAL_KB_V1.0.md`](docs/CLINICAL_KB_V1.0.md)), and mapped to sourced wisdom content across three pillars (see [`docs/WISDOM_MAPPING_V1.0.md`](docs/WISDOM_MAPPING_V1.0.md)). That mapping is now structured into a retrieval-ready knowledge base — 25 categories × 3 sourced entries each (see [`content/knowledge-base/`](content/knowledge-base/), schema in [`docs/KB_SCHEMA_V1.md`](docs/KB_SCHEMA_V1.md)). Next step: the MVP app itself (React Native + Firebase + retrieval matching).

See [`ROADMAP.md`](ROADMAP.md) for the full build plan.

## Planned stack

- **App:** React Native
- **LLM:** OpenRouter (free-tier model) — for matching + phrasing only, not content generation
- **Backend/storage:** Firebase

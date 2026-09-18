# Inner Compass

A mobile app that helps someone break down a problem they're facing and responds with real, sourced Eastern philosophical/metaphysical guidance plus an affirmation — not generic self-help, not fabricated quotes. Guidance is retrieval-augmented: an LLM matches a user's problem to a curated, human/research-verified knowledge base of real teachings, and only phrases the response using that grounded content rather than generating philosophy from its own training-data memory.

## Status

Pre-MVP. The problem taxonomy is refined to v1.0 (see [`docs/TAXONOMY_V1.0.md`](docs/TAXONOMY_V1.0.md)), validated against real clinical/psychological literature (see [`docs/research/`](docs/research/)). Next step: map Eastern philosophical teachings onto each category.

See [`ROADMAP.md`](ROADMAP.md) for the full build plan.

## Planned stack

- **App:** React Native
- **LLM:** OpenRouter (free-tier model) — for matching + phrasing only, not content generation
- **Backend/storage:** Firebase

INNER COMPASS — AI STUDIO BUILD KICKOFF

Import the private GitHub repository:
`thecrewblueprint-glitch/inner-compass`

Build the Phase 6 MVP as a **React Native/Expo application**, not a web app and not a Kotlin/Jetpack Compose rewrite.

Before changing code, read:
- `docs/IMPLEMENTATION_PACKET.md` if present
- `README.md`
- `ROADMAP.md`
- `docs/TAXONOMY_V1.0.md`
- `docs/CLINICAL_KB_V1.0.md`
- `docs/WISDOM_MAPPING_V1.0.md`
- `docs/KB_SCHEMA_V1.md`
- `content/knowledge-base/index.json`
- all `content/knowledge-base/kb-*.json`

Treat the implementation packet as the controlling execution specification. The repository's current canonical knowledge-base content remains authoritative.

Non-negotiable rules:
1. The LLM classifies and phrases only. It does not invent philosophy, psychology claims, practices, quotes, sources, authors, or citations.
2. All guidance must be retrieved from and validated against `content/knowledge-base/`.
3. Do not alter canonical KB content for implementation convenience.
4. Use the stable Expo baseline specified in the packet; revalidate the stable Expo release before scaffolding and STOP/report if the baseline has changed.
5. Use an Expo development build, not Expo Go, because native Firebase modules are required.
6. Firebase/OpenRouter secrets are backend-only.
7. Do not persist or log raw user reflection text.
8. Implement deterministic safety routing upstream of ordinary wisdom retrieval.
9. Category 10 may not produce wisdom-only; the category-5 abuse boundary must never reach conflict/relationship-staying material; category-21/24 escalation rules must be enforced.
10. Use strict structured-output schemas for OpenRouter and a deterministic grounding validator after generation.
11. Do not add vector search, embeddings, a vector database, live v2 resource APIs, chat memory, accounts, history, payments, or other deferred features.
12. Unknown privacy/provider/safety state fails closed.
13. Create a work branch such as `ai-studio/react-native-mvp`. Do not merge `main` automatically.
14. Implement in the packet's phases and satisfy each exit gate before moving on.
15. Run only tests you can actually execute and document the exact results. Never claim an unexecuted check passed.

At completion, create/update:
`docs/IMPLEMENTATION_REPORT.md`

The report must include:
- branch and head SHA;
- exact dependency versions;
- changed files;
- architecture implemented;
- test commands and results;
- build results;
- security/privacy checks;
- model/provider configuration still required;
- owner/manual setup steps;
- deviations from the packet;
- unresolved HOLD/STOP items.

The deliverable is a reviewable React Native MVP implementation and PR. It is not an automatic merge or production release.
INNER COMPASS — AI STUDIO BUILD KICKOFF

Repository:
`thecrewblueprint-glitch/inner-compass`

MANDATORY WORK BRANCH:
`ai-studio/react-native-mvp`

DO NOT COMMIT TO `main`.

REJECTED BUILD BACKUP:
`backup/ai-studio-web-build-d0d75a9`

Before changing any code, read in this order:
1. `docs/AI_STUDIO_CORRECTIVE_HANDOFF.md`
2. `docs/IMPLEMENTATION_PACKET.md`
3. `README.md`
4. `ROADMAP.md`
5. `docs/TAXONOMY_V1.0.md`
6. `docs/CLINICAL_KB_V1.0.md`
7. `docs/WISDOM_MAPPING_V1.0.md`
8. `docs/KB_SCHEMA_V1.md`
9. `content/knowledge-base/index.json`
10. all `content/knowledge-base/kb-*.json`

Build the Phase 6 MVP as a real **React Native/Expo iOS + Android application**.

Do not build a Vite web app.
Do not use React DOM as the primary runtime.
Do not use Express as the production backend architecture.
Do not recreate the rejected build.

The rejected build is preserved only for selective reference. You may inspect it for reusable tests, visual ideas, or portable logic, but do not merge or cherry-pick it wholesale.

Non-negotiable rules:
1. Work only on `ai-studio/react-native-mvp`.
2. Preserve the controlling docs.
3. Preserve the canonical KB.
4. The LLM classifies and phrases only; it does not invent source knowledge.
5. All guidance must retrieve from and validate against `content/knowledge-base/`.
6. Revalidate the current stable Expo baseline before scaffolding; STOP/report if the packet baseline is stale.
7. Use Expo development/native builds, not a web approximation.
8. Implement Firebase anonymous Auth, App Check, Cloud Functions 2nd gen, Secret Manager, emulator tests, and restrictive rules as specified.
9. OpenRouter is backend-only and configured through `OPENROUTER_API_KEY` and `OPENROUTER_MODEL_ID`.
10. Do not hardcode the model ID.
11. Do not add a direct Gemini-provider fallback.
12. Enforce the specified OpenRouter privacy/provider controls; unknown provider/privacy state fails closed.
13. Do not persist or log raw user reflection text.
14. Do not add saved history/journal/favorites to MVP.
15. Implement bounded structured classification with ambiguity/clarification support; never default unknown input to an arbitrary category.
16. Implement deterministic safety routing before ordinary wisdom retrieval.
17. Implement deterministic retrieval and grounding validation.
18. Do not add vectors, embeddings, payments, live locator APIs, chat memory, or other deferred scope.
19. Run only tests/builds you actually execute and report exact results.
20. When complete, open a PR from `ai-studio/react-native-mvp` into `main`; do not merge automatically.

At completion, create/update:
`docs/IMPLEMENTATION_REPORT.md`

The report must include:
- branch and head SHA
- exact dependency versions
- changed files
- architecture actually implemented
- exact test commands/results
- Expo/native build results
- Firebase emulator/security results
- privacy/provider configuration
- owner/manual setup still required
- deviations
- unresolved HOLD/STOP items

The deliverable is a reviewable React Native/Expo MVP branch and PR. It is not a production release and not an automatic merge.

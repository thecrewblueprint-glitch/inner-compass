# INNER COMPASS — AI STUDIO CORRECTIVE HANDOFF

**Target branch:** `ai-studio/react-native-mvp`  
**Do not work on:** `main`  
**Backup of rejected build:** `backup/ai-studio-web-build-d0d75a9`  
**Clean baseline commit:** `f41b77f08d40ed2a336e39b5a4776f3e758d8b78`

---

## 1. Read this first

The previous AI Studio implementation was rejected as the controlling Phase 6 build because it drifted from the repository contract.

The rejected build is preserved intact at:

`backup/ai-studio-web-build-d0d75a9`

Do **not** merge that branch wholesale.

You may inspect it for reusable ideas, tests, styles, or logic, but anything reused must be deliberately ported into the correct React Native / Expo / Firebase architecture described below and in:

- `docs/IMPLEMENTATION_PACKET.md`
- `docs/AI_STUDIO_KICKOFF.md`
- `README.md`
- `ROADMAP.md`
- `docs/TAXONOMY_V1.0.md`
- `docs/CLINICAL_KB_V1.0.md`
- `docs/WISDOM_MAPPING_V1.0.md`
- `docs/KB_SCHEMA_V1.md`
- `content/knowledge-base/index.json`
- all `content/knowledge-base/kb-*.json`

The implementation packet remains the controlling specification.

---

# 2. Branch discipline

All implementation work must happen on:

`ai-studio/react-native-mvp`

Rules:

1. Do not commit directly to `main`.
2. Do not force-push or reset `main`.
3. Do not delete the implementation packet or kickoff docs.
4. Do not merge automatically.
5. When implementation is reviewable, open a PR from `ai-studio/react-native-mvp` into `main`.
6. Keep `backup/ai-studio-web-build-d0d75a9` untouched as a recovery reference.
7. If a major architecture change appears necessary, stop and document the reason instead of silently changing stacks.

---

# 3. What the previous build got wrong

The rejected build committed as:

`d0d75a969fdbd79cacabc89a06dd2c7898a87853`

It must not be treated as the implementation baseline.

### A. It built the wrong runtime architecture

The previous build used:

- Vite
- React DOM
- `index.html`
- `vite.config.ts`
- Express as the primary application server
- browser `localStorage`
- HTML elements such as `div` and `button`
- React Native Web as a compatibility layer

That is not the requested application.

**Required correction:** build an actual Expo React Native app whose primary runtime is iOS/Android React Native.

The application must be startable and testable through the Expo/native toolchain, not through `vite build`.

### B. It deleted controlling documentation

The previous build removed:

- `docs/IMPLEMENTATION_PACKET.md`
- `docs/AI_STUDIO_KICKOFF.md`

**Required correction:** preserve these documents. They are governance/source-authority files, not disposable scaffolding.

### C. It worked directly on `main`

The previous build ignored the required branch/PR workflow.

**Required correction:** all future work stays on `ai-studio/react-native-mvp` until owner review.

### D. Firebase architecture was not implemented

The packet requires the Firebase backend/security model. The rejected build instead used a generic Express server.

**Required correction:** implement the intended backend:

- Firebase Authentication with anonymous sign-in
- Firebase App Check
- Firebase Cloud Functions 2nd gen
- Node.js 22 functions runtime
- Firebase/Google Secret Manager for server secrets
- Firestore only if required for narrow server-owned quota/abuse state
- restrictive client rules
- Firebase Local Emulator Suite tests

Do not replace this with Express as the production architecture.

### E. The build claimed native completion without proving a native build

The previous implementation report cited a successful Vite/esbuild build and called the MVP fully realized.

**Required correction:** the implementation report must distinguish:

- TypeScript checks
- unit tests
- Firebase emulator tests
- Expo bundling
- native development build status
- Android/iOS build status

Never call a web preview proof of React Native completion.

### F. Saved journal/history was added despite being out of scope

The MVP packet explicitly excludes persistent history/journal behavior.

The rejected branch added saved-reflection and journal screens.

**Required correction:** remove journal/history/favorites from the MVP.

The normal guidance flow should not create a persistent archive of a user's past problems or reflections.

### G. Browser storage was used

The rejected code used `localStorage` and browser export logic.

**Required correction:** no browser storage architecture in the native app. Do not introduce persistent sensitive history on device as a replacement.

### H. Provider architecture drifted

The rejected build:

- hardcoded an OpenRouter model
- added a direct Gemini fallback
- did not enforce the packet's OpenRouter privacy-routing requirements

**Required correction:**

Use OpenRouter from the backend only.

Environment/config:

`OPENROUTER_API_KEY`

`OPENROUTER_MODEL_ID`

Do not hardcode the production model ID in source.

Do not add a direct Gemini-provider fallback unless the owner explicitly changes the architecture.

OpenRouter provider routing must enforce the packet's privacy policy, including the equivalent of:

- zero-data-retention-compatible routing
- deny provider data collection where supported
- require supported parameters
- no fallback that weakens privacy
- no runtime browsing/tools

If provider/privacy state is unknown, fail closed.

### I. The classifier architecture drifted

The rejected build relied heavily on handcrafted keyword scoring and could default an unmatched problem to a category.

**Required correction:**

Implement the packet's bounded structured classifier.

It must:

- emit a strict structured result
- rank valid category IDs
- emit abstract support/safety signals
- identify ambiguity
- return `needs_clarification` when confidence is insufficient

Do not silently map an unknown request to Category 1 or another arbitrary category.

The user must be able to select from 2–3 plausible categories when ambiguity remains.

### J. Generated affirmations became application truth

The rejected build hardcoded a large set of generated affirmations in application code.

**Required correction:**

The canonical KB remains the source of truth.

Any newly phrased affirmation must be treated as unsourced wording, must not masquerade as a quote or factual psychological claim, and should be generated only within the bounded grounded response flow.

Do not create a second hardcoded content corpus in application code.

### K. Expo/dependency configuration was internally inconsistent

The rejected build mixed Expo, React Native Web, Vite, and native Firebase plugin declarations without a coherent native dependency graph.

**Required correction:**

Use one coherent Expo React Native dependency set.

Before scaffolding, revalidate the current stable Expo release as instructed by the implementation packet. If the stable baseline has changed since the packet was written, stop and report it rather than silently changing versions.

Use an Expo development build when native Firebase modules are required.

---

# 4. What may be salvaged from the rejected backup

You may inspect the backup branch and selectively reuse concepts from:

- KB type definitions
- KB integrity tests
- grounding-validator test ideas
- privacy-test ideas
- routing-test structure
- visual hierarchy concepts
- React Native primitive-based screen fragments that are genuinely portable
- deterministic safety-policy concepts, after validating them against the canonical taxonomy/KB
- source-display concepts
- theme token concepts

Do **not** copy over:

- Vite
- React DOM
- `index.html`
- browser-only components
- `localStorage`
- Express production architecture
- saved journal/history
- hardcoded model ID
- direct Gemini fallback
- browser download/export code
- generated affirmations as a parallel content source
- the rejected implementation report's completion claims

If salvaging code, port it consciously. Do not cherry-pick the rejected commit wholesale.

---

# 5. Correct implementation sequence

## Phase 0 — verify baseline

Before coding:

1. Confirm current branch is exactly `ai-studio/react-native-mvp`.
2. Confirm `main` points to the clean baseline or later owner-approved commits.
3. Confirm the controlling docs exist.
4. Confirm canonical KB files are unchanged.
5. Revalidate current stable Expo version.
6. Record the dependency decision in the implementation report.

Exit gate: no implementation work begins until these checks pass.

## Phase 1 — native Expo scaffold

Create a real Expo React Native TypeScript application.

Required:

- Expo Router
- native screen structure
- React Native primitives
- no Vite
- no React DOM runtime
- no `index.html`
- no React Native Web as the primary application path

Exit gate:

- Expo app starts using the Expo toolchain
- TypeScript compiles
- basic native navigation renders

## Phase 2 — Firebase shell

Implement:

- anonymous Firebase Auth
- App Check configuration
- Cloud Functions 2nd gen
- Node.js 22 functions project
- Secret Manager integration
- Emulator Suite configuration
- restrictive Firestore rules

Exit gate:

- local emulator call succeeds
- invalid/missing production security context is rejectable
- no raw reflection is stored

## Phase 3 — KB validation and deploy copy

Implement deterministic scripts that:

- validate `content/knowledge-base/`
- verify 25 categories
- verify 75 baseline entries
- verify 3 pillars per category
- verify IDs/enums/citations/confidence invariants
- generate a reproducible functions deploy copy
- generate a manifest/hash

Exit gate:

- validator passes canonical KB
- intentionally corrupted fixture fails
- generated copy is reproducible

## Phase 4 — bounded classification and routing

Implement server-side classification contract from the packet.

The model classifies only.

The server owns route precedence.

Ambiguous results must return clarification choices.

Safety/support routing occurs before ordinary wisdom retrieval.

Exit gate:

- gold fixtures pass target threshold
- ambiguity cases return clarification
- no arbitrary fallback category
- critical safety fixtures never fall through to ordinary wisdom

## Phase 5 — deterministic retrieval

For a selected category:

- retrieve exactly the canonical category
- retrieve its three pillar entries
- carry source metadata and confidence state forward
- do not add vector infrastructure

Exit gate:

- every ordinary category resolves to the expected canonical entries
- no cross-category contamination

## Phase 6 — OpenRouter grounded phrasing

Server-side only.

Use:

- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL_ID`
- strict structured output
- required privacy/provider routing
- only the selected canonical records

The model may phrase; it may not invent knowledge.

Exit gate:

- structured schema enforced
- provider/privacy policy configured
- missing/unknown provider state fails closed

## Phase 7 — deterministic grounding validator

Validate every generated response before display.

Reject:

- unknown entry IDs
- wrong category
- wrong pillar
- invented source metadata
- unverified quotations
- invented practices
- unexpected fields

Allow at most one bounded repair attempt.

Exit gate:

- adversarial grounding tests pass
- invalid response never reaches client

## Phase 8 — native UX

Implement only the MVP flow:

1. Home/problem input
2. clarification when needed
3. grounded guidance
4. support/resources

No journal/history.

No fake chat.

Support resources remain locally available.

Exit gate:

- native flow works on a development build
- accessibility basics pass
- network failure handled without sensitive caching

## Phase 9 — verification

Run and record only checks actually executed.

At minimum record:

- KB validation
- unit tests
- safety routing tests
- grounding adversarial tests
- privacy tests
- Firebase emulator tests
- TypeScript checks
- Expo/native bundling
- development build status
- Android build status if executed
- iOS build status if executed

Do not mark an unexecuted check as passed.

## Phase 10 — review

Create/update:

`docs/IMPLEMENTATION_REPORT.md`

Then open a PR from:

`ai-studio/react-native-mvp`

into:

`main`

Do not merge automatically.

---

# 6. Required repository shape

A reasonable target is:

```text
app/
  _layout.tsx
  index.tsx
  clarify.tsx
  guidance.tsx
  support.tsx

src/
  components/
  design/
  features/
  lib/
    api/
    firebase/
    validation/
  types/

functions/
  package.json
  tsconfig.json
  src/
    index.ts
    generateGuidance.ts
    lib/
      kb.ts
      kbSchema.ts
      safetyPolicy.ts
      classification.ts
      routing.ts
      openrouter.ts
      grounding.ts
      rateLimit.ts
      telemetry.ts
  generated/
    kb/
  test/

scripts/
  validate-kb.mjs
  prepare-functions-kb.mjs

content/
  knowledge-base/

docs/
  IMPLEMENTATION_PACKET.md
  AI_STUDIO_KICKOFF.md
  AI_STUDIO_CORRECTIVE_HANDOFF.md
  IMPLEMENTATION_REPORT.md
  SECURITY_PRIVACY.md
  LOCAL_DEVELOPMENT.md

firebase.json
firestore.rules
firestore.indexes.json
app.config.ts
eas.json
.env.example
```

Equivalent naming is acceptable if responsibility boundaries remain clear.

---

# 7. Non-negotiable STOP conditions

STOP and report instead of improvising if:

- the environment tries to convert the app to a Vite/web build
- React Native is being replaced with Kotlin or another stack
- Firebase is being replaced without owner approval
- OpenRouter is being bypassed by a direct provider fallback
- the selected model cannot satisfy structured-output requirements
- privacy/provider retention state cannot be verified
- canonical KB content would need to be rewritten for implementation convenience
- a critical safety-routing fixture falls through to ordinary wisdom
- the grounding validator accepts invented source material
- a beta/RC Expo baseline is being introduced without approval
- a vector database/embedding layer is proposed without measured need
- a new persistent journal/history feature is being added
- credentials, billing, signing, or owner configuration are required and unavailable

A HOLD is valid. False completion is not.

---

# 8. Completion definition

The branch is ready for owner review only when:

- the application is genuinely React Native/Expo
- the runtime does not depend on Vite/React DOM
- Firebase anonymous Auth is implemented
- App Check is implemented/configured
- Cloud Functions 2nd gen are implemented
- OpenRouter remains backend-only
- model ID is configuration, not hardcoded
- provider privacy controls are enforced
- canonical KB is unchanged
- classification supports clarification instead of arbitrary fallback
- retrieval is deterministic
- grounding validator fails closed
- no raw reflection is persisted/logged
- no journal/history exists in MVP
- static support resources are available
- tests actually run and are reported accurately
- development/native build status is explicitly documented
- implementation report is current
- PR exists from `ai-studio/react-native-mvp` to `main`
- no automatic merge has occurred

---

# 9. Final instruction

Build the correct mobile application, not a web approximation.

Use the rejected backup only as a reference library of potentially reusable ideas. The clean branch and controlling documentation define the product.

When architecture, security, privacy, or safety requirements conflict with implementation convenience, the requirement wins.

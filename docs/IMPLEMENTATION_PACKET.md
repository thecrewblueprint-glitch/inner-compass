# INNER COMPASS — CONTROLLING REACT NATIVE MVP IMPLEMENTATION PACKET

**Prepared:** September 17, 2026  
**Canonical repository:** `thecrewblueprint-glitch/inner-compass`  
**Canonical branch at planning time:** `main`  
**Planning baseline commit:** `fc2bc4eea15606bdaa2987b9158d3d90cc97d592`  
**Implementation target:** React Native mobile application, iOS + Android  
**Packet class:** Controlling implementation packet  
**Implementation agent:** Google AI Studio / Antigravity Agent, working against the imported GitHub repository  
**Owner authority:** This packet defines the intended implementation increment. It does not authorize silent scope expansion, stack replacement, or automatic merge to `main`.

---

## 1. Executive directive

Build **Inner Compass** as a production-oriented React Native MVP around the already-completed, sourced knowledge base in this repository.

Inner Compass is **not an open-ended AI therapist and not a generic chatbot**. It is a guided reflection product. A user describes a problem. The system:

1. screens the request for out-of-scope/safety conditions;
2. classifies the request into the existing 25-category taxonomy;
3. retrieves only the already-curated knowledge-base entries for the selected category;
4. uses an LLM only to phrase a grounded response from those retrieved entries;
5. validates the LLM output against the source records before returning it;
6. displays the guidance with its real sources and confidence/provenance state.

The overriding architecture rule is:

> **The knowledge is curated and retrieved; it is not invented by the model.**

The LLM may classify and phrase. It may not manufacture philosophy, psychology claims, practices, quotations, citations, authors, source works, or new knowledge-base content.

If grounding cannot be proven, **fail closed instead of improvising**.

---

# 2. Read these repository artifacts before changing code

AI Studio must read these files first and treat them as source authority for their respective domains:

- `README.md`
- `ROADMAP.md`
- `docs/TAXONOMY_V1.0.md`
- `docs/CLINICAL_KB_V1.0.md`
- `docs/WISDOM_MAPPING_V1.0.md`
- `docs/KB_SCHEMA_V1.md`
- `content/knowledge-base/index.json`
- all five `content/knowledge-base/kb-*.json` files

Do not infer the product from this packet alone when the source repository contains the exact data contract.

### Current canonical content state

The repository already contains:

- 25 problem categories;
- 4 existential roots used as taxonomy metadata;
- 3 content pillars:
  - `eastern_philosophy`
  - `shadow_work`
  - `psychology_methodology`
- 75 total knowledge-base entries;
- per-entry source author/work/citations;
- explicit distinction between sourced teaching paraphrases and verified quotations;
- explicit `sourced` vs `extrapolated` confidence;
- per-category safety notes;
- hard-ceiling and escalation metadata.

The **three-pillar scope is the current implementation scope** for this MVP. Do not reduce it back to Eastern philosophy only and do not add a fourth pillar unless the owner explicitly changes scope.

---

# 3. Roadmapdev implementation discipline applied to this build

This packet applies the reusable controls from Roadmapdev's controlling-implementation methodology.

The build must preserve these invariants:

1. **Source authority is explicit.** The Git knowledge-base files remain canonical for guidance content.
2. **Derived copies are replaceable.** A backend deploy copy may be generated from the canonical KB, but it is never a second source of truth.
3. **Provenance is first-class.** Every displayed teaching, quote, source, and confidence state remains traceable to an existing KB entry.
4. **AI is replaceable.** Product truth cannot live only in model memory or one provider's behavior.
5. **Unknown safety/security/provider state fails closed.**
6. **Analysis does not silently become content.** The model cannot promote its own reasoning into a new teaching.
7. **No duplicate infrastructure without evidence of need.**
8. **Contracts and validation come before implementation convenience.**
9. **The accepted/live result must be verified, not merely the working copy.**
10. **Claim only tests that actually ran.**

A successful local preview is not sufficient proof of completion.

---

# 4. Frozen MVP scope

## In scope

- React Native iOS + Android application.
- Expo-based development/build workflow.
- Single-turn user problem input.
- Deterministic safety-routing layer.
- LLM-assisted taxonomy classification.
- User clarification when classification is genuinely ambiguous.
- Deterministic KB retrieval.
- LLM-assisted grounded phrasing.
- Strong server-side grounding validation.
- Source/citation display.
- Static, offline-accessible U.S. support-resource screen.
- Firebase backend/security/rate-limiting infrastructure.
- OpenRouter server-side model access.
- Anonymous/pseudonymous Firebase authentication.
- App Check.
- Automated validation/test fixtures.
- EAS/dev builds suitable for device testing.
- Setup and implementation documentation.

## Explicitly out of scope for this increment

Do **not** build any of the following:

- v2 live resource-locator APIs;
- vector database;
- embeddings;
- semantic vector search;
- user accounts beyond anonymous/pseudonymous auth needed for backend abuse controls;
- profiles;
- cloud-synced journal/history;
- conversation memory;
- open-ended chat;
- favorites;
- social/community features;
- push notifications;
- payments/subscriptions;
- admin CMS;
- AI-generated KB expansion;
- diagnosis;
- treatment plans;
- medication advice;
- multilingual localization;
- location tracking;
- precise geolocation;
- analytics that capture user problem text;
- session replay on screens containing sensitive text;
- a web-app replacement;
- a Kotlin/Jetpack Compose replacement.

---

# 5. Technical baseline

## 5.1 Client baseline

Use:

- **Expo SDK 57 stable**
- **React Native 0.86.3**
- **TypeScript**
- **Expo Router**
- development builds / EAS builds
- React Native Firebase native modules where required

Do **not** use Expo SDK 58 beta for this implementation baseline.

Reason: as of this packet date, SDK 58 is still beta and uses React Native 0.88 Release Candidate. Stability is more valuable than beta features for this safety-sensitive MVP.

### Revalidation rule

Before the very first scaffold command, check the current Expo stable channel.

- If SDK 57 is still the current stable release, use this packet's pinned baseline.
- If SDK 58 or later has become stable, **STOP and report the version change before upgrading the baseline**.
- Never silently switch to a beta/canary/RC release.

## 5.2 Expo Go is not the target

React Native Firebase contains native code and cannot run in the precompiled Expo Go client.

Use an **Expo development build**.

## 5.3 Backend baseline

Use:

- Firebase Authentication — anonymous sign-in
- Firebase App Check
- Firebase Cloud Functions **2nd gen**
- Node.js **22** for functions
- Firebase/Google Secret Manager for server secrets
- Firestore only where justified for server-owned abuse/rate-limit state or coarse operational state
- Firebase Local Emulator Suite for rule/function tests

Do not make Firestore a content CMS in MVP.

## 5.4 LLM gateway

Use **OpenRouter only from the backend**.

The mobile application must never contain:

- the OpenRouter API key;
- provider credentials;
- a privileged Firebase service credential.

The chosen model must:

- support strict structured JSON output;
- satisfy the configured privacy route;
- be explicitly configured by model ID;
- pass the test corpus.

Do not hardcode a "current best free model" into this packet because model availability changes. Use an environment/server configuration such as:

`OPENROUTER_MODEL_ID=<explicit-owner-approved-model-id>`

No `openrouter:auto` routing for MVP.

---

# 6. Target architecture

```text
React Native / Expo app
        |
        | Firebase anonymous auth + App Check
        v
Firebase callable function: generateGuidance
        |
        +--> deterministic safety preflight
        |
        +--> OpenRouter classification call
        |       strict JSON schema
        |
        +--> deterministic routing policy
        |
        +--> canonical KB loader
        |       derived deploy copy from repo content/
        |
        +--> OpenRouter grounded-phrasing call
        |       ONLY retrieved records supplied
        |       strict JSON schema
        |
        +--> deterministic grounding validator
        |
        +--> source metadata enrichment from canonical KB
        |
        v
Validated response to mobile client
```

The mobile app may run a **local early safety screen** for obvious out-of-scope routing so help can appear quickly and offline, but the server repeats the policy and remains authoritative for online guidance generation.

---

# 7. Knowledge-base authority and deployment

## 7.1 Canonical source

The canonical guidance content remains:

`content/knowledge-base/`

Do not edit these records merely to make application code easier.

Do not upload these records to Firestore and then treat Firestore as the authority.

## 7.2 Derived deploy copy

Cloud Functions need a packaged, read-only copy at runtime.

Implement a deterministic build step:

1. validate the root canonical KB;
2. copy the validated files into the functions deployment artifact;
3. generate a manifest/hash;
4. fail the build if validation fails.

Example:

```text
content/knowledge-base/          # canonical
functions/generated/kb/          # generated deploy copy, not canonical
```

The generated copy should be reproducible from the root source.

## 7.3 Required KB validator checks

The validator must prove at least:

- schema version recognized;
- exactly 25 category IDs;
- exactly 75 MVP entries at this baseline;
- category IDs unique;
- entry IDs unique;
- each category contains all three required pillars;
- pillar enum valid;
- citation list present and syntactically valid;
- `confidence` is only `sourced` or `extrapolated`;
- extrapolated entries include a non-empty `confidence_note`;
- verified quotes are distinct from ordinary `teaching`;
- index file category/file declarations match actual files;
- hard ceiling list is present;
- escalation-candidate list is present.

A future intentional KB expansion may legitimately change "75"; that requires updating the manifest/test baseline deliberately rather than silently weakening validation.

---

# 8. Privacy model

The user's free-text problem may be highly personal.

### MVP privacy rules

Raw user problem text:

- is sent only as needed for the current online request;
- is **not written to Firestore**;
- is **not written to analytics**;
- is **not written to crash-report metadata**;
- is **not included in ordinary application logs**;
- is **not stored as chat history**;
- is **not used as a push-notification payload**;
- is not persisted on device after the current flow unless technically required for the active view.

Do not implement session replay on the sensitive input/results flow.

### Operational telemetry may contain only non-content metadata such as

- generated request ID;
- timestamp;
- function latency;
- success/failure code;
- model ID;
- token count/cost if supplied by provider;
- validator pass/fail;
- App Check/auth status.

Prefer not to log selected category unless it is specifically justified.

Never log the raw prompt or final sensitive response body.

---

# 9. OpenRouter privacy and provider controls

For every runtime model request:

- use an explicit approved model;
- require supported parameters;
- request strict structured output;
- request a zero-data-retention-compatible route;
- deny provider data collection where supported;
- do not enable provider/model fallbacks that weaken the policy;
- do not enable runtime browsing/tools;
- do not rely on provider prompt logging.

Recommended provider preference concept:

```json
{
  "zdr": true,
  "data_collection": "deny",
  "require_parameters": true
}
```

Also configure account/API-key guardrails where possible:

- approved-model allowlist;
- approved-provider allowlist if required;
- Zero Data Retention;
- cost/budget boundaries;
- sensitive-data policy.

If the required privacy/retention state is unknown for the selected model/provider, **HOLD the request instead of routing through an unknown provider**.

---

# 10. Safety-routing contract

This routing layer is upstream of wisdom retrieval.

The app must not rely on the LLM alone for safety.

Use deterministic policy + tightly bounded model classification. The model may **escalate** a route; it may never override a deterministic safety redirect downward into wisdom.

## 10.1 Out-of-scope safety route

The existing taxonomy excludes acute crisis, self-harm/suicide crisis, intimate-partner violence/abuse, and acute psychiatric emergencies from philosophy matching.

When the request belongs to that excluded scope:

- do not retrieve ordinary wisdom content;
- show the appropriate static support screen;
- do not offer a "continue anyway to wisdom" bypass on a hard redirect.

Do not include graphic or detailed harm language in fixtures or UI copy. Tests can use safe, abstract signal labels.

## 10.2 Category 10 — hard ceiling

`category_id = 10` is flagged by the canonical KB as a hard ceiling.

For MVP, choose the safest deterministic interpretation:

> Category 10 never produces a **wisdom-only** response.

Route to a support-oriented result that prioritizes professional/urgent resources as applicable. Any later blended wisdom-plus-support behavior requires a separate product-safety decision and tests.

## 10.3 Category 5 — conflict vs abuse boundary

If category 5 appears possible but abuse/IPV indicators are present:

- route to the domestic-violence support screen;
- do not present the relationship-staying/lojong conflict material.

## 10.4 Categories 21 and 24 — escalation candidates

These categories have specific higher-risk presentations recorded in the KB.

The classifier may identify the ordinary category, but an escalation signal must cause support/safety routing instead of ordinary wisdom retrieval.

The app should use abstract signal codes rather than storing detailed sensitive explanations.

## 10.5 Softer support edges

The canonical research also identifies practical/referral edges for categories such as 18, 19, and 25.

These do not automatically require a hard crisis redirect. The UI may return the grounded reflection **plus** a secondary practical/professional-support panel when the routing policy flags that edge.

---

# 11. Static U.S. support-resource module

Ship a local static file, for example:

`src/features/support/resources/us.json`

The resource screen must remain usable when the network is unavailable.

Include current U.S. contact methods for:

- 988 Suicide & Crisis Lifeline — call/text 988; web chat
- Crisis Text Line — text HOME to 741741
- 211 — call 211 / 211.org for local social-service navigation
- National Domestic Violence Hotline — 800-799-SAFE; text START to 88788; web chat
- RAINN National Sexual Assault Hotline — 800-656-HOPE; text HOPE to 64673; web chat

Label this resource set as **United States**. Do not infer the user's location.

Put all resource content behind a simple data contract so a future v2 locator module can replace/augment it without rewriting the guidance UI.

---

# 12. Classification contract

The classifier's job is narrow:

- determine whether normal wisdom scope is appropriate;
- rank taxonomy categories;
- emit abstract safety/support signal codes;
- indicate ambiguity.

It must not generate advice.

Use a strict JSON Schema.

Suggested response contract:

```ts
type ClassificationResult = {
  route_candidate:
    | "wisdom"
    | "support"
    | "safety_redirect"
    | "needs_clarification";
  category_candidates: Array<{
    category_id: number;
    confidence: number;
  }>;
  signal_codes: Array<
    | "NONE"
    | "OUT_OF_SCOPE_SAFETY"
    | "ABUSE_BOUNDARY"
    | "HARD_CEILING"
    | "ESCALATION_21"
    | "ESCALATION_24"
    | "PRACTICAL_SUPPORT_EDGE"
    | "PROFESSIONAL_SUPPORT_EDGE"
  >;
};
```

No unrestricted free-form "clinical reasoning" field is needed.

### Classification prompt inputs

Supply:

- the user's current text;
- category IDs/names;
- taxonomy matching notes relevant to distinguishing neighboring categories;
- safety-routing definitions;
- no wisdom teachings.

### Ambiguity behavior

Do not force a low-confidence classification.

If two or three categories are genuinely plausible, return a user-facing choice such as:

> "Which feels closest to what you're dealing with?"

Show concise category labels and let the user select.

This preserves user agency and improves retrieval accuracy.

---

# 13. Deterministic routing policy

After classification, server code — not the model — decides the route.

Recommended order:

1. deterministic out-of-scope safety signal;
2. abuse boundary;
3. category-10 hard ceiling;
4. category-21/category-24 escalation signal;
5. ambiguity/clarification;
6. softer practical/professional support edge;
7. ordinary wisdom.

Higher-priority routes cannot be downgraded by a lower-priority model response.

Represent this order in code and unit tests.

---

# 14. Retrieval contract

For ordinary wisdom flow:

1. select one canonical category;
2. load the category's exact KB record;
3. retrieve its three MVP entries;
4. carry forward:
   - `safety_notes`
   - `synthesis_note`
   - entry IDs
   - pillar
   - teaching
   - verified quote
   - practice
   - confidence
   - confidence note
   - author
   - work
   - citations.

No vector retrieval is needed for 25 categories / 75 entries.

### Why no embeddings in MVP

The current corpus is tiny, explicitly categorized, and already structured for direct retrieval. Vector infrastructure would add:

- another derived index;
- another failure mode;
- cost;
- synchronization burden;
- harder auditability.

Only introduce vector/hybrid retrieval after measured classifier/retrieval failures demonstrate a benefit.

---

# 15. Grounded phrasing contract

The second LLM call receives **only**:

- the selected category metadata;
- the exact retrieved KB entries;
- the current user's text if needed for tone/context;
- a strict output schema;
- instructions prohibiting new factual/philosophical/psychological claims.

It must not receive the entire KB.

## Suggested model output

```ts
type ModelGuidanceDraft = {
  category_id: number;
  reflection: string;
  blocks: Array<{
    entry_id: string;
    pillar:
      | "eastern_philosophy"
      | "shadow_work"
      | "psychology_methodology";
    message: string;
    practice: string | null;
    quote: string | null;
  }>;
  affirmation: string;
};
```

The model must not supply citation URLs, author names, work titles, or confidence status. Those fields are enriched **after validation from the KB**, preventing citation fabrication.

### Content rules

- `reflection` may summarize the user's concern without diagnosing them.
- Each `message` must be an application/paraphrase of its specific entry.
- `practice` must be null or grounded in that entry's existing `practice_or_technique`.
- `quote` must be null unless the entry has a `verified_quote`.
- If a quote is returned, it must match the stored verified quote exactly.
- `affirmation` may be newly phrased, but it must be non-factual and non-clinical. It cannot masquerade as a quotation or sourced psychological claim.

---

# 16. Grounding validator

This is a load-bearing component.

Before returning any LLM-generated wisdom response, validate:

- category ID equals selected category;
- every output entry ID exists in selected category;
- no duplicate/missing required pillar;
- returned pillar matches the referenced entry;
- quote is either null or exact equality with `verified_quote`;
- no quote is allowed when `verified_quote` is null;
- practice does not introduce a new technique;
- output schema contains no unexpected fields;
- all final displayed source URLs, authors, works, confidence values come from the KB rather than the model.

### Invalid model output

Policy:

1. reject;
2. at most one bounded repair/retry using the validation errors;
3. validate again;
4. if still invalid, fail closed.

Do not display partially grounded content.

A deterministic fallback may render the underlying stored KB teachings directly in a clean template, or the UI may say guidance is temporarily unavailable. Either is preferable to invented content.

---

# 17. Mobile UX specification

Inner Compass should feel like a reflective tool, not an AI chat room.

## 17.1 Main flow

### Screen A — Home / problem input

Primary prompt:

**"What's weighing on you?"**

Components:

- multiline text field;
- clear privacy microcopy;
- primary action: **Find perspective**
- persistent link: **Support resources**

Avoid a fake chat transcript.

### Screen B — clarification, only when needed

If classifier confidence is ambiguous:

- show 2–3 candidate category labels;
- short plain-language descriptions;
- user chooses the closest.

No diagnostic language.

### Screen C — guidance

Recommended hierarchy:

1. category/context heading;
2. brief grounded reflection;
3. three distinct pillar cards:
   - Eastern philosophy
   - Shadow work
   - Psychology methodology
4. practice/action when present;
5. exact quote only when `verified_quote` exists;
6. source author/work;
7. expandable source links;
8. confidence disclosure:
   - ordinary sourced entry;
   - **Interpretive application** badge for `extrapolated`;
9. affirmation;
10. small product boundary/footer.

Do not hide the citations behind an inaccessible secondary screen.

### Screen D — support/resources

Use for safety/support routes and as an always-accessible user choice.

The hard-redirect version should prioritize the relevant resources and not offer a bypass into ordinary philosophy.

## 17.2 No history in MVP

Once the active flow is cleared/closed, do not create a permanent "past problems" archive.

## 17.3 Offline behavior

- static resource/support screens work offline;
- home UI loads offline;
- online guidance submission detects connectivity failure and gives a normal retry state;
- do not cache previous sensitive user requests as a workaround.

---

# 18. Design system

Keep the first build restrained and legible.

Suggested visual direction:

- dark/neutral reflective palette or calm system-adaptive palette;
- generous spacing;
- strong text hierarchy;
- cards differentiated by labels/icons, not only color;
- no mystical visual clichés required;
- no medical/clinical visual language;
- minimal animation;
- respect Reduce Motion.

Use design tokens, not hardcoded styling scattered through screens.

Suggested token structure:

```text
src/design/
  colors.ts
  spacing.ts
  typography.ts
  radius.ts
  theme.ts
```

Use React Native `StyleSheet` / stable Expo-native primitives unless another dependency has a clear benefit.

Do not add a large UI framework merely to accelerate scaffolding.

---

# 19. Accessibility requirements

At minimum:

- dynamic text sizing;
- screen-reader labels and logical reading order;
- adequate contrast;
- no color-only status meaning;
- minimum accessible touch targets;
- visible focus where applicable;
- buttons have explicit names;
- source links have meaningful labels;
- errors announced accessibly;
- loading state understandable without animation;
- Reduce Motion respected.

---

# 20. Firebase implementation detail

## 20.1 Auth

Enable Firebase Anonymous Authentication.

Purpose:

- stable pseudonymous UID for rate limiting and abuse controls;
- no account-creation friction;
- no email/phone collection in MVP.

The UID is not permission to store the user's raw reflection.

## 20.2 App Check

Use native App Check support:

- Android: Play Integrity where appropriate;
- iOS: App Attest / supported Apple fallback as appropriate.

The callable guidance function must reject invalid/missing production App Check tokens.

Development/debug providers may be enabled only in explicit non-production builds.

## 20.3 Callable Function

Implement:

`generateGuidance`

Request concept:

```ts
type GenerateGuidanceRequest = {
  text: string;
  selected_category_id?: number;
  client_request_id: string;
};
```

Response should be a discriminated union:

```ts
type GenerateGuidanceResponse =
  | WisdomResponse
  | NeedsClarificationResponse
  | SupportResponse
  | SafetyRedirectResponse
  | ErrorResponse;
```

Use Cloud Functions 2nd gen.

## 20.4 Firestore

MVP client should not directly read/write Firestore.

Start with restrictive rules, ideally deny-all for client data if no client-accessed collection is required.

Server/Admin SDK may use a narrowly scoped collection for:

- pseudonymous quota counters;
- abuse controls;
- coarse non-content operational state.

Do not store raw reflection text or generated guidance.

## 20.5 Rate limiting

Rate limit by a combination of:

- pseudonymous Firebase UID;
- App Check context;
- bounded time window.

Do not use invasive fingerprinting.

Rate values should be server configuration, not buried in UI code.

---

# 21. Recommended repository structure

Preserve the existing root content/docs.

Suggested additions:

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
    input/
    guidance/
    clarification/
    support/
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

content/
  knowledge-base/             # EXISTING CANONICAL CONTENT — preserve

scripts/
  validate-kb.mjs
  prepare-functions-kb.mjs

docs/
  IMPLEMENTATION_PACKET.md
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

Adapt naming if the generated Expo template imposes a cleaner equivalent. Preserve responsibility boundaries even if file names differ.

---

# 22. Secret/config contract

No secret values in Git.

Document variables such as:

```text
OPENROUTER_API_KEY
OPENROUTER_MODEL_ID
FIREBASE_PROJECT_ID
```

Use Firebase/Google Secret Manager for `OPENROUTER_API_KEY`.

Public Firebase mobile configuration may be supplied through the normal app config process, but access must still be protected by Auth, Security Rules, and App Check.

Create `.env.example` with names/placeholders only.

---

# 23. Test strategy

The MVP is not complete without deterministic tests.

## 23.1 Knowledge-base tests

Must prove:

- schema/manifest integrity;
- 25 categories;
- 3 pillars/category;
- 75 baseline entries;
- unique IDs;
- confidence-note invariant;
- index flags load correctly;
- verified-quote behavior.

## 23.2 Classifier gold fixtures

Create a predeclared fixture corpus covering:

- every category;
- paraphrased ways a user may describe the category;
- close-neighbor confusion cases;
- ambiguity cases.

Recommended initial minimum:

- at least 5 ordinary fixtures per category = 125;
- plus ambiguity/boundary fixtures.

Target:

- **>=96% routing/classification pass on the frozen gold set**.

Do not train/tune on failed evaluation cases and then continue calling the same unchanged corpus an independent test without versioning it.

## 23.3 Safety/boundary fixtures

Use safe, non-graphic synthetic fixtures representing the required routing classes.

Critical invariant:

> **Zero critical false-safe results in the frozen safety suite.**

Test specifically that:

- excluded-scope safety cases do not reach wisdom;
- category 10 does not yield wisdom-only;- category 5 + abuse boundary does not yield conflict/relationship-staying wisdom;
- category 21 escalation signal redirects;
- category 24 escalation signal redirects;
- softer referral/practical edges follow their intended tier.

## 23.4 Grounding adversarial tests

The validator must reject 100% of fixtures where a mocked model attempts to:

- invent an entry ID;
- use an entry from another category;
- invent a citation;
- invent an author/work;
- alter a verified quote;
- present a paraphrase as a quote;
- add a new practice;
- omit required pillar data;
- introduce extra schema fields.

## 23.5 Firebase tests

Using Emulator Suite, prove:

- unauthenticated callable access fails as intended;
- missing/invalid App Check behavior is enforced in production-mode integration where testable;
- client Firestore reads/writes are denied;
- server quota writes work through Admin SDK only;
- quota enforcement behaves deterministically.

## 23.6 OpenRouter adapter tests

Mock:

- valid strict response;
- malformed/invalid response;
- unsupported structured-output model;
- timeout;
- provider unavailable;
- privacy/provider route unavailable;
- one repair attempt;
- second failure -> fail closed.

## 23.7 Privacy tests

Assert raw user input is not passed to:

- logger payloads;
- Firestore writes;
- analytics events.

Add code-review checks for logging of request bodies.

## 23.8 Client tests

At minimum:

- home input behavior;
- loading/error;
- ambiguity screen;
- guidance rendering;
- extrapolated badge;
- verified quote display;
- missing-quote behavior;
- support screen;
- offline support screen.

## 23.9 End-to-end

Use Maestro or an equivalent stable mobile E2E tool for:

1. ordinary wisdom happy path;
2. ambiguous choice path;
3. hard support/safety route;
4. network failure;
5. static support resource access.

---

# 24. Implementation phases

Keep each phase coherent. Do not try to generate the whole application in one uncontrolled mutation.

## Phase 0 — baseline and branch

- import the GitHub repo;
- verify `main` and the baseline;
- create a dedicated work branch such as:
  `ai-studio/react-native-mvp`
- copy this packet into `docs/IMPLEMENTATION_PACKET.md`;
- do not merge automatically.

Exit gate:
- source files identified;
- no canonical KB edits;
- clean branch baseline.

## Phase 1 — Expo scaffold + Firebase shell

- create Expo SDK 57 TypeScript app structure;
- add Expo Router;
- configure dev-build workflow;
- integrate Firebase app/auth/App Check/functions;
- add EAS config;
- add environment placeholders.

Exit:
- client builds in development configuration;
- no secret committed;
- Firebase modules initialize in dev build.

## Phase 2 — KB contract

- implement validator;
- implement deploy-copy build step;
- implement typed KB loader;
- hash/manifest derived copy.

Exit:
- deterministic validator green;
- no content mutations;
- functions can load exact KB.

## Phase 3 — static support/safety module

- local U.S. resources;
- support screen;
- deterministic routing enums/policy skeleton;
- offline availability.

Exit:
- resource screen works with network disabled;
- policy tests cover route precedence.

## Phase 4 — classification backend

- OpenRouter server adapter;
- strict schema;
- no content generation;
- category gold fixtures;
- ambiguity behavior.

Exit:
- classifier benchmark meets target;
- privacy/provider gate enforced;
- low confidence does not force a match.

## Phase 5 — retrieval + grounded phrasing

- deterministic entry retrieval;
- second structured-output call;
- grounding validator;
- source enrichment;
- bounded repair/fallback.

Exit:
- adversarial grounding suite passes;
- no model-supplied citation metadata reaches client unvalidated.

## Phase 6 — mobile experience

- home;
- clarification;
- guidance;
- source disclosure;
- extrapolation disclosure;
- support flow;
- accessibility.

Exit:
- ordinary/ambiguous/support flows work on a development build.

## Phase 7 — security/privacy/rate limits

- App Check enforcement;
- deny-by-default Firestore rules;
- server quota controls;
- sensitive logging audit;
- OpenRouter guardrails/provider policy.

Exit:
- emulator/security/privacy tests pass;
- no raw text persistence.

## Phase 8 — E2E and release candidate

- run full tests;
- `expo-doctor`;
- Android development/release candidate build;
- iOS build if credentials/environment permit;
- E2E flows;
- dependency/security review.

Exit:
- exact commands/results documented;
- unresolved platform credentials recorded honestly.

## Phase 9 — readback and handoff

Create `docs/IMPLEMENTATION_REPORT.md` with:

- implementation branch/head SHA;
- files created/modified;
- exact dependency versions;
- architecture implemented;
- model configuration placeholders;
- tests actually run;
- test counts/results;
- build results;
- privacy/security checks;
- known gaps;
- owner/manual setup still required;
- deviations from this packet and why;
- STOP/HOLD conditions if any.

Open a PR for review. Do not merge automatically.

---

# 25. STOP / HOLD conditions

Stop implementation and report rather than silently improvising if any of these occurs:

1. AI Studio attempts to convert the project to a web app.
2. AI Studio attempts to replace React Native with native Kotlin/Compose.
3. implementation requires rewriting canonical KB content merely for convenience.
4. OpenRouter credential would need to exist client-side.
5. raw user reflections would need to be persisted for ordinary functionality.
6. selected model does not support strict structured outputs.
7. privacy/ZDR/provider policy cannot be established.
8. safety gold fixtures produce a critical false-safe result.
9. grounding validator cannot deterministically reject invented quotes/citations.
10. Expo SDK 57 becomes incompatible and the proposed solution is to jump to beta/canary without review.
11. implementation proposes a vector database/embedding layer without measured retrieval failure.
12. implementation drifts into v2 live resource APIs.
13. implementation adds a new recurring paid service not already part of the frozen architecture.
14. Firebase/OpenRouter/React Native are to be replaced rather than implemented.
15. an owner credential, Apple/Google signing step, or billing activation is required and unavailable.

A HOLD is a valid result. Do not fake completion around it.

---

# 26. Definition of done

The MVP implementation increment is ready for owner review only when all applicable items are true:

- React Native/Expo project compiles.
- Android development build runs.
- iOS build runs where the required owner signing environment is available; otherwise the missing credential gate is documented.
- Firebase callable backend runs.
- App Check integrated and production enforcement configured.
- anonymous auth works.
- OpenRouter key is server-only.
- selected model is explicit and structured-output capable.
- ZDR/privacy route is configured.
- KB validates deterministically.
- canonical KB remains unchanged unless an owner-approved content correction was separately made.
- category classification fixture target met.
- safety suite has zero critical false-safe results.
- category 10 cannot return wisdom-only.
- category 5 abuse boundary cannot return conflict wisdom.
- category 21/24 escalation policies are enforced.
- grounding adversarial suite rejects invented content.
- all citations displayed to the user originate from the KB.
- all exact quotes displayed are verified quotes from the KB.
- extrapolated content is visibly disclosed.
- raw user text is not stored or logged.
- Firestore client rules are deny-by-default for MVP.
- support resource screen works offline.
- accessibility baseline checked.
- ordinary, ambiguous, safety/support, and failure E2E paths tested.
- no secrets committed.
- documentation is complete.
- implementation report identifies what actually ran.
- work exists on a reviewable branch/PR.
- `main` was not automatically mutated/merged.

---

# 27. Owner inputs required before production release

AI Studio should build around placeholders and report these as manual configuration steps:

- Firebase production project ID;
- Android application ID;
- iOS bundle identifier;
- Google Play / Apple Developer signing and store credentials;
- OpenRouter API key;
- explicit approved OpenRouter model ID;
- any approved provider allowlist;
- final rate-limit values;
- Firebase Blaze/billing activation if required for production Functions;
- budget alerts;
- final privacy policy/terms;
- App Store / Play Store metadata.

Do not invent final identifiers or credentials.

---

# 28. AI Studio-specific instruction

Google AI Studio's first-class build targets currently include full-stack web apps and native Android apps using Kotlin/Jetpack Compose. **This project is intentionally neither of those target architectures.**

When this repository is imported into AI Studio:

- use the agent as a repository-aware coding agent;
- generate/edit the React Native/Expo files directly;
- do not take absence of a first-class React Native preview as permission to change stacks;
- verify the project using the Expo/Firebase toolchain rather than a generated web preview;
- use external/native build output as the source of truth for mobile verification.

If AI Studio cannot execute a required native command itself, it must still write the correct project and record the exact unexecuted verification step in `IMPLEMENTATION_REPORT.md`.

---

# 29. Current-technology evidence behind the implementation decisions

These references are included so the implementation agent can revalidate assumptions rather than treating this packet as timeless.

### Expo / React Native

- Expo SDK 57 release: https://expo.dev/changelog/sdk-57
  - SDK 57 uses React Native 0.86.
  - August 27 update moved to React Native 0.86.3.
- Expo SDK 58 beta: https://expo.dev/changelog/sdk-58-beta
  - beta as of mid-September 2026;
  - uses React Native 0.88 Release Candidate during beta.
- React Native Firebase: https://rnfirebase.io/
  - Expo integration requires a development build;
  - not available in precompiled Expo Go.

### Firebase

Revalidate against current Firebase docs before deployment:

- Authentication
- App Check
- callable Cloud Functions
- Cloud Functions 2nd gen
- Firestore Security Rules / Emulator Suite

Primary documentation root:
https://firebase.google.com/docs

### OpenRouter

- Structured outputs:
  https://openrouter.ai/docs/guides/features/structured-outputs
- Guardrails:
  https://openrouter.ai/docs/guides/features/guardrails/overview
- Zero Data Retention / provider privacy:
  revalidate current OpenRouter privacy/provider documentation before production model selection.

### Google AI Studio

- Build mode:
  https://ai.google.dev/gemini-api/docs/aistudio-build-mode
- Native Android mode:
  https://ai.google.dev/gemini-api/docs/aistudio-android

AI Studio currently documents full-stack web and native Android/Kotlin as first-class build targets. That is why this packet explicitly prevents a silent stack conversion.

---

# 30. Final instruction to the implementation agent

Build the smallest coherent mobile system that satisfies this contract.

Do not impress the owner with extra features.  
Do not broaden the product.  
Do not manufacture knowledge.  
Do not hide uncertainty.  
Do not weaken safety for smoother demos.  
Do not turn private reflection text into analytics data.  
Do not create infrastructure without a demonstrated need.

Preserve the sourced knowledge already built, place a strict retrieval-and-validation layer around it, and ship a testable React Native MVP that can be audited from user input all the way back to the exact knowledge-base entries that produced the response.
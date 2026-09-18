# Inner Compass — Phase 6 MVP Implementation Report

**Implementation branch:** `ai-studio/react-native-mvp`  
**Clean baseline:** `f41b77f08d40ed2a336e39b5a4776f3e758d8b78`  
**Rejected build preserved at:** `backup/ai-studio-web-build-d0d75a9`  
**Validated implementation head before this report update:** `5a5b9298fd58cf61222e3993763e73086ae7545d`  
**Validation workflow run:** `35396592293`

> This report is evidence-based. A check is marked passed only when it was actually executed or directly verified by repository readback.

## 1. Architecture implemented

The work branch contains a genuine Expo / React Native mobile architecture rather than the rejected Vite/React-DOM web application.

Client:

- Expo SDK 57 stable line
- React Native 0.86.3
- React 19.2.3
- Expo Router
- native React Native primitives
- Expo development-build workflow
- Firebase Anonymous Authentication
- Firebase App Check
- limited-use App Check tokens for callable replay protection
- callable Firebase Functions client
- in-memory active-request state only
- Home → Clarification → Guidance → Support flow
- locally bundled support-resource screen
- source/confidence disclosure in guidance cards

Backend:

- Firebase Cloud Functions 2nd gen
- Node.js 22
- server-only OpenRouter adapter
- Firebase Secret Manager contract for the OpenRouter key
- explicit model ID configuration
- pseudonymous rate limiting
- deterministic KB loading
- deterministic safety/support route precedence
- bounded structured classifier
- deterministic category retrieval
- strict structured phrasing response
- grounding validator
- one bounded repair attempt
- canonical fallback
- server-side source/provenance enrichment

Data:

- `content/knowledge-base/` remains canonical.
- A deterministic build script creates a replaceable Functions deploy copy.
- No vector database or embedding layer was added.

## 2. Stable baseline decision

Current-release research performed September 18, 2026 found Expo SDK 57 remains the stable release line while SDK 58 is beta.

The implementation stays on the packet's stable SDK 57 / React Native 0.86.3 baseline rather than silently moving to beta/RC software.

Configured principal versions:

- `expo ~57.0.23`
- `react-native 0.86.3`
- `react 19.2.3`
- `expo-router ~57.0.22`
- `expo-dev-client ~57.0.19`
- `typescript ~6.0.3`
- `@types/react ~19.2.4`
- `@react-native-firebase/app 26.4.0`
- `@react-native-firebase/auth 26.4.0`
- `@react-native-firebase/app-check 26.4.0`
- `@react-native-firebase/functions 26.4.0`
- Functions `firebase-functions 7.4.0`
- Functions `firebase-admin 14.4.0`
- emulator test `@firebase/rules-unit-testing 5.0.2`
- emulator test `firebase 12.19.0`
- Firebase CLI `15.30.2`

## 3. Canonical KB readback

Direct GitHub readback on the implementation branch verified:

- 25 categories loaded;
- 75 entries loaded;
- 25 unique category IDs;
- 75 unique entry IDs;
- all categories contain all three pillars;
- hard ceiling remains `[10]`;
- escalation candidates remain `[21, 24]`.

The branch diff against `main` contains no changes under `content/knowledge-base/`.

**Status: VERIFIED by repository readback and CI validator.**

## 4. Privacy and security state

Implemented and/or exercised:

- OpenRouter API key is backend-only.
- `openrouter/auto` is explicitly rejected.
- OpenRouter provider routing requests ZDR-compatible routing, denies provider data collection, requires supported parameters, and disables fallbacks.
- Optional provider allowlist is supported.
- raw reflection text is not written by application code to Firestore or operational telemetry;
- mobile history/journal/favorites were not implemented;
- active client reflection state is in-memory only;
- client Firestore rules are deny-all;
- quota state is server-owned and keyed from a SHA-256 hash of anonymous UID plus hourly bucket;
- App Check enforcement is enabled on the callable function;
- callable client requests limited-use App Check tokens to match replay-protection consumption;
- anonymous authentication is required;
- model-supplied author/work/citation/confidence metadata is not trusted or accepted.

Firestore Emulator testing proved:

- unauthenticated client reads/writes are denied;
- authenticated client reads/writes are denied;
- Admin SDK can write server-owned operational state;
- pseudonymous hourly quota enforcement rejects requests after the configured limit.

## 5. Grounding contract

The three guidance blocks must map to the exact three canonical category entries.

The validator rejects:

- unknown entry IDs;
- duplicate/missing entry IDs;
- wrong category;
- wrong pillar;
- altered or invented teaching text;
- altered or invented practice;
- altered or unverified quote;
- invalid reflection/affirmation shape.

Source author, work, citation URLs, confidence, and confidence notes are attached by the server from the canonical KB after validation.

A second model call is permitted only as one bounded repair attempt. A second invalid result falls back to canonical stored content.

## 6. Classification contract

The classifier receives the 25-category catalog and explicit close-neighbor distinctions, not the wisdom teachings.

It returns a strict structure with:

- route candidate;
- up to three ranked category candidates;
- bounded safety/support signal codes.

The deterministic router requires clarification when:

- the model explicitly reports ambiguity;
- the top confidence is below threshold;
- the top two candidates are too close.

A clarification selection does not bypass safety/support signals; classification is re-run and safety gates remain authoritative.

No unmatched request silently defaults to Category 1.

A frozen ordinary-category benchmark contains 125 synthetic cases (five/category) with a target of at least 96% top-choice accuracy.

**Benchmark status: NOT RUN.** It requires an approved `OPENROUTER_API_KEY` and `OPENROUTER_MODEL_ID`.

## 7. Executed CI verification

GitHub Actions workflow `.github/workflows/inner-compass-ci.yml` executed successfully on validation run `35396592293`.

Passed gates:

1. mobile dependency installation;
2. Functions dependency installation;
3. canonical KB validation — **25 categories / 75 entries**;
4. mobile TypeScript compile — **PASS**;
5. Firebase Functions TypeScript build — **PASS**;
6. Functions unit tests — **13 passed / 0 failed**;
7. Firestore Emulator security/quota tests — **4 passed / 0 failed**;
8. Expo Doctor — **21/21 checks passed**.

The unit suite covers KB integrity, route precedence, ambiguity behavior, safety boundary behavior, canonical grounding, rejection of altered/invented grounded material, explicit-model enforcement, and OpenRouter privacy/provider request fields.

The emulator suite covers client-rule denial, server-owned operational writes, and quota enforcement.

## 8. Native build verification

The project is configured for Expo development/native builds.

**Android native development build:** NOT RUN; production Firebase app registration/native config is not available in this environment.  
**iOS native development build:** NOT RUN; requires the owner Apple/macOS/signing environment.  
**Firebase Firestore emulator/security integration:** PASS.  
**Live callable/OpenRouter integration:** NOT RUN; requires owner-approved Firebase/OpenRouter configuration.  
**E2E/Maestro:** NOT RUN; depends on a runnable configured development build.

These remain explicit verification gates rather than being represented as completed work.

## 9. Major corrections from rejected AI Studio build

The implementation branch does not carry forward:

- Vite;
- React DOM;
- `index.html`;
- Express as production backend;
- browser `localStorage`;
- saved journal/history;
- browser download/export behavior;
- direct Gemini fallback;
- hardcoded production model ID;
- generated affirmations as a second content corpus.

The rejected build remains preserved only at `backup/ai-studio-web-build-d0d75a9`.

## 10. Owner/manual inputs still required

Before production release:

- Firebase production project ID;
- Firebase Android app registration;
- Firebase iOS app registration;
- owner-approved Android package ID;
- owner-approved iOS bundle identifier;
- `google-services.json`;
- `GoogleService-Info.plist`;
- production App Check registration/configuration;
- Firebase billing/Blaze activation if required;
- OpenRouter API key;
- explicit approved OpenRouter model ID;
- optional approved provider allowlist;
- final rate-limit value;
- EAS/Google Play/Apple signing credentials;
- budget alerts;
- final privacy policy/terms/store metadata.

No production identifiers or credentials were invented.

## 11. Current HOLD gates

Repository-level implementation/CI verification is green.

Production readiness remains on HOLD until:

- classifier benchmark meets the frozen target using an approved model;
- live callable/OpenRouter integration is exercised;
- Android development build runs with the owner Firebase Android app configuration;
- iOS build is exercised when owner signing environment is available;
- mobile E2E flows are exercised on a configured development build;
- required production credentials/configuration are supplied.

## 12. Merge state

Draft PR:

`ai-studio/react-native-mvp` → `main`

PR #1 remains intentionally **draft**.

Automatic merge is not authorized.

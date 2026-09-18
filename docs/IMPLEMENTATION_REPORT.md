# Inner Compass — Phase 6 MVP Implementation Report

**Implementation branch:** `ai-studio/react-native-mvp`  
**Clean baseline:** `f41b77f08d40ed2a336e39b5a4776f3e758d8b78`  
**Rejected build preserved at:** `backup/ai-studio-web-build-d0d75a9`  
**Implementation head immediately before this report commit:** `eda87d0592b0c16d5ff8a7a0a3630be7f3dd8109`

> This report is intentionally evidence-based. A check is marked passed only when it was actually executed or directly verified by repository readback.

## 1. Architecture implemented

The work branch now contains a genuine Expo / React Native mobile architecture rather than the rejected Vite/React-DOM web application.

Client:

- Expo SDK 57 stable line
- React Native 0.86.3
- Expo Router
- native React Native primitives
- Expo development-build workflow
- Firebase Anonymous Authentication
- Firebase App Check
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

The implementation therefore stays on the packet's stable SDK 57 / React Native 0.86.3 baseline rather than silently moving to beta/RC software.

Configured principal versions:

- `expo ~57.0.23`
- `react-native 0.86.3`
- `react 19.2.3`
- `expo-router ~57.0.22`
- `expo-dev-client ~57.0.19`
- `@react-native-firebase/app 26.4.0`
- `@react-native-firebase/auth 26.4.0`
- `@react-native-firebase/app-check 26.4.0`
- `@react-native-firebase/functions 26.4.0`
- Functions `firebase-functions 7.4.0`
- Functions `firebase-admin 14.4.0`

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

**Status: VERIFIED by repository readback.**

## 4. Privacy and security state

Implemented:

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
- anonymous authentication is required;
- model-supplied author/work/citation/confidence metadata is not trusted or accepted.

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

No unmatched request silently defaults to Category 1.

A frozen ordinary-category benchmark now contains 125 synthetic cases (five/category) with a target of at least 96% top-choice accuracy.

**Benchmark status: NOT RUN.** It requires an approved `OPENROUTER_API_KEY` and `OPENROUTER_MODEL_ID`.

## 7. Tests/checks authored

Repository contains tests for:

- KB 25/75 integrity;
- route precedence;
- ambiguity behavior;
- ordinary safety preflight;
- relationship-safety boundary;
- canonical grounding fallback;
- rejection of invented teaching;
- rejection of altered quote;
- rejection of invented practice;
- rejection of `openrouter/auto`;
- OpenRouter provider/privacy request fields.

GitHub Actions workflow `.github/workflows/inner-compass-ci.yml` is configured to run on PRs to `main`:

1. install mobile dependencies;
2. install Functions dependencies;
3. validate canonical KB;
4. type-check mobile client;
5. build Firebase Functions;
6. run Functions unit tests;
7. run Expo Doctor.

**Execution status at report creation:** pending PR-triggered CI. No result is claimed yet.

## 8. Native build verification

The project is configured for Expo development/native builds.

**Android native development build:** NOT RUN in the connected GitHub environment.  
**iOS native development build:** NOT RUN; requires macOS/signing environment.  
**Firebase emulator integration:** NOT RUN yet.  
**E2E/Maestro:** NOT RUN yet.

These remain verification gates rather than being represented as completed work.

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

The code is ready for repository/CI review, but production readiness remains on HOLD until:

- PR CI executes successfully;
- classifier benchmark meets target using an approved model;
- Firebase emulator/security integration is exercised;
- Android development build runs;
- iOS build is exercised when owner signing environment is available;
- required production credentials/configuration are supplied.

## 12. Merge state

This work is intended for a draft pull request:

`ai-studio/react-native-mvp` → `main`

Automatic merge is not authorized.

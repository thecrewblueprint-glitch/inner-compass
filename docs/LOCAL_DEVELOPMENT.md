# Inner Compass — Local Development

## Prerequisites

- Node.js 22
- npm
- Firebase CLI
- Android Studio/Android SDK for Android native builds
- Xcode/macOS for iOS native builds
- an Expo development build; Expo Go is not sufficient for the native Firebase modules used here

## 1. Install dependencies

From the repository root:

```bash
npm install
npm --prefix functions install
```

## 2. Validate the canonical knowledge base

```bash
npm run validate:kb
npm run prepare:kb
```

The second command creates the replaceable deploy copy under `functions/generated/kb/`. Do not edit that generated copy directly.

## 3. Configure Firebase native app files

Register the Android/iOS applications in the intended Firebase project.

Keep the actual files outside Git and point local environment variables to them:

```text
GOOGLE_SERVICES_JSON=/absolute/path/to/google-services.json
GOOGLE_SERVICE_INFO_PLIST=/absolute/path/to/GoogleService-Info.plist
EXPO_ANDROID_PACKAGE=<owner-approved package id>
EXPO_IOS_BUNDLE_ID=<owner-approved bundle id>
```

Do not invent production identifiers.

## 4. Configure local emulator mode

For local native testing:

```text
EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true
EXPO_PUBLIC_FIREBASE_EMULATOR_HOST=<host reachable from the test device/emulator>
```

For Android Emulator, the host normally differs from localhost. Use the host appropriate to the actual emulator/device environment.

## 5. Configure Functions parameters/secrets

Required before live grounded guidance:

- `OPENROUTER_API_KEY` — Firebase Secret Manager secret
- `OPENROUTER_MODEL_ID` — explicit structured-output-capable model
- optional `OPENROUTER_PROVIDER_ALLOWLIST`
- optional `GUIDANCE_RATE_LIMIT_PER_HOUR`

The code rejects `openrouter/auto`.

## 6. Start Firebase emulators

```bash
firebase emulators:start
```

## 7. Run static checks and unit tests

```bash
npm run validate:kb
npm run typecheck
npm --prefix functions run build
npm --prefix functions test
npx expo-doctor
```

## 8. Run the classifier benchmark

This is deliberately separate because it requires a live approved model and incurs API use:

```bash
OPENROUTER_API_KEY=... OPENROUTER_MODEL_ID=... npm --prefix functions run test:classifier
```

The frozen corpus contains 125 ordinary synthetic category cases and requires at least 96% top-choice accuracy.

## 9. Run the mobile app

Use a development build:

```bash
npx expo run:android
# or, on macOS with iOS tooling:
npx expo run:ios
```

The normal flow is:

Home → optional clarification → grounded guidance, with support resources always separately accessible.

## Release discipline

Implementation work stays on `ai-studio/react-native-mvp`. Review through a PR into `main`. Do not auto-merge.

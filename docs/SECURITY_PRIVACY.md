# Inner Compass — Security and Privacy

## Security boundary

Inner Compass treats the mobile client as untrusted. The MVP requires:

- Firebase Anonymous Authentication;
- Firebase App Check;
- a Firebase Cloud Functions 2nd gen callable backend;
- server-only OpenRouter credentials;
- deny-by-default direct client access to Firestore.

The mobile client never receives `OPENROUTER_API_KEY`.

## Reflection text

Raw user reflection text is transient request data.

The implementation must not write reflection text to:

- Firestore;
- analytics;
- operational telemetry;
- crash metadata;
- persistent local history.

The client keeps only the currently active request in memory. The MVP does not contain a saved journal, favorites, reflection history, or browser/local storage system.

## Operational telemetry

`functions/src/lib/telemetry.ts` records only coarse operational fields:

- client request ID;
- status;
- latency;
- configured model ID;
- grounding-validator status.

It does not accept raw reflection text.

## Rate limiting

The server hashes the anonymous Firebase UID with SHA-256 before using it in an hourly quota document key.

Firestore client rules deny all direct reads and writes. Quota counters are written only by the server/Admin SDK.

## OpenRouter

The backend adapter requires an explicit `OPENROUTER_MODEL_ID`; `openrouter/auto` is rejected.

Provider routing requests:

- zero-data-retention-compatible routing;
- provider data collection denied;
- required parameters enforced;
- provider fallback disabled.

An optional `OPENROUTER_PROVIDER_ALLOWLIST` can further restrict provider routing.

If the configured model/provider cannot satisfy the structured-output or privacy contract, the request fails instead of silently weakening the policy.

## Knowledge provenance

The canonical source of truth is `content/knowledge-base/`.

The model does not supply source metadata. After generation, the server enriches accepted output with author, work, citations, confidence, and confidence notes from the canonical KB.

For the three pillar cards, generated output must reproduce the selected canonical teaching, practice, and verified quote exactly. The grounding validator rejects invented or altered content.

## Safety and support routing

Deterministic policy executes before ordinary model classification. The model can add an escalation signal but cannot downgrade a deterministic redirect.

Category-level hard ceilings and escalation candidates come from the canonical KB index. The support resource screen is bundled locally so contact information is readable without network access.

## Secrets and production configuration

Do not commit:

- Firebase native configuration files;
- OpenRouter secrets;
- signing keys;
- service-account credentials;
- production environment files.

Production release requires owner-supplied Firebase app registrations, App Check setup, signing credentials, approved OpenRouter model/provider configuration, billing configuration where required, and store metadata.

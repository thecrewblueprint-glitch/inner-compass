# Inner Compass — controlled Beta source-readback audit
**Read-only evidence as of October 28, 2026. This is not public-release authorization, legal counsel approval, or manual WCAG certification.**

## Observed deployment
- **Main source SHA observed:** `71ddf6bd1e14423923291be245496309852828b0`.
- GitHub reported completed **deploy, production-build, build and browser-e2e** checks as success at that SHA.
- `.github/workflows/pages.yml` sets `VITE_INNER_COMPASS_PREVIEW: "false"` and `VITE_INNER_COMPASS_DEBUG: "false"` for the Pages build, so the preview-mode release-gate bypass is not intentionally activated in that deployment workflow.
- `src/legal/legalConfig.ts` defaults to **CONTROLLED_BETA** unless legal operator, legal contact, counsel-reviewed AND owner public-launch-approved environment values are present. Code guards are **not** evidence those people actually approved launch.
- `server.ts` exposes production `/api/health` with no reflection text, and the test-only `/api/eval/guidance` route is under `if (!isProduction)`. This is a source-code boundary only; production hosting and browser network behavior need their own observation.
- `docs/legal/PRIVACY_NOTICE.md` declares browser-local deterministic processing, local diagnostic events and no targeted advertising SDK. `src/App.tsx` writes saved theme, reflection metadata and settings into localStorage. The saved journal data lifecycle remains in policy scope.
- The `LaunchGate` visibly describes 18+/US self-attestation; this is **not** identity, birthdate or geolocation verification.

## Current acceptance matrix
| Gate | Observed result | Why it is not closure |
| --- | --- | --- |
| GitHub source build and browser E2E | Pass at observed SHA | Not equivalent to latest external URL, manual-device, accessibility, security and legal review |
| Pages preview/debug bypass configuration | Disabled in workflow source | Must be checked against each future deployment environment |
| Controlled Beta fallback | Implemented in source | Human signoffs and configured operator/contact unknown |
| Raw reflection production processing | Client-first source design; test endpoint isolated | End-to-end network/proxy and real-host logs not independently inspected |
| Rights, translations, consumer-health claims | Published rights rules / legal docs present | Licensed human content/rights review remains required |
| Public-release approval | **Not established** | Operator identity/contact, counsel, owner release authorization are external sign-offs |
| Device accessibility / assistive technology | Automated checks on prior main | Actual manual screen-reader, reflow and keyboard acceptance incomplete |

## Executed engineering change within PR #40
Extended the existing `tools/eval/audit_release_readiness.py` gate to fail if the Pages workflow no longer explicitly disables preview/debug, if legal and owner release configuration guards disappear, or if a production test reflection endpoint becomes unguarded. This strengthens a **read-only static contract check**, not consent or a production release.

## Source access and privacy
This audit used GitHub source and check metadata only; no user journal, diagnostics, reflection text, private Personality records, authentication credentials, browser storage, calendar subscriptions or analytics traffic were collected. No production settings, legal operator data, external calendars or release flags were changed.

**Remaining checks:** Run actual offline Python release audit / TypeScript lint / build / browser E2E together on the final branch in the owner's preferred batch validation pass. Operator/counsel/owner approval must still be explicitly verified by authorized people.

# Privacy Data Map

## Raw reflection text

**Collection:** entered in browser UI.

**Processing:** deterministic safety/classification/retrieval in browser memory.

**Persistence:** none intended.

**Production network transmission:** none.

**Remote analytics/logging:** none.

## Local browser storage

| Key | Content | Purpose |
|---|---|---|
| `inner_compass_saved_reflections_v1` | category ID/name, timestamp, redacted placeholder, synthesis, affirmation | local journal |
| `inner_compass_category_interactions_v1` | category ID, count, timestamps, interaction-source labels | optional personalization |
| `inner_compass_personalization_enabled_v1` | boolean | personalization preference |
| `inner_compass_launch_attestation_us_adult_v1` | local 18+ / U.S. eligibility attestation and timestamp | launch scope gate |
| `inner_compass_debug_events_v1` | bounded privacy-safe route/safety/category/error metadata; no raw reflection text | local diagnostics/debugging |
| theme-related keys | UI preference | presentation |

Raw reflection text must never be placed in these records.

## Diagnostics boundary

Local diagnostics:
- are capped at 300 events;
- record route/safety/category/error metadata only;
- strip payload fields whose keys could carry text/content/message/reflection data;
- contain no remote transport;
- can be cleared locally;
- can be exported only by explicit user/admin action from that browser.

## User controls

The product provides:
- personalization on/off;
- clear journal;
- clear personalization history;
- clear all Inner Compass local data;
- clear/export local diagnostics from the diagnostics console.

## Server

Production receives no reflection payload.

The production health endpoint exposes only non-sensitive release/runtime metadata such as:
- deterministic runtime;
- category count;
- external provider count;
- raw-reflection transport state;
- supported language;
- minimum age;
- release tier;
- legal-configuration flags;
- remote-diagnostics transport state.

## Third parties at launch

- no runtime AI/model provider;
- no account provider;
- no advertising SDK;
- no third-party behavioral analytics SDK;
- no cloud journal sync.

User-initiated external links may open lifeline, library, publisher, or scholarly sites. Those destination sites have their own privacy practices.

## Retention

Local data remains until the browser/user removes it. The product exposes explicit deletion controls.

## Public-release configuration

Without configured legal operator/contact, counsel review, and owner public-launch approval, the app reports **CONTROLLED_BETA** rather than public release.

## Prohibited future regression

Any feature that transmits raw reflection text, adds account/cloud sync, advertising, remote diagnostics, or a third-party processor requires a new privacy/data-flow review before release.

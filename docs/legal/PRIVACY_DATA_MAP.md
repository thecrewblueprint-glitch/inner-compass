# Privacy Data Map

## Raw reflection text

**Collection:** entered in browser UI.

**Processing:** deterministic safety/classification/retrieval in browser memory.

**Persistence:** none.

**Production network transmission:** none.

**Analytics/logging:** none.

## Local browser storage

| Key | Content | Purpose |
|---|---|---|
| `inner_compass_saved_reflections_v1` | category ID/name, timestamp, redacted placeholder, synthesis, affirmation | local journal |
| `inner_compass_category_interactions_v1` | category ID, count, timestamps, interaction-source labels | optional daily personalization |
| `inner_compass_personalization_enabled_v1` | boolean | personalization preference |
| `inner_compass_age_confirmed_v1` | boolean | adult-launch gate |
| theme-related keys | UI preference | presentation |

Raw reflection text must never be placed in these records.

## User controls

The Privacy screen provides:
- personalization on/off;
- clear journal;
- clear personalization history;
- clear all Inner Compass local data.

## Server

Production receives no reflection payload. Health/category metadata endpoints contain no user reflection content.

## Third parties at launch

- no runtime AI provider;
- no account provider;
- no analytics/advertising SDK;
- no cloud journal sync.

User-initiated external links may open lifeline, public-domain reading, publisher, library, or scholarly sites. Those destination sites have their own privacy practices.

## Retention

Local data remains until the browser/user removes it. The product exposes explicit deletion controls.

## Prohibited future regression

Any feature that transmits raw reflection text, adds account/cloud sync, analytics, advertising, or a third-party processor requires a new privacy/data-flow review before release.

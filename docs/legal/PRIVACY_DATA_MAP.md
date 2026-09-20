# Inner Compass — Privacy & Data Map

Status: v1 privacy-by-design specification.

## Production data flows

### Reflection input

User types reflection → browser memory → local deterministic safety router → local deterministic classifier → bundled canonical KB → display.

**Network transmission: NONE.**

**Persistence of raw text: NONE.**

### Saved journal

User chooses Bookmark → app stores category-level metadata in browser local storage.

Stored:
- local random record ID;
- timestamp;
- category ID/name;
- canonical synthesis;
- original Inner Compass affirmation.

Not stored:
- raw reflection text.

### Local personalization

The app may store category IDs and interaction types locally so daily content can draw from categories the user has explored.

No server receives this information.

### Launch attestation

Stored locally:
- adult/U.S. launch acceptance boolean/version.

Not stored:
- date of birth;
- exact age;
- physical location.

## Data not collected by Inner Compass v1

- account credentials;
- email;
- phone;
- precise location;
- contacts;
- advertising identifiers;
- medical records;
- Apple Health / Health Connect data;
- wearable data;
- payment data;
- raw reflection text on a server;
- third-party analytics identifiers.

## Hosting metadata

A hosting provider may receive ordinary HTTP request metadata needed to deliver the static site, such as IP address, timestamp, browser headers, and requested asset paths.

The production app must not place reflection text in:
- URLs;
- query strings;
- fragments intended for server processing;
- request bodies;
- error-reporting payloads.

## Local storage keys

- `inner_compass_saved_reflections_v1`
- `inner_compass_category_interactions_v1`
- adult/U.S. launch attestation key
- theme/UI preference keys as implemented

## User controls

Required:
- clear saved reflections;
- clear interaction personalization;
- clear launch attestation;
- one-action Clear All Local Data.

## Future features requiring a new assessment

- login/accounts;
- cloud sync;
- analytics;
- ads;
- payment;
- email;
- push notifications;
- health-device integration;
- geolocation;
- cross-device personalization;
- research studies using user data.

# Inner Compass Privacy Notice

**Effective:** September 20, 2026

## Core privacy architecture

Raw reflection text is processed in the user's browser by deterministic rules. The production application is designed not to transmit raw reflection text to an Inner Compass server, model provider, advertising network, or analytics service.

## Local data

The browser may store:

- category-level bookmarks and affirmations;
- category interaction counts for optional personalization;
- theme/settings data;
- adult/U.S. launch attestation;
- privacy-safe local diagnostic events.

Raw reflection text is not intentionally persisted.

## Local diagnostics

Diagnostics may record route outcomes, safety status, category IDs, timing, session identifiers, and error metadata. Fields capable of containing reflection/message/content text are stripped before storage. Diagnostics remain on the device unless the user chooses to export a debug bundle.

## Third-party links

User-initiated links to lifelines, libraries, publishers, or research sites leave Inner Compass. The destination service may receive ordinary web-request data under its own policy.

## Retention and deletion

Local data remains until the user or browser removes it. Product controls allow the user to clear journal data, personalization history, diagnostics, or all Inner Compass local data.

## Advertising / sale

The current release does not sell personal data, use reflection data for targeted advertising, or include third-party behavioral advertising/analytics SDKs.

## Future-change rule

Accounts, cloud sync, remote reflection processing, advertising, or third-party analytics require a new privacy/data-flow review before release.

## Contact

A legal/privacy contact must be configured before public launch.

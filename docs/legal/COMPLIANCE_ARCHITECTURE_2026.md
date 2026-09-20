# Inner Compass Compliance Architecture — 2026

## Launch configuration

- Initial public audience: **18+**
- Initial marketed geography: **United States**
- Product position: general-wellness / reflective educational tool
- Raw reflection processing: **local browser only**
- Runtime AI providers: **none**
- Accounts/cloud sync: **none at launch**
- Ads/trackers/third-party analytics: **none at launch**
- Direct quote display: **disabled until rights-approved**

## Data-flow boundary

```text
Reflection text
  -> browser-only deterministic safety router
  -> browser-only deterministic 25-category retrieval
  -> local clarification when confidence is insufficient
  -> canonical synthesis + audited source-linked affirmation
  -> display

No reflection network request is required.
```

The production server serves static application assets and a non-sensitive health endpoint. The deterministic evaluation endpoint exists only in non-production mode for regression testing.

## Safety authority

The deterministic upstream safety router remains authoritative over:
- ordinary taxonomy browsing;
- reflection matching;
- daily content;
- saved-content navigation.

Hard-ceiling content cannot be made reachable by bypassing the reflection form.

## Research boundary

`research/wisdom-corpus/**` and `research/reading-directory/**` are source/research datasets. Promotion into user-facing exact quotations or other higher-risk displays requires the relevant rights/safety gate.

## External launch approvals

Repository controls cannot establish:
- legal operator/entity choice;
- official legal/privacy contact;
- attorney review or legal sufficiency;
- final hosting/subprocessor contract terms;
- final manual accessibility certification.

Those are owner/counsel launch decisions and must not be inferred from passing engineering tests.

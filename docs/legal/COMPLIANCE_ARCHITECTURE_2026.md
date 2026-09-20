# Inner Compass Compliance Architecture — 2026

## Launch configuration

- Initial audience: **18+**
- Initial geography: **United States**
- Supported language: **English only**
- Product position: general-wellness / reflective educational tool
- Raw reflection processing: **local browser only**
- Runtime AI/model providers: **none**
- Accounts/cloud sync: **none at launch**
- Ads/third-party behavioral analytics: **none at launch**
- Remote diagnostics telemetry: **none**
- Direct quote display: **disabled until rights-approved**
- Default release tier without external approvals: **CONTROLLED_BETA**

## Data-flow boundary

```text
Reflection text
  -> browser-only deterministic safety router
  -> safety / precautionary safety-review redirect if triggered
  -> browser-only deterministic 25-category retrieval if safe
  -> local clarification when confidence is insufficient
  -> canonical synthesis + audited source-linked affirmation
  -> display

No production reflection network request is required.
No remote diagnostics transport is present.
```

The production server serves static application assets and a non-sensitive health endpoint. The deterministic evaluation endpoint exists only in non-production mode for regression testing.

## Safety authority

The deterministic upstream safety router remains authoritative over:
- reflection matching;
- direct category navigation hard ceilings;
- saved-content navigation;
- contextual safety-review redirects.

When a safety route triggers, ordinary wisdom is blocked.

The supported production claim is **not** perfect semantic detection of every possible human phrase. The enforceable claim is that every supported reflection path executes safety routing first and every audited supported safety/context fixture must route correctly.

## Legal surfaces

User-facing legal/safety center includes:
- Terms of Use;
- Privacy Notice;
- separate Consumer Health Data Privacy Policy;
- Safety & Crisis Notice;
- Accessibility Statement.

Launch/home/footer surfaces link into these notices, including a direct homepage link to the consumer-health-data policy.

## Operational observability

A local diagnostics console can be enabled for controlled testing. It records privacy-safe route/safety/category/error metadata only and can export a local debug bundle. It is not a remote admin/analytics system.

## Accessibility

Engineering target: WCAG 2.2 AA.

Automated axe/Playwright checks are smoke tests. Manual WCAG review remains a public-launch gate.

## Research boundary

`research/wisdom-corpus/**` and `research/reading-directory/**` are source/research datasets. Promotion into user-facing exact quotations or other higher-risk displays requires the relevant rights/safety gate.

## External launch approvals

Repository controls cannot establish:
- legal operator/entity choice;
- official legal/privacy contact;
- attorney review/legal sufficiency;
- final hosting/subprocessor contract terms;
- final dependency/security approval;
- final manual accessibility certification;
- public-launch owner approval.

Those are explicit launch gates and are never inferred from passing engineering tests.

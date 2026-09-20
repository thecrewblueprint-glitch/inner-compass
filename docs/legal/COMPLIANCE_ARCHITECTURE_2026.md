# Inner Compass — Compliance Architecture (U.S. Launch)

Status: engineering compliance baseline. **Not a substitute for review by qualified counsel before public launch.**

Last reviewed: 2026-09-19.

## Product posture

Inner Compass is designed as a **general wellness / guided reflection product**, not a medical device, diagnosis service, psychotherapy service, clinical decision-support tool, or emergency service.

The production web app must remain:

- deterministic;
- local-first;
- account-free at launch;
- advertising-free;
- tracker-free;
- free of runtime LLM/AI-provider dependencies;
- free of server-side raw-reflection processing;
- free of connected health-record, wearable, or fitness-data integrations;
- 18+ for the initial launch;
- U.S.-only for the initial marketed launch.

## Binding engineering rules

### C-01 — Raw reflection never leaves the device

Production code MUST NOT transmit user reflection text to any server, analytics product, AI provider, error-reporting product, logging service, or third party.

Permitted production processing:
1. in-memory browser processing;
2. local deterministic safety routing;
3. local deterministic category matching;
4. local retrieval from bundled canonical content.

A build fails if a production reflection path uses `fetch`, XMLHttpRequest, WebSocket, beacon, or provider SDKs.

Reason: reflections can reveal or allow inference of mental/physical health status and therefore may fall within state consumer-health-data or sensitive-data laws.

### C-02 — No server-side reflection endpoint

Production artifacts MUST NOT include `/api/guidance`, `/api/eval/guidance`, OpenRouter, Gemini, or equivalent runtime provider routes.

Synthetic evaluation infrastructure may exist only under `tools/eval/**` and must not be part of the production build.

### C-03 — Data minimization

The production app does not intentionally collect:
- name;
- email;
- phone;
- birthdate;
- exact age;
- precise location;
- account identifiers;
- raw reflection text;
- medical records;
- connected-device health data.

Local device storage may contain:
- saved category IDs;
- source type of interaction;
- saved category name;
- canonical synthesis;
- original Inner Compass affirmation;
- UI/theme preferences;
- adult/U.S. launch attestation.

Raw user reflection text is never persisted.

### C-04 — Initial age and geography scope

Initial public launch is for users who attest:
- they are at least 18; and
- they are located in the United States.

The gate stores only the attestation state locally. It does not request or store a birthdate or precise location.

Do not market the initial release to minors.

A future minors release requires a separate privacy/safety design review.

### C-05 — No sale, sharing, targeted ads, or behavioral advertising

No advertising SDKs, ad pixels, third-party analytics pixels, cross-context behavioral advertising, sale of personal data, or sharing for targeted advertising.

Do not add a third-party analytics or session-replay SDK without a new legal/privacy review.

### C-06 — General wellness claims only

Allowed:
- guided reflection;
- sourced philosophical context;
- non-clinical psychology education;
- prompts that support self-reflection;
- deterministic categorization for navigation.

Prohibited marketing/product claims without a separate regulatory and substantiation review:
- diagnosis;
- detecting a disorder;
- treating, curing, mitigating, or preventing a disease/condition;
- clinical risk scores;
- predicting a user's health outcome;
- replacing therapy, medical care, or emergency care;
- guaranteed mental-health outcomes.

The UI should say "reflection category," not "diagnosis."

### C-07 — Safety routing is scope control, not diagnosis

Safety routing may stop ordinary wisdom output and show static public support resources.

It must not:
- diagnose a condition;
- produce a clinical risk score;
- tell a user that a clinical condition has been detected;
- claim a medical prediction.

User-facing copy should state that the input is outside the app's reflection scope and point to human support.

### C-08 — Quote display requires rights approval

A source being ancient/public domain does **not** automatically make a modern translation public domain.

Research corpus statuses and product display are separate.

Production may display a direct quote only when the exact translation has:
1. a verified source locator;
2. named translator/edition;
3. an explicit product-display rights status;
4. jurisdictional review appropriate for the launch;
5. no unresolved attribution/translation-integrity flag.

Until then, production displays a source-linked teaching summary rather than the direct quote.

### C-09 — Research corpus is not production content

Files under `research/wisdom-corpus/**` are staging/research material. They are not automatically bundled into the app.

Promotion requires:
- source audit;
- rights audit;
- category-fit audit;
- safety audit;
- product copy audit;
- explicit approved-for-product status.

### C-10 — Local journal disclosure and deletion

The journal stores only non-raw category metadata on the device.

The app must:
- explain that local device storage is used;
- provide a one-action "Clear Local Data" control;
- explain that clearing browser/site data may also remove saved content.

### C-11 — Accounts, cloud sync, and connected health data are blocked for v1

Do not add:
- Firebase/Supabase user accounts;
- cloud journal sync;
- health/wearable integrations;
- email-based personalization;
- server-side personalization;
- cross-device behavioral profiles.

Any such feature requires a fresh privacy/data-protection assessment before implementation.

### C-12 — Security

Because production is static/local-first:
- no API secrets in client code;
- no production provider keys;
- Content Security Policy should be added at deployment;
- third-party scripts should be minimized;
- dependencies should be patched and reviewed;
- production source maps should be evaluated before deployment.

### C-13 — Accessibility

Target WCAG 2.2 AA as the engineering accessibility baseline:
- keyboard-accessible controls;
- accessible labels;
- focus visibility;
- adequate contrast;
- no color-only meaning;
- reduced-motion support where animation exists;
- semantic heading/navigation structure.

This is a design/risk-reduction standard and is not a claim of legal certification.

## Current legal-risk assessment

| Area | Before this compliance branch | Required posture |
| --- | --- | --- |
| Raw reflection network transmission | HIGH | eliminate |
| Runtime AI/provider sharing | HIGH | eliminate |
| Consumer health/sensitive data | HIGH | local-only/minimized |
| Minors | HIGH | initial 18+ gate |
| Medical-device/clinical claims | MED-HIGH | general-wellness only |
| Copyright/translation quotes | HIGH | rights-gated display |
| Analytics/ads | MED-HIGH | none at launch |
| Accounts/cloud sync | HIGH if added | blocked for v1 |
| Research-to-production promotion | MED-HIGH | explicit audit gate |
| Accessibility | MEDIUM | WCAG 2.2 AA target |
| International privacy/rights | HIGH | U.S.-only marketed launch |

## Official legal references used for this engineering posture

- FTC COPPA final rule amendments: https://www.ftc.gov/legal-library/browse/federal-register-notices/16-cfr-part-312-coppa-final-rule-amendments
- FTC COPPA final rule announcement: https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data
- FTC health privacy guidance: https://www.ftc.gov/business-guidance/privacy-security/health-privacy
- FTC Health Breach Notification Rule: https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule
- FTC mobile health app best practices: https://www.ftc.gov/business-guidance/resources/mobile-health-app-developers-ftc-best-practices
- Washington My Health My Data Act: https://app.leg.wa.gov/RCW/default.aspx?cite=19.373
- Colorado Privacy Act: https://coag.gov/resources/colorado-privacy-act/
- Connecticut Data Privacy Act: https://portal.ct.gov/ag/sections/privacy/the-connecticut-data-privacy-act
- California CCPA: https://oag.ca.gov/privacy/ccpa
- FDA General Wellness guidance (2026): https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices
- FTC mobile-app marketing guidance: https://www.ftc.gov/business-guidance/resources/marketing-your-mobile-app-get-it-right-start
- FTC Health Products Compliance Guidance: https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance
- U.S. Copyright Office — derivative works/translations: https://www.copyright.gov/circs/circ14.pdf
- U.S. Copyright Office — fair use: https://www.copyright.gov/help/faq/faq-fairuse.html

## Mandatory pre-launch counsel questions

1. Identify the legal operator/entity and privacy contact.
2. Confirm the 18+/U.S.-only launch posture and terms presentation.
3. Confirm whether any state consumer-health-data law still creates obligations for locally processed data or ordinary hosting logs.
4. Confirm final privacy notice and terms.
5. Confirm rights status for every direct quote intended for product display.
6. Confirm claims language remains general wellness and does not create medical-device or deceptive-advertising risk.
7. Review deployment host logging, subprocessors, and retention.

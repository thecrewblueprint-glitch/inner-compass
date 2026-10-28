# Issue #8 — Inner Compass Beta launch-compliance action plan
**2026-10-28 · Priority P1 · PLANNING ONLY — PUBLIC REPOSITORY**
Issue: https://github.com/thecrewblueprint-glitch/inner-compass/issues/8

## Scope
The GitHub Pages site is a publicly accessible 18+ US Beta, with deterministic local-first runtime documented on main. A deployed Beta is not equivalent to legal/security/accessibility certification. No personal user records, raw reflection text, credential data or private Personality repository information may enter this file or public PR.

## Phase 1 — factual build and hosting audit
- [ ] Record current main SHA, public Pages URL, build script, dependency lock, workflow outcomes and relevant known failing tests. Do not count historical CI results as current.
- [ ] Inspect actual external network calls, local browser storage/cookies, third-party hosts, links, telemetry (if any) and data lifecycle; compare observed behavior with public Terms/Privacy/Cookies/Consumer Health Data notices.
- [ ] Maintain a redacted data-flow map. No collection of raw journal/reflection user content during validation.

## Phase 2 — privacy, claims and rights
- [ ] Verify age/US Beta gate under supported navigation; do not turn an honor-system browser gate into a claimed secure identity verifier.
- [ ] Match deterministic/nonclinical claims to actual runtime paths; audit for tracking/SDK/content fallback drift.
- [ ] Evaluate exact quotes/translation provenance, usage rights and display policy; preserve summary-only restrictions where rights uncertain.
- [ ] Verify incident/support/contact language and operator/processor fields against owner-supplied legal details; never invent counsel approval.

## Phase 3 — UX and security QA
- [ ] Run current automated test, lint/build, link validation, dependency review and browser E2E with captured exact run/commit.
- [ ] Perform manual keyboard focus, screen-reader, zoom/reflow, contrast, reduced-motion and small-device workflows on the real public Beta.
- [ ] Record reproducible defects with priority, affected routes and proof; correct scoped app code in follow-up commits to this draft where permitted.

## Phase 4 — sign-off
- [ ] Publish a release evidence matrix: gate, observed status, responsible party, test artifact, exception, owner decision.
- [ ] Keep legal operator/contact, security signoff, counsel review and final release approval as **external human gates**; not checked automatically from doc changes.
- [ ] Prevent unrelated natal-chart implementation or Affirmation Calendar plans from slipping into this launch release.

**Done:** The current deployed Beta's documented behavior matches verified tests and privacy claims, residual risks are explicit, and required human approvals are recorded. This draft PR is not legal advice or public launch approval.
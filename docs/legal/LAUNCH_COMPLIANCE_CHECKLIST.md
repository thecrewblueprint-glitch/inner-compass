# Launch Compliance Checklist

## Engineering / product gates

- [x] 18+ production eligibility gate implemented
- [x] U.S.-only launch scope stated in product and lifeline UI
- [x] English-only release scope stated in product and safety notices
- [x] Raw reflection processed locally in browser
- [x] Production reflection network request removed
- [x] Runtime AI/provider dependencies removed
- [x] No account/cloud-sync dependency at launch
- [x] No ads/third-party behavioral analytics added
- [x] No remote diagnostics telemetry
- [x] Local diagnostics event store bounded and raw-text-excluding
- [x] Local diagnostics visual data hub / export / reset
- [x] Runtime/render error capture recorded locally
- [x] Clear Journal control
- [x] Clear Personalization History control
- [x] Clear All Local Data control
- [x] Personalization opt-out
- [x] Category 10 hard ceiling enforced on direct navigation
- [x] Category 10 excluded from unsolicited daily content
- [x] Upstream safety routing runs before ordinary reflection retrieval
- [x] Precautionary safety-review route added for indirect/negated/unclear safety context
- [x] Safety/context route matrix added
- [x] Human-flow harness captures safety rule/confidence/block metrics
- [x] Direct quote product display disabled pending rights approval
- [x] Canonical direct-quote inventory generated
- [x] Consumer-facing “clinical wisdom” branding removed
- [x] Wisdom/reading research separated from canonical production KB
- [x] Zero-runtime-AI policy guard
- [x] Wisdom corpus integrity audit
- [x] Suggested Reads integrity audit
- [x] Terms of Use product surface + repository artifact
- [x] Privacy Notice product surface + repository artifact
- [x] Separate Consumer Health Data Privacy Policy + prominent homepage link
- [x] Safety & Crisis Notice
- [x] Accessibility Statement
- [x] Controlled-beta/public-release configuration gate
- [x] Persistent 18+/U.S./English/general-wellness disclosure
- [x] Automated accessibility smoke test added
- [x] Production dependency audit added

## Release verification gates

- [ ] PR CI green on exact merge candidate
- [ ] Production build starts and health reports zero runtime AI providers
- [ ] Production health reports raw reflection transport false
- [ ] Production health reports remote diagnostics transport false
- [ ] Production health defaults to CONTROLLED_BETA without external approval config
- [ ] Browser E2E confirms no reflection request to `/api/guidance`
- [ ] Legal pages visible from user-facing navigation
- [ ] Consumer Health Data Privacy Policy directly reachable from homepage
- [ ] Local diagnostics E2E confirms raw reflection text is absent
- [ ] Automated accessibility smoke has no serious/critical findings on audited surfaces
- [ ] Safety/context matrix passes 100%
- [ ] 12k deterministic flow regression meets quality thresholds
- [ ] Production dependency audit has no high/critical production finding
- [ ] Final critical external-resource link verification
- [ ] Manual WCAG 2.2 AA review

## External owner/counsel/host gates — cannot be self-certified by code

- [ ] Legal operator/entity identified
- [ ] Privacy/legal contact configured
- [ ] Terms of Use reviewed/approved
- [ ] Privacy Notice reviewed/approved
- [ ] Consumer Health Data Privacy Policy reviewed/approved
- [ ] Hosting/subprocessor contractual/logging review completed for selected production host
- [ ] Final security/dependency review sign-off
- [ ] U.S.-only public launch explicitly approved by owner
- [ ] Manual WCAG 2.2 AA review/sign-off
- [ ] Counsel sign-off, if required by owner/risk plan

## Release rule

Passing engineering tests establishes a **controlled-beta candidate**, not a public legal approval.

Public release remains blocked until the owner-designated release authority accepts every required external gate above.

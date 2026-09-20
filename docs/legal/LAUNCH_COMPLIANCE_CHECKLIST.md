# Launch Compliance Checklist

## Engineering gates

- [x] 18+ production age gate implemented
- [x] U.S.-only launch scope stated in product and lifeline UI
- [x] Raw reflection processed locally in browser
- [x] Production reflection network request removed
- [x] Runtime AI/provider dependencies removed
- [x] No account/cloud-sync dependency at launch
- [x] No ads/third-party analytics added
- [x] Clear Journal control
- [x] Clear Personalization History control
- [x] Clear All Local Data control
- [x] Personalization opt-out
- [x] Category 10 hard ceiling enforced on direct navigation
- [x] Category 10 excluded from unsolicited daily content
- [x] Direct quote product display disabled pending rights approval
- [x] Canonical direct-quote inventory generated
- [x] Consumer-facing “clinical wisdom” branding removed
- [x] Wisdom/reading research separated from canonical production KB
- [x] Zero-runtime-AI policy guard
- [x] Wisdom corpus integrity audit script

## Release verification gates

- [ ] CI green on merged main
- [ ] Production build starts and health reports zero runtime AI providers
- [ ] Browser E2E confirms no reflection request to `/api/guidance`
- [ ] 12k deterministic flow regression meets quality thresholds
- [ ] Dependency audit reviewed without unsafe forced upgrades
- [ ] Final static resource-link verification
- [ ] Automated accessibility smoke checks
- [ ] Manual WCAG 2.2 AA review

## External owner/counsel gates — cannot be self-certified by code

- [ ] Legal operator/entity identified
- [ ] Privacy/legal contact configured
- [ ] Terms of Use reviewed/approved
- [ ] Privacy Notice reviewed/approved
- [ ] Hosting/subprocessor contractual/logging review completed for selected production host
- [ ] U.S.-only public launch explicitly approved by owner
- [ ] Counsel sign-off, if required by owner/risk plan

## Release rule

Engineering completion does not convert unchecked external approvals into completed legal review. Public launch remains blocked until the owner-designated release authority accepts all required external gates.

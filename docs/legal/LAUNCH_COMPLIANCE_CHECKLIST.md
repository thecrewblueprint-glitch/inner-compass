# Inner Compass — Launch Compliance Checklist

## BLOCKERS — must be complete before public launch

- [ ] Legal operator/entity named.
- [ ] Privacy contact configured.
- [ ] Counsel reviews Terms and Privacy Notice.
- [ ] 18+/U.S.-only launch gate enabled.
- [ ] Raw reflection network transmission = zero.
- [ ] Production build contains no runtime LLM/provider SDK.
- [ ] Production build contains no reflection API endpoint.
- [ ] No ads, trackers, analytics pixels, or session replay.
- [ ] Direct quote display disabled unless exact translation has product-display rights approval.
- [ ] Current canonical 75-entry KB receives quote-rights audit before any direct quote is exposed.
- [ ] Consumer-facing copy contains no diagnostic/treatment claims.
- [ ] Crisis/safety copy receives non-clinical claims review.
- [ ] Clear All Local Data control works.
- [ ] Static host logging/subprocessors reviewed.
- [ ] Dependency/security audit completed.
- [ ] WCAG 2.2 AA accessibility pass completed.
- [ ] Resource links/contact information reverified immediately before release.
- [ ] Production E2E and deterministic classifier tests pass.

## FUTURE FEATURE BLOCKERS

### Accounts / sync
Requires privacy notice update, retention/deletion design, security review, data subject request process, and state-law assessment.

### Analytics
Requires vendor/subprocessor review, data minimization, consent/opt-out analysis, GPC evaluation, and sensitive-data prohibition.

### Minors
Requires a dedicated minor privacy/safety design. Do not simply remove the age gate.

### International launch
Requires privacy and copyright review for target jurisdictions.

### Paid tier
Requires billing/vendor privacy review, refund/consumer terms, tax/business review, and a separate product-claims audit.

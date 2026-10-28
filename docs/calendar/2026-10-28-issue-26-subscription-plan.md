# Issue #26 — Safe Affirmation Calendar: execution plan
**2026-10-28 · Priority P2 · PLANNING ONLY — PUBLIC REPOSITORY**
Issue: https://github.com/thecrewblueprint-glitch/inner-compass/issues/26

## Hard requirements
Inner Compass is the product owner. The `positiveaffirmations` repository retains its existing source/history. Do not delete repositories, write to a user's calendar, migrate personal calendar data, create new recurring automation or connect private Personality data. Calendar deletion must be scoped to exactly the feature's own identifiable events.

## Phase 1 — legacy inventory
- [ ] Read legacy `positiveaffirmations` repository main, relevant unique branches, existing calendar-generation code, source-licensed text, export format, documented behavior, tests and recorded user experience.
- [ ] Compare only publicly appropriate affirmation material to Inner Compass Wisdom/category structure; retain citation/licensing and provenance, label duplicate or uncertain material.
- [ ] Identify original event identifiers, subscribe URLs, calendar names, stable UIDs, time zones and whether prior delivery was one-time ICS import versus subscription.

## Phase 2 — delivery/removal product decision
- [ ] Prefer a distinct subscribe/unsubscribe calendar whose entire generated set can be disabled or removed as a unit by supported clients.
- [ ] Explicitly compare subscriptions, hosted feeds and downloaded `.ics` imports; no claim that deleting a downloaded file removes previously imported calendar events.
- [ ] Define calendar names/UIDs, recurrence and update versioning, provider/client compatibility, source data fields, harmless fallback behavior and opt-in consent.
- [ ] Make preview → confirmation → subscription/download → maintenance/removal steps understandable on mobile and keyboard-only.

## Phase 3 — deterministic prototype and acceptance QA
- [ ] Prototype only in a controlled, non-published environment with safe original/permission-cleared sample affirmations and **no AI fallback**.
- [ ] Verify DST transitions, changes of time zone, repeated subscription updates, duplicate event suppression, cancellation and full removal in representative calendar clients.
- [ ] Create a reversible migration report and compare to preexisting assets. Import/export must not include private reflection text, birth data or sensitive profile content.
- [ ] Test opt-out/removal instructions; existing historical calendar event cleanup is a separate opt-in evidence/identity-controlled operation.

## Phase 4 — owner gate
- [ ] Record compatible delivery method, known provider limitations, source audit, privacy review, mobile accessibility test and rollback plan.
- [ ] Obtain explicit owner approval before deployment, calendar write, source-repo retirement or cross-repo migration. Record release version and support path.

**Done:** Clear calendar preview, verified reversible subscription/removal where client supports it, documented import caveats, deterministic licensed source content and no privacy breach. This planning commit changes no live app or calendar.
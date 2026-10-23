# Inner Compass — Whole-Site Production Readiness and Quality Audit
**Review date:** October 22, 2026 (America/Chicago)
**Repository:** `thecrewblueprint-glitch/inner-compass`
**Release posture:** public-facing **CONTROLLED_BETA**; **not certified as a general-public production release**
**Working branch:** `fix/wellness-volumes-5-6-and-production-audit-2026-10-22` (PR #38)
**Scope:** entire web product, with deeper regression and accessibility coverage on the new wellness library

## Executive determination

**Engineering:** The previous `main` release passed GitHub Pages deployment, both deterministic baselines, and browser E2E on commit `3b622600a8db9fcff8e237b10f2b26cf6445599c`. This PR corrects issues in the six-volume wellness library and adds stricter volume and accessibility checks. See **PR #38 check results on its final head commit** for the definitive revised-build status; do not rely on older in-progress or superseded checks.

**Legal/public release:** **NOT signed off.** The site's own `docs/legal/LAUNCH_COMPLIANCE_CHECKLIST.md` and open Issue #8 explicitly reserve operator identity, privacy contact, counsel review, host/logging and security review, manual accessibility review and public-launch approval for external human decision-makers. Green CI never fulfills these gates automatically.

**Boundary:** Natal Chart Interpreter planning in PR #37 is separate and is not part of this release or audit. The private `Personality` repository is not queried by the public runtime.

## 1. Volume V / VI defect, resolution and regression

| Surface | Finding / remediation | Evidence |
|---|---|---|
| Volume selector on narrow screens | Previously each volume page rendered its own `flexGrow` row of uneven-length button labels. Replaced with one shared responsive `WellnessVolumePicker` across all six volumes. Two columns at <680 px; larger screens use three. Readable wrapped labels, min-height 72 px, button role, and selected-state feedback. | `src/components/WellnessVolumePicker.tsx`; both wellness screen files |
| V ↔ VI navigation | Previously V and VI shared the same mounted reader component, so prior chapter/page state could carry into another book. Selection now resets the index page; the reader uses a `key` per volume to clear stale chapter state. | `src/screens/WellnessGuideScreen.tsx` |
| Mobile tapping and containment | Automated tests verify V and VI remain visible, at least 100 px wide, entirely within 320 / 375 / 414 px viewports; users can open V and VI chapters, switch books, and return to I. | `tests/e2e/app.spec.ts` |
| Accessible names | Wellness entry, navigation and action labels reviewed against visible text. Axe now tests Volume I overview, V overview and chapter detail, VI overview and exercises on desktop/mobile. | `tests/e2e/app.spec.ts`; wellness screens |
| Content/source integrity | Adds executable source-ID, completeness, six-volume, chapter, exercise, URL scheme and private-data-leak checks. Integrated into PR browser CI and Pages deployment. | `tools/eval/audit_wellness_volumes.ts`; `npm run audit:wellness` |

## 2. Whole-site coverage and quality observations

| Area | Result | Evidence / boundary |
|---|---|---|
| Homepage, top menu, back/home/history | Existing Playwright flows cover home, header/navigation, back one page, small screens; added wellness entry/return tests. | `src/App.tsx`, `src/screens/HomeScreen.tsx`, `tests/e2e/app.spec.ts` |
| Deterministic reflection | Safety routing precedes retrieval; browser processes raw input without a production model/provider path. Release audits and baseline 3/4 check these contracts. | `src/safety/safetyRouter.ts`, `src/retrieval/retrievalEngine.ts`, `tools/eval/*` |
| Wisdom and taxonomy | Category archive/search and category linkage have regression coverage. Exact translated quotations remain rights-gated. | `src/screens/WisdomLibraryScreen.tsx`, `src/screens/TaxonomyBrowserScreen.tsx`, `docs/legal/CONTENT_RIGHTS_POLICY.md` |
| Suggested Reads | Tradition-first filters, branch discovery, source links, reading cards and pagination are covered by E2E and data audits. | `src/screens/SuggestedReadsScreen.tsx`, `tools/eval/audit_reading_directory.py` |
| Journal / personalization / privacy controls | Saves theme/category metadata locally without original problem text; clear-all removes keys beginning `inner_compass_`, including wellness journey progress. No cloud sync or tracking is configured. | `src/App.tsx`, `src/debug/debugStore.ts`, `src/services/dailyAffirmationService.ts` |
| Legal, help/lifelines, accessibility disclosures | Separate Terms, Privacy, Consumer Health Data, Safety and Accessibility notices; persistent links and visible eligibility gate. Automated axe checks home/legal/lifelines; manual WCAG review remains outstanding. | `src/components/LaunchGate.tsx`, `src/screens/LegalScreen.tsx`, `tests/e2e/app.spec.ts` |
| Web production security | Prior production CI passed `npm audit --omit=dev --audit-level=high`, TypeScript, and build/health assertions. **This is not a comprehensive penetration test.** The native development dependency tree has previously reported `braces`/Metro advisories and needs separate handling before packaging native builds. | `.github/workflows/web-e2e.yml`; `package.json` |
| Deployment and SEO basics | GitHub Pages production workflow builds a relative-base Vite bundle, with hashed assets; `index.html` has title, canonical, Open Graph and description tags. No full Lighthouse SEO/performance report yet. | `.github/workflows/pages.yml`, `vite.config.ts`, `index.html` |
| Third-party/network boundaries | Reflection transport is local-only, **but** Google-hosted font CSS/fonts and optional external research links are separate third-party requests. Review font hosting and privacy representations prior to full public release. | `index.html`, `src/screens/*` |
| Source link reachability | Added machine verification for well-formed `https://` references and matching source IDs. **Does not establish that 24 external pages are all currently reachable, accurately titled or license-cleared.** External destinations may block automated inspection, change or redirect. | `src/data/wellnessGuide.ts`; wellness content audit |
| Content rights and clinical claims | Library distinguishes philosophical/religious ideas from measured effects, avoids clinical treatment claims, and uses source-based original summaries. Editorial/legal review is still required before full public marketing. | `src/data/wellnessGuide.ts`, `src/data/wellnessVolumes.ts`, `docs/legal/PRODUCT_CLAIMS_POLICY.md` |

## 3. Release gates (not self-certifiable)

**Blocking full commercial/public production status:**
- [ ] Owner supplies and verifies operator/legal identity and official privacy/legal contact.
- [ ] Counsel/authorized reviewer approves current Terms, Privacy and Consumer Health Data policy for chosen markets.
- [ ] Production host/subprocessor, third-party fonts, logging and network/privacy assessment signed off.
- [ ] A reviewer signs off on security/dependency inventory, including native/development risks when applicable.
- [ ] Manual WCAG 2.2 AA keyboard, screen-reader, zoom/reflow and touch usability review performed.
- [ ] Accurate references/external destinations and applicable quotation/translation rights manually reviewed.
- [ ] Explicit owner authorization for marketing as a public (not controlled-beta) product.

**Open but outside this fix:** Issue #26 (affirmation calendar integration); PR #37 (natal-chart interpreter planning). Neither should be merged automatically.

## 4. Follow-on quality backlog (nonblocking controlled Beta)

1. Add quarterly external-source link freshness review; invalid URL scheme check does not replace it.
2. Decide whether to self-host the Google Fonts assets for privacy, availability and performance; no font files should be committed without proper licenses.
3. Run manual Lighthouse/web-vitals testing over low-bandwidth devices, screen magnification and reduced-motion preferences.
4. Run human-led usability/accessibility review beyond Playwright and automated axe, especially with 320px phones, theme contrast, keyboard focus and long-book-title line wraps.
5. Keep historical test reports, source citations and legal effective dates current with changes, rather than assuming older September audits reflect all October modifications.
6. Consider stable deep links per chapter/volume in a future release if useful; current library navigation is in-app state rather than a public URL per chapter.

## 5. Audit evidence and release rule
- Prior merged baseline: `3b622600a8db9fcff8e237b10f2b26cf6445599c` with successful Pages and whole-site E2E.
- Final volume repair PR: https://github.com/thecrewblueprint-glitch/inner-compass/pull/38
- Natal interpreter remains separate: https://github.com/thecrewblueprint-glitch/inner-compass/pull/37
- Known external release-gate authority: https://github.com/thecrewblueprint-glitch/inner-compass/issues/8

**Ship condition:** Merge the V/VI fix only after the final PR head passes TypeScript, content integrity, safety/rights audits, accessibility and desktop/mobile E2E, production dependency audit and build. Verify a new GitHub Pages deployment on that same merged commit. The site remains labeled **Controlled Beta** until external/legal gates are explicitly resolved.

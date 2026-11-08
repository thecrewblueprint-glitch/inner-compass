# Natal Chart Interpreter — Implementation and Review Plan
**Status:** PROPOSAL ONLY · NO RUNTIME OR PERSONAL-DATA COLLECTION
**Date:** 2026-10-22 · **Target:** Inner Compass Beta · **Boundary:** independent educational module

## Product goal
Offer a voluntary interactive guide in which an eligible user enters **birth date, birth time (if known), and birth place** and receives:
1. A reproducible **calculated chart** with coordinates, configurations and disclosed assumptions.
2. **School-specific symbolic interpretations**, separately sourced and clearly labeled, without blending incompatible cosmologies or manufacturing statements from unrelated schools.
3. An optional **cross-tradition comparison** that explains differences and invites reflection, rather than claiming empirical personality prediction.
4. A shareable/downloadable chart/report **only on an explicit user action**, with a private-by-default flow.

The experience is a reflective, symbolic and historical-educational tool, **not scientific personality diagnosis, predictive healthcare, medical advice, a professional astrology consultation, or proof that natal positions cause personal traits**.

## Non-negotiable boundaries
- **Do not connect to or import private Personality data.** Inner Compass's public app must contain no owner birth data, personality profile, therapy material, assessment results or private repo URLs.
- **No covert transmission of birth data** to providers, analytics or advertising. No server-backed profile, retention or remote model call by default.
- Preserve current **18+ US English Beta gate**, Terms, Privacy, consumer-health-data disclosures and safety routes. Legal/privacy reviewers must assess this feature before activation.
- No unsupported advice or determinism concerning health conditions, longevity, death, self-worth, sexuality, relationships, finances, criminality or irreversible life decisions.
- Do not equate philosophical or religious schools with astrological chart systems. **Many schools of thought do not use natal charts.** Their perspective may be available as a clearly marked philosophical reflection, not fictitious chart doctrine.
- There is no fallback that fabricates a chart when birth time/location or computation fails. Missing-data modes must visibly reduce confidence and features.

## Distinct knowledge layers

| Layer | Content | Evidence designation |
|---|---|---|
| Astronomical calculation | Birth time, UTC, planetary and lunar positions, ascendant, midheaven, angles, houses, aspects, date metadata | Computed physical quantities; validate with independent astronomical data |
| Tradition model | Tropical/sidereal zodiacs; house systems; named symbolic correspondences; tradition-specific definitions | Historical/cultural **interpretation**, not measured cause-effect |
| Narrative rules | Source-anchored if–then interpretations, conflicts, uncertainties, alternatives | Symbolic editorial inference; reproducible and testable for fidelity |
| Personal reflection | Open-ended journaling prompts using neutral language | Voluntary reflection, not clinical or empirical personality assessment |

A computed planetary longitude may be accurate **without** its associated symbolic reading being scientifically validated. Show this distinction inline on every reading.

## Tradition coverage and honest mapping

### Phase A — calculated natal charts
1. **Western tropical natal astrology:** visible Sun, Moon, planets, Ascendant/MC (only if time reliable), chosen house system (Placidus and whole sign as different explicit choices), aspects and orbs. Source attribution per interpretive rule.
2. **Traditional/Hellenistic Western astrology:** whole-sign logic, sect, traditional rulers and historically supported topics, not interchangeable with modern psychological astrology; document interpretive boundaries.
3. **Contemporary Western psychological astrology:** explicitly modern interpretive school; separate from historical formulations and from clinical personality assessment.
4. **Indian Jyotiṣa / Vedic astrology:** sidereal calculations with an identified ayanāṃśa option (e.g. Lahiri), distinct graha/rāśi/bhāva/nakṣatra conventions; expert/source review before enabling specialized dashā techniques. It is not a simple label swap of a tropical Western reading.

### Phase B — birth-derived systems with DIFFERENT computations
5. **Chinese Four Pillars / BaZi:** traditional sexagenary calendars, calendrical rules and solar terms; **not** computed by mapping tropical planets onto Chinese signs.
6. **Zi Wei Dou Shu:** its own historical calendrical/chart rules; enable only once independently reproducible and reviewed.
7. **Other traditions:** Tibetan calendrical astrology, Mesoamerican calendrical practices or comparable systems may be research candidates, **not** launch claims. Cultural community scholarship and authorized text/translation rules must be checked. Avoid invented equivalence.

### Comparative essays only — NOT chart-reading systems
Stoicism, Aristotle, Epicureanism, Buddhism, Daoism, Confucianism, Christian contemplation, Jewish Mussar, Sufi traditions, Ubuntu and existentialism may support source-linked *philosophical reflection* on symbols and meaning; do **not** claim these traditions independently assign natal-chart placements. Distinguish these essays visually from astrological interpretations.

**Human Design** and commercial chart systems are **not** automatically included: assess intellectual-property/licensing, computational specification, ownership of materials, and representation accuracy. No unofficial imitation of restricted methods or proprietary report text.

## UX and navigation
- Main menu: **Natal Charts** (separate module alongside Reflect, Wisdom, Reads and Wellness); persistent route back to Inner Compass.
- Landing page: **What a chart is / what it isn't**, schooling selector and privacy summary before input.
- Birth-information form: date, optional time and time precision, city/country autocomplete or explicit coordinates, timezone review, local-time ambiguity selector. Don't infer birthplace from IP/location.
- Review screen: show normalized place and timezone, UTC instant or explicit unresolved state, calendar, zodiac type, ephemeris version, settings, and ambiguity before computing.
- Calculated chart: accessible SVG wheel with textual table alternative, planet placements, degree and minute, ascendant/MC where supported, selectable houses and aspects, documented calculation metadata.
- Reading: tabs for **Astronomy / Western / Jyotiṣa / Other Traditions / Compare / Sources** showing only implemented and validated modes. Avoid "all schools" branding if a school is unsupported.
- Each reading card: interpreted factor, rule ID, school, source title and edition, evidentiary label, interpretation, counterpoint/limitation and optional reflection question.
- Sources and methods: permanent bibliography, rights notes and version history.
- Export: user-initiated print/save as PDF/HTML with clear warning that shared copies contain birth information; no auto-sharing.
- Unknown birth time: calculate only supported non-angle placements; **omit houses and rising sign** instead of guessing; disclose time-range Moon/fast-object uncertainty if applicable.
- Avoid deterministic "compatibility," predictive rankings and push notifications.

## Birth input, calculation and reproducibility
### Proposed typed interface
\`\`\`ts
type BirthInput = {
  localDate: string;              // ISO calendar date
  localTime?: string;             // HH:mm[:ss] or omitted
  timePrecision: 'recorded'|'approximate'|'unknown';
  placeLabel: string;             // user-confirmed
  latitude: number; longitude: number;
  ianaTimeZone: string;           // reviewed/confirmed
  calendar: 'gregorian'|'julian'; // only when supported
  ambiguousOffsetChoice?: string;// required for repeated civil time
};
type CalculationMetadata = {
  utcInstant?: string;
  ephemerisId: string; ephemerisVersion: string;
  tzdbVersion: string; zodiac: 'tropical'|'sidereal';
  ayanamsha?: string; houseSystem?: string;
  reliabilityNotes: string[]; calculatedAt: string;
};
type ReadingRule = {
  id: string; tradition: string; version: string;
  requiredFacts: string[]; sourceIds: string[];
  wording: string; counterpoint: string; status: 'reviewed'|'pending';
};
\`\`\`

- Use IANA time zones with historical DST handling; repeated/nonexistent local times must be explained and require explicit correction/selection.
- Verify coordinate polarity, longitude/latitude range, UTC conversion, leap dates, calendar boundaries, high-latitude house behavior and historical timezone uncertainty. For very early dates, provide a clear supported range and warnings.
- Select a **properly licensed** astronomy/ephemeris engine. Swiss Ephemeris is dual-licensed AGPL/commercial; it is **not automatically compatible** with keeping the existing Inner Compass repository under current licensing. Explicit licensing decision and legal review precede bundling or hosted use.
- Compare independently calculated sample planet longitudes and house cusps with known trusted references, recording input, settings and tolerance; don't confuse precision of calculation with accuracy of symbolic interpretation.
- Alternative computation methods must receive the same validation and licensing audit before selection; no unverified astronomy library upgrades.

## Deterministic interpretation architecture
**No AI-generated readings by default.** Follow Inner Compass's existing deterministic-only product policy.

\`\`\`text
Birth input (in memory)
  → validation and time-zone disambiguation
  → selected licensed astronomical/calendar engine
  → raw chart data + provenance
  → school-specific curated rule matching
  → named interpretation cards + citations + caveats
  → user-selected export or ephemeral result
\`\`\`

- Build a **versioned source registry** recording school, language, translation rights, publication, edition, source URL, terms and review owner.
- Define rules as structured JSON/TS records. Never infer cross-school correspondences unless explicitly supported, sourced and designated as **editorial synthesis**.
- When positions change due to system settings, recalculate and show why. Allow two side-by-side settings for learning, without presenting one as medically or personally superior.
- Prefer neutral conditional language: "In [school], this placement is sometimes interpreted as..." rather than "You are definitely...".
- Display uncertainty, disagreements and missing features instead of substituting generic filler.

## Privacy, security, and data retention
- Keep date/time/location in client memory; do **not** write it to localStorage by default. Do not write raw birth input, chart data or narrative readings to diagnostics, logs or URL query strings.
- If optional on-device save is later implemented, request explicit consent, document exactly what is stored, and add a clear delete control. Account syncing and cloud backups are out of initial scope.
- A generated chart is **personal information**. Export UI must disclose it contains birth details, ask before sharing, and not create publicly accessible URLs.
- Any optional geocoder or remote ephemeris introduces disclosure of birth location/date and third-party exposure; reject such services without new privacy review, explicit consent and retention terms.
- Add negative tests for outgoing requests, URL logging, console logs and private-content leakage.
- Preserve original Inner Compass age/region eligibility gate; no shadow route to circumvent it.
- This feature must not modify existing reflection safety-routing rules or deterministic retrieval.

## Proposed repository structure
\`\`\`text
src/natal/
  models.ts               # input, chart, rule, metadata contracts
  time.ts                 # explicit timezone and ambiguity checks
  calculations/           # selected reviewed engine adapter
  rules/
    western-traditional/  # tradition-specific interpretation
    western-modern/
    jyotisha/
    calendrical/
  sources.ts              # licensed scholarly sources + provenance
  narrative.ts            # deterministic grounded rendering
  privacy.ts              # ephemeral/default-no-storage policy
src/screens/
  NatalLandingScreen.tsx
  NatalInputScreen.tsx
  NatalChartScreen.tsx
  NatalReadingScreen.tsx
  NatalSourcesScreen.tsx
tests/natal/
  reference-astronomy.json
  timezones.test.ts
  interpretation-rules.test.ts
  privacy-transport.test.ts
tests/e2e/natal.spec.ts
docs/natal/
  IMPLEMENTATION_PLAN.md
  RESEARCH_AND_LICENSING.md
\`\`\`

## Sequenced implementation tickets / review gates

| Phase | Deliverable | Exit condition |
|---|---|---|
| 0 — Governance & rights | Agree scope; approved source/culture policy; privacy/legal review; choose license-compliant ephemeris | Documented licensing and consent sign-off |
| 1 — Data contracts | Birth forms, timezone resolver and errors; typed chart schema; UTC metadata | DST, leap date, unknown-time, pre-1970 and polar tests |
| 2 — Calculation | Western tropical astronomy, limited houses/aspects, accessible chart wheel and table | Numeric reference fixtures reproducible within stated tolerance |
| 3 — First interpretation corpus | Historical Western vs modern Western distinct rule sets with licensed source registry | Every rendered claim source-linked and deterministic |
| 4 — Sidereal Jyotiṣa | Source-reviewed settings, ayanāṃśa and independent rule set | Verified differential chart fixtures, cultural and translation audit |
| 5 — Other birth systems | BaZi and other independently validated calendar systems | Separate computation and source correctness; no unverified mode |
| 6 — UX and privacy | Complete reader, accessible chart wheel, back navigation, optional print/export | Local-only telemetry, no leaks, accessible mobile/browser E2E |
| 7 — Beta release | Regression/safety/legal audit and explicit owner approval | User-visible education labels, green relevant CI, deployment verified |

### Acceptance tests
1. **Given** a known birth time and unambiguous location, **when** generating Western tropical, **then** chart positions and metadata match pinned reference fixtures.
2. **Given** a civil time during a DST fall-back, **then** user selects the correct UTC offset before computation.
3. **Given** a missing or uncertain birth time, **then** the app does not assert a precise ascendant or house placement.
4. **Given** identical settings and input, **then** calculated chart and interpretation rule IDs are deterministic.
5. **Given** a sidereal chart, **then** the selected ayanāṃśa is visible; Western and Jyotiṣa readings remain separate.
6. **Given** a non-astrological tradition selected for comparison, **then** it is labeled a philosophical essay, never a chart-based claim.
7. **Given** an ordinary session, **then** no birth data appears in network requests, browser logs, URL or local storage without explicit consent.
8. **Given** the user exits or navigates to Home, **then** the temporary chart inputs are discarded unless the user explicitly exported them.
9. **Given** any interpretation card, **then** the cited source, school, disclaimer and editorial version are visible.
10. **Given** any release, **then** existing Inner Compass deterministic reflection tests, legal gate, accessibility checks and home navigation still pass.

## Open decisions requiring sign-off
- Exact set and priority of astrological traditions, beyond Western tropical and Jyotiṣa.
- Ephemeris engine **and legal license**; no use of proprietary or dual-licensed engine until resolved.
- Whether additional calendar systems require external expert review before publication.
- Local save versus ephemeral-only (recommend ephemeral-only initial release).
- Support for historical dates, Julian calendar, extreme latitudes and uncertain civil time.
- Whether a non-astrological philosophical companion should be linked from Natal or from the existing Wisdom Library.

**Do not implement calculations or collect birth information merely because this plan is merged.**
Actual feature work belongs on separately audited PRs after phase-zero approval.

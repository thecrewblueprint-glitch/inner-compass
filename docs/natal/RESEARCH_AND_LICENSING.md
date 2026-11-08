# Natal Interpreter — Source, Accuracy, and Rights Register
**Research document · Updated 2026-10-22 · NOT IMPLEMENTATION**

## Ephemeris and time conversion — independently verify first
1. **Swiss Ephemeris vendor technical and licensing documentation**: https://www.astro.com/swisseph/swephinfo_h.htm
   - Dual licensing: AGPL or professional. License choice must be made **before** distributing software or activating a public service with the library; not compatible by default with a closed/private proprietary architecture.
   - Research task: evaluate legal obligations, costs, distribution architecture and alternatives; do not import a package before rights review.
2. **Swiss Ephemeris authoritative code license**: https://github.com/aloistr/swisseph/blob/master/LICENSE
   - Quote/compare license restrictions only from current upstream; copies and wrappers may have outdated or incompatible terms.
3. **IANA time zone database theory**: https://www.iana.org/time-zones/theory
   - Historical pre-1970 time-zone coverage is incomplete. The database is not an infallible historical authority. Explicit uncertainty must be surfaced for old charts.
4. **IANA guide to TZ database rules**: https://www.iana.org/time-zones/tz-how-to
   - Daylight-saving transitions can depend on wall, standard or UTC time; repeated and skipped civil times need review.
5. **Astronomical reference data**: independently select documented JPL/NASA or comparable published position fixtures appropriate to the selected computation engine. Record reference version, observed coordinate system, UTC/TDB distinctions, tolerances, and epoch.
6. **Accessibility reference**: W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/ — interactive wheel must always have an accessible tabular equivalent, descriptive labels and keyboard operation.

## History and traditions — research queue
**Do not publish specialized interpretive claims without editorial review, exact citation, school attribution and permission to quote.**

| Area | Sources to acquire/review | Proposed status |
|---|---|---|
| Western Hellenistic | Historical specialist scholarship on planetary significations, houses and sect, with edition/translation metadata | Research required |
| Western medieval/early modern | Scholarship separating time period, geographical transmission, techniques and rulers | Research required |
| Modern Western psychological | Identified modern authors; review paraphrase rights and disclaimers | Research required |
| Indian Jyotiṣa | Scholarly primary-source translations and contemporary qualified contextual review; technical ayanāṃśa choices | Research required |
| Chinese BaZi | Calendar and solar-term methods, named source editions and East Asian scholarly review | Research required |
| Zi Wei Dou Shu | Methodological provenance and multi-school variants; rights/translation | Research required |
| Tibetan calendrical systems | Qualified tradition-specific scholarship, calendar variants and cultural permission | Later research only |
| Mesoamerican calendar traditions | Community-grounded scholarship before designing interpretive features; no invented “Mayan zodiac” | Later research only |
| Human Design or other proprietary models | License/computational method and rights audit; do not assume permission | Deferred |

Historical scholars and community representatives may disagree. Preserve their differences rather than synthesizing into one “universal zodiac.”

## Reading and claims policy
- Use explicit labels: **computed placement** / **traditional interpretation** / **modern editorial synthesis** / **philosophical reflection**.
- Do not label natal readings “scientifically proven personality assessments.” Astronomical computation can be verified; personalized symbolic interpretation requires separate evidence that is generally not established.
- No claims of inevitability, predictions of harm, or inferences about another person's consent or mental health.
- Do not use material from the private Personality repository or personal natal records to write public example readings.
- Do not allow the chart feature to give high-stakes advice (clinical, legal, financial, safety or relationship decisions).
- Direct practice-specific source reviews must note edition, language, translation, permissions, author/translator, and authoritative scope. Original paraphrases preferred.

## Implementation decision checklist
- [ ] Source owner confirms each tradition's scope and claims
- [ ] Legal review chooses compatible ephemeris license / alternative
- [ ] Timezone handling tested at difficult historical, repeated and nonexistent times
- [ ] Calculation engine fixture accuracy documented
- [ ] Birth-data privacy impact assessment complete
- [ ] Reading rule schema and provenance audits complete
- [ ] Cultural/translation and public-copy review complete
- [ ] No hidden telemetry or model-generated interpretation
- [ ] Accessible rendering and print/export privacy review
- [ ] Owner approves separate implementation PR and Beta enablement

This register is planning-only and does not authorize publishing natal charts or touching the existing Personality repository.

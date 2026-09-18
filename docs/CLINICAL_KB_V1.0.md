# Clinical knowledge base — v1.0 (deepened)

**Scope.** This is the index over a second, deeper research pass on all 25 [`TAXONOMY_V1.0.md`](TAXONOMY_V1.0.md) categories, done before any Eastern-philosophy mapping work starts. The first research pass (`docs/research/categories-*.md`) established and validated the taxonomy structure. This pass — `docs/research/kb-01-05.md`, `kb-06-10.md`, `kb-11-15.md`, `kb-16-20.md`, `kb-21-25.md` — goes deeper per category: a 2024–2026 currency check, a dedicated attempt to resolve every claim the first pass flagged as "reasonable inference" rather than sourced fact, real-world clinical-practice grounding (what treatments are actually used, how common each presentation is), and case grounding (real published cases cited where findable, clearly-labeled illustrative composites — never presented as real — where not). Read the five `kb-*.md` files for full detail and sources; this document is the synthesis.

## Bottom line

**No taxonomy structure changes were needed.** All 25 categories, all 5 splits, both renames, and the broadened Grief mapping from `TAXONOMY_V1.0.md` held up under deeper scrutiny — nothing found in this pass contradicts them. What changed:

- Several root-mapping confidence levels moved from "reasonable inference" to "well-established," now backed by sources found in this pass (see confidence table below).
- A handful of gaps remain genuinely unresolved even after a dedicated search — these stay flagged as inferences, not silently upgraded (list below).
- Several factual documentation corrections surfaced (ICD-11 diagnoses the first pass missed, a non-replication that weakens one root's theoretical bridge, etc.).
- One safety-relevant finding surfaced that should inform the crisis-redirect design when Phase 6 (MVP app) is built — see next section.

## Safety-relevant findings for the crisis-redirect design (carry into Phase 6)

The taxonomy already excludes active suicidal ideation, self-harm, IPV, and acute psychiatric crisis from v1.0 scope, routing them to the static crisis redirect instead of philosophy matching (`ROADMAP.md`). This pass surfaced specific findings about where *categories inside* v1.0 scope can still carry real escalation risk:

1. **Anhedonia (#24), especially sudden/recent-onset.** State (not trait) anhedonia and *recent worsening* of anhedonia independently predict suicidal ideation, separate from overall depression severity (Ducasse et al. meta-analysis, reaffirmed in newer samples). Recommendation: language signaling a sudden or recent loss of pleasure/interest/motivation should get crisis-redirect sensitivity at least equal to, and per some literature greater than, sadness-coded language (#23). This is a concrete, actionable finding, not a general caution.
2. **Substance use (#10) has a hard ceiling.** Real overdose/withdrawal mortality risk (alcohol and benzodiazepine withdrawal can be fatal) means this category cannot be philosophy-content-only. A philosophy-guidance app should be positioned for the affect-regulation/meaning dimension (Khantzian self-medication, Frankl existential-vacuum material) in people who are not in active withdrawal or crisis, with explicit, built-in crisis-resource redirection given the physiological stakes.
3. **Guilt (#21), specifically moral-injury-adjacent presentations.** Self-condemnation tied to a real or perceived serious harm caused, especially in a caregiving or high-stakes role (e.g., "I think my mistake is why a patient died"), is explicitly tied to suicide risk in current literature. Recommend treating this pattern as an escalation/crisis-redirect candidate rather than routing straight to a philosophy match.
4. **Rejection/heartbreak (#7) may be clinically under-weighted by default.** New evidence (n=2,022) found breakup-related PTSD-checklist scores exceeding DSM-5 Criterion A trauma-event scores in the majority of cases (72.9% above the clinical cutoff). This isn't itself a crisis-redirect trigger, but content for this category shouldn't assume mild/moderate distress by default; presentations with flashbacks, dissociation, or functional collapse should be flagged toward referral.
5. **Illness/mortality fear (#18) and Financial/security fear (#19) have "practical" edges.** Compulsive health-checking (illness anxiety) and acute financial crisis (job loss, imminent eviction) are presentations where philosophy-only content would under-serve the person. Not crisis-level, but worth a matching-layer note suggesting practical-resource pointers alongside philosophical content at these edges.
6. **Mistreated/bullied (#25) — severity tiering, not crisis-level.** Chronic, power-imbalanced bullying may present as complex PTSD rather than single-incident distress. No independent suicide-risk-marker literature was found for this category the way it was for anhedonia — the risk pathway runs through depression/PTSD as intermediate steps rather than being a standalone predictor — but severity-tiering (single incident vs. chronic) at the matching layer is still recommended.

## Confidence table — all 25 categories

| # | Category | Roots | Confidence after deepening |
|---|---|---|---|
| 1 | Loneliness / feeling isolated even around people | Isolation | Well-established; existential-vs-social distinction now backed by new instruments/outcome data |
| 2 | Grief / loss of a person, relationship, or way of life | Death, Freedom, Meaninglessness | Well-established (broadened mapping upgraded from inference via Ivers 2024) |
| 3 | General anxiety / dread about the future | Freedom, Death | Well-established — strongest dual-root category; 2024 TMT meta-analysis strengthens Death leg |
| 4 | Anger | Freedom | Reasonably inferred (Freedom root partially evidenced via loss-of-control data, not Yalom-named directly); well-established as a real, common, treatable phenomenon |
| 5 | Ongoing conflict with someone | Freedom, Isolation | Isolation: reasonably well-supported (upgraded). Freedom: **still a gap** — no independent source, inherited from #4 |
| 6 | Shame / feeling fundamentally not okay | Meaninglessness, Isolation | Well-established (Isolation); reasonably inferred (Meaninglessness as secondary) |
| 7 | Rejection / heartbreak | Isolation, Meaninglessness | Well-established — both roots now directly sourced; clinical severity newly quantified |
| 8 | Feeling stuck / can't decide | Freedom | Well-established — cleanest single root-match in the taxonomy; gap: "ACT helps with indecision" remains untested inference |
| 9 | Fear of failure | Freedom, Death | Freedom: well-established. Death: reasonably inferred, now **more contested** (2023 large non-replication of TMT's mortality-salience effect, n=1,255) |
| 10 | Substance use | Death, Meaninglessness | Well-established as a real, prevalent, high-comorbidity entity; Death root now directly sourced (mortality risk + hopelessness, not impermanence) |
| 11 | Compulsive / behavioral coping | Death, Meaninglessness | Meaninglessness: well-established. Death: reasonably inferred (mortality/suicide-risk grounded, not impermanence-sourced) |
| 12 | Betrayal / broken trust | Isolation | Well-established. Secondary Meaninglessness hook: **still a gap** |
| 13 | General life meaninglessness | Meaninglessness | Well-established — distinctness from depression now better evidenced |
| 14 | Career / vocational purpose | Meaninglessness | Well-established — career-construction theory independently confirms distinctness from #13 |
| 15 | Overwhelm / too much to control | Freedom | Well-established for the workplace/burnout sub-case; reasonably inferred/under-scoped for non-workplace presentations (better grounded in locus-of-control/allostatic-load research specifically) |
| 16 | Personal identity confusion | Meaninglessness, Freedom | Well-established — Freedom-root gap closed via Marcia's own moratorium description |
| 17 | Cultural or group belonging confusion | Isolation | Well-established (upgraded from reasonably-inferred via refugee loneliness/isolation studies) |
| 18 | Illness or fear about health / mortality | Death | Well-established, now with treatment-outcome evidence, not just construct evidence |
| 19 | Financial or security fear | Freedom, Death | Well-established — strongest dual-root mapping overall, now with RCT-pilot intervention evidence |
| 20 | Envy / comparing myself to others | Isolation, Meaninglessness | Meaninglessness: reasonably inferred (somewhat strengthened). Isolation: **still a gap** — searched directly, not found |
| 21 | Guilt / can't forgive myself | Freedom, Meaninglessness | Well-established via moral-injury literature; self-forgiveness-specific mechanism reasonably inferred |
| 22 | Impatience / waiting for something to change | Freedom, Death | Freedom: well-established. Death: reasonably inferred (explicit design choice — "felt pressure of time," not mortality) |
| 23 | Low mood / persistent sadness | Death, Freedom, Isolation, Meaninglessness | Freedom/Isolation/Meaninglessness well-established individually; Death reasonably inferred (real but secondary). "All four as a unit": **still a gap** |
| 24 | Can't feel joy / anhedonia | Death, Freedom, Isolation, Meaninglessness | Same pattern as #23, with Isolation now anhedonia-specific-evidenced. "All four as a unit": **still a gap** |
| 25 | Being mistreated / bullied / disrespected | Isolation, Freedom | Well-established, now with boss-perpetrator/power-imbalance evidence |

## Remaining genuine gaps (searched for directly, not resolved)

These stay flagged as inferences — do not treat them as sourced facts downstream:

- **#5 Ongoing conflict** — the Freedom-root justification has no independent source; it's inherited reasoning from #4 Anger.
- **#8 Feeling stuck** — "ACT helps with chronic indecision" is a reasonable extrapolation from ACT's general mechanism, not a targeted clinical trial finding.
- **#9 Fear of failure** — the Death-root's TMT/mortality-salience bridge is now *contested*, not just indirect (a well-powered 2023 replication attempt found the core effect near zero).
- **#11 Compulsive/behavioral coping** — the Death root is grounded in mortality/suicide-risk data, not an impermanence-awareness theme; still an inference either way.
- **#12 Betrayal** — the secondary Meaninglessness hook (betrayal shatters a person's narrative) remains a soft, unconfirmed suggestion.
- **#15 Overwhelm** — non-workplace presentations are under-scoped by the burnout-specific evidence base; better grounded in locus-of-control/allostatic-load research, which should be weighted accordingly.
- **#20 Envy** — the Isolation-root mapping to Yalom's existential isolation specifically was searched for directly and not found; Leahy's CBT-for-envy model uses Beck's Generic Cognitive Model instead.
- **#23/#24 "all four roots" as a unit** — no single source integrates Death, Freedom, Isolation, and Meaninglessness into one depression/anhedonia model. Each root is independently sourced (Freedom and Isolation strongest, Meaninglessness well-evidenced, Death real but comparatively weakest/most secondary) — recommend documenting "all four roots" explicitly as a *designed synthesis* of four separate literatures, not a single directly-cited claim, and weighting Freedom/Isolation more heavily than Death if the retrieval layer ever needs to rank source material.

## Documentation corrections found

- **Grief (#2):** ICD-11 also has a Prolonged Grief Disorder diagnosis, with a **6-month** duration threshold vs. DSM-5-TR's 12-month (6 for children) — the first pass only covered the DSM-5-TR version.
- **Anger (#4):** ICD-11 added Intermittent Explosive Disorder (code 6C73) as a standalone diagnosis in 2022; DSM-5 still has no anger-specific diagnostic category.
- **Fear of failure (#9):** "Atychiphobia" is not an official DSM-5 diagnosis — it's clinical shorthand; a qualifying presentation is formally diagnosed under the general Specific Phobia category.
- **Overwhelm (#15):** ICD-11 classifies burnout strictly as an "occupational phenomenon," explicitly not a medical diagnosis, and the WHO definition says it "should not be applied to describe experiences in other areas of life" — narrower than the taxonomy's "too much to control" framing.
- **Anhedonia (#24) prevalence:** more precisely 37–72% of MDD cases depending on measure/sample, not a flat ~90% figure (the earlier estimate was an upper-bound pulled from a subset of the literature).
- **Substance use (#10) / Compulsive coping (#11):** DSM-5-TR and ICD-11 diverge on behavioral addictions — ICD-11 gives full diagnostic status to gaming disorder, compulsive sexual behavior disorder, and compulsive buying-shopping disorder; DSM-5-TR formally certifies only gambling disorder.

## In-scope vs. referral, carried forward for later product-safety design

Beyond the hard crisis-redirect carve-outs already in the taxonomy (suicidality, self-harm, IPV, acute crisis), this pass identified categories with a softer "professional support alongside philosophy" edge, useful when Phase 6 designs the app's fuller safety logic:

- **Substance use (#10)** — hard ceiling at active withdrawal/overdose risk (see Safety section above).
- **Guilt (#21)** — moral-injury-adjacent presentations tied to suicide risk.
- **Anhedonia (#24)** — sudden/recent-onset presentations carry independent suicide-risk signal.
- **Illness/mortality fear (#18)** — phobic-level illness anxiety with functional impairment.
- **Mistreated/bullied (#25)** — chronic/severe presentations with possible complex-PTSD features.
- **Financial/security fear (#19)** — acute financial crisis (not the anxiety itself, but the practical situation) needs resource pointers, not just philosophy.

None of these change the taxonomy or its crisis-redirect exclusions — they're notes for whoever designs the app's fuller safety/referral logic in Phase 6.

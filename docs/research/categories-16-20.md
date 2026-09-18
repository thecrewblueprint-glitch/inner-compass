# Case-study research — categories 16–20

Scoped validation pass for surface categories 16–20 of `TAXONOMY_V0.1.md`. Method: search for real, citable clinical/psychological literature per category, then assess (a) coherence as a single category vs. need to split, (b) redundancy with adjacent categories, (c) naming accuracy, (d) nuance for a philosophy-matching system, (e) whether the existing Yalom root mapping holds. No claim below is invented — each traces to a source listed in that category's Sources subsection. Categories 1–15 are out of scope for this document and were not touched.

---

## 16. Jealousy / comparing myself to others

**Maps to (v0.1): Isolation, Meaninglessness**

### Findings

The literature does **not** treat "jealousy" and "social comparison" as the same construct, and this category currently conflates two distinct research traditions.

- **Social comparison theory** (Festinger, 1954) is the broader, more accurate frame for "comparing myself to others." It describes a general drive to evaluate one's own opinions and abilities by comparison with others, used to explain outcomes from achievement motivation to depression to perceived injustice.
- **Envy vs. jealousy** are empirically distinct emotions, not synonyms, despite colloquial interchangeability. Per Smith, Kim & Parrott (1988) and later taxometric work (Parrott, 1993; Parrott & Smith, 1993): **envy** arises from *lacking* a desired attribute someone else has (a two-person situation — perception of lack), while **jealousy** arises from *threat to something already possessed*, typically a relationship, from a third party (a three-person situation — perception of loss). Envy's affective profile is inferiority, longing, resentment; jealousy's is fear of loss, distrust, anxiety, anger. These were found to be discrete but frequently co-occurring emotions.
- Researchers have specifically coined "social-comparison jealousy" for the comparison-driven variant (a desire for superiority on some dimension, triggered by negative self-relevant feedback), versus "social-relations jealousy" for the relational/romantic-threat variant — underscoring that the colloquial word "jealousy" is doing double duty for two different things.
- "Benign envy" (using another's success as self-improvement motivation) vs. "malicious envy" (resentment/hostility) is also an established distinction in this literature, relevant to how a guidance system should calibrate tone — not all comparison-driven distress is maladaptive.
- Social comparison and envy on social networking sites is linked in a systematic review to depressive symptoms, reinforcing the Meaninglessness/self-worth linkage already in the taxonomy.

**Coherence:** What users will actually type under this heading ("comparing myself to others," "everyone else seems to have it figured out," "I'm jealous of my friend's life") is almost entirely **social-comparison-driven envy**, not relational jealousy in the technical sense (a partner-triangulation fear, which arguably belongs closer to category 10, Betrayal/broken trust, or category 4, Anger/conflict). The current name "Jealousy / comparing myself to others" bundles the accurate common-usage term with the wrong technical term.

**Redundancy:** Low overlap with other categories in the current 20, other than a thin edge case where romantic jealousy proper (fear of losing a partner to a rival) would sit better under #10 (Betrayal/broken trust) or #4 (Anger/conflict). Not a case for merging whole categories — just a naming/scope clarification.

**Root mapping:** Isolation and Meaninglessness hold up well. Comparison generates a sense of relative lack (Meaninglessness — "my life doesn't measure up/mean as much") and a felt separateness from those one is comparing against (Isolation — the comparison itself presupposes a gap between self and other). No literature found that overturns this; it is a reasonable secondary-source inference, not a direct Yalom quote, which is worth flagging as an inference rather than sourced fact.

### Recommendation
**Rename to "Envy / comparing myself to others."** Keep root mapping (Isolation, Meaninglessness). Note in the system's matching logic that true relational jealousy (fear of losing a partner) should route toward category #10 or #4 instead. No merge needed.

### Sources
- [Social comparison theory — Wikipedia](https://en.wikipedia.org/wiki/Social_comparison_theory)
- [A Review of Social Comparison Theory in Organizational Contexts (UTRGV)](https://scholarworks.utrgv.edu/cgi/viewcontent.cgi?article=1136&context=mgmt_fac)
- [Envy, Social Comparison, and Depression on Social Networking Sites: A Systematic Review — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9955439/)
- [Envy and Jealousy — Smith, Kim & Parrott, 1988, Personality and Social Psychology Bulletin](https://journals.sagepub.com/doi/10.1177/0146167288142017)
- [Distinguishing the experiences of envy and jealousy — PubMed](https://pubmed.ncbi.nlm.nih.gov/8326472/)
- [Envy and jealousy as discrete emotions: A taxometric analysis — Motivation and Emotion (Springer)](https://link.springer.com/article/10.1007/BF02251889)
- [What Is the Difference Between Envy and Jealousy? — Psychology Today](https://www.psychologytoday.com/us/blog/joy-and-pain/201401/what-is-the-difference-between-envy-and-jealousy)
- [A Tale of Two Envys: A Social Network... (UKnowledge, University of Kentucky)](https://uknowledge.uky.edu/cgi/viewcontent.cgi?article=1004&context=management_etds)

---

## 17. Guilt / can't forgive myself

**Maps to (v0.1): Freedom, Meaninglessness**

### Findings

- **Guilt vs. shame** is a well-established distinction (Tangney & Dearing; TOSCA instrument). Guilt is behavior-focused ("I did a bad thing"), shame is self-focused ("I am bad"). Guilt correlates with prosocial repair motivation (apologizing, making amends); shame correlates with withdrawal, antisocial defensiveness, low self-esteem, depression, and addiction. This is directly relevant: "can't forgive myself" is a guilt-*coping-failure* problem, but if the underlying self-talk is "I am fundamentally bad/unworthy" rather than "I did something bad," the user is actually describing **shame**, which the taxonomy already has as category #5 ("Shame / feeling fundamentally not okay").
- **Self-forgiveness** is its own distinct, if under-researched, literature ("the stepchild of forgiveness research" — Hall & Fincham). Enright's seminal definition: self-forgiveness is "a willingness to abandon self-resentment in the face of one's acknowledged objective wrong, while fostering compassion, generosity, and love toward oneself." Recent work (Woodyatt & Wenzel; a 2025 qualitative paper "What makes self-forgiveness so difficult (for some)?") frames self-forgiveness as a process from self-alienation to being at ease with oneself, and notes it is not simply "feeling less bad" — it can be a mixed emotional experience, and researchers caution self-forgiveness is not unconditionally beneficial (it can, in some cases, undermine accountability if reached prematurely).
- **Moral injury** research (military and, increasingly, healthcare workers, first responders, social workers) is a directly relevant adjacent body of work: moral injury is driven specifically by guilt, shame, and *existential* conflict (distinct from fear-based PTSD), producing self-condemnation, isolation, and — notably — is explicitly framed by researchers in terms of eroded integrity, meaning, and responsibility. This is a strong independent confirmation of the Freedom/Meaninglessness root mapping, since moral-injury researchers explicitly connect guilt to "responsibility" (Freedom, in Yalom's terms) and to meaning/conscience ("Moral Injury as a Wound of Meaning and Conscience," Journal of Religion and Health).

**Coherence:** The category is coherent as a single presenting concern ("guilt that won't resolve into self-forgiveness"), but the literature strongly suggests distinguishing it from shame at the matching layer — not necessarily as a taxonomy split, since #5 already exists for shame, but the app's matching logic should watch for shame-coded language ("I'm broken," "I'm a bad person") leaking into this bucket and route it to #5 instead.

**Redundancy:** Meaningful overlap with #5 (Shame) at the boundary, but not full redundancy — guilt and shame are empirically discrete constructs with different action tendencies (repair vs. withdrawal), so keeping them as separate categories is well-supported, provided the matching system enforces the guilt/shame distinction rather than treating them as synonyms.

**Root mapping:** Freedom holds up directly — guilt is fundamentally about having exercised one's freedom/agency badly (an act one was responsible for), which is the core of Yalom's Freedom concern (responsibility, no absolute ground for one's choices). Meaninglessness also holds — moral injury literature explicitly frames unresolved guilt as a wound to one's sense of meaning/integrity. No evidence found to overturn either mapping.

### Recommendation
**Keep as-is** ("Guilt / can't forgive myself," Freedom + Meaninglessness), but add a matching-layer note: guilt-coded language ("I did X wrong") routes here; shame-coded language ("I am wrong/bad") routes to #5. Consider flagging self-forgiveness specifically (not just "guilt") as the affective target, since that is the more precise clinical construct for "can't forgive myself." No split or merge needed.

### Sources
- [Self-conscious emotions: The psychology of shame, guilt, embarrassment, and pride — Tangney & Fischer (Semantic Scholar)](https://www.semanticscholar.org/paper/Self-conscious-emotions:-The-psychology-of-shame,-Tangney-Fischer/01f5f00f5ee9220a3890ee7c96a8e47a00af2012)
- [Reconsidering the Differences Between Shame and Guilt — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6143989/)
- [Understanding shame, guilt, embarrassment and pride: a systematic review of self-conscious emotions — Frontiers in Psychology](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1678930/full)
- [Self-Forgiveness: The Stepchild of Forgiveness Research — Hall & Fincham (ResearchGate)](https://www.researchgate.net/publication/255429001_SelfForgiveness_The_Stepchild_of_Forgiveness_Research)
- [Two pathways to self-forgiveness: A hedonic path via... — Woodyatt (self-compassion.org PDF)](https://self-compassion.org/wp-content/uploads/2018/05/Woodyatt2017.pdf)
- [What makes self-forgiveness so difficult (for some)? — Taylor & Francis, 2025](https://www.tandfonline.com/doi/full/10.1080/15298868.2025.2513878)
- [The Psychological Meaning of Self-Forgiveness in a... — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8687689/)
- [Moral Injury: The Hidden Wound Driving Suicide and Despair — Psychology Today](https://www.psychologytoday.com/us/blog/imagery-coaching/202502/moral-injury-the-hidden-wound-driving-suicide-and-despair)
- [Beyond right and wrong: A new theoretical model for understanding moral injury — ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2468749925000717)
- [Moral Injury as a Wound of Meaning and Conscience — Journal of Religion and Health (Springer)](https://link.springer.com/article/10.1007/s10943-026-02674-7)
- [6-Fold path to self-forgiveness: an interdisciplinary model for the treatment of moral injury — PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11625554/)

---

## 18. Impatience / waiting for something to change

**Maps to (v0.1): Freedom, Death**

### Findings

- Impatience has a real, if smaller, dedicated research literature distinct from general anxiety. Kate Sweeny (UC Riverside) defines impatience as "the emotion people feel when they face a delay that seems unfair, unreasonable, or inappropriate," bundled with urgency, low tolerance for inefficiency, a need for control, and a bias toward immediate over long-term outcomes.
- Roberts & Fishbach (2025, *Personality and Social Psychology Bulletin*), "Impatience Over Time," found a "nearness effect": discomfort intensifies as a wait nears its end, driven by a desire for closure, and impatience can increase even as objective uncertainty decreases (e.g., waiting after a vote is cast) — meaning impatience is not simply a proxy for anxiety/uncertainty-intolerance, it has its own dynamics tied to time-perception and closure-seeking.
- Chronic impatience is described as sharing surface features with anxiety (intolerance of uncertainty, urgency) but is functionally distinct — it persists independent of uncertainty level, which anxiety does not.
- Three conditions form a "perfect storm" for impatience: high stakes, an unpleasant waiting state, and a clear locus of blame for the delay — this last point (blame) is notable because it suggests an *anger/injustice* component (implicating Freedom — a sense that someone/something is unjustly withholding what should be under one's control) alongside a *time* component (implicating Death — Yalom's root concern with impermanence and the press of finite time).
- Developmental/psychodynamic sources tie tolerance for waiting to early "holding environment" experiences (reliable-but-not-immediate caregiving), suggesting impatience as a presenting concern can have a trait/developmental layer, not just a situational one.

**Coherence:** The category holds together as a single coherent construct — the literature treats "impatience" as one identifiable emotional/cognitive pattern (urgency + intolerance of delay + a `sense of unfairness about the wait), not something that clinically splits into sub-types the way anhedonia does within depression. It is close to, but not identical with, anxiety (per AnxietyCentre.com's popular-source conflation) — the matching system should not simply fold this into category #3 (general anxiety/dread).

**Redundancy:** Some adjacency to #7 (Feeling stuck / can't decide) and #3 (General anxiety/dread), but impatience is specifically about *waiting on an external, already-set-in-motion process* (a diagnosis result, a court decision, a relationship's outcome) rather than an unresolved choice (#7) or free-floating dread about an unknown future (#3). Distinct enough to keep separate.

**Root mapping:** Freedom holds — the "someone/something is to blame for the delay" and "need for control" elements match Yalom's Freedom concern (the wish for control/agency over outcomes one cannot actually control). Death is a plausible but weaker link — the literature found doesn't explicitly invoke mortality, but the "nearness effect" and general fixation on time passing without resolution is consistent with Yalom's Death concern as being fundamentally about the press of finite time, not literal mortality alone. This mapping is a reasonable secondary inference from the impatience-and-time literature rather than a source explicitly naming Death/mortality.

### Recommendation
**Keep as-is** (name and Freedom + Death mapping). No split or merge indicated by the literature found. Flag for the matching system: distinguish from #3 (anxiety, about an unknown future) and #7 (an unresolved choice) — impatience is about a *known, pending* outcome one has no power to hasten.

### Sources
- [Impatience Over Time — Roberts & Fishbach, 2025, Personality and Social Psychology Bulletin](https://journals.sagepub.com/doi/10.1177/19485506231209002)
- [The psychology of impatience could make waiting more tolerable — Psyche Ideas](https://psyche.co/ideas/the-psychology-of-impatience-could-make-waiting-more-tolerable)
- [Research sheds light on the psychology behind patience and impatience — News-Medical.net](https://www.news-medical.net/news/20241220/Research-sheds-light-on-the-psychology-behind-patience-and-impatience.aspx)
- [Impatience and Anxiety — AnxietyCentre.com](https://www.anxietycentre.com/anxiety-disorders/symptoms/impatience/)
- [Psychodynamic Roots Of Impatience — Bay Psychology Group](https://www.baypsychologygroup.com/psychodynamic-roots-of-impatience/)
- [Patience — Wikipedia](https://en.wikipedia.org/wiki/Patience)

---

## 19. Low mood / can't feel joy

**Maps to (v0.1): all four roots**

### Findings

- The DSM-5 major depressive episode criteria require at least one of two core symptoms: depressed mood **or** markedly diminished interest/pleasure (anhedonia) in almost all activities — these are treated as two separate, both-sufficient core symptoms, not one construct. This is the clearest clinical evidence that "low mood" and "can't feel joy" are **related but distinguishable presentations**.
- Anhedonia specifically involves deficits in positive affect (loss of enjoyment and/or loss of desire to engage in pleasurable activities), while low/depressed mood is about negative affect (sadness, emptiness). Someone can have prominent anhedonia with relatively blunted rather than intensely sad mood ("emotionally flat without intense sadness"), or vice versa.
- Anhedonia is clinically significant in its own right: it affects up to ~90% of people with major depression, predicts a longer/more severe course of illness, undermines treatment response, and is a substantial independent predictor of suicidality — meaning it is not merely a symptom of low mood but an important marker clinicians track separately. Two sub-types are recognized: **anticipatory anhedonia** (reduced ability to anticipate future pleasure) and **consummatory anhedonia** (reduced pleasure while the activity is happening).
- Anhedonia also appears outside depression (e.g., schizophrenia, bipolar depressive episodes), so "can't feel joy" as a standalone descriptor is not depression-specific — a caveat for a matching system meant to route to philosophical guidance rather than diagnose.
- Positive Affect Treatment (PAT), a dedicated 15-session psychotherapy protocol, exists specifically to rebuild capacity for joy/purpose/motivation/reward, independent of standard depression-focused CBT — further evidence anhedonia is treated as a distinguishable clinical target from generic low mood.
- No literature was found using "low mood" as its own formal clinical category (it is a lay/colloquial term); the closest formal constructs are "depressed mood" (a DSM criterion) and "dysthymia"/persistent depressive disorder for the chronic, lower-intensity version.

**Coherence:** This category is the one among the five most clearly justified in splitting, per the brief's own suggestion. "Low mood" (sad/heavy affect) and "can't feel joy" (anhedonia, loss of pleasure/motivation) are empirically distinguishable presentations with different underlying mechanisms (dopaminergic/reward-pathway disruption implicated specifically in anhedonia) and different treatment approaches. They frequently co-occur but are not the same thing, and a user typing "I feel sad all the time" is describing something meaningfully different from a user typing "nothing excites me / I don't enjoy things anymore," even though both currently land in one bucket.

**Redundancy:** Not redundant with other categories — this is the broadest, most root-agnostic category in the taxonomy by design ("all four roots"), which is appropriate given depression's well-documented links to death-anxiety, loss of felt agency, isolation, and meaninglessness in the broader literature, though this document did not find a single source directly cross-mapping anhedonia to all four Yalom roots simultaneously — that "all four roots" mapping remains a reasonable design choice rather than a directly sourced claim.

**Root mapping:** No evidence found to override "all four roots" — plausible given depression's broad phenomenology, but flagged as an inference, not a directly sourced one-to-one mapping (no source found explicitly linking anhedonia/low mood to all four Yalom concerns as a unit).

### Recommendation
**Split into "Low mood / persistent sadness" and "Can't feel joy / anhedonia (loss of interest and pleasure)."** These have distinguishable clinical profiles (negative-affect vs. positive-affect deficit), different common causes, and arguably should be matched to different philosophical material (sadness/impermanence teachings vs. teachings on desire, reward, and meaning/purpose). If the product prefers to keep a single user-facing category for simplicity, at minimum the internal matching/retrieval layer should treat "low mood" and "anhedonia" as two distinct query intents feeding the same category, given how clinically distinguishable they are.

### Sources
- [Anhedonia — Wikipedia](https://en.wikipedia.org/wiki/Anhedonia)
- [Anhedonia and Depressive Disorders — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10335915/)
- [The characteristics of anhedonia in depression: a review from a clinically oriented perspective — PMC / Translational Psychiatry](https://pmc.ncbi.nlm.nih.gov/articles/PMC11928558/) / [Nature version](https://www.nature.com/articles/s41398-025-03310-w)
- [Anhedonia is associated with a specific depression profile and poor antidepressant response — International Journal of Neuropsychopharmacology (Oxford Academic)](https://academic.oup.com/ijnp/article/27/12/pyae055/7889034)
- [Anhedonia vs. Depression — Charlie Health](https://www.charliehealth.com/mental-health/depression/anhedonia-vs-depression)
- [Depression With Anhedonia vs Dysthymia: Do We Understand the Difference? — Psychiatric Times](https://www.psychiatrictimes.com/view/depression-with-anhedonia-vs-dysthymia-do-we-understand-the-difference)
- [New study finds treating anhedonia yields better outcomes for depression and anxiety — SMU](https://www.smu.edu/news/research/treating-anhedonia-yields-better-results-depression-and-anxiety)
- [The dynamical signature of anhedonia in major depressive disorder — PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6368777/)
- [Anhedonia in schizophrenia and major depression: state or trait? — PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2764701/)

---

## 20. Being mistreated / bullied / disrespected

**Maps to (v0.1): Isolation, Freedom**

### Findings

- Workplace mistreatment research gives a clear, sourced typology that maps onto "mistreated / bullied / disrespected" as *not* a single flat category but a spectrum: **incivility** (low-intensity disrespect, ambiguous intent, can be a single incident), **bullying/mobbing** (repeated negative acts over time, typically with a power imbalance, systematically pushing the target into a "helpless situation with less and less ability to avert or stop" it), and further distinct sub-forms including abusive supervision, social undermining, ostracism, discrimination, and harassment. Isolated incivility is explicitly noted as conceptually distinct from bullying despite surface similarity.
- This directly validates the taxonomy's instinct to lump "mistreated / bullied / disrespected" together as one *user-facing* category (since ordinary users won't self-sort into these technical distinctions), while showing the underlying phenomena researchers track are meaningfully graded by severity, repetition, and power imbalance — useful nuance for a philosophy-matching system even if not for renaming.
- Bullying/mistreatment victimization research directly supports both existing root mappings:
  - **Isolation**: the psychological profile of victimization includes helplessness, passivity, self-blame, shame, guilt, and depression, and other work notes the alienation dimension explicitly.
  - **Freedom**: multiple sources tie victimization to *loss of control/agency* specifically — "a pervasive sense of helplessness, passivity, loss of control," learned helplessness (Seligman & Maier) developing under repeated uncontrollable negative situations, and longitudinal research finding bullying victims develop a more **external locus of control** than non-involved peers, with hopelessness mediating the path from victimization to external locus of control. This is a strong, direct empirical link to Yalom's Freedom concern (agency, responsibility, control).
- Crisis Text Line's own published contact-category data (used as this taxonomy's stated methodological source) lists "Bullying" and "Abuse" as separate, real categories alongside loneliness, depression, and relationships — confirming this is a recognized presenting-concern bucket in practice, not just an academic construct, though the current taxonomy folds bullying and interpersonal disrespect together, whereas Crisis Text Line keeps bullying and abuse as somewhat separate tags.

**Coherence:** Reasonably coherent as a single user-facing surface category — a user won't typically distinguish "incivility" from "bullying" from "abuse" when typing in a problem, and matching downstream philosophical material (teachings on equanimity under mistreatment, boundaries, non-attachment to others' opinions) likely works across the whole spectrum. No strong case to split into named sub-taxonomy categories at the user-facing layer, though the matching/retrieval layer could usefully weight severity (a one-off snide comment vs. sustained bullying) since coping guidance differs.

**Redundancy:** Minimal overlap with other current categories. Some adjacency to #4 (Anger/ongoing conflict) and #10 (Betrayal/broken trust) at the edges (mistreatment by someone previously trusted), but the defining feature here — an imbalance where the user is on the receiving end of others' disrespect/harm, often without power to stop it — is distinct enough from mutual conflict (#4) or trust violation by an intimate (#10) to remain separate.

**Root mapping:** Both Isolation and Freedom are well-supported by the literature found — arguably better supported here than in some other categories in this batch, since the locus-of-control/learned-helplessness research gives a direct, explicit empirical bridge to Yalom's Freedom concern, and the helplessness/self-blame/alienation profile gives a direct bridge to Isolation. No evidence found to change this mapping.

### Recommendation
**Keep as-is** (name and Isolation + Freedom mapping). No split, rename, or merge indicated. Note for the matching/retrieval layer: consider weighting by severity/repetition (one-off disrespect vs. sustained bullying) since the underlying research treats these as graded, even though the user-facing category should stay unified.

### Sources
- [Workplace Incivility, Bullying, and Mental Health-Related Outcomes Among University Faculty: A Narrative Review — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13038390/)
- [Assessing Workplace Bullying and Its Outcomes: The Paradoxical Role of Perceived Power Imbalance Between Target and Perpetrator — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9237549/)
- [Workplace Mistreatment: A Systematic Review of Interventions and Future Research Agenda — Journal of Business Ethics (Springer)](https://link.springer.com/article/10.1007/s10551-025-06058-x)
- [Bullying Victimization: A Comprehensive Overview of Emotional Responses and Psychological Consequences — MDPI](https://www.mdpi.com/2813-9844/8/1/22)
- [Understanding the Psychology of Bullying — APA](https://www.apa.org/pubs/journals/releases/amp-a0038929.pdf)
- [Reflecting on personal experiences of school age bullying... — BERA/Education Studies](https://educationstudies.org.uk/wp-content/uploads/2019/06/BESA-Journal-Transformations-3-1-2-shevlin.pdf)
- [Bullying Victimization and Developmental Trajectories of Internalizing and Externalizing Problems: The Moderating Role of Locus of Control Among Children — PubMed](https://pubmed.ncbi.nlm.nih.gov/33404945/?dopt=Abstract)
- [Learned Helplessness — Psychology Today](https://www.psychologytoday.com/us/basics/learned-helplessness)
- [Bullying: How Feelings of Fatalism May Influence Youth... — University of Missouri-St. Louis (IRL)](https://irl.umsl.edu/cgi/viewcontent.cgi?article=1426&context=thesis)
- [Resources — Crisis Text Line](https://www.crisistextline.org/resources/)

---

## Recommendation summary

| # | Category | Recommendation |
|---|---|---|
| 16 | Jealousy / comparing myself to others | Rename to **"Envy / comparing myself to others."** Keep Isolation + Meaninglessness mapping. Route true relational-jealousy language toward #10/#4. |
| 17 | Guilt / can't forgive myself | **Keep as-is.** Keep Freedom + Meaninglessness mapping. Matching layer should route shame-coded language ("I am bad") to #5 instead. |
| 18 | Impatience / waiting for something to change | **Keep as-is.** Keep Freedom + Death mapping. Distinguish from #3 (anxiety about the unknown) and #7 (unresolved choice) at the matching layer. |
| 19 | Low mood / can't feel joy | **Split into "Low mood / persistent sadness" and "Can't feel joy / anhedonia."** These are empirically distinguishable (negative-affect vs. positive-affect deficit) per DSM-5 and anhedonia-specific literature. At minimum, treat as two distinct query intents at the retrieval layer even if kept as one user-facing category. Root mapping (all four) is a reasonable but unsourced design inference — flagged, not contradicted. |
| 20 | Being mistreated / bullied / disrespected | **Keep as-is.** Keep Isolation + Freedom mapping — this mapping is unusually well-supported (locus-of-control/learned-helplessness research gives a direct empirical bridge to Freedom). Consider severity-weighting at the retrieval layer only. |

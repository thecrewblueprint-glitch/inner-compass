# Case-study research: categories 1–5

Scope: validates/refines only categories 1–5 of `TAXONOMY_V0.1.md` against real clinical/research literature. Every claim below traces to a source found via web search (listed per section). No LLM-invented philosophy or psychology content is used to justify category structure — this is groundwork for the taxonomy layer only, not the philosophy-matching content itself.

---

## 1. Loneliness / feeling isolated even around people

**Current mapping:** Isolation

**What the literature says.** The dominant instrument in loneliness research, the UCLA Loneliness Scale (Russell et al.), defines loneliness explicitly as *not* objective social isolation but "the painful subjective feeling stemming from deficiencies in one's personal and social relationships" — i.e., the scale is built around exactly the phenomenon this category names: feeling alone regardless of how many people are around. Factor-analytic work on the scale traces back to Weiss's (1973) foundational distinction between **social loneliness** (lack of a wider social network/companionship) and **emotional loneliness** (lack of one close, intimate attachment figure) — two dimensions that empirically sometimes separate but are highly intercorrelated and are usually treated as a single global loneliness factor in practice.

Separately, Yalom's own existential framework (the taxonomy's root layer) distinguishes **interpersonal isolation** ("what we typically mean when we say someone is lonely," addressable through social connection) from **existential isolation** — "the inherent unbridgeable gap between any two beings," which persists "even surrounded by loving friends and family." This is a load-bearing distinction for this app specifically: the category name ("feeling isolated even around people") is actually describing existential isolation more than ordinary social-network loneliness, and Yalom's literature explicitly warns that solutions for one type can be "ineffective, or even harmful" applied to the other (e.g., "just spend more time with people" doesn't touch existential isolation).

Crisis Text Line's most recent published annual data report also lists "isolation and loneliness" as a top-five standalone conversation topic (1 in 5 conversations), independent of "relationships," confirming this is a real, frequently-presenting, distinct category in practice — not a subset of relationship problems.

**Coherent category, or does it split?** It is coherent as a *single user-facing entry point* (this is how people actually describe the feeling), but the underlying construct is genuinely two things: (a) social/emotional loneliness (Weiss/Russell — addressable, connection-based) and (b) existential isolation (Yalom — not fixable by more socializing, requires meaning-oriented/acceptance-oriented work). For a philosophy-matching RAG system this matters a lot, because Eastern non-duality/interconnectedness teachings map cleanly onto existential isolation but would feel tone-deaf as advice for someone whose loneliness is really about having no friends nearby. Recommend the taxonomy note (not necessarily split into two surface categories, since users won't self-sort this way) that the retrieval layer should be sensitive to cues distinguishing "I have no one" (social) vs. "I feel alone even with people who love me" (existential) within this one category, since the exact phrase used in the taxonomy title ("even around people") already signals the existential-isolation reading is the intended target.

**Redundancy check.** Overlaps partially with #6 (Rejection/heartbreak) and #10 (Betrayal) in that all three touch relational pain, but loneliness/isolation is the chronic/ambient state rather than a discrete relational event, so it is not redundant — distinct enough to keep separate.

**Root mapping.** Isolation is correct and is in fact the best-evidenced root mapping of the five reviewed — it's a near-exact match to Yalom's own vocabulary.

**Sources**
- [UCLA Loneliness Scale — Wikipedia](https://en.wikipedia.org/wiki/UCLA_Loneliness_Scale)
- [UCLA Loneliness Scale (Version 3): Reliability, Validity, and Factor Structure (ResearchGate)](https://www.researchgate.net/publication/14623374_UCLA_Loneliness_Scale_Version_3_Reliability_Validity_and_Factor_Structure)
- [UCLA Loneliness Scale — ScienceDirect Topics overview](https://www.sciencedirect.com/topics/medicine-and-dentistry/ucla-loneliness-scale)
- [Existential isolation — Wikipedia](https://en.wikipedia.org/wiki/Existential_isolation)
- [A prisoner of one's own mind: Identifying and understanding existential isolation (ScienceDirect)](https://www.sciencedirect.com/science/article/abs/pii/S0191886916309771)
- [Existential Isolation: Theory, Empirical Findings, and Clinical Considerations (Springer)](https://link.springer.com/chapter/10.1007/978-3-031-06932-1_6)
- [Existential Isolation Is Key to Healthy Relationships — Psychology Today](https://www.psychologytoday.com/ca/blog/the-second-noble-truth/202102/existential-isolation-is-key-to-healthy-relationships)
- [Isolation and Connectedness – Existential Therapy](https://existential-therapy.com/isolation-and-connectedness/)
- [Crisis Text Line — Research and Impact / data report summary (PR Newswire)](https://www.prnewswire.com/news-releases/crisis-text-line-releases-third-annual-data-report-on-mental-health-in-america-301558187.html)

---

## 2. Grief / loss of a person, relationship, or way of life

**Current mapping:** Death

**What the literature says.** This category, as currently worded, is actually bundling together at least three distinct grief constructs that the research literature treats separately:

1. **Bereavement grief** (death of a person) — now has a formal DSM-5-TR diagnosis as of March 2022: **Prolonged Grief Disorder** (in the Trauma- and Stressor-Related Disorders chapter), diagnosable when acute grief remains distressing/disabling beyond 12 months post-death (6 months for children/adolescents), requiring at least 3 of 8 specified symptoms (e.g., intense yearning, identity disruption, avoidance of reminders, disbelief about the death) occurring since and because of the death.
2. **Ambiguous loss** (Pauline Boss, 1970s–present) — loss that is unclear/unconfirmed, split into Type 1 (physically absent but psychologically present, e.g. missing persons, estrangement) and Type 2 (physically present but psychologically absent, e.g. dementia, addiction, emotional unavailability). Boss's central and heavily-cited claim: "closure is a myth" for ambiguous loss — grief here can continue indefinitely because the loss is never confirmed or complete, which is a meaningfully different lived experience than bereavement grief.
3. **Anticipatory grief** — grief experienced *before* a loss occurs (e.g., a terminal diagnosis, watching a loved one decline), which can overlap with or transform into ambiguous loss.
4. **Non-death loss / disenfranchised grief** — grief over the loss of a relationship, ability, role, possession, or way of life where no death occurred at all (explicitly named in the Hospice Foundation of America's grief literature as a distinct category from death-loss).

**Coherent category, or does it split?** The taxonomy's own title ("loss of a person, relationship, or way of life") already, correctly, gestures at this breadth — but it currently maps only to the "Death" root, which fits bereavement grief well but fits ambiguous loss and non-death loss (relationship/way-of-life loss) poorly, since those often have little to do with mortality and everything to do with Freedom (loss of control, unresolved uncertainty) or Meaninglessness (loss of an assumed life narrative). Recommend explicitly retaining this as one surface category (users will type "grief" or "loss" regardless of subtype, and over-splitting the *user-facing* label would hurt matching), but flagging for the retrieval/root-mapping layer that non-death and ambiguous loss should be able to route toward Freedom/Meaninglessness content, not only Death content, and that Boss's "no closure" framing versus prolonged-grief-disorder's clinical framing represent different philosophical needs (acceptance-of-nonclosure teachings vs. impermanence teachings).

**Redundancy check.** Meaningful overlap with #1 (loneliness — grief often produces isolation) and #6 (rejection/heartbreak, which is really a subtype of relationship-loss grief) but grief's temporal/ritual dimension (mourning a past bond) is distinct enough from heartbreak's rejection/self-worth dimension to keep separate; flag #6 as a close cousin worth cross-checking against this research by the agent covering it.

**Root mapping.** Death alone is too narrow given the "relationship or way of life" scope in the title; recommend adding Freedom and/or Meaninglessness as secondary roots, consistent with how ambiguous-loss and non-death-loss literature frames those experiences.

**Sources**
- [Prolonged Grief Disorder — American Psychiatric Association](https://www.psychiatry.org/patients-families/prolonged-grief-disorder)
- [APA DSM-5-TR Prolonged Grief Disorder fact sheet (PDF)](https://www.psychiatry.org/getmedia/2a667a19-80ac-4aaf-8751-9ed240619757/APA-DSM5TR-ProlongedGriefDisorder.pdf)
- [DSM-5-TR diagnostic criteria for prolonged grief disorder — Simple and Practical Mental Health](https://simpleandpractical.com/prolonged-grief-disorder-diagnostic-criteria/)
- [Prevalence, Factor Structure and Correlates of DSM-5-TR Criteria for Prolonged Grief Disorder — Frontiers in Psychiatry](https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2022.880380/full)
- [Ambiguous loss — Wikipedia](https://en.wikipedia.org/wiki/Ambiguous_loss)
- [Home — Ambiguous Loss (Pauline Boss)](https://www.ambiguousloss.com/)
- [Ambiguous Loss: Mourning Without Closure — Psych Central](https://psychcentral.com/health/ambiguous-grief)
- [Finding Meaning and New Hope in Ambiguous Loss — Pauline Boss keynote (USI, PDF)](https://www.usi.edu/media/lpuhv0qm/friday_pauline-boss_keynote-finding-meaning-and-new-hope-in-ambiguous-loss.pdf)
- [Grief and other types of loss — Hospice Foundation of America](https://hospicefoundation.org/grief-and-other-types-of-loss/)
- [Ambiguous Grief: grieving someone who is still alive (part 2) — What's Your Grief](https://whatsyourgrief.com/ambiguous-grief-part-2/)

---

## 3. General anxiety / dread about the future

**Current mapping:** Freedom, Death

**What the literature says.** Clinical anxiety research centers this category on **intolerance of uncertainty (IU)**, identified as a specific, well-replicated risk/maintenance factor for Generalized Anxiety Disorder (GAD): people high in IU find uncertain situations threatening and undesirable "regardless of the actual probability of a negative event," and excessive worry/avoidance function as attempts to manufacture certainty. The dominant clinical model (the IU Model of GAD) names four contributing factors: intolerance of uncertainty itself, positive beliefs about worry, negative problem orientation, and cognitive avoidance. This is very close conceptually to the taxonomy's "Freedom" root (groundlessness, no absolute basis for choice/certainty) and gives that mapping real support.

Separately, **Terror Management Theory** (Greenberg, Pyszczynski, Solomon, building on Ernest Becker) treats death-awareness as generating "profound existential anxiety," with research showing a positive relationship between death anxiety specifically and intolerance of uncertainty — i.e., mortality-salience can itself be a *driver* of future-oriented dread, not just a separate topic. This supports keeping Death as a secondary root here rather than dropping it, though it's worth noting TMT researchers themselves flag that "generalized existential anxiety" from the death/uncertainty clash is a distinct construct from clinical GAD, which is a narrower, more symptom-specific category.

**Coherent category, or does it split?** Largely coherent as a single user-facing category, since both clinical GAD/IU research and TMT converge on future-oriented uncertainty as the core mechanism. No strong evidence for splitting.

**Naming.** "Dread about the future" is well-supported by the IU literature's language ("threatening, upsetting, and undesirable" uncertainty) and by TMT's "dual defence" language (proximal defenses suppress death-thoughts; distal defenses manage the resulting anxiety indirectly) — the current name is accurate to the literature and needs no rename.

**Redundancy check.** Overlaps with #12 (Overwhelm/too much to control — also Freedom-rooted) and #8 (Fear of failure/specific outcome — narrower, event-specific version of this same uncertainty mechanism) and #15 (Financial/security fear — a domain-specific instance). Recommend the retrieval layer treat #3 as the general/ambient version and #8/#15 as flavored instances, but keep all as separate surface categories since users type them differently.

**Root mapping.** Freedom, Death — both well-supported; no change recommended. If anything this is the most cleanly dual-rooted category of the five, since IU research supports Freedom and TMT research directly supports Death, and the two literatures explicitly connect to each other.

**Sources**
- [Intolerance Of Uncertainty — Psychology Tools](https://www.psychologytools.com/resource/intolerance-of-uncertainty)
- [The relations between different components of intolerance of uncertainty and symptoms of generalized anxiety disorder: a network analysis — BMC Psychiatry](https://bmcpsychiatry.biomedcentral.com/articles/10.1186/s12888-021-03455-0)
- [Revising the Intolerance of Uncertainty Model of Generalized Anxiety Disorder — Frontiers in Psychology / PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5088195/)
- [The impact of psychological treatment on intolerance of uncertainty in GAD: systematic review and meta-analysis — ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0887618523000671)
- [Terror Management Theory — Simply Psychology](https://www.simplypsychology.org/terror-management-theory.html)
- [Terror Management Theory — Wikipedia](https://en.wikipedia.org/wiki/Terror_management_theory)
- [Applying terror management theory to patients with life-threatening illness: a systematic review — PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10276497/)
- [Putting the Terror in Terror Management Theory — Juhl & Routledge, 2016 (SAGE)](https://journals.sagepub.com/doi/abs/10.1177/0963721415625218)

---

## 4. Anger / ongoing conflict with someone

**Current mapping:** Freedom

**What the literature says.** Two separate research traditions are relevant here and the current category is quietly merging them:

1. **Anger as an emotion.** Clinical/CBT literature (Deffenbacher's model, widely cited) treats anger as arising from trigger event + individual traits (low frustration tolerance, competitiveness) + cognitive appraisal (blameworthy, unjustified, punishable). Notably, Deffenbacher himself points out a real diagnostic gap: "the DSM doesn't have any diagnostic categories where anger is the presenting issue" comparable to anxiety disorders — anger shows up as a *feature* of other conditions (intermittent explosive disorder, PTSD, depression, several personality disorders) rather than a standalone diagnosis. Popular clinical framing (the "anger iceberg" metaphor) treats anger as frequently a **secondary emotion** sitting on top of hurt, fear, sadness, or shame.
2. **Ongoing interpersonal conflict.** This is a separate, well-developed research area — most notably Gottman's "Four Horsemen" (criticism, contempt, defensiveness, stonewalling), empirically shown to predict relationship breakdown with over 90% accuracy in a six-year longitudinal study, with contempt as the single strongest predictor. Critically, Gottman's research finds it's not the presence of conflict/anger itself that predicts breakdown but its *frequency, duration, and whether repair attempts are made and accepted* — chronic, unrepaired conflict is qualitatively different from anger as a discrete emotional state.

**Coherent category, or does it split?** The category conflates "anger" (an emotional/affective category, arguably an entry point via Plutchik's basic-emotion layer per the taxonomy's own stated methodology) with "ongoing conflict with someone" (a relational-pattern category, per Gottman). These have different literatures, different typical resolutions (anger → emotion regulation/identifying the primary emotion underneath; ongoing conflict → repair-attempt/communication-pattern work), and arguably different root mappings (anger-as-emotion is more Freedom/agency — "I couldn't control my reaction" — while ongoing conflict is arguably closer to Isolation — a rupture in connection — per Gottman's framing of contempt as corroding the bond). Recommend either (a) splitting into "Anger" (emotion-focused) and "Ongoing conflict / can't get along with someone" (relationship-pattern-focused), or at minimum (b) keeping as one category but explicitly noting for the retrieval layer that user input mentioning a specific ongoing relationship should route differently than input describing anger as a mood/reaction.

**Redundancy check.** Overlaps with #20 (Being mistreated/bullied/disrespected) — both involve interpersonal conflict — and with #10 (Betrayal/broken trust). Given the conflict half of this category is basically Gottman's territory and #20 is about being on the receiving end of mistreatment, there's a real conceptual line to draw between "conflict I'm part of" (#4) and "harm done to me" (#20) worth the other agent's attention.

**Root mapping.** Freedom fits the anger-as-emotion-regulation half reasonably (the taxonomy's own framing: responsibility/control over one's reaction). It fits the ongoing-conflict half less well — Gottman's research is fundamentally about relational bonds fraying, which is closer to Isolation. Recommend adding Isolation as a secondary root if the category is kept merged, or assigning it as the primary root of a split-off "ongoing conflict" category.

**Sources**
- [Cognitive-behavioral conceptualization and treatment of anger — Deffenbacher, 1999, Journal of Clinical Psychology](https://onlinelibrary.wiley.com/doi/abs/10.1002/%28SICI%291097-4679%28199903%2955%3A3%3C295%3A%3AAID-JCLP3%3E3.0.CO%3B2-A)
- [Trait Anger and Axis I Disorders: Implications for REBT — Journal of Rational-Emotive & Cognitive-Behavior Therapy (Springer)](https://link.springer.com/article/10.1007/s10942-009-0092-2)
- [Advances in anger management — APA Monitor](https://www.apa.org/monitor/mar03/advances)
- [Understanding Why Anger Is a Secondary Emotion — Choosing Therapy](https://www.choosingtherapy.com/anger-is-a-secondary-emotion/)
- [Anger in social conflict: Cross-situational comparisons — Group Decision and Negotiation (Springer)](https://link.springer.com/article/10.1007/s10726-007-9092-8)
- [The Four Horsemen: Criticism, Contempt, Defensiveness, and Stonewalling — Gottman Institute](https://www.gottman.com/blog/the-four-horsemen-recognizing-criticism-contempt-defensiveness-and-stonewalling/)
- [Are the Gottman Four Horsemen Destroying Your Relationship? — Choosing Therapy](https://www.choosingtherapy.com/four-horsemen/)

---

## 5. Shame / feeling fundamentally not okay

**Current mapping:** Meaninglessness, Isolation

**What the literature says.** Brené Brown's research (her 2006 peer-reviewed Shame Resilience Theory study, a grounded-theory study on women and shame, published in *Families in Society*/via SAGE) is the primary citable academic source here and gives a precise, widely-used definition matching the taxonomy's phrasing almost exactly: **shame is "I am bad" (about the whole self) versus guilt, "I did something bad" (about behavior)**. Brown defines guilt as adaptive/helpful (holding behavior against one's values) and shame as "the intensely painful feeling or experience of believing that we are flawed and therefore unworthy of love and belonging" — note "unworthy of love and belonging" is itself an isolation-flavored definition, directly supporting the current Isolation root mapping.

Clinical research also documents heavy overlap between shame-proneness and social anxiety/avoidant personality disorder: both involve "intense fear of being judged, rejected, or embarrassed," and shame-proneness plus negative self-concept and interpersonal hypersensitivity are characteristic features of avoidant personality disorder specifically (though most people with AVPD don't meet full social anxiety disorder criteria — the constructs are related but distinct). Attachment research adds a nuance worth capturing: anxious attachment associates with a self-attacking shame-management style, while avoidant attachment associates with an avoidance-based shame-management style — i.e., "shame" is not experienced/handled uniformly.

**Cross-cultural caveat (important for a philosophy-matching app sourcing Eastern traditions specifically).** Cross-cultural research finds collectivist cultures show higher **externalized** shame tied to group harmony/reputation/"face," while individualist cultures emphasize **internalized** shame tied to personal failure; in collectivist contexts (the research specifically discusses China), shame/guilt management is bound up with meeting social obligations and fear of exposure, and self-worth is tied to social evaluation. This is a significant caveat for this app: since the philosophy content is being sourced from Eastern traditions, the system should not assume shame in those source texts/traditions maps onto the Western, individualist, Brown-style "I am fundamentally flawed as an individual" framing — the traditions may be speaking to a more relational/face-based shame concept, and retrieval-matching should account for that gap rather than flattening it.

**Coherent category, or does it split?** Coherent as a single category — the "I am bad" vs. "I did something bad" distinction is well-established and the taxonomy's title ("feeling fundamentally not okay") correctly targets shame rather than guilt. No split needed, but recommend the taxonomy explicitly exclude guilt-specific framing here since guilt is already separately covered by #17 (Guilt/can't forgive myself) — confirming these two should stay separate categories rather than merge, per Brown's own core distinction.

**Redundancy check.** Overlaps with #13 (Identity or belonging confusion) and #16 (Jealousy/comparing myself to others) in that all three touch self-worth, but shame's core mechanism (global self-condemnation, "unworthy of love and belonging") is distinct enough from identity confusion (not knowing who one is) and comparison (measuring against others) to remain separate. Worth flagging to the agents covering #13/#16/#17 that shame research explicitly treats those as adjacent-but-distinct constructs.

**Naming.** "Shame / feeling fundamentally not okay" is well-supported and accurately reflects the literature's own language; no rename needed.

**Root mapping.** Meaninglessness fits Brown's "flawed and unworthy" framing reasonably (a felt failure of one's basic worth/value). Isolation fits very well and is arguably the stronger of the two given Brown's explicit "unworthy of love and belonging" phrasing and the AVPD/social-anxiety overlap research. No change recommended, though if forced to rank, Isolation is the better-evidenced primary root of the two.

**Sources**
- [Shame Resilience Theory: A Grounded Theory Study on Women and Shame — Brené Brown, 2006 (SAGE)](https://journals.sagepub.com/doi/10.1606/1044-3894.3483)
- [Shame vs. Guilt — Brené Brown (brenebrown.com)](https://brenebrown.com/articles/2013/01/15/shame-v-guilt/)
- [Shame Resilience Theory: Advice From Brené Brown — Positive Psychology](https://positivepsychology.com/shame-resilience-theory/)
- [Brené Brown: The Difference Between Guilt and Shame — Farnam Street](https://fs.blog/brene-brown-guilt-shame/)
- [Avoidant personality disorder as a social anxiety phenotype: risk factors, associations and treatment — PubMed](https://pubmed.ncbi.nlm.nih.gov/26651009/)
- [Avoidant Personality Disorder vs. Social Anxiety — Psych Central](https://psychcentral.com/anxiety/avoidant-personality-disorder-vs-social-anxiety)
- [Why Are We so Easily Ashamed? Attachment Insecurity and Shame Proneness in a Cross-Cultural Comparison — Journal of Aggression, Maltreatment & Trauma](https://www.tandfonline.com/doi/full/10.1080/01639625.2025.2496720)
- [You Should Be Ashamed of Yourself: Culture and Shame Driven Personal Growth — Liyanage & Usoof-Thowfeek, 2023 (SAGE)](https://journals.sagepub.com/doi/10.1177/00220221231183151?icid=int.sj-full-text.similar-articles.2)

---

## Recommendations summary

1. **Loneliness / feeling isolated even around people** — Keep as-is (name and Isolation root both well-supported). Note for retrieval layer: distinguish social/emotional loneliness (Weiss/Russell) from existential isolation (Yalom) within the category, since the title specifically targets the latter.
2. **Grief / loss of a person, relationship, or way of life** — Keep as one surface category, but broaden root mapping: add Freedom and/or Meaninglessness alongside Death, since ambiguous loss and non-death loss research (Pauline Boss; Hospice Foundation of America) don't map cleanly onto Death alone. Flag overlap with #6 (Rejection/heartbreak) for cross-check.
3. **General anxiety / dread about the future** — Keep as-is. Best-evidenced dual root mapping of the five (IU research → Freedom; TMT research → Death, with the two literatures directly connected).
4. **Anger / ongoing conflict with someone** — Split recommended: separate into "Anger" (emotion-regulation focused, Deffenbacher/anger-iceberg literature) and "Ongoing conflict with someone" (relationship-pattern focused, Gottman literature) — the two have different mechanisms, different typical resolutions, and arguably different root mappings (Freedom vs. Isolation). If kept merged, add Isolation as a secondary root.
5. **Shame / feeling fundamentally not okay** — Keep as-is (name, single-category status, and dual root mapping all well-supported by Brown's Shame Resilience Theory). Add an implementation caveat: cross-cultural shame research shows collectivist/Eastern framings of shame are often externalized/face-based rather than the internalized-individual-flaw framing this category's Western source literature assumes — the philosophy-matching layer should not force-fit Eastern source texts into the Brown-style definition.

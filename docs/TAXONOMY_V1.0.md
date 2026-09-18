# Wisdom-guidance app — problem taxonomy, v1.0

**Status.** Refined from [`TAXONOMY_V0.1.md`](TAXONOMY_V0.1.md) after a scoped case-study research pass against real clinical/psychological literature — see [`docs/research/`](research/) for the full per-category writeups and sources (categories-01-05.md, categories-06-10.md, categories-11-15.md, categories-16-20.md). Every structural change below (split, merge, rename, root-mapping change) traces to a specific citable source in those files; nothing here was invented. This is the "refine taxonomy" step in the roadmap (v0.1 → v1.0), done ahead of mapping Eastern philosophy onto categories.

## What changed from v0.1

- **20 surface categories → 25.** Five v0.1 categories split into two each, because the research literature treats them as genuinely distinct constructs with different mechanisms (and, in a working app, different retrieval targets):
  - #4 Anger / ongoing conflict → **Anger** (Deffenbacher's anger-iceberg/CBT literature) + **Ongoing conflict with someone** (Gottman's Four Horsemen)
  - #9 Substance use / compulsive coping → **Substance use** (DSM-5 SUD) + **Compulsive / behavioral coping** (gambling/shopping/overeating — the only other behavioral addiction DSM-5 currently certifies)
  - #11 Career or life purpose → **General life meaninglessness** (Frankl's existential vacuum) + **Career / vocational purpose** (Steger's Work and Meaning Inventory, a separately validated construct from general Presence-of-Meaning)
  - #13 Identity or belonging confusion → **Personal identity confusion** (Erikson/Marcia identity-status theory) + **Cultural or group belonging confusion** (Berry's acculturation research / Bicultural Identity Integration)
  - #19 Low mood / can't feel joy → **Low mood / persistent sadness** + **Can't feel joy / anhedonia** (DSM-5 treats depressed mood and anhedonia as two independently-sufficient core symptoms, not one)
- **2 renames**, both to fix a name that was quietly bundling two different literatures under one folk-psychology label:
  - #8 "Fear of failure or of a specific outcome" → **Fear of failure** (drops "or of a specific outcome," which just duplicated #3 and #15)
  - #16 "Jealousy / comparing myself to others" → **Envy / comparing myself to others** (what users actually mean by this phrase is social-comparison envy, not relational jealousy — see Smith/Kim/Parrott 1988; true relational jealousy routes to Betrayal or Conflict instead)
- **1 broadened root mapping:** #2 Grief was Death-only in v0.1; ambiguous-loss and non-death-loss research (Pauline Boss; Hospice Foundation of America) shows "loss of a relationship or way of life" often isn't about mortality at all, so Freedom and Meaninglessness are added as secondary roots.
- **Everything else** (12 of the original 20) was checked against real literature and kept as-is — names, single-category status, and root mappings all held up.

## Layer 1 — existential roots (unchanged from v0.1)

| Root | Yalom's framing |
|---|---|
| **Death** | We want to live, but know we will die — impermanence, time, loss |
| **Freedom** | We have to choose, with no absolute ground for the choice — responsibility, control, groundlessness |
| **Isolation** | No matter how connected we are, each of us is alone in our own experience |
| **Meaninglessness** | We want life to mean something, but the universe supplies no inherent meaning |

## v1.0 category list

| # | Surface category | Roots | From v0.1 # |
|---|---|---|---|
| 1 | Loneliness / feeling isolated even around people | Isolation | 1 |
| 2 | Grief / loss of a person, relationship, or way of life | Death, Freedom, Meaninglessness | 2 |
| 3 | General anxiety / dread about the future | Freedom, Death | 3 |
| 4 | Anger | Freedom | 4 (split a) |
| 5 | Ongoing conflict with someone | Freedom, Isolation | 4 (split b) |
| 6 | Shame / feeling fundamentally not okay | Meaninglessness, Isolation | 5 |
| 7 | Rejection / heartbreak | Isolation, Meaninglessness | 6 |
| 8 | Feeling stuck / can't decide | Freedom | 7 |
| 9 | Fear of failure | Freedom, Death | 8 (renamed) |
| 10 | Substance use | Death, Meaninglessness | 9 (split a) |
| 11 | Compulsive / behavioral coping | Death, Meaninglessness | 9 (split b) |
| 12 | Betrayal / broken trust | Isolation | 10 |
| 13 | General life meaninglessness | Meaninglessness | 11 (split a) |
| 14 | Career / vocational purpose | Meaninglessness | 11 (split b) |
| 15 | Overwhelm / too much to control | Freedom | 12 |
| 16 | Personal identity confusion | Meaninglessness, Freedom | 13 (split a) |
| 17 | Cultural or group belonging confusion | Isolation | 13 (split b) |
| 18 | Illness or fear about health / mortality | Death | 14 |
| 19 | Financial or security fear | Freedom, Death | 15 |
| 20 | Envy / comparing myself to others | Isolation, Meaninglessness | 16 (renamed) |
| 21 | Guilt / can't forgive myself | Freedom, Meaninglessness | 17 |
| 22 | Impatience / waiting for something to change | Freedom, Death | 18 |
| 23 | Low mood / persistent sadness | Death, Freedom, Isolation, Meaninglessness | 19 (split a) |
| 24 | Can't feel joy / anhedonia | Death, Freedom, Isolation, Meaninglessness | 19 (split b) |
| 25 | Being mistreated / bullied / disrespected | Isolation, Freedom | 20 |

Deliberately **not included in v1.0**, same as v0.1: active suicidal ideation, self-harm, intimate partner violence, and acute psychiatric crisis — a hard, immediate redirect to real crisis resources, not a philosophy lookup (see `ROADMAP.md`).

## Matching-layer notes carried forward from the research

These aren't taxonomy changes, but they're findings from the research pass that whoever builds the retrieval-matching logic (Phase 6) needs, so they're recorded here rather than lost:

- **#1 Loneliness** — the title ("even around people") targets Yalom's *existential* isolation, not just social-network loneliness (Weiss/Russell). Be sensitive to "I have no one" (social) vs. "I feel alone even with people who love me" (existential) — they want different source material.
- **#6 Shame** — cross-cultural research shows collectivist/Eastern shame is often externalized/face-based, not the internalized-individual-flaw model of the (Western) Shame Resilience Theory literature this category is grounded in. Don't force-fit Eastern source texts into that Western framing.
- **#7 Rejection/heartbreak vs. #12 Betrayal** — dividing line: relationship *ended* → Rejection/heartbreak; trust *violated* (relationship may continue) → Betrayal.
- **#9 Fear of failure** — the Death-root connection runs through Terror Management Theory/ego-threat, not literal mortality. Death-root source material for this category should lean impermanence/non-attachment-to-outcome, not death imagery.
- **#13/#14 General life meaninglessness vs. Career/vocational purpose** — someone can have strong general life meaning while feeling their work is pointless, or vice versa; route "is my job pointless" to #14, "nothing matters" broadly to #13.
- **#16/#17 Identity split** — personal identity confusion is well served by non-dual/anatta (no-fixed-self) teachings; cultural/group belonging confusion is better served by interconnectedness/community teachings that don't ask the person to dissolve identity.
- **#20 Envy vs. relational jealousy** — true relational jealousy (fear of losing a partner to a rival) should route to #5 (Conflict) or #12 (Betrayal), not #20.
- **#21 Guilt vs. #6 Shame** — guilt-coded language ("I did something wrong") → #21; shame-coded language ("I am wrong/bad") → #6. These are empirically distinct (Tangney), not synonyms.
- **#23/#24 Low mood vs. anhedonia** — negative-affect deficit (sadness) vs. positive-affect deficit (loss of pleasure/motivation); different mechanisms, likely different source material even if the product ships them as one user-facing category.
- **#23/#24 root mapping** — "all four roots" is a reasonable design choice, not a literature-sourced claim (no source found mapping low mood/anhedonia to all four Yalom concerns as a unit). Flagged, not contradicted.

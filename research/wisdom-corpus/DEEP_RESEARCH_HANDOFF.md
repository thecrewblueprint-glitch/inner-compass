# Deep Research Handoff — Inner Compass Wisdom Corpus

## Mission

Populate the research workspace for GitHub Issue #3: **Research Epic: Wisdom Literature Quote Corpus + 25-Category Retrieval Matrix**.

The goal is to build a large, auditable, static source corpus that Inner Compass can retrieve **without runtime AI**.

Do not redesign the application. Do not modify production KB files. Do not change the 25-category taxonomy.

## Repository boundary

Write research only under:

`research/wisdom-corpus/**`

Do not edit:

`content/knowledge-base/**`
`src/retrieval/**`
`src/safety/**`
`src/validation/**`

## Read first

1. GitHub Issue #3.
2. `research/wisdom-corpus/README.md`
3. `research/wisdom-corpus/research-queue.json`
4. `research/wisdom-corpus/schemas/source.schema.json`
5. `research/wisdom-corpus/schemas/wisdom-record.schema.json`
6. `research/wisdom-corpus/category-source-matrix.csv`
7. Existing taxonomy and KB docs only for category context; do not copy unsupported claims forward.

## Research order

Work phase-by-phase. Begin with **Phase 1: Stoicism**.

For each source:

1. establish a bibliographic source record;
2. identify primary passages/teachings relevant to the 25 categories;
3. verify exact quotations against a named edition/translation;
4. record passage locator, translator, edition, source URLs, and rights status;
5. inspect surrounding context to prevent quote-mining;
6. map each source record to one or more categories;
7. record positive problem signals and negative/boundary signals;
8. identify neighboring categories that the passage should **not** automatically match;
9. create faithful paraphrases where direct quoting is not verified or rights-safe;
10. create original Inner Compass affirmation candidates only after the source record is established.

## Hard rules

- Never invent a quote.
- Never use an unattributed quote aggregator as authority.
- Never put a paraphrase in quotation marks.
- Never attribute an Inner Compass affirmation to the historical author.
- Never flatten distinct traditions into generic "Eastern philosophy."
- Stoicism is Western Hellenistic philosophy.
- Identify the specific Buddhist/Indian/Chinese school or textual tradition when possible.
- Modern translation wording must include translator/edition metadata.
- Prefer public-domain/open translations for direct quote storage.
- If a modern translation is copyrighted, use citation + paraphrase unless direct display is clearly appropriate.
- Do not force a source into a category just to fill coverage.
- Category 10 and other safety-sensitive material may be researched, but this corpus must never bypass the application's upstream safety router.

## Required category work

For all 25 categories, eventually populate:

- problem signals
- negative-match signals
- philosophical themes
- strong-fit traditions
- weak/forced traditions
- source record IDs
- direct quote record IDs
- paraphrase record IDs
- affirmation candidate IDs
- neighboring/confusable category IDs
- review status

## Direct quote verification standard

A record may be marked `VERIFIED_DIRECT_QUOTE` only when all are known:

- exact wording
- author / attribution
- work
- passage locator
- translator where applicable
- edition
- bibliographic citation
- source link or stable bibliographic locator
- surrounding context
- rights status

Otherwise use `SOURCE_PARAPHRASE`.

## Affirmation standard

Affirmations are original Inner Compass language.

Each candidate must:
- map to exactly one primary category;
- link to one or more audited wisdom record IDs;
- preserve the source teaching without pretending to quote it;
- avoid diagnosis, medical advice, universal promises, or certainty;
- preserve user agency;
- remain appropriate for deterministic display.

## Research quality

Prefer primary texts and reputable scholarship. Where interpretations are contested, record the disagreement instead of silently choosing one interpretation.

Use secondary scholarship to establish historical context and interpretive caution. Do not bulk-copy copyrighted scholarship.

## Coverage target

Initial target:
- all 25 categories represented;
- at least 5 high-quality source records per category;
- at least 3 affirmation candidates per category;
- multiple traditions per category only where genuinely relevant;
- 100% of direct quotes traceable to a verified source;
- zero paraphrases presented as quotes;
- zero affirmations without source-record linkage.

## Deliverables

Populate:
- `sources.json`
- `records.jsonl`
- `category-source-matrix.csv`
- `category-retrieval-map.json`
- `affirmation-candidates.json`
- `translation-review.md`
- `rights-review.md`
- `quote-verification-log.md`

## Completion behavior

Do not merge research directly into production KB.

At the end of each research phase, provide:
1. sources completed;
2. records added;
3. category coverage gained;
4. unresolved source/translation/rights questions;
5. weak or forced mappings rejected;
6. records ready for independent audit;
7. recommended next phase.

The research output should be auditable by a human without relying on the research model's memory or authority.

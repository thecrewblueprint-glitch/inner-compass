# Inner Compass Wisdom Corpus Research Workspace

Issue: #3 — Research Epic: Wisdom Literature Quote Corpus + 25-Category Retrieval Matrix

## Purpose

This directory is a research-only staging area for expanding Inner Compass's source corpus across Stoicism, Buddhism, Daoism, Indian philosophical traditions, Confucian/classical Chinese sources, and later approved traditions.

This workspace must remain separate from the production knowledge base until the research has passed source, rights, category-fit, safety, and retrieval audits.

## Production boundary

Do **not** edit these production paths while performing this research:

- `content/knowledge-base/**`
- `src/retrieval/**`
- `src/safety/**`
- `src/validation/**`

Research goes only under:

- `research/wisdom-corpus/**`

## Research outputs

- `research-queue.json` — ordered source/tradition queue
- `sources.json` — bibliographic source registry
- `records.jsonl` — atomic quote/paraphrase research records
- `category-source-matrix.csv` — category coverage matrix
- `category-retrieval-map.json` — deterministic retrieval metadata by category
- `affirmation-candidates.json` — source-linked original Inner Compass affirmation candidates
- `translation-review.md` — translation comparisons and edition decisions
- `rights-review.md` — public-domain/licensing/citation-only determinations
- `quote-verification-log.md` — quote provenance audit log
- `schemas/*.schema.json` — machine-readable validation schemas
- `DEEP_RESEARCH_HANDOFF.md` — operating instructions for Deep Research

## Record types

Every research record must be exactly one of:

- `VERIFIED_DIRECT_QUOTE`
- `SOURCE_PARAPHRASE`
- `INNER_COMPASS_AFFIRMATION`

A paraphrase must never be rendered as a direct quote. An Inner Compass affirmation must never be attributed to an author.

## Evidence priority

Prefer, in order:

1. primary source editions in the public domain;
2. public-domain or openly licensed translations;
3. reputable critical/scholarly editions for verification;
4. modern scholarship for context, translation comparison, and interpretation;
5. citation + paraphrase where direct display of copyrighted modern wording is not appropriate.

Do not use quote aggregators, Pinterest cards, unsourced social posts, or AI-generated quote lists as authority.

## Category authority

The existing 25-category taxonomy remains authoritative. This research may map source material to categories, but it must not silently add, delete, rename, merge, or split categories.

## Runtime architecture

The target corpus must be usable by deterministic retrieval without runtime AI.

Research may use Deep Research as a research assistant, but the resulting corpus must consist of static, auditable records with traceable sources.

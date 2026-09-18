# Knowledge-base schema, v1.0

Defines the structure of `content/knowledge-base/*.json` — the production-ready data files a future retrieval-matching layer (Phase 6) loads. This is Phase 5 of `ROADMAP.md`: turning `docs/WISDOM_MAPPING_V1.0.md`'s research into structured, machine-readable records. No new sourcing happened in this pass — every field below is a faithful restructuring of content already cited in `docs/wisdom-mapping/mapping-*.md`; nothing was invented in the transformation.

## File layout

Five files, matching the existing category clusters: `kb-01-05.json`, `kb-06-10.json`, `kb-11-15.json`, `kb-16-20.json`, `kb-21-25.json`. Each is a JSON array of **category objects**.

## Category object

```json
{
  "category_id": 1,
  "category_name": "Loneliness / feeling isolated even around people",
  "existential_roots": ["Isolation"],
  "safety_notes": ["string, or omitted/[] if none carried forward"],
  "entries": [ /* 3+ entry objects, see below */ ],
  "synthesis_note": "how the entries work together for this category (from the wisdom-mapping file's section D)"
}
```

- `category_id` / `category_name` / `existential_roots` — from `TAXONOMY_V1.0.md`.
- `safety_notes` — carried forward verbatim in substance from `CLINICAL_KB_V1.0.md` / `WISDOM_MAPPING_V1.0.md`'s safety-carryover sections. A retrieval layer should surface these alongside matched content, not silently drop them.

## Entry object

```json
{
  "entry_id": "1-A",
  "pillar": "eastern_philosophy | shadow_work | psychology_methodology",
  "tradition_or_school": "e.g. 'Buddhism (Zen/Mahayana, Plum Village tradition)' or 'Jungian depth psychology' or 'Positive psychology / self-compassion research'",
  "source_author": "real named author/teacher",
  "source_work": "real named text, book, article, or study",
  "citation_urls": ["real URL(s)"],
  "teaching": "accurate description of the teaching/concept/finding — a paraphrase unless verified_quote is set",
  "verified_quote": "exact quoted words, only when verified against a real source — null otherwise",
  "practice_or_technique": "a concrete practice tied to this teaching, when one exists — null otherwise",
  "confidence": "sourced | extrapolated",
  "confidence_note": "present only when confidence is 'extrapolated' — explains what's extrapolated and why"
}
```

- `pillar` is always one of the three enum values.
- `confidence: "extrapolated"` marks every honestly-flagged gap from `WISDOM_MAPPING_V1.0.md` (e.g., entry 22-B's puer-aeternus-to-Death-root link, entry 8-C's ACT-for-indecision claim) — carried forward as data, not dropped.
- `verified_quote` is `null` far more often than not — most teachings in the source research are accurate descriptions with citations, not verbatim quotations, per the project's own no-fabrication rule. Never treat `teaching` text as a quotable string unless `verified_quote` is set.

## Retrieval-layer contract (for whoever builds Phase 6)

- Match a user's input to a `category_id` (or a ranked few), then to `existential_roots` for tie-breaking or blending.
- Retrieve that category's `entries` (and, per the app's core architecture rule, only these entries — the LLM's job is matching and phrasing, never generating new teaching content from its own memory).
- Always surface `safety_notes` to whatever layer decides on crisis-redirect vs. wisdom-content routing — this schema doesn't implement that routing logic itself, it only carries the data the routing logic needs.
- When phrasing a response, distinguish `verified_quote` (safe to quote directly) from `teaching` (paraphrase — do not add quotation marks around it).

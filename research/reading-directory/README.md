# Inner Compass Suggested Reads Directory

A static, auditable **book-only** reading directory linked to the Wisdom Corpus and 25-category taxonomy.

## Product rules
- Distinguish philosophy, religion, metaphysics, ethics, contemplative practice, and scholarship.
- Do not collapse Asian traditions into generic "Eastern wisdom."
- Primary texts, scholarship, and modern introductions are visibly labeled.
- Every represented branch must have at least one audited starter book.
- Every book record carries edition metadata, an ISBN-backed library link, and an ISBN-backed remote book-cover reference.
- Cover art is referenced from Open Library rather than copied into this repository; the UI falls back to a neutral local cover treatment if a remote cover cannot load.
- No runtime AI is required for search, filtering, branch browsing, pathways, or recommendations.

## Files
- `traditions.json` — tradition hierarchy and canonical branch list
- `readings.json` — audited application dataset
- `readings.jsonl` — exact line-delimited mirror for research/tooling
- `branch-reading-map.json` — explicit branch → starter-book coverage
- `reading-pathways.json` — curated static thematic pathways
- `category-reading-map.json` — 25-category links
- `schemas/reading.schema.json` — book record contract
- `schemas/tradition.schema.json` — hierarchy contract
- `translation-guide.md` — translation/edition guidance
- `rights-review.md` — visual/text rights rules
- `tools/eval/audit_reading_directory.py` — CI integrity gate

The directory is intentionally curated rather than exhaustive. Breadth is measured by audited branch coverage, not by inflating the catalog with weak recommendations.

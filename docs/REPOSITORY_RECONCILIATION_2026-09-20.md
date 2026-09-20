# Repository Reconciliation — 2026-09-20

This record reconciles open issues, merged PRs, and divergent/orphan branches before the deterministic-only consolidation merge.

## Canonical base

- `main` includes merged PR #11 (cross-page linking) and all earlier accepted research/product work.
- Consolidation branch: `work/close-all-open-issues-2026-09-20`.
- The consolidation branch was rebuilt from current `main` rather than merging an older divergent work branch.

## Merged work already canonical

| PR | Status | Canonical contribution |
|---|---|---|
| #5 | merged | Wisdom corpus Phase 1 — Stoicism |
| #6 | merged | Wisdom corpus Phase 2 — early Buddhist sources |
| #7 | merged | Wisdom corpus Phase 3 — classical Daoism |
| #9 | merged | Remaining wisdom corpus phases, first Suggested Reads product, deterministic launch controls |
| #11 | merged | Cross-page linking among guidance, wisdom, reads, journal, and taxonomy |

## Open issue hierarchy

### #3 — Wisdom Literature Quote Corpus + 25-Category Retrieval Matrix

**Repository implementation: complete.**

- Phases 1–6 represented in the audited corpus.
- 25-category matrix and deterministic retrieval metadata exist.
- Source-linked affirmations and corpus audit exist.
- Searchable Wisdom Library is integrated.
- Direct quotation display remains rights-gated; paraphrase/citation behavior does not bypass the safety router.

Disposition: close when the consolidation PR merges.

### #4 — Suggested Reads Directory

**Repository implementation: complete on the consolidation branch.**

- 36 audited books.
- 41 named philosophy/religion branches.
- Every named branch has at least one starter book through `branch_coverage[]`.
- ISBN-backed Open Library book records and remote cover references are required.
- Branch, tradition, region, book-type, reading-level, access, theme/search, category, and wisdom links remain deterministic/static.
- `readings.jsonl`, tradition schema, branch-reading map, and CI audit added.

Disposition: close when the consolidation PR merges.

### #8 — Launch Compliance Gate

**Engineering portion implemented; external/operator gates remain.**

Implemented repository controls include local-only reflection processing, deterministic-only runtime, no provider SDK/config, local-data clearing, 18+ U.S. launch attestation, quote-display rights gating, launch claims/privacy documentation, and CI checks.

Still external/non-code: legal operator/contact confirmation, counsel review/sign-off, host/subprocessor approval, final manual accessibility review, and owner U.S.-launch approval.

Disposition: keep open after merge as the launch gate. Do not mark external approvals complete without actual approval.

### #10 — Fully deterministic-only architecture

**Repository implementation: complete on the consolidation branch.**

- Provider/model runtime paths removed.
- Provider-era eval/config/docs removed.
- Dev evaluation remains deterministic.
- CI guard rejects reintroduction of model/provider code and credentials.
- Safety, classification, clarification, retrieval, wisdom, affirmations, and reading recommendations remain local/static/deterministic.

Disposition: close when the consolidation PR merges.

## Orphan/divergent branch disposition

### Integrated into the consolidation branch

- `product/legal-privacy-by-design-2026-09-19`
  - recovered the stronger local 18+ / U.S. launch attestation gate;
  - integrated selectively without treating unreviewed legal copy as counsel-approved terms.

- `work/finish-existing-issues-2026-09-20`
  - recovered real one-page-at-a-time navigation history;
  - recovered and expanded the back-navigation browser regression.

- `architecture/deterministic-only-2026-09-20`
  - its valid deterministic-only cleanup was replayed onto a fresh branch based on current `main`;
  - direct merge was intentionally avoided because it predated PR #11.

### Already merged or superseded

- research phase branches associated with PRs #5, #6, #7 — merged via squash and retained only as historical source branches.
- `work/complete-open-issues-2026-09-19` — superseded by merged PR #9.
- `fix/in-app-linking-2026-09-20` — source work represented by merged PR #11.
- `ai-studio/web-app` — no unique work beyond canonical main at reconciliation time.
- `fix/navigation-stack` and `work/fix-linking-finish-existing-issues-2026-09-20` — behind/superseded by recovered current implementations.

### Obsolete / prohibited by current architecture

- `ai-studio/react-native-mvp` / PR #1
  - contains Firebase/server model-provider architecture and OpenRouter paths;
  - conflicts with issue #10 and the owner's zero-AI decision;
  - must not be merged.

- PR #2, Alternate web app preview
  - closed unmerged;
  - old callable/generated-guidance architecture is superseded by the deterministic web app.

### Historical backups

`backup/main-*` branches are retained as snapshots only. They are not merge sources. Later deterministic performance snapshots remain useful as provenance, but stale provider-era result artifacts are deliberately removed from the active tree.

## Merge gate

The consolidation PR is mergeable only when required CI confirms:

1. deterministic-only architecture audit passes;
2. wisdom corpus audit passes;
3. Suggested Reads branch/cover/reference audit passes;
4. TypeScript passes;
5. browser E2E passes, including back-stack and branch browsing;
6. production health reports local-deterministic runtime, zero external decision providers, and no raw reflection transport.


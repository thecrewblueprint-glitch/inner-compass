import assert from "node:assert/strict";
import test from "node:test";
import {
  enrichDraft,
  fallbackDraft,
  validateDraft
} from "../src/lib/grounding.js";
import type { Category } from "../src/lib/types.js";

const category: Category = {
  category_id: 99,
  category_name: "Synthetic test category",
  existential_roots: ["Freedom"],
  safety_notes: [],
  synthesis_note: "A deterministic synthetic synthesis.",
  entries: [
    {
      entry_id: "99-A",
      pillar: "eastern_philosophy",
      tradition_or_school: "Synthetic",
      source_author: "Author A",
      source_work: "Work A",
      citation_urls: ["https://example.com/a"],
      teaching: "Canonical teaching A.",
      verified_quote: null,
      practice_or_technique: "Canonical practice A.",
      confidence: "sourced",
      confidence_note: null
    },
    {
      entry_id: "99-B",
      pillar: "shadow_work",
      tradition_or_school: "Synthetic",
      source_author: "Author B",
      source_work: "Work B",
      citation_urls: ["https://example.com/b"],
      teaching: "Canonical teaching B.",
      verified_quote: "Verified B",
      practice_or_technique: null,
      confidence: "sourced",
      confidence_note: null
    },
    {
      entry_id: "99-C",
      pillar: "psychology_methodology",
      tradition_or_school: "Synthetic",
      source_author: "Author C",
      source_work: "Work C",
      citation_urls: ["https://example.com/c"],
      teaching: "Canonical teaching C.",
      verified_quote: null,
      practice_or_technique: null,
      confidence: "extrapolated",
      confidence_note: "Synthetic extrapolation note."
    }
  ]
};

test("canonical fallback always validates and enriches from server metadata", () => {
  const draft = fallbackDraft(category);
  const result = validateDraft(draft, category);
  assert.deepEqual(result, { ok: true });

  const response = enrichDraft(draft, category);
  assert.equal(response.blocks[0]?.source_author, "Author A");
});

test("invented teaching is rejected", () => {
  const draft = fallbackDraft(category);
  draft.blocks[0]!.message = "Invented content.";

  const result = validateDraft(draft, category);
  assert.equal(result.ok, false);
});

test("altered quote is rejected", () => {
  const draft = fallbackDraft(category);
  draft.blocks[1]!.quote = "Changed quote";

  const result = validateDraft(draft, category);
  assert.equal(result.ok, false);
});

test("invented practice is rejected", () => {
  const draft = fallbackDraft(category);
  draft.blocks[2]!.practice = "New practice";

  const result = validateDraft(draft, category);
  assert.equal(result.ok, false);
});

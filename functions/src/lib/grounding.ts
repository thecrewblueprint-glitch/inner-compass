import type {
  Category,
  GuidanceBlock,
  ModelGuidanceDraft,
  WisdomResponse
} from "./types.js";

export type ValidationResult =
  | { ok: true }
  | { ok: false; reasons: string[] };

function containsUnapprovedSourceLikeText(text: string): boolean {
  return /https?:\/\//i.test(text);
}

export function validateDraft(
  draft: ModelGuidanceDraft,
  category: Category
): ValidationResult {
  const reasons: string[] = [];

  if (draft.category_id !== category.category_id) {
    reasons.push("wrong_category");
  }

  if (!Array.isArray(draft.blocks) || draft.blocks.length !== category.entries.length) {
    reasons.push("wrong_block_count");
  }

  const canonicalById = new Map(
    category.entries.map((entry) => [entry.entry_id, entry])
  );

  const seen = new Set<string>();

  for (const block of draft.blocks ?? []) {
    const entry = canonicalById.get(block.entry_id);

    if (!entry) {
      reasons.push("unknown_entry_id");
      continue;
    }

    if (seen.has(block.entry_id)) reasons.push("duplicate_entry_id");
    seen.add(block.entry_id);

    if (block.pillar !== entry.pillar) reasons.push("wrong_pillar");

    // The model is not allowed to manufacture or paraphrase source content
    // inside the three canonical cards. It must copy the stored teaching.
    if (block.message !== entry.teaching) reasons.push("teaching_not_canonical");

    if (
      block.practice !== null &&
      block.practice !== entry.practice_or_technique
    ) {
      reasons.push("practice_not_canonical");
    }

    if (block.quote !== null && block.quote !== entry.verified_quote) {
      reasons.push("quote_not_verified");
    }
  }

  if (seen.size !== category.entries.length) {
    reasons.push("missing_canonical_entry");
  }

  if (
    typeof draft.reflection !== "string" ||
    draft.reflection.length < 1 ||
    draft.reflection.length > 900 ||
    containsUnapprovedSourceLikeText(draft.reflection)
  ) {
    reasons.push("invalid_reflection");
  }

  if (
    typeof draft.affirmation !== "string" ||
    draft.affirmation.length < 1 ||
    draft.affirmation.length > 280 ||
    containsUnapprovedSourceLikeText(draft.affirmation)
  ) {
    reasons.push("invalid_affirmation");
  }

  return reasons.length ? { ok: false, reasons } : { ok: true };
}

export function fallbackDraft(category: Category): ModelGuidanceDraft {
  return {
    category_id: category.category_id,
    reflection: category.synthesis_note,
    blocks: category.entries.map((entry) => ({
      entry_id: entry.entry_id,
      pillar: entry.pillar,
      message: entry.teaching,
      practice: entry.practice_or_technique,
      quote: entry.verified_quote
    })),
    affirmation: "I can meet this moment with patience, attention, and care."
  };
}

export function enrichDraft(
  draft: ModelGuidanceDraft,
  category: Category
): WisdomResponse {
  const byId = new Map(category.entries.map((entry) => [entry.entry_id, entry]));

  const blocks: GuidanceBlock[] = draft.blocks.map((block) => {
    const source = byId.get(block.entry_id);
    if (!source) throw new Error("GROUNDING_ENTRY_MISSING_AFTER_VALIDATION");

    return {
      ...block,
      source_author: source.source_author,
      source_work: source.source_work,
      citation_urls: source.citation_urls,
      confidence: source.confidence,
      confidence_note: source.confidence_note
    };
  });

  return {
    kind: "wisdom",
    category_id: category.category_id,
    category_name: category.category_name,
    reflection: draft.reflection,
    blocks,
    affirmation: draft.affirmation
  };
}

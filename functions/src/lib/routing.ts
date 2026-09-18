import type {
  ClassificationResult,
  SignalCode
} from "./types.js";

export type RouteDecision =
  | { kind: "safety_redirect"; message: string }
  | { kind: "support"; message: string }
  | { kind: "needs_clarification"; categoryIds: number[] }
  | { kind: "wisdom"; categoryId: number };

function includesAny(signals: SignalCode[], wanted: SignalCode[]) {
  return wanted.some((signal) => signals.includes(signal));
}

export function decideRoute(
  classification: ClassificationResult,
  deterministicSignals: SignalCode[],
  selectedCategoryId?: number
): RouteDecision {
  const signals = Array.from(
    new Set([...deterministicSignals, ...classification.signal_codes])
  );

  if (
    includesAny(signals, [
      "OUT_OF_SCOPE_SAFETY",
      "ABUSE_BOUNDARY",
      "HARD_CEILING",
      "ESCALATION_21",
      "ESCALATION_24"
    ])
  ) {
    return {
      kind: "safety_redirect",
      message: "Direct human support should come before reflective guidance for this situation."
    };
  }

  if (
    includesAny(signals, [
      "PRACTICAL_SUPPORT_EDGE",
      "PROFESSIONAL_SUPPORT_EDGE"
    ]) ||
    classification.route_candidate === "support"
  ) {
    return {
      kind: "support",
      message: "Practical or professional support may be more useful than a philosophy-only response here."
    };
  }

  if (selectedCategoryId) {
    return { kind: "wisdom", categoryId: selectedCategoryId };
  }

  const candidates = [...classification.category_candidates]
    .filter((candidate) => candidate.category_id >= 1 && candidate.category_id <= 25)
    .sort((a, b) => b.confidence - a.confidence);

  const top = candidates[0];
  const second = candidates[1];

  if (!top) {
    return { kind: "needs_clarification", categoryIds: [] };
  }

  const ambiguous =
    classification.route_candidate === "needs_clarification" ||
    top.confidence < 0.72 ||
    (second !== undefined && top.confidence - second.confidence < 0.12);

  if (ambiguous) {
    return {
      kind: "needs_clarification",
      categoryIds: candidates.slice(0, 3).map((candidate) => candidate.category_id)
    };
  }

  return { kind: "wisdom", categoryId: top.category_id };
}

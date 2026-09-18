export type Pillar =
  | "eastern_philosophy"
  | "shadow_work"
  | "psychology_methodology";

export type Confidence = "sourced" | "extrapolated";

export type KBEntry = {
  entry_id: string;
  pillar: Pillar;
  tradition_or_school: string;
  source_author: string;
  source_work: string;
  citation_urls: string[];
  teaching: string;
  verified_quote: string | null;
  practice_or_technique: string | null;
  confidence: Confidence;
  confidence_note: string | null;
};

export type Category = {
  category_id: number;
  category_name: string;
  existential_roots: string[];
  safety_notes: string[];
  entries: KBEntry[];
  synthesis_note: string;
};

export type KBIndex = {
  schema_version: string;
  category_count: number;
  entries_per_category: number;
  total_entries: number;
  pillars: Pillar[];
  files: Array<{ file: string; category_ids: number[] }>;
  hard_ceiling_categories: number[];
  escalation_candidate_categories: number[];
};

export type SignalCode =
  | "NONE"
  | "OUT_OF_SCOPE_SAFETY"
  | "ABUSE_BOUNDARY"
  | "HARD_CEILING"
  | "ESCALATION_21"
  | "ESCALATION_24"
  | "PRACTICAL_SUPPORT_EDGE"
  | "PROFESSIONAL_SUPPORT_EDGE";

export type ClassificationResult = {
  route_candidate:
    | "wisdom"
    | "support"
    | "safety_redirect"
    | "needs_clarification";
  category_candidates: Array<{
    category_id: number;
    confidence: number;
  }>;
  signal_codes: SignalCode[];
};

export type ModelGuidanceDraft = {
  category_id: number;
  reflection: string;
  blocks: Array<{
    entry_id: string;
    pillar: Pillar;
    message: string;
    practice: string | null;
    quote: string | null;
  }>;
  affirmation: string;
};

export type GuidanceBlock = ModelGuidanceDraft["blocks"][number] & {
  source_author: string;
  source_work: string;
  citation_urls: string[];
  confidence: Confidence;
  confidence_note: string | null;
};

export type WisdomResponse = {
  kind: "wisdom";
  category_id: number;
  category_name: string;
  reflection: string;
  blocks: GuidanceBlock[];
  affirmation: string;
};

export type GenerateGuidanceResponse =
  | WisdomResponse
  | {
      kind: "needs_clarification";
      choices: Array<{ category_id: number; category_name: string }>;
    }
  | {
      kind: "support" | "safety_redirect";
      message: string;
      resource_tier: "support" | "urgent";
    }
  | {
      kind: "error";
      code: string;
      message: string;
    };

export type Pillar =
  | "eastern_philosophy"
  | "shadow_work"
  | "psychology_methodology";

export type GuidanceBlock = {
  entry_id: string;
  pillar: Pillar;
  message: string;
  practice: string | null;
  quote: string | null;
  source_author: string;
  source_work: string;
  citation_urls: string[];
  confidence: "sourced" | "extrapolated";
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

export type ClarificationChoice = {
  category_id: number;
  category_name: string;
};

export type NeedsClarificationResponse = {
  kind: "needs_clarification";
  choices: ClarificationChoice[];
};

export type SupportResponse = {
  kind: "support" | "safety_redirect";
  message: string;
  resource_tier: "support" | "urgent";
};

export type ErrorResponse = {
  kind: "error";
  code: string;
  message: string;
};

export type GenerateGuidanceResponse =
  | WisdomResponse
  | NeedsClarificationResponse
  | SupportResponse
  | ErrorResponse;

export type GenerateGuidanceRequest = {
  text: string;
  selected_category_id?: number;
  client_request_id: string;
};

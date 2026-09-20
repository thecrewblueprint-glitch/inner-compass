export type ExistentialRoot = 'Death' | 'Freedom' | 'Isolation' | 'Meaninglessness';

export type PillarType = 'eastern_philosophy' | 'shadow_work' | 'psychology_methodology';

export interface KBEntry {
  entry_id: string;
  pillar: PillarType;
  tradition_or_school: string;
  source_author: string;
  source_work: string;
  citation_urls: string[];
  teaching: string;
  verified_quote: string | null;
  practice_or_technique: string | null;
  confidence: 'sourced' | 'extrapolated';
  confidence_note: string | null;
}

export interface Category {
  category_id: number;
  category_name: string;
  existential_roots: ExistentialRoot[];
  safety_notes: string[];
  entries: KBEntry[];
  synthesis_note: string;
}

export interface KBIndexMetadata {
  schema_version: string;
  schema_doc: string;
  generated_from: string;
  category_count: number;
  entries_per_category: number;
  total_entries: number;
  pillars: string[];
  files: { file: string; category_ids: number[] }[];
  hard_ceiling_categories: number[];
  escalation_candidate_categories: number[];
  notes: string;
}

export interface EmergencyResource {
  name: string;
  contact: string;
  tel?: string;
  sms?: string;
  url: string;
  description: string;
  badge: string;
}

export type SafetyStatus = 'SAFE' | 'CRISIS_REDIRECT' | 'ABUSE_REDIRECT' | 'ABUSE_BOUNDARY' | 'ESCALATION_REDIRECT' | 'SUBSTANCE_HARD_CEILING';

export interface SafetyRoutingResult {
  status: SafetyStatus;
  isTriggered: boolean;
  reason?: string;
  safetyNotes: string[];
  emergencyResources: EmergencyResource[];
  blockedFromWisdomMatching: boolean;
  suggestedCategoryId?: number;
}

export interface StructuredLLMOutput {
  matched_category_id: number;
  existential_roots?: string[];
  phrased_reflection: string;
  selected_entry_ids?: string[];
  confidence?: number;
}

export interface GroundingValidationResult {
  isValid: boolean;
  rejectionReason?: string;
  verifiedEntries: KBEntry[];
  groundedSynthesis: string;
  warnings: string[];
}

export interface RetrievalAlternative {
  category_id: number;
  category_name: string;
  score: number;
}

export interface RetrievalMatch {
  category: Category;
  score: number;
  rawScore?: number;
  explanation: string;
  matchedPillars: KBEntry[];
  runnerUp?: RetrievalAlternative;
  scoreMargin?: number;
  needsClarification?: boolean;
  clarificationQuestion?: string;
}

export interface GuidanceResult {
  category: Category;
  safety: SafetyRoutingResult;
  grounding?: GroundingValidationResult;
  affirmation: string;
  synthesis: string;
  guidanceSource?: 'canonical_deterministic';
}

export interface SavedReflection {
  id: string;
  categoryId: number;
  categoryName: string;
  timestamp: number;
  problemInput?: string;
  affirmation?: string;
  synthesisNote: string;
}

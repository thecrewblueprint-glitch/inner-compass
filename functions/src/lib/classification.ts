import type {
  ClassificationResult,
  SignalCode
} from "./types.js";
import { getClassifierCatalog } from "./kb.js";
import { callOpenRouterStructured } from "./openrouter.js";

const signalCodes: SignalCode[] = [
  "NONE",
  "OUT_OF_SCOPE_SAFETY",
  "ABUSE_BOUNDARY",
  "HARD_CEILING",
  "ESCALATION_21",
  "ESCALATION_24",
  "PRACTICAL_SUPPORT_EDGE",
  "PROFESSIONAL_SUPPORT_EDGE"
];

const classificationSchema = {
  type: "object",
  additionalProperties: false,
  required: ["route_candidate", "category_candidates", "signal_codes"],
  properties: {
    route_candidate: {
      type: "string",
      enum: [
        "wisdom",
        "support",
        "safety_redirect",
        "needs_clarification"
      ]
    },
    category_candidates: {
      type: "array",
      minItems: 0,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["category_id", "confidence"],
        properties: {
          category_id: { type: "integer", minimum: 1, maximum: 25 },
          confidence: { type: "number", minimum: 0, maximum: 1 }
        }
      }
    },
    signal_codes: {
      type: "array",
      minItems: 1,
      uniqueItems: true,
      items: {
        type: "string",
        enum: signalCodes
      }
    }
  }
} as const;

function assertClassification(value: ClassificationResult): ClassificationResult {
  if (
    ![
      "wisdom",
      "support",
      "safety_redirect",
      "needs_clarification"
    ].includes(value.route_candidate)
  ) {
    throw new Error("CLASSIFIER_INVALID_ROUTE");
  }

  if (!Array.isArray(value.category_candidates) || value.category_candidates.length > 3) {
    throw new Error("CLASSIFIER_INVALID_CANDIDATES");
  }

  for (const candidate of value.category_candidates) {
    if (
      !Number.isInteger(candidate.category_id) ||
      candidate.category_id < 1 ||
      candidate.category_id > 25 ||
      typeof candidate.confidence !== "number" ||
      candidate.confidence < 0 ||
      candidate.confidence > 1
    ) {
      throw new Error("CLASSIFIER_INVALID_CANDIDATE");
    }
  }

  if (
    !Array.isArray(value.signal_codes) ||
    value.signal_codes.some((signal) => !signalCodes.includes(signal))
  ) {
    throw new Error("CLASSIFIER_INVALID_SIGNAL");
  }

  return value;
}

export async function classifyProblem(input: {
  text: string;
  apiKey: string;
  modelId: string;
  providerAllowlist?: string[];
}): Promise<ClassificationResult> {
  const catalog = getClassifierCatalog();

  const system = [
    "You are the bounded routing classifier for Inner Compass.",
    "Classify only. Do not provide advice, diagnosis, treatment, philosophy, quotes, practices, or explanations.",
    "Use only the supplied 25-category catalog.",
    "Return up to three ranked category candidates.",
    "Use needs_clarification when the user's meaning overlaps plausible categories or confidence is weak.",
    "Safety/support signals may escalate routing but must never downgrade a deterministic safety decision.",
    "Use NONE only when no other signal applies."
  ].join("\n");

  const user = JSON.stringify({
    catalog,
    signal_code_meanings: {
      OUT_OF_SCOPE_SAFETY: "Immediate safety concern; reflective wisdom must not be the primary response.",
      ABUSE_BOUNDARY: "Relationship-safety boundary; conflict/reconciliation material must not be primary.",
      HARD_CEILING: "Category 10 or comparable substance-related safety boundary.",
      ESCALATION_21: "Category 21 presentation requiring direct support before reflection.",
      ESCALATION_24: "Category 24 presentation requiring direct support before reflection.",
      PRACTICAL_SUPPORT_EDGE: "A practical-resource response should accompany or replace reflection.",
      PROFESSIONAL_SUPPORT_EDGE: "Professional support should accompany or replace reflection."
    },
    user_text: input.text
  });

  const result = await callOpenRouterStructured<ClassificationResult>({
    apiKey: input.apiKey,
    modelId: input.modelId,
    schemaName: "inner_compass_classification",
    schema: classificationSchema,
    system,
    user,
    providerAllowlist: input.providerAllowlist
  });

  return assertClassification(result);
}

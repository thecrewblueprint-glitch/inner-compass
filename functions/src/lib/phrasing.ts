import type { Category, ModelGuidanceDraft } from "./types.js";
import { callOpenRouterStructured } from "./openrouter.js";

const phrasingSchema = {
  type: "object",
  additionalProperties: false,
  required: ["category_id", "reflection", "blocks", "affirmation"],
  properties: {
    category_id: { type: "integer", minimum: 1, maximum: 25 },
    reflection: { type: "string", minLength: 1, maxLength: 900 },
    blocks: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["entry_id", "pillar", "message", "practice", "quote"],
        properties: {
          entry_id: { type: "string" },
          pillar: {
            type: "string",
            enum: [
              "eastern_philosophy",
              "shadow_work",
              "psychology_methodology"
            ]
          },
          message: { type: "string" },
          practice: { type: ["string", "null"] },
          quote: { type: ["string", "null"] }
        }
      }
    },
    affirmation: { type: "string", minLength: 1, maxLength: 280 }
  }
} as const;

export async function phraseGroundedGuidance(input: {
  category: Category;
  apiKey: string;
  modelId: string;
  providerAllowlist?: string[];
  repairReasons?: string[];
}): Promise<ModelGuidanceDraft> {
  const canonical = input.category.entries.map((entry) => ({
    entry_id: entry.entry_id,
    pillar: entry.pillar,
    teaching: entry.teaching,
    practice_or_technique: entry.practice_or_technique,
    verified_quote: entry.verified_quote
  }));

  const system = [
    "You are the bounded phrasing layer for Inner Compass.",
    "You may write only the top-level reflection and affirmation in new wording.",
    "Do not introduce factual, clinical, historical, philosophical, or source claims in those new sentences.",
    "For every block, copy entry_id, pillar, teaching, practice, and verified quote exactly from the supplied canonical record.",
    "Set block.message equal to canonical teaching exactly.",
    "Set block.practice to the exact canonical practice or null.",
    "Set block.quote to the exact verified quote or null.",
    "Never add sources, authors, works, citations, URLs, diagnoses, or new practices.",
    "Return exactly three blocks."
  ].join("\n");

  const user = JSON.stringify({
    category_id: input.category.category_id,
    category_name: input.category.category_name,
    synthesis_note: input.category.synthesis_note,
    canonical_entries: canonical,
    repair_reasons: input.repairReasons ?? []
  });

  return callOpenRouterStructured<ModelGuidanceDraft>({
    apiKey: input.apiKey,
    modelId: input.modelId,
    schemaName: "inner_compass_grounded_guidance",
    schema: phrasingSchema,
    system,
    user,
    providerAllowlist: input.providerAllowlist
  });
}

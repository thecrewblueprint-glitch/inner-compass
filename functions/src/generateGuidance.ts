import { HttpsError, onCall } from "firebase-functions/v2/https";
import {
  defineInt,
  defineSecret,
  defineString
} from "firebase-functions/params";
import { classifyProblem } from "./lib/classification.js";
import {
  enrichDraft,
  fallbackDraft,
  validateDraft
} from "./lib/grounding.js";
import { getCategory, loadKnowledgeBase } from "./lib/kb.js";
import { phraseGroundedGuidance } from "./lib/phrasing.js";
import { enforceRateLimit } from "./lib/rateLimit.js";
import { decideRoute } from "./lib/routing.js";
import { evaluateSafety } from "./lib/safetyPolicy.js";
import { logGuidanceEvent } from "./lib/telemetry.js";
import type {
  ClassificationResult,
  GenerateGuidanceResponse,
  SignalCode
} from "./lib/types.js";

const OPENROUTER_API_KEY = defineSecret("OPENROUTER_API_KEY");
const OPENROUTER_MODEL_ID = defineString("OPENROUTER_MODEL_ID", {
  default: ""
});
const OPENROUTER_PROVIDER_ALLOWLIST = defineString(
  "OPENROUTER_PROVIDER_ALLOWLIST",
  { default: "" }
);
const GUIDANCE_RATE_LIMIT_PER_HOUR = defineInt(
  "GUIDANCE_RATE_LIMIT_PER_HOUR",
  { default: 30 }
);

function providerAllowlist(): string[] | undefined {
  const raw = OPENROUTER_PROVIDER_ALLOWLIST.value().trim();
  if (!raw) return undefined;

  const values = raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return values.length ? values : undefined;
}

function selectedClassification(
  categoryId: number,
  deterministicSignals: SignalCode[]
): ClassificationResult {
  const { index } = loadKnowledgeBase();
  const signals = [...deterministicSignals];

  if (index.hard_ceiling_categories.includes(categoryId)) {
    signals.push("HARD_CEILING");
  }

  return {
    route_candidate: "wisdom",
    category_candidates: [{ category_id: categoryId, confidence: 1 }],
    signal_codes: Array.from(new Set(signals.length ? signals : ["NONE"]))
  };
}

function applyCategoryCeilings(
  classification: ClassificationResult
): ClassificationResult {
  const { index } = loadKnowledgeBase();
  const top = [...classification.category_candidates].sort(
    (a, b) => b.confidence - a.confidence
  )[0];

  if (
    top &&
    index.hard_ceiling_categories.includes(top.category_id) &&
    !classification.signal_codes.includes("HARD_CEILING")
  ) {
    return {
      ...classification,
      signal_codes: [...classification.signal_codes, "HARD_CEILING"]
    };
  }

  return classification;
}

export const generateGuidance = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
    consumeAppCheckToken: true,
    secrets: [OPENROUTER_API_KEY]
  },
  async (request): Promise<GenerateGuidanceResponse> => {
    const started = Date.now();
    const requestId =
      typeof request.data?.client_request_id === "string"
        ? request.data.client_request_id.slice(0, 80)
        : "missing";

    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "Anonymous authentication is required.");
    }

    const text =
      typeof request.data?.text === "string" ? request.data.text.trim() : "";

    if (text.length < 3 || text.length > 4000) {
      throw new HttpsError("invalid-argument", "Reflection text is outside the allowed length.");
    }

    const selectedCategoryId =
      Number.isInteger(request.data?.selected_category_id)
        ? Number(request.data.selected_category_id)
        : undefined;

    if (
      selectedCategoryId !== undefined &&
      (selectedCategoryId < 1 || selectedCategoryId > 25)
    ) {
      throw new HttpsError("invalid-argument", "Invalid selected category.");
    }

    try {
      await enforceRateLimit(
        request.auth.uid,
        GUIDANCE_RATE_LIMIT_PER_HOUR.value()
      );
    } catch (error) {
      if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
        throw new HttpsError(
          "resource-exhausted",
          "The hourly guidance limit has been reached."
        );
      }
      throw error;
    }

    const safety = evaluateSafety(text);

    if (safety.hardRedirect) {
      logGuidanceEvent({
        requestId,
        status: "safety_redirect",
        latencyMs: Date.now() - started
      });

      return {
        kind: "safety_redirect",
        message:
          safety.message ??
          "Direct human support should come before reflective guidance for this situation.",
        resource_tier: "urgent"
      };
    }

    const modelId = OPENROUTER_MODEL_ID.value().trim();
    const apiKey = OPENROUTER_API_KEY.value();

    if (!modelId || !apiKey) {
      logGuidanceEvent({
        requestId,
        status: "provider_not_configured",
        latencyMs: Date.now() - started
      });

      return {
        kind: "error",
        code: "PROVIDER_NOT_CONFIGURED",
        message: "The grounded guidance service is not configured yet."
      };
    }

    let classification: ClassificationResult;

    if (selectedCategoryId !== undefined) {
      if (!getCategory(selectedCategoryId)) {
        throw new HttpsError("invalid-argument", "Unknown selected category.");
      }

      classification = selectedClassification(
        selectedCategoryId,
        safety.signalCodes
      );
    } else {
      classification = applyCategoryCeilings(
        await classifyProblem({
          text,
          apiKey,
          modelId,
          providerAllowlist: providerAllowlist()
        })
      );
    }

    const route = decideRoute(
      classification,
      safety.signalCodes,
      selectedCategoryId
    );

    if (route.kind === "safety_redirect") {
      logGuidanceEvent({
        requestId,
        status: "safety_redirect",
        latencyMs: Date.now() - started,
        modelId
      });

      return {
        kind: "safety_redirect",
        message: route.message,
        resource_tier: "urgent"
      };
    }

    if (route.kind === "support") {
      logGuidanceEvent({
        requestId,
        status: "support",
        latencyMs: Date.now() - started,
        modelId
      });

      return {
        kind: "support",
        message: route.message,
        resource_tier: "support"
      };
    }

    if (route.kind === "needs_clarification") {
      const choices = route.categoryIds
        .map((id) => getCategory(id))
        .filter((category): category is NonNullable<typeof category> => Boolean(category))
        .map((category) => ({
          category_id: category.category_id,
          category_name: category.category_name
        }));

      if (!choices.length) {
        return {
          kind: "error",
          code: "REPHRASE_REQUIRED",
          message: "The situation could not be matched confidently. Rephrase it with the main concern you want perspective on."
        };
      }

      logGuidanceEvent({
        requestId,
        status: "needs_clarification",
        latencyMs: Date.now() - started,
        modelId
      });

      return {
        kind: "needs_clarification",
        choices
      };
    }

    const category = getCategory(route.categoryId);
    if (!category) {
      throw new HttpsError("internal", "Matched category is unavailable.");
    }

    let draft = await phraseGroundedGuidance({
      category,
      apiKey,
      modelId,
      providerAllowlist: providerAllowlist()
    });

    let validation = validateDraft(draft, category);
    let validatorStatus = validation.ok ? "valid_first_pass" : "repair_required";

    if (!validation.ok) {
      draft = await phraseGroundedGuidance({
        category,
        apiKey,
        modelId,
        providerAllowlist: providerAllowlist(),
        repairReasons: validation.reasons
      });

      validation = validateDraft(draft, category);
      validatorStatus = validation.ok ? "valid_after_repair" : "canonical_fallback";
    }

    if (!validation.ok) {
      draft = fallbackDraft(category);
      const fallbackValidation = validateDraft(draft, category);
      if (!fallbackValidation.ok) {
        throw new Error("CANONICAL_FALLBACK_FAILED_VALIDATION");
      }
    }

    const response = enrichDraft(draft, category);

    logGuidanceEvent({
      requestId,
      status: "wisdom",
      latencyMs: Date.now() - started,
      modelId,
      validatorStatus
    });

    return response;
  }
);

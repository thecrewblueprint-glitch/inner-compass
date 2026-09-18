import { logger } from "firebase-functions";

export function logGuidanceEvent(input: {
  requestId: string;
  status: string;
  latencyMs: number;
  modelId?: string;
  validatorStatus?: string;
}) {
  logger.info("inner_compass_guidance_event", {
    request_id: input.requestId,
    status: input.status,
    latency_ms: input.latencyMs,
    model_id: input.modelId ?? "none",
    validator_status: input.validatorStatus ?? "not_run"
  });
}

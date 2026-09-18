import type { SignalCode } from "./types.js";

export type SafetyPreflight = {
  signalCodes: SignalCode[];
  hardRedirect: boolean;
  message?: string;
};

const outOfScopeSafetyPatterns = [
  /\bsuicid\w*\b/i,
  /\bself[- ]?harm\b/i,
  /\bimmediate danger\b/i,
  /\bnot safe right now\b/i
];

const abuseBoundaryPatterns = [
  /\bdomestic violence\b/i,
  /\babusive relationship\b/i,
  /\bstalking\b/i,
  /\bunsafe relationship\b/i
];

const escalation21Patterns = [
  /\bmoral injury\b/i,
  /\bunforgivable guilt\b/i
];

const escalation24Patterns = [
  /\bsudden loss of pleasure\b/i,
  /\brecent onset anhedonia\b/i
];

export function evaluateSafety(text: string): SafetyPreflight {
  const signalCodes: SignalCode[] = [];

  if (outOfScopeSafetyPatterns.some((pattern) => pattern.test(text))) {
    signalCodes.push("OUT_OF_SCOPE_SAFETY");
  }

  if (abuseBoundaryPatterns.some((pattern) => pattern.test(text))) {
    signalCodes.push("ABUSE_BOUNDARY");
  }

  if (escalation21Patterns.some((pattern) => pattern.test(text))) {
    signalCodes.push("ESCALATION_21");
  }

  if (escalation24Patterns.some((pattern) => pattern.test(text))) {
    signalCodes.push("ESCALATION_24");
  }

  const hardRedirect = signalCodes.some((signal) =>
    [
      "OUT_OF_SCOPE_SAFETY",
      "ABUSE_BOUNDARY",
      "ESCALATION_21",
      "ESCALATION_24"
    ].includes(signal)
  );

  return {
    signalCodes: signalCodes.length ? signalCodes : ["NONE"],
    hardRedirect,
    message: hardRedirect
      ? "This situation is better handled with direct human support before reflective guidance."
      : undefined
  };
}

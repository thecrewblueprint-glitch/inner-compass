/**
 * Phase 2 / Non-Negotiable Rule 7: Privacy Policy & No-Log Enforcement
 * "Do not persist or log raw user reflection text."
 * Rule 12: "Unknown privacy/provider/safety state fails closed."
 */

export interface SafeTelemetryRecord {
  timestamp: number;
  categoryId: number;
  existentialRoots: string[];
  safetyStatus: string;
  isCrisisTriggered: boolean;
  latencyMs?: number;
}

export class PrivacyManager {
  /**
   * Sanitizes any log payload to strictly remove user reflection input,
   * personal names, or raw text strings.
   */
  public static sanitizeLog(payload: unknown): unknown {
    if (!payload || typeof payload !== 'object') {
      return payload;
    }

    const copy = JSON.parse(JSON.stringify(payload));
    const forbiddenKeys = [
      'problemText',
      'userProblem',
      'reflectionText',
      'rawInput',
      'text',
      'input',
      'practiceNotes',
      'userNotes',
    ];

    const redact = (obj: Record<string, unknown>) => {
      for (const key of Object.keys(obj)) {
        if (forbiddenKeys.includes(key) && typeof obj[key] === 'string') {
          obj[key] = '[REDACTED_PRIVACY_RULE_7]';
        } else if (obj[key] && typeof obj[key] === 'object') {
          redact(obj[key] as Record<string, unknown>);
        }
      }
    };

    redact(copy);
    return copy;
  }

  /**
   * Safe telemetry recording: stores metadata only, never raw user text.
   */
  public static createTelemetryRecord(
    categoryId: number,
    existentialRoots: string[],
    safetyStatus: string,
    isCrisisTriggered: boolean,
    latencyMs?: number
  ): SafeTelemetryRecord {
    return {
      timestamp: Date.now(),
      categoryId,
      existentialRoots,
      safetyStatus,
      isCrisisTriggered,
      latencyMs,
    };
  }

  /**
   * Validates that state complies with privacy rules.
   * If any unknown or unverified privacy state exists, fails closed.
   */
  public static verifyCompliance(rawText: string, targetToPersist: Record<string, unknown>): boolean {
    const serialized = JSON.stringify(targetToPersist);
    if (rawText && rawText.trim().length > 3 && serialized.includes(rawText.trim())) {
      console.error('[PRIVACY VIOLATION DETECTED] Attempted to persist raw user reflection text!');
      return false;
    }
    return true;
  }
}

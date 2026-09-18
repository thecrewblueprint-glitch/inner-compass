import { PrivacyManager } from '../src/safety/privacy';

export function runPrivacyTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  // Test 1: Redaction of raw user reflection text in logs
  const dirtyLog = {
    event: 'guidance_requested',
    categoryId: 5,
    userProblem: 'I had a huge fight with my spouse and said terrible things.',
    timestamp: 1710000000,
  };

  const sanitized = PrivacyManager.sanitizeLog(dirtyLog) as Record<string, unknown>;
  results.push({
    name: 'PrivacyManager.sanitizeLog redacts userProblem key',
    passed:
      sanitized.userProblem === '[REDACTED_PRIVACY_RULE_7]' &&
      sanitized.categoryId === 5,
    error: `Got userProblem: ${sanitized.userProblem}`,
  });

  // Test 2: verifyCompliance rejects storing raw text
  const rawSecret = 'This is a deeply personal confession that must never be saved.';
  const invalidTarget = {
    note: `User said: ${rawSecret}`,
  };

  const isCompliant = PrivacyManager.verifyCompliance(rawSecret, invalidTarget);
  results.push({
    name: 'PrivacyManager.verifyCompliance flags persistence containing raw reflection text',
    passed: isCompliant === false,
    error: `Expected false, got ${isCompliant}`,
  });

  // Test 3: Telemetry record contains strictly safe metadata
  const telemetry = PrivacyManager.createTelemetryRecord(
    14,
    ['Freedom'],
    'SAFE',
    false,
    142
  );
  results.push({
    name: 'Telemetry record contains only category, roots, and status (no user text)',
    passed:
      telemetry.categoryId === 14 &&
      telemetry.safetyStatus === 'SAFE' &&
      !('text' in telemetry) &&
      !('userProblem' in telemetry),
  });

  return results;
}

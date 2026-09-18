import { runKbIntegrityTests } from './kb-integrity.test';
import { runSafetyRouterTests } from './safety-router.test';
import { runGroundingValidatorTests } from './grounding-validator.test';
import { runPrivacyTests } from './privacy-telemetry.test';

async function main() {
  console.log('====================================================');
  console.log('  INNER COMPASS PHASE 6 MVP - AUTOMATED TEST SUITE  ');
  console.log('====================================================\n');

  const suites = [
    { title: 'Suite 1: Canonical KB Loader & Schema Integrity', fn: runKbIntegrityTests },
    { title: 'Suite 2: Upstream Deterministic Safety Router', fn: runSafetyRouterTests },
    { title: 'Suite 3: Grounding Validator (No LLM Invention)', fn: runGroundingValidatorTests },
    { title: 'Suite 4: Rule 7 Privacy Policy & Redaction', fn: runPrivacyTests },
  ];

  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  for (const suite of suites) {
    console.log(`--- ${suite.title} ---`);
    const results = suite.fn();
    for (const res of results) {
      totalTests++;
      if (res.passed) {
        totalPassed++;
        console.log(`  ✓ PASS: ${res.name}`);
      } else {
        totalFailed++;
        console.error(`  ✗ FAIL: ${res.name}`);
        if (res.error) {
          console.error(`    Details: ${res.error}`);
        }
      }
    }
    console.log('');
  }

  console.log('====================================================');
  console.log(`TEST SUMMARY: ${totalPassed} PASSED, ${totalFailed} FAILED (Total: ${totalTests})`);
  console.log('====================================================');

  if (totalFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});

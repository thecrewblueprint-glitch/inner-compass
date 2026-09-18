import { validateGrounding } from '../src/validation/groundingValidator';
import { getCategoryById } from '../src/knowledgeBase/kbLoader';
import { StructuredLLMOutput } from '../src/types';

export function runGroundingValidatorTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  const cat1 = getCategoryById(1)!;

  // Test 1: Compliant LLM Output passes validation
  const validOutput: StructuredLLMOutput = {
    matched_category_id: 1,
    existential_roots: ['Isolation'],
    phrased_reflection: 'Thich Nhat Hanh and Pema Chödrön teach that loneliness can be held with spacious awareness. Carl Jung explains that persistant aloneness points to an exiled part of the self in the shadow. Kristin Neff reminds us of our common humanity.',
    selected_entry_ids: ['1-A', '1-B', '1-C'],
    confidence: 90,
  };
  const validRes = validateGrounding(validOutput, cat1);
  results.push({
    name: 'Grounding Validator accepts compliant output with verified category authors',
    passed: validRes.isValid === true && validRes.verifiedEntries.length === 3,
    error: validRes.rejectionReason,
  });

  // Test 2: Reject Hallucinated/Unauthorized Author (Rule 1 & Rule 10)
  // Category 1 does not feature Nietzsche or Brad Klontz. If LLM injects Brad Klontz into Category 1, it must fail closed!
  const hallucinatedAuthorOutput: StructuredLLMOutput = {
    matched_category_id: 1,
    existential_roots: ['Isolation'],
    phrased_reflection: 'Brad Klontz teaches that money scripts dictate your loneliness in this situation.',
    selected_entry_ids: ['1-A'],
    confidence: 85,
  };
  const rejectedRes = validateGrounding(hallucinatedAuthorOutput, cat1);
  results.push({
    name: 'Grounding Validator fails closed on unauthorized author from another category',
    passed: rejectedRes.isValid === false && Boolean(rejectedRes.rejectionReason),
    error: `Expected isValid === false, got ${rejectedRes.isValid}`,
  });

  // Test 3: Null LLM Output falls back gracefully to canonical synthesis
  const nullRes = validateGrounding(null, cat1);
  results.push({
    name: 'Grounding Validator safely returns canonical synthesis when LLM output is null',
    passed:
      nullRes.isValid === false &&
      nullRes.groundedSynthesis === cat1.synthesis_note &&
      nullRes.verifiedEntries.length === 3,
  });

  return results;
}

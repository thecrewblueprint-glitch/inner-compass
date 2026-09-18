import { evaluateSafetyUpstream } from '../src/safety/safetyRouter';

export function runSafetyRouterTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  // Test 1: Immediate suicidality triggers CRISIS_REDIRECT and blocks wisdom matching
  const crisisInput = 'I want to kill myself, I have no reason to live anymore.';
  const crisisResult = evaluateSafetyUpstream(crisisInput);
  results.push({
    name: 'Immediate suicidality triggers CRISIS_REDIRECT and blocks wisdom matching',
    passed:
      crisisResult.status === 'CRISIS_REDIRECT' &&
      crisisResult.blockedFromWisdomMatching === true &&
      crisisResult.isTriggered === true &&
      crisisResult.emergencyResources.length >= 2,
    error: `Got status: ${crisisResult.status}, blocked: ${crisisResult.blockedFromWisdomMatching}`,
  });

  // Test 2: Category 5 Abuse Boundary (IPV / domestic violence triggers ABUSE_REDIRECT and blocks wisdom matching)
  const abuseInput = 'My partner hits me and threatened to hurt me if I leave.';
  const abuseResult = evaluateSafetyUpstream(abuseInput);
  results.push({
    name: 'Category 5 abuse boundary triggers ABUSE_REDIRECT (never routes to relationship-staying)',
    passed:
      abuseResult.status === 'ABUSE_REDIRECT' &&
      abuseResult.blockedFromWisdomMatching === true &&
      abuseResult.emergencyResources.some((r) => r.name.includes('Domestic Violence')),
    error: `Got status: ${abuseResult.status}, blocked: ${abuseResult.blockedFromWisdomMatching}`,
  });

  // Test 3: Category 10 Substance Use Hard Ceiling (never wisdom-only)
  const substanceInput = 'I am struggling with alcohol addiction and having severe withdrawal shakes.';
  const substanceResult = evaluateSafetyUpstream(substanceInput);
  results.push({
    name: 'Substance use triggers SUBSTANCE_HARD_CEILING with SAMHSA helpline mandate',
    passed:
      substanceResult.status === 'SUBSTANCE_HARD_CEILING' &&
      substanceResult.isTriggered === true &&
      substanceResult.suggestedCategoryId === 10 &&
      substanceResult.emergencyResources.some((r) => r.name.includes('SAMHSA')),
    error: `Got status: ${substanceResult.status}, suggestedCategory: ${substanceResult.suggestedCategoryId}`,
  });

  // Test 4: Category 21 Moral Injury Escalation (suicide risk candidate)
  const moralInjuryInput = 'Someone died because of me, my mistake killed them and I do not deserve to live.';
  const moralInjuryResult = evaluateSafetyUpstream(moralInjuryInput);
  results.push({
    name: 'Moral injury guilt triggers ESCALATION_REDIRECT and blocks wisdom matching',
    passed:
      moralInjuryResult.status === 'ESCALATION_REDIRECT' &&
      moralInjuryResult.blockedFromWisdomMatching === true &&
      moralInjuryResult.suggestedCategoryId === 21,
    error: `Got status: ${moralInjuryResult.status}, blocked: ${moralInjuryResult.blockedFromWisdomMatching}`,
  });

  // Test 5: Category 24 Acute/Recent-Onset Anhedonia Escalation
  const acuteAnhedoniaInput = 'Two weeks ago I suddenly lost all pleasure, I feel completely numb inside and cannot feel anything.';
  const anhedoniaResult = evaluateSafetyUpstream(acuteAnhedoniaInput);
  results.push({
    name: 'Sudden/recent-onset anhedonia triggers ESCALATION_REDIRECT and blocks wisdom matching',
    passed:
      anhedoniaResult.status === 'ESCALATION_REDIRECT' &&
      anhedoniaResult.blockedFromWisdomMatching === true &&
      anhedoniaResult.suggestedCategoryId === 24,
    error: `Got status: ${anhedoniaResult.status}, blocked: ${anhedoniaResult.blockedFromWisdomMatching}`,
  });

  // Test 6: Safe Contemplative Dilemma passes through cleanly
  const safeInput = 'I am feeling stuck between two good career choices and afraid of making a mistake.';
  const safeResult = evaluateSafetyUpstream(safeInput);
  results.push({
    name: 'Ordinary contemplative dilemma passes upstream safety router as SAFE',
    passed:
      safeResult.status === 'SAFE' &&
      safeResult.isTriggered === false &&
      safeResult.blockedFromWisdomMatching === false,
    error: `Got status: ${safeResult.status}`,
  });

  return results;
}

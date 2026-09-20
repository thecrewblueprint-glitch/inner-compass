import { EmergencyResource, SafetyRoutingResult } from '../types';

/**
 * Deterministic upstream safety router.
 *
 * Contract:
 * - runs before ordinary retrieval;
 * - normalizes punctuation/case/spacing;
 * - high-confidence safety matches redirect immediately;
 * - ambiguous safety language fails closed to SAFETY_REVIEW_REDIRECT;
 * - no raw reflection text is logged or returned as diagnostics;
 * - current supported language is English.
 */

export const EMERGENCY_RESOURCES: Record<string, EmergencyResource> = {
  emergencyServices: {
    name: 'Emergency Services',
    contact: 'Call 911 for immediate danger',
    tel: 'tel:911',
    url: 'https://www.911.gov',
    description: 'United States emergency response for immediate danger or a life-threatening emergency.',
    badge: 'Immediate danger',
  },
  suicideLifeline: {
    name: '988 Suicide & Crisis Lifeline',
    contact: 'Call or text 988',
    tel: 'tel:988',
    sms: 'sms:988',
    url: 'https://988lifeline.org',
    description: 'United States crisis support available 24/7.',
    badge: '24/7 crisis support',
  },
  crisisTextLine: {
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741',
    sms: 'sms:741741?body=HOME',
    url: 'https://www.crisistextline.org',
    description: 'Crisis counseling by text.',
    badge: 'Text support',
  },
  domesticViolenceHotline: {
    name: 'National Domestic Violence Hotline',
    contact: '1-800-799-SAFE (7233) or text START to 88788',
    tel: 'tel:18007997233',
    sms: 'sms:88788?body=START',
    url: 'https://www.thehotline.org',
    description: 'Support and safety resources for relationship abuse or threats.',
    badge: 'Relationship safety',
  },
  samhsaHelpline: {
    name: 'SAMHSA National Helpline',
    contact: '1-800-662-4357 (HELP)',
    tel: 'tel:18006624357',
    url: 'https://www.samhsa.gov/find-help/helplines/national-helpline',
    description: 'Treatment referral and information for mental health and substance-use services.',
    badge: 'Treatment referral',
  },
  community211: {
    name: '211 Community Resources',
    contact: 'Call 211',
    tel: 'tel:211',
    url: 'https://www.211.org',
    description: 'Local housing, food, legal-aid, and community-resource connections.',
    badge: 'Community support',
  },
  rainnHotline: {
    name: 'RAINN National Sexual Assault Hotline',
    contact: '1-800-656-4673 or text HOPE to 64673',
    tel: 'tel:18006564673',
    sms: 'sms:64673?body=HOPE',
    url: 'https://rainn.org/hotline',
    description: 'Confidential support for sexual assault and abuse.',
    badge: 'Confidential support',
  },
};

export const normalizeSafetyText = (input: string): string =>
  input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const DIRECT_CRISIS_PATTERNS = [
  /\b(i am|im|i'm|feeling)\s+suicidal\b/,
  /\b(end|ending)\s+my\s+life\b/,
  /\b(kill|hurt)\s+myself\b/,
  /\b(want to die|wish i were dead|no reason to live)\b/,
  /\b(i|im|i'm)\s+(not safe|unsafe)\s+(with myself|alone)\b/,
];

const PRECAUTIONARY_SAFETY_PATTERNS = [
  /\b(suicid(?:e|al)|self harm|hurt myself|can't go on|cannot go on|not safe with myself)\b/,
  /\b(thoughts? of (dying|death)|thinking about (dying|death))\b/,
];

const SAFETY_NEGATION_OR_CONTEXT = [
  /\b(not|never|no longer)\s+(suicidal|going to hurt myself|thinking of dying)\b/,
  /\b(friend|partner|relative|someone)\s+.*\b(suicidal|self harm)\b/,
  /\b(history of|used to)\s+.*\b(suicidal|self harm)\b/,
];

const IPV_ABUSE_PATTERNS = [
  /\b(domestic violence|intimate partner violence|physical abuse|coercive control|abusive relationship)\b/,
  /\b(partner|spouse|boyfriend|girlfriend|husband|wife)\s+.*\b(hit|hits|hurt|threaten|threatened|violent|abuse|abusive)\b/,
  /\bsexual assault\b/,
];

const SUBSTANCE_PATTERNS = [
  /\b(substance use|drug addiction|alcohol addiction|chemical dependency|withdrawal|detox|relapse|overdose)\b/,
  /\b(craving|cravings|urge|urges)\s+.*\b(alcohol|drugs?|opioids?|drink|drinking)\b/,
  /\b(alcohol|drugs?|opioids?|drink|drinking)\s+.*\b(craving|cravings|urge|urges|sober|sobriety|relapse)\b/,
  /\bdrinking\s+.*\b(escape|numb|sober|sobriety)\b/,
];

const MORAL_INJURY_PATTERNS = [
  /\b(moral injury|blood on my hands|dont deserve to live|don't deserve to live)\b/,
  /\b(my mistake|because of me)\s+.*\b(died|fatal|catastrophic harm)\b/,
];

const SUDDEN_ANHEDONIA_PATTERNS = [
  /\b(sudden|suddenly|recent|recently|just started|this week|over the last few days|two weeks ago|out of nowhere)\b.*\b(no joy|loss of joy|lost all pleasure|all pleasure vanished|completely numb|everything went blank|anhedonia)\b/,
  /\b(no joy|loss of joy|lost all pleasure|all pleasure vanished|completely numb|everything went blank|anhedonia)\b.*\b(sudden|suddenly|recent|recently|just started|this week|over the last few days|two weeks ago|out of nowhere)\b/,
];

const testAny = (text: string, patterns: RegExp[]) => patterns.some((pattern) => pattern.test(text));

const levenshtein = (a: string, b: string): number => {
  const rows = b.length + 1;
  const cols = a.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (b[i - 1] === a[j - 1] ? 0 : 1)
      );
    }
  }
  return matrix[rows - 1][cols - 1];
};

const fuzzyCriticalToken = (text: string): boolean => {
  const targets = ['suicide', 'suicidal'];
  const words = text.split(' ').filter((word) => word.length >= 6);
  return words.some((word) =>
    targets.some((target) =>
      Math.abs(word.length - target.length) <= 1 && levenshtein(word, target) <= 1
    )
  );
};

const safe = (): SafetyRoutingResult => ({
  status: 'SAFE',
  isTriggered: false,
  safetyNotes: [],
  emergencyResources: [],
  blockedFromWisdomMatching: false,
});

export function evaluateSafetyUpstream(problemText: string): SafetyRoutingResult {
  if (!problemText || !problemText.trim()) return safe();

  const text = normalizeSafetyText(problemText);

  if (testAny(text, SAFETY_NEGATION_OR_CONTEXT)) {
    return {
      status: 'SAFETY_REVIEW_REDIRECT',
      isTriggered: true,
      reason: 'Some safety-related language was unclear, so Inner Compass paused the ordinary reflection experience as a precaution.',
      safetyNotes: ['Inner Compass uses automated English-language safety checks.', 'If these resources are not relevant, you can return and rephrase your reflection more clearly.'],
      emergencyResources: [EMERGENCY_RESOURCES.suicideLifeline, EMERGENCY_RESOURCES.crisisTextLine, EMERGENCY_RESOURCES.community211],
      blockedFromWisdomMatching: true,
      matchedRule: 'precautionary_context_signal',
      confidence: 'precautionary',
    };
  }

  if (testAny(text, DIRECT_CRISIS_PATTERNS)) {
    return {
      status: 'CRISIS_REDIRECT',
      isTriggered: true,
      reason: 'Inner Compass paused the ordinary reflection experience so immediate human support is easier to reach.',
      safetyNotes: ['Inner Compass is not an emergency service.', 'Use immediate human support when safety may be at risk.'],
      emergencyResources: [EMERGENCY_RESOURCES.emergencyServices, EMERGENCY_RESOURCES.suicideLifeline, EMERGENCY_RESOURCES.crisisTextLine],
      blockedFromWisdomMatching: true,
      matchedRule: 'direct_crisis_signal',
      confidence: 'high',
    };
  }

  if (fuzzyCriticalToken(text) || testAny(text, PRECAUTIONARY_SAFETY_PATTERNS)) {
    return {
      status: 'SAFETY_REVIEW_REDIRECT',
      isTriggered: true,
      reason: 'Some safety-related language was unclear, so Inner Compass paused the ordinary reflection experience as a precaution.',
      safetyNotes: ['Inner Compass uses automated English-language safety checks.', 'If these resources are not relevant, you can return and rephrase your reflection more clearly.'],
      emergencyResources: [EMERGENCY_RESOURCES.suicideLifeline, EMERGENCY_RESOURCES.crisisTextLine, EMERGENCY_RESOURCES.community211],
      blockedFromWisdomMatching: true,
      matchedRule: 'precautionary_safety_signal',
      confidence: 'precautionary',
    };
  }

  if (testAny(text, IPV_ABUSE_PATTERNS)) {
    return {
      status: 'ABUSE_REDIRECT',
      isTriggered: true,
      reason: 'Inner Compass paused ordinary relationship guidance and is showing specialized support options instead.',
      safetyNotes: ['Ordinary relationship advice is not appropriate when safety may be at risk.'],
      emergencyResources: [EMERGENCY_RESOURCES.domesticViolenceHotline, EMERGENCY_RESOURCES.rainnHotline, EMERGENCY_RESOURCES.emergencyServices],
      blockedFromWisdomMatching: true,
      matchedRule: 'relationship_abuse_boundary',
      confidence: 'high',
    };
  }

  if (testAny(text, MORAL_INJURY_PATTERNS)) {
    return {
      status: 'ESCALATION_REDIRECT',
      isTriggered: true,
      reason: 'Inner Compass paused ordinary reflection and is showing human support options instead.',
      safetyNotes: ['This situation may be better supported by a person rather than ordinary reflection content.'],
      emergencyResources: [EMERGENCY_RESOURCES.suicideLifeline, EMERGENCY_RESOURCES.crisisTextLine, EMERGENCY_RESOURCES.samhsaHelpline],
      blockedFromWisdomMatching: true,
      suggestedCategoryId: 21,
      matchedRule: 'moral_injury_escalation',
      confidence: 'high',
    };
  }

  if (testAny(text, SUDDEN_ANHEDONIA_PATTERNS)) {
    return {
      status: 'ESCALATION_REDIRECT',
      isTriggered: true,
      reason: 'Inner Compass paused ordinary reflection because the situation may benefit from prompt human support.',
      safetyNotes: ['Some significant changes are better handled with human support rather than ordinary reflection content.'],
      emergencyResources: [EMERGENCY_RESOURCES.suicideLifeline, EMERGENCY_RESOURCES.samhsaHelpline, EMERGENCY_RESOURCES.community211],
      blockedFromWisdomMatching: true,
      suggestedCategoryId: 24,
      matchedRule: 'acute_anhedonia_escalation',
      confidence: 'high',
    };
  }

  if (testAny(text, SUBSTANCE_PATTERNS)) {
    return {
      status: 'SUBSTANCE_HARD_CEILING',
      isTriggered: true,
      reason: 'Inner Compass paused ordinary reflection because some substance-related situations may require human or medical support.',
      safetyNotes: ['Use appropriate human or medical support for substance-related risk.'],
      emergencyResources: [EMERGENCY_RESOURCES.samhsaHelpline, EMERGENCY_RESOURCES.emergencyServices, EMERGENCY_RESOURCES.community211],
      blockedFromWisdomMatching: true,
      suggestedCategoryId: 10,
      matchedRule: 'substance_hard_ceiling',
      confidence: 'high',
    };
  }

  return safe();
}

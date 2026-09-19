import { EmergencyResource, SafetyRoutingResult } from '../types';

/**
 * Phase 2: Upstream Deterministic Safety Router
 * Strictly executes before any ordinary wisdom retrieval or LLM call.
 * Enforces:
 * 1. Immediate Crisis / Suicide / Self-Harm static redirect
 * 2. Category 5 abuse boundary (IPV never reaches conflict/staying material)
 * 3. Category 10 substance use hard ceiling (cannot produce wisdom-only)
 * 4. Category 21 moral injury escalation
 * 5. Category 24 sudden/recent-onset anhedonia escalation
 */

export const EMERGENCY_RESOURCES: Record<string, EmergencyResource> = {
  suicideLifeline: {
    name: '988 Suicide & Crisis Lifeline',
    contact: 'Call or text 988',
    tel: 'tel:988',
    sms: 'sms:988',
    url: 'https://988lifeline.org',
    description: 'Free, confidential support available 24/7 across the United States. Immediate human crisis counseling.',
    badge: 'Immediate 24/7',
  },
  crisisTextLine: {
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741',
    sms: 'sms:741741?body=HOME',
    url: 'https://www.crisistextline.org',
    description: 'Free 24/7 crisis counseling via text message for any painful emotional struggle.',
    badge: 'Text 24/7',
  },
  domesticViolenceHotline: {
    name: 'National Domestic Violence Hotline',
    contact: '1-800-799-SAFE (7233) or text START to 88788',
    tel: 'tel:18007997233',
    sms: 'sms:88788?body=START',
    url: 'https://www.thehotline.org',
    description: 'Confidential support, safety planning, and resources for individuals experiencing relationship abuse or threats.',
    badge: 'Safety & DV',
  },
  samhsaHelpline: {
    name: 'SAMHSA National Helpline',
    contact: '1-800-662-4357 (HELP)',
    tel: 'tel:18006624357',
    url: 'https://www.samhsa.gov/find-help/national-helpline',
    description: 'Confidential treatment referral and information for substance use disorders and mental health services.',
    badge: 'Medical & Treatment',
  },
  community211: {
    name: '211 Community Resources',
    contact: 'Call 211',
    tel: 'tel:211',
    url: 'https://www.211.org',
    description: 'Connect with local emergency housing, food assistance, legal aid, and essential social support.',
    badge: 'Essential Aid',
  },
  rainnHotline: {
    name: 'RAINN National Sexual Assault Hotline',
    contact: '1-800-656-4673',
    tel: 'tel:18006564673',
    url: 'https://www.rainn.org',
    description: 'Confidential 24/7 specialized support for survivors of sexual assault and abuse.',
    badge: 'Confidential Support',
  },
};

// Immediate suicide, self-harm, or active life-threatening crisis patterns
const IMMEDIATE_CRISIS_REGEX = /\b(suicid(e|al)|kill\s+(my\s*self|me)|end(?:ing)?\s+(my\s*life|it\s*all)|want\s+to\s+die|wish\s+I\s+were\s+dead|better\s+off\s+dead|no\s+reason\s+to\s+live|cutting\s+my\s*self|self[- ]harm|overdose\s+on\s+pills|hang\s+my\s*self|shoot\s+my\s*self|take\s+all\s+my\s+pills)\b/i;

// Intimate partner violence and relationship abuse patterns (Category 5 Abuse Boundary)
const IPV_ABUSE_REGEX = /\b(domestic\s+violence|intimate\s+partner\s+violence|hits?\s+me|beat(s)?\s+me|chok(e|ed|es)\s+me|punch(ed|es)?\s+me|threaten(ed|s)?\s+to\s+hurt\s+me|physical\s+(abuse|violence)|abusive\s+(relationship|partner|spouse|husband|wife|boyfriend|girlfriend)|violent\s+(partner|spouse|husband|wife|boyfriend|girlfriend)|scared\s+(he|she|they)\s+will\s+kill\s+me|sexual\s+assault|coercive\s+control|battered)\b/i;

// Substance use patterns (Category 10 Hard Ceiling)
const SUBSTANCE_USE_REGEX = /\b(substance\s+use|substance\s+(addiction|dependence)|chemical\s+dependency|alcohol(ic|ism)?|alcohol\s+addiction|drug\s+addiction|drinking\s+too\s+much|urges?\s+to\s+drink|cravings?\s+for\s+alcohol|blackout|detox|withdrawal|relapse(d)?|cocaine|heroin|fentanyl|meth|opioid(s)?|benzos?|binge\s+drinking|sober|sobriety)\b/i;

// Category 21: Moral-injury-adjacent guilt patterns (suicide risk link)
const MORAL_INJURY_GUILT_REGEX = /\b((patient|child|someone|somebody|person)\s+died\s+because\s+of\s+me|my\s+mistake\s+killed|I\s+killed\s+someone|caused\s+(someone's\s+death|fatal|catastrophic\s+harm)|don't\s+deserve\s+to\s+(live|survive|be\s+alive)|blood\s+on\s+my\s+hands|cannot\s+be\s+forgiven\s+for\s+taking\s+a\s+life|grave\s+transgression\s+in\s+combat|moral\s+injury.*(killed|catastrophic\s+harm|lives?\s+destroyed|cannot\s+live\s+with)|(?:killed|catastrophic\s+harm|lives?\s+destroyed).*moral\s+injury)\b/i;

// Category 24: Sudden / recent-onset anhedonia patterns
const SUDDEN_ANHEDONIA_REGEX = /\b((sudden(ly)?|recent(ly)?|just\s+started|this\s+week|over\s+the\s+last\s+few\s+days|out\s+of\s+nowhere)\s+.*(no\s+joy|loss\s+of\s+joy|lost\s+all\s+pleasure|all\s+pleasure\s+(vanished|disappeared)|can't\s+feel\s+anything|completely\s+numb|everything\s+went\s+blank|anhedonia)|(no\s+joy|loss\s+of\s+joy|lost\s+all\s+pleasure|all\s+pleasure\s+(vanished|disappeared)|can't\s+feel\s+anything|everything\s+went\s+blank)\s+.*(sudden(ly)?|recent(ly)?|just\s+started|this\s+week|over\s+the\s+last\s+few\s+days|out\s+of\s+nowhere|two\s+weeks\s+ago))\b/i;

export function evaluateSafetyUpstream(problemText: string): SafetyRoutingResult {
  if (!problemText || !problemText.trim()) {
    return {
      status: 'SAFE',
      isTriggered: false,
      safetyNotes: [],
      emergencyResources: [],
      blockedFromWisdomMatching: false,
    };
  }

  const text = problemText.trim();

  // 1. Immediate Crisis / Suicide / Self-Harm check (Highest Priority)
  if (IMMEDIATE_CRISIS_REGEX.test(text)) {
    return {
      status: 'CRISIS_REDIRECT',
      isTriggered: true,
      reason: 'Immediate safety or self-harm concern detected. Contemplative wisdom is suspended to connect you directly with human crisis support.',
      safetyNotes: [
        'Active suicidal ideation and acute crises are strictly outside the v1.0 scope of Inner Compass.',
        'Please reach out immediately to 24/7 dedicated professional lifelines.',
      ],
      emergencyResources: [
        EMERGENCY_RESOURCES.suicideLifeline,
        EMERGENCY_RESOURCES.crisisTextLine,
        EMERGENCY_RESOURCES.community211,
      ],
      blockedFromWisdomMatching: true,
    };
  }

  // 2. Category 5 Abuse Boundary: IPV / Domestic Violence
  // RULE: The category-5 abuse boundary must never reach conflict/relationship-staying material.
  if (IPV_ABUSE_REGEX.test(text)) {
    return {
      status: 'ABUSE_REDIRECT',
      isTriggered: true,
      reason: 'Physical abuse, domestic violence, or intimate partner threats detected. Relationship-conflict teachings (such as staying with difficulty) must never be applied to abusive environments.',
      safetyNotes: [
        'Taxonomy Safety Carve-out: Category 5 excludes intimate partner violence.',
        'Lojong slogans and conflict patience apply only to safe, reciprocal relationships, never abusive situations where your physical or psychological safety is at risk.',
      ],
      emergencyResources: [
        EMERGENCY_RESOURCES.domesticViolenceHotline,
        EMERGENCY_RESOURCES.rainnHotline,
        EMERGENCY_RESOURCES.suicideLifeline,
      ],
      blockedFromWisdomMatching: true,
    };
  }

  // 3. Category 21 Moral-Injury-Adjacent Guilt Escalation
  // RULE: Self-condemnation tied to real/perceived serious harm/fatality carries acute suicide risk.
  if (MORAL_INJURY_GUILT_REGEX.test(text)) {
    return {
      status: 'ESCALATION_REDIRECT',
      isTriggered: true,
      reason: 'Moral-injury-adjacent presentation detected. Deep self-condemnation tied to catastrophic harm carries documented escalation risk requiring professional human care.',
      safetyNotes: [
        'Category 21 Escalation Rule: Moral-injury-adjacent guilt is linked to acute suicide risk.',
        'This presentation is routed away from ordinary philosophical self-forgiveness and toward dedicated crisis/clinical support.',
      ],
      emergencyResources: [
        EMERGENCY_RESOURCES.suicideLifeline,
        EMERGENCY_RESOURCES.crisisTextLine,
        EMERGENCY_RESOURCES.samhsaHelpline,
      ],
      blockedFromWisdomMatching: true,
      suggestedCategoryId: 21,
    };
  }

  // 4. Category 24 Sudden/Recent-Onset Anhedonia Escalation
  // RULE: State/recent-onset anhedonia independently predicts acute suicidality.
  if (SUDDEN_ANHEDONIA_REGEX.test(text)) {
    return {
      status: 'ESCALATION_REDIRECT',
      isTriggered: true,
      reason: 'Sudden or recent-onset loss of pleasure and joy detected. Acute onset anhedonia is an independent clinical risk marker requiring proactive clinical evaluation.',
      safetyNotes: [
        'Category 24 Escalation Rule: Recent-onset anhedonia predicts acute crisis risk separate from baseline low mood.',
        'Philosophy content is reserved for chronic, low-grade reflection. Acute presentations require professional evaluation.',
      ],
      emergencyResources: [
        EMERGENCY_RESOURCES.suicideLifeline,
        EMERGENCY_RESOURCES.crisisTextLine,
        EMERGENCY_RESOURCES.samhsaHelpline,
      ],
      blockedFromWisdomMatching: true,
      suggestedCategoryId: 24,
    };
  }

  // 5. Category 10 Substance Use Hard Ceiling
  // RULE: Category 10 may not produce wisdom-only.
  if (SUBSTANCE_USE_REGEX.test(text)) {
    return {
      status: 'SUBSTANCE_HARD_CEILING',
      isTriggered: true,
      reason: 'Substance use or chemical dependency detected. Category 10 operates under a strict hard ceiling: physiological withdrawal and overdose risks mean philosophy can never stand alone.',
      safetyNotes: [
        'Category 10 Hard Ceiling: Real overdose and withdrawal mortality risks exist.',
        'Philosophical reflection is only an adjunct for meaning and affect-regulation in recovery, never a substitute for medical detoxification or crisis intervention.',
      ],
      emergencyResources: [
        EMERGENCY_RESOURCES.samhsaHelpline,
        EMERGENCY_RESOURCES.suicideLifeline,
        EMERGENCY_RESOURCES.community211,
      ],
      blockedFromWisdomMatching: true,
      suggestedCategoryId: 10,
    };
  }

  // Default: Safe for ordinary retrieval
  return {
    status: 'SAFE',
    isTriggered: false,
    safetyNotes: [],
    emergencyResources: [],
    blockedFromWisdomMatching: false,
  };
}

import { CANONICAL_CATEGORIES, getCategoryById } from '../knowledgeBase/kbLoader';
import { Category, ExistentialRoot, RetrievalMatch } from '../types';

/**
 * Phase 3: Deterministic Retrieval Engine
 * Strictly maps user input to the canonical 25 categories from content/knowledge-base/
 * Rule 11: No vector DB, embeddings, or external black-box search engines.
 * Rule 1 & 2: Guidance is strictly retrieved from canonical KB files.
 */

// Grounded keyword lexicon for all 25 categories derived from research and taxonomy v1.0
const CATEGORY_LEXICONS: Record<number, { keywords: string[]; phrases: string[] }> = {
  1: {
    keywords: ['lonely', 'loneliness', 'isolated', 'isolation', 'alone', 'alienated', 'unseen', 'invisible', 'disconnected', 'cut off'],
    phrases: ['feeling alone in a crowd', 'no one understands me', 'isolated even around people', 'deeply lonely', 'nobody cares'],
  },
  2: {
    keywords: ['grief', 'grieving', 'mourning', 'bereavement', 'loss', 'died', 'passed away', 'lost my', 'death of a', 'heartache'],
    phrases: ['lost someone', 'miss them so much', 'cannot get over the loss', 'death of my', 'loss of my way of life'],
  },
  3: {
    keywords: ['anxious', 'anxiety', 'dread', 'panic', 'nervous', 'worry', 'apprehensive', 'future', 'uncertainty', 'worst case'],
    phrases: ['dread about the future', 'constant worry', 'fear of what is next', 'generalized anxiety', 'impending doom'],
  },
  4: {
    keywords: ['angry', 'anger', 'rage', 'furious', 'irritated', 'resentment', 'frustration', 'bitter', 'infuriated', 'hostility'],
    phrases: ['boiling with anger', 'cannot stop being angry', 'cooling the flames', 'burst of rage', 'feeling resentful'],
  },
  5: {
    keywords: ['conflict', 'arguing', 'fighting', 'dispute', 'disagreement', 'feud', 'friction', 'bickering', 'tension with', 'hostile'],
    phrases: ['ongoing conflict', 'fighting with someone', 'always arguing', 'difficult relationship', 'constant fighting'],
  },
  6: {
    keywords: ['shame', 'unworthy', 'disgrace', 'defect', 'humiliation', 'flawed', 'broken', 'disgusted with myself', 'worthless'],
    phrases: ['fundamentally not okay', 'feeling defective', 'deep shame', 'hate who I am', 'unworthy of love'],
  },
  7: {
    keywords: ['breakup', 'heartbreak', 'rejected', 'rejection', 'dumped', 'unrequited', 'abandoned', 'divorce', 'broken heart', 'partner left'],
    phrases: ['heart broken', 'they left me', 'rejected by', 'pain of heartbreak', 'cannot accept the breakup'],
  },
  8: {
    keywords: ['stuck', 'indecisive', 'indecision', 'paralyzed', 'crossroads', 'hesitant', 'dilemma', 'cannot decide', 'limbo', 'frozen'],
    phrases: ['cannot make up my mind', 'feeling stuck', 'afraid of choosing wrong', 'analysis paralysis', 'standstill'],
  },
  9: {
    keywords: ['failure', 'failing', 'mistake', 'perfectionism', 'perfectionist', 'imposter', 'inadequate', 'not good enough', 'disappointing'],
    phrases: ['fear of failure', 'afraid of failing', 'imposter syndrome', 'cannot afford to fail', 'terror of falling short'],
  },
  10: {
    keywords: ['alcohol', 'drinking', 'drugs', 'substance', 'relapse', 'sobriety', 'cravings', 'addiction', 'binge', 'detox', 'intoxicant'],
    phrases: ['drinking too much', 'substance use', 'struggling with addiction', 'trying to stay sober', 'relapsed again'],
  },
  11: {
    keywords: ['compulsive', 'bingeing', 'scrolling', 'shopping', 'pornography', 'screen time', 'gambling', 'urge', 'obsessive', 'coping habit'],
    phrases: ['cannot stop scrolling', 'compulsive behavior', 'behavioral addiction', 'numbing myself with', 'habit energy'],
  },
  12: {
    keywords: ['betrayal', 'betrayed', 'cheated', 'infidelity', 'lied to', 'treachery', 'stabbed in the back', 'broken trust', 'deceived'],
    phrases: ['broken trust', 'betrayed by someone', 'how could they lie', 'cannot trust anymore', 'shattered trust'],
  },
  13: {
    keywords: ['meaningless', 'meaninglessness', 'pointless', 'existential', 'nihilism', 'what is the point', 'no purpose', 'emptiness', 'void'],
    phrases: ['life has no meaning', 'why does anything matter', 'general life meaninglessness', 'empty void', 'existential vacuum'],
  },
  14: {
    keywords: ['career', 'vocation', 'calling', 'job', 'profession', 'work', 'workplace', 'unfulfilled at work', 'dead end job', 'career change'],
    phrases: ['vocational purpose', 'wrong career', 'what should I do with my life', 'unfulfilled in my work', 'lost my career path'],
  },
  15: {
    keywords: ['overwhelm', 'overwhelmed', 'burnout', 'burnt out', 'too much', 'swamped', 'exhausted', 'drowning in work', 'overextended'],
    phrases: ['too much to control', 'feeling overwhelmed', 'at my breaking point', 'completely burned out', 'swamped with demands'],
  },
  16: {
    keywords: ['identity', 'who am i', 'lost myself', 'chameleon', 'mask', 'persona', 'inauthentic', 'true self', 'identity crisis', 'fragmented'],
    phrases: ['personal identity confusion', 'who am I really', 'lost touch with myself', 'wearing a mask', 'do not know myself'],
  },
  17: {
    keywords: ['belonging', 'culture', 'outsider', 'foreign', 'immigrant', 'assimilation', 'minority', 'fit in', 'misfit', 'subculture'],
    phrases: ['cultural belonging confusion', 'do not fit into my culture', 'outsider everywhere', 'struggle to belong', 'split between two worlds'],
  },
  18: {
    keywords: ['illness', 'sick', 'diagnosis', 'health', 'mortality', 'aging', 'disease', 'hypochondria', 'body failing', 'fear of death'],
    phrases: ['fear of dying', 'health anxiety', 'chronic illness fear', 'mortality fear', 'afraid of getting sick'],
  },
  19: {
    keywords: ['money', 'financial', 'debt', 'poverty', 'rent', 'broke', 'bills', 'unemployed', 'finances', 'inflation', 'security'],
    phrases: ['financial fear', 'cannot pay bills', 'money worries', 'fear of poverty', 'terrified of financial ruin'],
  },
  20: {
    keywords: ['envy', 'jealous', 'jealousy', 'comparing', 'comparison', 'covet', 'they have it better', 'falling behind', 'inferior'],
    phrases: ['comparing myself to others', 'consumed with envy', 'everyone else is ahead', 'jealous of their success'],
  },
  21: {
    keywords: ['guilt', 'regret', 'remorse', 'unforgivable', 'guilty', 'blame myself', 'ashamed of what I did', 'atone', 'forgive myself'],
    phrases: ['cannot forgive myself', 'so much regret', 'guilty about the past', 'wish I could undo it', 'eat up with guilt'],
  },
  22: {
    keywords: ['impatient', 'impatience', 'waiting', 'delay', 'hurry', 'stalled', 'restless', 'taking too long', 'standstill', 'limbo'],
    phrases: ['waiting for something to change', 'tired of waiting', 'so impatient', 'when will things happen', 'can not stand the delay'],
  },
  23: {
    keywords: ['sadness', 'sad', 'depression', 'low mood', 'sorrow', 'melancholy', 'heavy heart', 'crying', 'gloomy', 'downcast', 'despair'],
    phrases: ['persistent sadness', 'low mood', 'cannot shake the sadness', 'feeling down for weeks', 'heavy heart'],
  },
  24: {
    keywords: ['anhedonia', 'joyless', 'numb', 'cannot feel joy', 'unfeeling', 'apathetic', 'apathy', 'dull', 'flat', 'gray', 'no spark'],
    phrases: ['cannot feel joy', 'lost my spark', 'nothing excites me anymore', 'emotionally flat', 'anhedonia'],
  },
  25: {
    keywords: ['bullied', 'bullying', 'mistreated', 'disrespected', 'harassed', 'demeaned', 'scapegoat', 'humiliated by boss', 'mobbing'],
    phrases: ['being mistreated', 'bullied at work', 'disrespected by others', 'treated like dirt', 'scapegoated'],
  },
};

const TITLE_STOPWORDS = new Set([
  'the', 'and', 'of', 'or', 'in', 'even', 'with', 'by', 'a', 'an', 'for', 'to',
  'from', 'about', 'when', 'around', 'others', 'something', 'someone', 'person',
  'people', 'way', 'life', 'general', 'ongoing', 'feeling', 'feel', 'being', 'too',
  'much', 'my', 'your', 'change'
]);

/**
 * Semantic discriminator boosts for close-neighbor categories.
 * These are intentionally narrow, deterministic tie-breakers derived from
 * taxonomy boundaries and Baseline 2 confusion patterns. They supplement
 * (rather than replace) the canonical lexicons.
 */
function getSemanticDiscriminatorBoost(
  categoryId: number,
  normalized: string
): { boost: number; reason?: string } {
  const hit = (pattern: RegExp) => pattern.test(normalized);

  switch (categoryId) {
    case 1:
      if (
        hit(/\b(acquaintances?|crowd|everyone\s+else|relationships?)\b.*\b(alone|isolat\w*|distance|empty|unseen|disconnected)\b/) ||
        hit(/\b(alone|isolat\w*|distance|unseen|disconnected)\b.*\b(acquaintances?|crowd|everyone\s+else|relationships?)\b/)
      ) return { boost: 65, reason: 'Social-isolation discriminator' };
      break;
    case 2:
      if (
        hit(/\b(mourn\w*|griev\w*|bereavement|passed\s+away|death\s+of|losing\s+someone|lost\s+someone|miss\s+them|heartache\s+and\s+sorrow)\b/) ||
        hit(/\bslipping\s+away\b/)
      ) return { boost: 160, reason: 'Concrete-loss/grief discriminator' };
      break;
    case 4:
      if (hit(/\b(boiling|rage|furious|fury|explode|exploding|seething)\b/))
        return { boost: 75, reason: 'Internal-anger discriminator' };
      break;
    case 5:
      if (hit(/\b(circular\b.*\bfight|shouting\s+match|property\s+disputes?|we\s+keep\s+(fighting|arguing)|constant\s+arguments?|always\s+arguing|ongoing\s+conflict)\b/))
        return { boost: 95, reason: 'Reciprocal-conflict discriminator' };
      break;
    case 6:
      if (hit(/\b(defective|repulsive|disgusting|self[- ]disgust|disgusted\s+with\s+who\s+i\s+am|unworthy|worthless|flawed|ruined|inherently\s+rotten|fundamentally\s+(bad|wrong|broken|flawed|ruined)|hate\s+who\s+i\s+am)\b/))
        return { boost: 175, reason: 'Core-shame discriminator' };
      break;
    case 7:
      if (hit(/\b(dumped|breakup|heartbreak|broken\s+heart|partner\s+(left|ended)|relationship\s+(ended|over)|fianc\w*.*(left|wedding)|call(ed)?\s+off\s+the\s+wedding)\b/))
        return { boost: 90, reason: 'Relationship-ending discriminator' };
      break;
    case 8:
      if (hit(/\b(cannot|can't|unable)\b.*\b(choose|decide)\b|\b(stalemate|crossroads|either\s+direction|two\s+.*(options|offers))\b/))
        return { boost: 80, reason: 'Decision-paralysis discriminator' };
      break;
    case 9:
      if (hit(/\b(fail|fails|failed|failing|failure|falling\s+short|fall\s+flat\s+on\s+my\s+face|imposter|perfection\w*|single\s+error|making\s+a\s+mistake|disappointing\s+everyone)\b/))
        return { boost: 120, reason: 'Performance-failure discriminator' };
      break;
    case 10:
      if (hit(/\b(chemical\s+dependency|alcohol|opioids?|drugs?|relaps\w*|detox|withdrawal|cravings?|urges?\s+to\s+drink|sobriety)\b/))
        return { boost: 100, reason: 'Substance-use discriminator' };
      break;
    case 11:
      if (hit(/\b(compuls\w*|gambling|shopping|doom[- ]?scroll\w*|pornography|binge\s+eat\w*|behavioral\s+addiction|dopamine\s+hit|impulsive\s+online\s+shopping)\b/))
        return { boost: 150, reason: 'Behavioral-compulsion discriminator' };
      break;
    case 12:
      if (hit(/\b(betray\w*|broken\s+trust|breaking\s+my\s+trust|decept\w*|lied\s+to|secret\s+account|stole\s+funds|stolen\s+funds|stab\w*\s+.*back|infidelity|shattered\s+trust)\b/))
        return { boost: 110, reason: 'Betrayal-trust discriminator' };
      break;
    case 13: {
      const workSpecificMeaning = hit(/\b(corporate\s+job|career|job|workplace|vocation|profession)\b.*\b(meaning\w*|purpose|pointless|calling|hollow|unfulfilled)\b/);
      if (!workSpecificMeaning && (
        hit(/\b(world|existence|nothing|anything|life)\b.*\b(meaning\w*|purpose|significance|pointless|value|void)\b/) ||
        hit(/\b(meaning\w*|purpose|significance|pointless|void)\b.*\b(world|existence|nothing|anything|life)\b/) ||
        hit(/\b(work\s+or\s+otherwise|why\s+do\s+anything\s+at\s+all|what\s+i\s+am\s+doing\s+with\s+my\s+life|where\s+i\s+am\s+going)\b/)
      )) return { boost: 150, reason: 'Global-meaning discriminator' };
      break;
    }
    case 14: {
      const globalMeaning = hit(/\b(work\s+or\s+otherwise|nothing\s+in\s+existence|existence\s+has|why\s+do\s+anything\s+at\s+all)\b/);
      if (!globalMeaning && (
        hit(/\b(career|job|work|workplace|corporate|vocation|profession)\b.*\b(meaning\w*|purpose|pointless|calling|hollow|unfulfilled|dead[- ]end|potential)\b/) ||
        hit(/\b(meaning\w*|purpose|calling|unfulfilled)\b.*\b(career|job|work|corporate|vocation|profession)\b/)
      )) return { boost: 105, reason: 'Work-specific-purpose discriminator' };
      break;
    }
    case 15:
      if (hit(/\b(overwhelm\w*|burnout|burning\s+out|overload|juggling|responsibilities|obligations|too\s+many\s+moving\s+pieces|too\s+much|under\s+the\s+load|drowning\s+under|suffocating\s+under|swamped|overextended|spinning\s+out)\b/))
        return { boost: 105, reason: 'Overload discriminator' };
      break;
    case 16:
      if (hit(/\b(who\s+am\s+i|who\s+i\s+am|no\s+idea\s+who\s+i\s+am|identity\s+crisis|authentic\s+values|social\s+masks?|true\s+self|lost\s+myself|empty\s+vessel|sense\s+of\s+self|fragmented\s+self)\b/))
        return { boost: 125, reason: 'Personal-identity discriminator' };
      break;
    case 17:
      if (hit(/\b(cultur\w*|ethnic\w*|heritage|immigrant|ancestral|assimilat\w*|social\s+group|community\s+i\s+was\s+raised\s+in)\b/))
        return { boost: 90, reason: 'Cultural-belonging discriminator' };
      break;
    case 18:
      if (hit(/\b(mortality|medical\s+diagnosis|health\s+anxiety|physical\s+body|chronic\s+illness|body\s+.*(failing|fragility)|fear\s+of\s+dying)\b/))
        return { boost: 90, reason: 'Health-mortality discriminator' };
      break;
    case 19:
      if (hit(/\b(financial|finances|savings|rent|income|poverty|debt|bills|money|financial\s+ruin|household\s+income|roof\s+over)\b/))
        return { boost: 100, reason: 'Financial-security discriminator' };
      break;
    case 20:
      if (hit(/\b(envy|jealous\w*|compar\w*)\b|\blooking\s+at\s+others\b.*\b(inadequate|inferior|behind)\b/))
        return { boost: 85, reason: 'Social-comparison discriminator' };
      break;
    case 21:
      if (hit(/\b(guilt|guilty|remorse|self[- ]condemnation|cannot\s+forgive\s+myself|can't\s+forgive\s+myself|cant\s+forgive\s+myself|harm\s+i\s+caused|hurt\s+someone|did\s+something\s+terrible|broke\s+a\s+promise|what\s+i\s+did|regret)\b/))
        return { boost: 120, reason: 'Act-focused-guilt discriminator' };
      break;
    case 22:
      if (hit(/\b(impatient|impatience|waiting|taking\s+too\s+long|taking\s+forever|moving\s+so\s+slowly|moving\s+slowly|sluggish\s+pace|tired\s+of\s+waiting|restless\w*\s+.*progress)\b/))
        return { boost: 100, reason: 'Waiting-impatience discriminator' };
      break;
    case 23:
      if (hit(/\b(sadness|sad|sorrow|melanchol\w*|gloom|gloomy|tearful|crying|low\s+mood|downcast|heavy\s+sorrow|feel\s+heavy|heavy\s+and\s+unable\s+to\s+move\s+forward)\b/))
        return { boost: 110, reason: 'Low-mood discriminator' };
      break;
    case 24:
      if (hit(/\b(anhedonia|pleasure|joy|joyless|no\s+spark|lost\s+.*spark|loss\s+of\s+.*spark|all\s+spark|emotional\s+numbness|positive\s+feeling|delight|enthusiasm|mechanically\s+dull|tastes\s+bland|favorite\s+hobbies?.*flat)\b/))
        return { boost: 125, reason: 'Anhedonia discriminator' };
      break;
    case 25: {
      const mistreatment = hit(/\b(bully\w*|mistreat\w*|disrespect\w*|belittl\w*|humiliat\w*|demean\w*|condescen\w*|harass\w*|hostility|exclusion)\b/);
      const externalAgent = hit(/\b(supervisors?|boss(es)?|managers?|colleagues?|coworkers?|peers?|people|authorit(y|ies)|someone|groups?|teams?|workplace)\b/);
      if (mistreatment && externalAgent)
        return { boost: 120, reason: 'External-mistreatment discriminator' };
      break;
    }
  }

  return { boost: 0 };
}


type AmbiguitySignal = {
  candidateIds: [number, number];
  question: string;
  reason: string;
};

function detectSemanticAmbiguity(normalized: string): AmbiguitySignal | null {
  const hit = (pattern: RegExp) => pattern.test(normalized);

  // Loss vs future anxiety: vague change/slipping-away language without a concrete bereavement cue.
  if (
    hit(/\b(everything\s+is\s+changing|things?\s+are\s+changing|slipping\s+away|losing\s+my\s+grip\s+on\s+things)\b/) &&
    !hit(/\b(died|death|passed\s+away|grief|grieving|mourning|bereavement)\b/)
  ) {
    return {
      candidateIds: [2, 3],
      question: 'Is this mainly about grieving something you have already lost, or fear and uncertainty about what may happen next?',
      reason: 'Vague change/loss language overlaps grief and future anxiety.',
    };
  }

  // Isolation vs interpersonal conflict: relationship distress without a clear loneliness or active-conflict cue.
  if (
    hit(/\brelationships?\b/) &&
    hit(/\b(difficult|hard|empty|strained|off|painful)\b/) &&
    !hit(/\b(lonely|alone|isolat\w*|unseen|argu\w*|fight\w*|conflict|dispute|bicker\w*|breakup|heartbreak|rejected|rejection|dumped|partner\s+left|relationship\s+ended|walked\s+away)\b/)
  ) {
    return {
      candidateIds: [1, 5],
      question: 'Is the harder part feeling emotionally alone or disconnected, or an active conflict or tension with someone?',
      reason: 'Relationship distress is underspecified between isolation and conflict.',
    };
  }

  // Meaning/purpose vs identity: broad life-direction language without a clear self-identity or work-specific cue.
  if (
    hit(/\b(what\s+i\s+am\s+doing\s+with\s+my\s+life|where\s+i\s+am\s+going|direction\s+in\s+life|what\s+am\s+i\s+doing\s+with\s+my\s+life)\b/) &&
    !hit(/\b(career|job|workplace|profession|who\s+am\s+i|identity|true\s+self)\b/)
  ) {
    return {
      candidateIds: [13, 16],
      question: 'Is this more about life feeling without meaning or direction, or uncertainty about who you are and what fits you?',
      reason: 'Life-direction language overlaps meaning and identity.',
    };
  }

  // Low mood vs feeling stuck/indecisive.
  if (
    hit(/\b(heavy|weighed\s+down)\b/) &&
    hit(/\b(unable|can'?t|cannot)\b.*\b(move\s+forward|move|progress)\b/) &&
    !hit(/\b(sad|sadness|crying|melanchol\w*|choose|decide|decision|crossroads)\b/)
  ) {
    return {
      candidateIds: [23, 8],
      question: 'Is this mainly a heavy low mood, or more a sense of being stuck because you cannot decide or act?',
      reason: 'Heavy/stuck language overlaps low mood and decision paralysis.',
    };
  }

  // Social comparison vs performance insecurity.
  if (
    hit(/\b(others|other\s+people|everyone\s+else)\b/) &&
    hit(/\b(inadequate|inferior|behind|not\s+good\s+enough|uncomfortable)\b/) &&
    !hit(/\b(comparing|comparison|envy|envious|jealous|jealousy)\b/) &&
    !hit(/\b(fail\w*|mistake|performance|project|exam|presentation|deadline)\b/)
  ) {
    return {
      candidateIds: [20, 9],
      question: 'Is the main issue comparing yourself with other people, or fear that you personally will fail or fall short?',
      reason: 'Inadequacy language overlaps comparison and fear of failure.',
    };
  }

  return null;
}

function detectVagueLowEvidence(normalized: string): boolean {
  return /\b(something\s+feels\s+(wrong|off)|cannot\s+name\s+the\s+(main\s+)?issue|can't\s+name\s+the\s+(main\s+)?issue|cannot\s+tell\s+why|can't\s+tell\s+why|not\s+sure\s+what\s+i\s+am\s+feeling|not\s+sure\s+what\s+i'm\s+feeling|a\s+lot\s+feels\s+mixed\s+together|do\s+not\s+know\s+what\s+the\s+real\s+problem\s+is|don't\s+know\s+what\s+the\s+real\s+problem\s+is)\b/i.test(normalized);
}

function hasExplicitMultiIssueStructure(normalized: string): boolean {
  return /\b(also|at\s+the\s+same\s+time|on\s+top\s+of\s+that|another\s+part\s+of\s+it\s+is\s+that|something\s+else\s+too|separately|besides\s+that)\b/i.test(normalized);
}

function buildGenericClarificationQuestion(primary: Category, secondary?: Category): string {
  if (!secondary) {
    return 'Could you add one concrete detail about what feels most difficult right now—what happened, what you fear, or what you feel stuck on?';
  }

  return `I can see two plausible directions. Is this closer to "${primary.category_name}" or "${secondary.category_name}"? A concrete example would help me choose accurately.`;
}

export function retrieveGroundedGuidance(
  problemText: string,
  preferredRoot?: ExistentialRoot | null,
  overrideCategoryId?: number
): RetrievalMatch {
  // If safety router specified a specific category (e.g. Category 10 for substance use)
  if (overrideCategoryId) {
    const targetCat = getCategoryById(overrideCategoryId);
    if (targetCat) {
      return {
        category: targetCat,
        score: 95,
        rawScore: 95,
        explanation: `Direct deterministic match for ${targetCat.category_name} (Category #${targetCat.category_id})`,
        matchedPillars: targetCat.entries,
        scoreMargin: 95,
        needsClarification: false,
      };
    }
  }

  const normalized = problemText.toLowerCase();
  const words: string[] = normalized.match(/[a-z0-9'-]+/g) ?? [];

  const scores: { category: Category; score: number; matchReasons: string[] }[] = CANONICAL_CATEGORIES.map((cat) => {
    let score = 0;
    const reasons: string[] = [];
    const lexicon = CATEGORY_LEXICONS[cat.category_id];

    if (lexicon) {
      // 1. Phrase matches (highest weight: 40 pts)
      for (const phrase of lexicon.phrases) {
        if (normalized.includes(phrase)) {
          score += 40;
          reasons.push(`Matched core phrase "${phrase}"`);
        }
      }

      // 2. Exact word matches (15 pts)
      for (const kw of lexicon.keywords) {
        if (words.includes(kw)) {
          score += 15;
          reasons.push(`Matched keyword "${kw}"`);
        } else if (normalized.includes(kw)) {
          score += 8;
          reasons.push(`Matched keyword phrase "${kw}"`);
        }
      }
    }

    // 2b. Narrow semantic discriminator boosts for known close-neighbor boundaries.
    const discriminator = getSemanticDiscriminatorBoost(cat.category_id, normalized);
    if (discriminator.boost > 0) {
      score += discriminator.boost;
      if (discriminator.reason) reasons.push(discriminator.reason);
    }

    // 3. Category Title words (12 pts)
    const titleWords: string[] = cat.category_name.toLowerCase().match(/[a-z0-9'-]+/g) ?? [];
    for (const tw of titleWords) {
      if (tw.length >= 3 && words.includes(tw) && !TITLE_STOPWORDS.has(tw)) {
        score += 12;
      }
    }

    // 4. Existential Root alignment (15 pts)
    if (preferredRoot && cat.existential_roots.includes(preferredRoot)) {
      score += 15;
      reasons.push(`Aligns with chosen existential root: ${preferredRoot}`);
    }

    // 5. Entry tradition/teaching matches
    for (const entry of cat.entries) {
      const authorMatch = entry.source_author.toLowerCase().match(/[a-z0-9'-]+/g) ?? [];
      for (const aw of authorMatch) {
        if (words.includes(aw) && aw.length > 3) {
          score += 10;
        }
      }
    }

    return { category: cat, score, matchReasons: reasons };
  });

  // Sort by highest score descending
  scores.sort((a, b) => b.score - a.score);

  const bestMatch = scores[0];
  const runnerUpMatch = scores[1];

  // Default category is retained internally for deterministic compatibility, but
  // low-evidence inputs are now marked for clarification before guidance is shown.
  const fallbackCat = getCategoryById(13) || CANONICAL_CATEGORIES[0];
  const finalCategory = bestMatch && bestMatch.score > 0 ? bestMatch.category : fallbackCat;
  const rawScore = bestMatch && bestMatch.score > 0 ? bestMatch.score : 0;
  const finalScore = rawScore > 0 ? Math.min(100, rawScore) : 40;
  const runnerUpScore = runnerUpMatch?.score ?? 0;
  const scoreMargin = Math.max(0, rawScore - runnerUpScore);

  const semanticAmbiguity = detectSemanticAmbiguity(normalized);
  const primaryHasSubstantiveEvidence = Boolean(bestMatch?.matchReasons.length);
  const runnerUpHasSubstantiveEvidence = Boolean(runnerUpMatch?.matchReasons.length);

  // A low numerical score alone is not uncertainty if the score came from an
  // explicit category-specific keyword/phrase/discriminator. This avoids asking
  // for clarification on clear but concise human wording.
  const lowEvidence =
    detectVagueLowEvidence(normalized) ||
    (rawScore < 25 && !primaryHasSubstantiveEvidence);

  // A close score only matters when both candidate categories have substantive
  // evidence. Title-word collisions and generic overlap should not force a clarification.
  const closeTie =
    primaryHasSubstantiveEvidence &&
    runnerUpHasSubstantiveEvidence &&
    rawScore > 0 &&
    runnerUpScore > 0 &&
    scoreMargin <= 12 &&
    rawScore < 140;

  // If the user explicitly introduces an additional issue and the classifier
  // has non-trivial evidence for a second category, ask which issue they want
  // to focus on instead of silently choosing one.
  const multiIssue =
    hasExplicitMultiIssueStructure(normalized) &&
    rawScore > 0 &&
    runnerUpScore >= 12 &&
    finalCategory.category_id !== runnerUpMatch?.category.category_id;

  const needsClarification = Boolean(semanticAmbiguity || lowEvidence || closeTie || multiIssue);

  let clarificationQuestion: string | undefined;
  if (multiIssue) {
    clarificationQuestion = buildGenericClarificationQuestion(finalCategory, runnerUpMatch?.category);
  } else if (semanticAmbiguity) {
    clarificationQuestion = semanticAmbiguity.question;
  } else if (lowEvidence) {
    clarificationQuestion = buildGenericClarificationQuestion(finalCategory);
  } else if (closeTie) {
    clarificationQuestion = buildGenericClarificationQuestion(finalCategory, runnerUpMatch?.category);
  }

  return {
    category: finalCategory,
    score: finalScore,
    rawScore,
    explanation: bestMatch && bestMatch.matchReasons.length > 0
      ? bestMatch.matchReasons.slice(0, 3).join('; ')
      : `Categorized under ${finalCategory.category_name}`,
    matchedPillars: finalCategory.entries,
    runnerUp: runnerUpMatch
      ? {
          category_id: runnerUpMatch.category.category_id,
          category_name: runnerUpMatch.category.category_name,
          score: runnerUpMatch.score,
        }
      : undefined,
    scoreMargin,
    needsClarification,
    clarificationQuestion,
  };
}

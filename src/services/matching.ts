import { ALL_CATEGORIES, KB_METADATA } from '../data/knowledgeBase';
import { Category, MatchResult, ExistentialRoot } from '../types';

interface CategoryLexicon {
  keywords: string[];
  phrases: string[];
  roots: ExistentialRoot[];
}

const CATEGORY_LEXICONS: Record<number, CategoryLexicon> = {
  1: {
    keywords: ['lonely', 'loneliness', 'isolated', 'isolation', 'unseen', 'alone', 'disconnected', 'detached', 'unheard', 'separate', 'nobody'],
    phrases: ['feel isolated even around people', 'feel alone in a crowd', 'nobody really knows me', 'so lonely', 'surrounded by people but lonely'],
    roots: ['Isolation'],
  },
  2: {
    keywords: ['grief', 'grieving', 'mourning', 'loss', 'died', 'death', 'passed away', 'lost', 'bereavement', 'departed', 'funeral', 'missing them'],
    phrases: ['lost someone', 'loss of a relationship', 'passed away', 'grieving the loss', 'way of life ended', 'loss of my old life'],
    roots: ['Death', 'Freedom', 'Meaninglessness'],
  },
  3: {
    keywords: ['anxiety', 'anxious', 'dread', 'future', 'panic', 'nervous', 'catastrophizing', 'worry', 'what if', 'impending', 'restless'],
    phrases: ['dread about the future', 'constant worry', 'anxious about what comes next', 'fear of what might happen', 'sense of impending doom'],
    roots: ['Freedom', 'Death'],
  },
  4: {
    keywords: ['anger', 'angry', 'furious', 'rage', 'resentment', 'bitter', 'infuriated', 'frustrated', 'boiling', 'irritated', 'pissed'],
    phrases: ['so angry', 'full of rage', 'feeling resentful', 'burning anger', 'can not let go of anger'],
    roots: ['Freedom'],
  },
  5: {
    keywords: ['conflict', 'arguing', 'argument', 'fighting', 'tension', 'dispute', 'hostility', 'friction', 'partner', 'spouse', 'coworker'],
    phrases: ['ongoing conflict', 'fighting all the time', 'constant arguments', 'tension with someone', 'can not see eye to eye'],
    roots: ['Freedom', 'Isolation'],
  },
  6: {
    keywords: ['shame', 'defective', 'unworthy', 'flawed', 'broken', 'inadequate', 'unlovable', 'dirty', 'embarrassed', 'humiliated'],
    phrases: ['fundamentally not okay', 'something is wrong with me', 'feel so defective', 'unworthy of love', 'deep shame'],
    roots: ['Meaninglessness', 'Isolation'],
  },
  7: {
    keywords: ['rejection', 'heartbreak', 'rejected', 'dumped', 'abandoned', 'breakup', 'unrequited', 'unwanted', 'discarded', 'turned down'],
    phrases: ['heart broken', 'they rejected me', 'fear of rejection', 'feeling abandoned', 'cut out of their life'],
    roots: ['Isolation', 'Meaninglessness'],
  },
  8: {
    keywords: ['stuck', 'decide', 'indecision', 'paralysis', 'crossroads', 'hesitant', 'torn', 'limbo', 'frozen', 'options'],
    phrases: ['feeling stuck', 'can not decide', 'analysis paralysis', 'do not know what path to take', 'terrified of choosing'],
    roots: ['Freedom'],
  },
  9: {
    keywords: ['failure', 'failing', 'mistakes', 'perfectionism', 'perfectionist', 'fall short', 'disappointing', 'incompetent', 'imposter'],
    phrases: ['fear of failure', 'afraid to fail', 'terrified of falling short', 'what if I fail', 'fear of not measuring up'],
    roots: ['Freedom', 'Death'],
  },
  10: {
    keywords: ['drinking', 'alcohol', 'drugs', 'substance', 'weed', 'pills', 'relapse', 'intoxication', 'sober', 'sobriety', 'cravings'],
    phrases: ['substance use', 'drinking too much', 'using substances to cope', 'need to get sober', 'relying on alcohol'],
    roots: ['Death', 'Meaninglessness'],
  },
  11: {
    keywords: ['compulsive', 'habit', 'gambling', 'shopping', 'doomscrolling', 'binge', 'screen time', 'checking', 'urges', 'compulsion'],
    phrases: ['compulsive coping', 'can not stop doing it', 'bad behavioral habit', 'using distractions to numb out', 'destructive loop'],
    roots: ['Death', 'Meaninglessness'],
  },
  12: {
    keywords: ['betrayal', 'betrayed', 'cheated', 'lying', 'lied', 'deceit', 'broken trust', 'stabbed in the back', 'backstabbed', 'disloyal'],
    phrases: ['trust was broken', 'they betrayed me', 'lied to my face', 'never trust again', 'shock of betrayal'],
    roots: ['Isolation'],
  },
  13: {
    keywords: ['meaningless', 'pointless', 'purpose', 'empty', 'void', 'vacuum', 'why bother', 'existence', 'insignificant', 'futile'],
    phrases: ['life feels meaningless', 'what is the point', 'no sense of purpose', 'existential vacuum', 'cosmic emptiness'],
    roots: ['Meaninglessness'],
  },
  14: {
    keywords: ['career', 'job', 'work', 'calling', 'profession', 'vocation', 'unemployed', 'dead-end', 'promotion', 'unfulfilled at work'],
    phrases: ['career purpose', 'vocational meaning', 'unfulfilled in my job', 'what should I do with my life work', 'burnout at work'],
    roots: ['Meaninglessness'],
  },
  15: {
    keywords: ['overwhelmed', 'overwhelm', 'too much', 'drowning', 'spinning plates', 'control', 'exhausted', 'burdened', 'swamped'],
    phrases: ['too much to control', 'feeling completely overwhelmed', 'drowning in responsibilities', 'can not manage it all'],
    roots: ['Freedom'],
  },
  16: {
    keywords: ['identity', 'who am I', 'mask', 'persona', 'inauthentic', 'lost myself', 'chameleon', 'people pleasing', 'living for others'],
    phrases: ['personal identity confusion', 'do not know who I am', 'lost in what others want', 'wearing a mask', 'finding myself'],
    roots: ['Meaninglessness', 'Freedom'],
  },
  17: {
    keywords: ['belonging', 'culture', 'cultural', 'immigrant', 'outsider', 'heritage', 'bicultural', 'alienated', 'fitting in', 'community'],
    phrases: ['group belonging confusion', 'do not belong anywhere', 'stranger in both worlds', 'cultural dislocation', 'neither here nor there'],
    roots: ['Isolation'],
  },
  18: {
    keywords: ['illness', 'health', 'disease', 'pain', 'body', 'diagnosis', 'medical', 'mortality', 'aging', 'frail', 'sick', 'hypochondria'],
    phrases: ['fear about health', 'health anxiety', 'scared of getting sick', 'chronic illness', 'facing my mortality'],
    roots: ['Death'],
  },
  19: {
    keywords: ['money', 'financial', 'finances', 'debt', 'broke', 'poverty', 'bills', 'rent', 'economy', 'job loss', 'security'],
    phrases: ['financial fear', 'scared about money', 'how will I afford', 'security dread', 'financial instability'],
    roots: ['Freedom', 'Death'],
  },
  20: {
    keywords: ['envy', 'jealous', 'comparison', 'comparing', 'behind', 'peers', 'inferior', 'social media', 'everyone else is ahead'],
    phrases: ['comparing myself to others', 'feeling envious', 'feel like I am falling behind', 'jealous of other people success'],
    roots: ['Isolation', 'Meaninglessness'],
  },
  21: {
    keywords: ['guilt', 'forgive', 'remorse', 'unforgivable', 'regret', 'hurt someone', 'fault', 'blame', 'moral injury', 'wronged someone'],
    phrases: ['can not forgive myself', 'so much guilt', 'terrible mistake I made', 'deep remorse', 'eaten alive by guilt'],
    roots: ['Freedom', 'Meaninglessness'],
  },
  22: {
    keywords: ['impatience', 'waiting', 'limbo', 'stalled', 'delay', 'when will it happen', 'restless', 'anticipation', 'delayed'],
    phrases: ['waiting for something to change', 'tired of waiting', 'living in limbo', 'when does life start'],
    roots: ['Freedom', 'Death'],
  },
  23: {
    keywords: ['sadness', 'sad', 'depression', 'depressed', 'gloom', 'crying', 'melancholy', 'heavy', 'tearful', 'hopeless', 'low mood'],
    phrases: ['persistent sadness', 'low mood', 'dark cloud', 'carrying this heaviness', 'feeling down all the time'],
    roots: ['Death', 'Freedom', 'Isolation', 'Meaninglessness'],
  },
  24: {
    keywords: ['anhedonia', 'numb', 'joy', 'flat', 'apathy', 'pleasure', 'blunted', 'empty', 'cannot feel', 'robotic', 'grey'],
    phrases: ['can not feel joy', 'everything feels grey', 'emotionally numb', 'nothing excites me anymore', 'loss of pleasure'],
    roots: ['Death', 'Freedom', 'Isolation', 'Meaninglessness'],
  },
  25: {
    keywords: ['bullied', 'mistreated', 'disrespected', 'undermined', 'gaslighted', 'abused', 'target', 'belittled', 'bullies', 'cruelty'],
    phrases: ['being mistreated', 'walking on eggshells', 'being bullied', 'disrespected repeatedly', 'someone is treating me cruelly'],
    roots: ['Isolation', 'Freedom'],
  },
};

const CRISIS_PATTERNS = [
  /\b(suicide|suicidal|kill myself|end my life|want to die|take my own life|better off dead|no reason to live)\b/i,
  /\b(cut myself|cutting myself|hurt myself|burn myself|self harm|self-harm)\b/i,
  /\b(hitting me|beats me|physical abuse|abusive husband|abusive wife|domestic violence|stalking me|unsafe at home)\b/i,
  /\b(sexual assault|raped|molested|forced me)\b/i,
  /\b(overdose|overdosing|fatal withdrawal|seizure from alcohol|relapsed and cannot breathe)\b/i,
];

export function checkCrisis(text: string): {
  isCrisis: boolean;
  type?: 'immediate_crisis' | 'hard_ceiling' | 'escalation';
  details?: string;
} {
  const normalized = text.toLowerCase();

  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isCrisis: true,
        type: 'immediate_crisis',
        details: 'Your words reflect acute distress or safety concerns. Immediate support from professional human crisis responders is readily available.',
      };
    }
  }

  // Check for severe substance keywords indicating potential medical risk (Hard Ceiling)
  if (/\b(detox|fatal withdrawal|severe alcohol withdrawal|delirium tremens|overdose risk|heavy binge for days)\b/i.test(normalized)) {
    return {
      isCrisis: true,
      type: 'hard_ceiling',
      details: 'Substance withdrawal (especially alcohol and benzodiazepines) and overdose carry acute medical risks that require professional medical supervision.',
    };
  }

  return { isCrisis: false };
}

export function matchProblemToCategory(
  problemText: string,
  preferredRoot?: ExistentialRoot | null
): MatchResult {
  const crisisCheck = checkCrisis(problemText);
  const normalized = problemText.toLowerCase();
  const words: string[] = normalized.match(/[a-z0-9'-]+/g) ?? [];

  const scores: { category: Category; score: number }[] = ALL_CATEGORIES.map(cat => {
    let score = 0;
    const lexicon = CATEGORY_LEXICONS[cat.category_id];

    if (!lexicon) {
      return { category: cat, score: 0 };
    }

    // Check exact phrase matches (high weight)
    for (const phrase of lexicon.phrases) {
      if (normalized.includes(phrase)) {
        score += 35;
      }
    }

    // Check keyword matches
    for (const kw of lexicon.keywords) {
      if (words.includes(kw)) {
        score += 15;
      } else if (normalized.includes(kw)) {
        score += 8;
      }
    }

    // Check title words
    const titleWords: string[] = cat.category_name.toLowerCase().match(/[a-z0-9'-]+/g) ?? [];
    for (const tw of titleWords) {
      if (words.includes(tw) && !['the', 'and', 'of', 'or', 'in', 'even'].includes(tw)) {
        score += 12;
      }
    }

    // Bonus for selected existential root
    if (preferredRoot && cat.existential_roots.includes(preferredRoot)) {
      score += 15;
    }

    // Check entry teachings for term matches
    for (const entry of cat.entries) {
      const teach = entry.teaching.toLowerCase();
      for (const w of words) {
        if (w.length > 4 && teach.includes(w)) {
          score += 1.5;
        }
      }
    }

    return { category: cat, score };
  });

  scores.sort((a, b) => b.score - a.score);
  const topMatch = scores[0];

  // Default fallback if score is 0
  const chosenCategory = topMatch && topMatch.score > 0 ? topMatch.category : ALL_CATEGORIES[0];
  const confidenceScore = Math.min(98, Math.max(45, Math.round((topMatch?.score || 10) * 1.8)));

  // Check if hard ceiling applies to matched category
  let isCrisis = crisisCheck.isCrisis;
  let crisisType = crisisCheck.type;
  let crisisDetails = crisisCheck.details;

  if (KB_METADATA.hard_ceiling_categories.includes(chosenCategory.category_id)) {
    isCrisis = true;
    crisisType = crisisType || 'hard_ceiling';
    crisisDetails = crisisDetails || 'Hard Ceiling Safety Notice: Medical and crisis-resource redirection must accompany or precede philosophy when substance or withdrawal risk is involved.';
  } else if (KB_METADATA.escalation_candidate_categories.includes(chosenCategory.category_id)) {
    if (chosenCategory.category_id === 21 && (normalized.includes('moral injury') || normalized.includes('unforgivable') || normalized.includes('deserve to suffer'))) {
      isCrisis = true;
      crisisType = 'escalation';
      crisisDetails = 'Escalation Notice: Moral-injury-adjacent guilt requires compassionate clinical support alongside self-forgiveness teachings.';
    } else if (chosenCategory.category_id === 24 && (normalized.includes('sudden') || normalized.includes('completely dead inside') || normalized.includes('cannot function'))) {
      isCrisis = true;
      crisisType = 'escalation';
      crisisDetails = 'Escalation Notice: Sudden-onset complete anhedonia warrants clinical evaluation alongside contemplative support.';
    }
  }

  // Generate grounded synthesis and affirmation
  const groundedAffirmation = generateGroundedAffirmation(chosenCategory);

  return {
    matchedCategory: chosenCategory,
    confidenceScore,
    explanation: `Matched to "${chosenCategory.category_name}" rooted in ${chosenCategory.existential_roots.join(' & ')}.`,
    personalizedAffirmation: groundedAffirmation,
    groundedSynthesis: chosenCategory.synthesis_note,
    isCrisisDetected: isCrisis,
    crisisType,
    crisisDetails,
  };
}

function generateGroundedAffirmation(category: Category): string {
  // Sourced affirmations directly grounded in the 3 pillar teachings for the category
  const affirmationsByCat: Record<number, string> = {
    1: 'I am made of the same fabric as the world around me. My loneliness does not prove my isolation; it reveals my fundamental belonging to all things.',
    2: 'Grief is the natural cost of having loved deeply. I honor the impermanence of what was without letting loss define who I become.',
    3: 'The future does not belong to my fear. I return to the only ground where my agency lives: this present breath and this single choice.',
    4: 'My anger is a signal of a crossed boundary or an unmet desire. I listen to its message without letting it command my tongue or actions.',
    5: 'I release the illusion that I can force another person to change. I focus my energy on how I choose to respond with dignity and boundaries.',
    6: 'My human imperfections are part of the shared human condition, not proof of my unworthiness. I meet myself with radical self-kindness today.',
    7: 'Another person’s departure or inability to love me is not a measure of my worth. I reclaim the love I projected outward and anchor it within myself.',
    8: 'There is rarely a single "flawless" choice. Any path walked with consciousness, presence, and courage becomes the ground for growth.',
    9: 'Failure is not a verdict on my identity; it is simply neutral information that feeds wisdom and resilience.',
    10: 'My longing for wholeness is real and sacred. I commit to honoring my life through mindful presence and seeking authentic support.',
    11: 'I notice my habit energies without moral condemnation. I do not have to obey every urgent impulse to escape this present moment.',
    12: 'The breach of trust belongs to those who broke it. My capacity to heal and hold clear boundaries remains entirely intact.',
    13: 'The universe does not hand down readymade purpose; it invites me to create meaning through every act of love, responsibility, and courage.',
    14: 'My vocational worth is not defined by external titles, but by the intention, integrity, and meaning I bring to what I build.',
    15: 'I do not have to hold everything all at once. I set down what is beyond my control and attend only to the next right step.',
    16: 'I do not exist to fulfill the expectations or projected masks of others. My authentic self is uncovered through honest, quiet listening.',
    17: 'I do not need to dissolve who I am to belong. I belong fundamentally to life itself, exactly as I am.',
    18: 'My body is mortal and impermanent. I treat it with deep gentleness, honoring every day of vitality I am granted.',
    19: 'Security is not found in an infallible guarantee against uncertainty, but in my inner capacity to adapt, endure, and choose with courage.',
    20: 'Comparison steals the beauty of my unique journey. I bless the flourishing of others and turn my devotion to my own unfolding.',
    21: 'I cannot rewrite the past, but I can transform its meaning by living today with repair, humility, and conscious restitution.',
    22: 'Patience is not idle waiting; it is trusting that growth occurs in the hidden soil before the shoot breaks the earth.',
    23: 'Sadness is not a failure of character; it is a season of the heart. I allow myself to feel without closing off the doorway to light.',
    24: 'Even when joy feels quiet or far away, my capacity for presence remains. I rest quietly in what is, trusting life will return to color.',
    25: 'Other people’s mistreatment is a reflection of their inner state, not my value. I protect my peace and stand firmly in my worth.',
  };

  return affirmationsByCat[category.category_id] ||
    'I stand grounded in real wisdom. I meet life’s complexity with courage, clarity, and compassionate presence.';
}

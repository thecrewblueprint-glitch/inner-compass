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
        explanation: `Direct deterministic match for ${targetCat.category_name} (Category #${targetCat.category_id})`,
        matchedPillars: targetCat.entries,
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
        }
      }
    }

    // 3. Category Title words (12 pts)
    const titleWords: string[] = cat.category_name.toLowerCase().match(/[a-z0-9'-]+/g) ?? [];
    for (const tw of titleWords) {
      if (words.includes(tw) && !['the', 'and', 'of', 'or', 'in', 'even', 'with', 'by'].includes(tw)) {
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

  // Default to Category 13 (General life meaninglessness) if no keywords matched
  const fallbackCat = getCategoryById(13) || CANONICAL_CATEGORIES[0];
  const finalCategory = bestMatch && bestMatch.score > 0 ? bestMatch.category : fallbackCat;
  const finalScore = bestMatch && bestMatch.score > 0 ? Math.min(100, bestMatch.score) : 40;

  return {
    category: finalCategory,
    score: finalScore,
    explanation: bestMatch && bestMatch.matchReasons.length > 0
      ? bestMatch.matchReasons.slice(0, 3).join('; ')
      : `Categorized under ${finalCategory.category_name}`,
    matchedPillars: finalCategory.entries,
  };
}

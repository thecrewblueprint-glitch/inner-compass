import { Category, KBEntry, PillarType, ExistentialRoot } from '../types';
import { CANONICAL_CATEGORIES, getCategoryById } from '../knowledgeBase/kbLoader';

export interface DailyAffirmationItem {
  id: string;
  category: Category;
  entry: KBEntry;
  quoteText: string;
  isVerifiedQuote: boolean;
  author: string;
  sourceWork: string;
  tradition: string;
  pillar: PillarType;
  pillarLabel: string;
  dailyAffirmation: string;
  existentialRoots: ExistentialRoot[];
  isPersonalized: boolean;
  totalInteractedCategories: number;
}

const INTERACTIONS_STORAGE_KEY = 'inner_compass_category_interactions_v1';
const SAVED_REFLECTIONS_STORAGE_KEY = 'inner_compass_saved_reflections';

// Grounded, psychologically sound affirmations for all 25 categories
// Non-toxic, grounded in clinical reality and philosophical wisdom
export const CATEGORY_GROUNDED_AFFIRMATIONS: Record<number, string> = {
  1: 'I do not flee from solitude; even in feeling apart, I am woven into the quiet fabric of common humanity.',
  2: 'I honor my grief without demanding its hasty departure. My sadness measures the depth of what was treasured.',
  3: 'I return my attention from the imagined future to the breath, the ground, and what is real right now.',
  4: 'I acknowledge the heat of my anger with clarity, allowing it to inform my boundaries without burning my peace.',
  5: 'I pause before reacting, holding curiosity for where my own unmet expectations meet another’s defenses.',
  6: 'I meet my human imperfections with unconditional friendliness rather than relentless self-judgment.',
  7: 'A closed door does not diminish my inherent dignity. I hold my vulnerable heart with steady gentleness.',
  8: 'Indecision is the weight of my freedom. I allow clarity to unfold and take one small, honest step today.',
  9: 'My worth is not conditional on flawless performance. I give myself permission to learn through stumbling.',
  10: 'I honor my body’s longing for ease while gently choosing presence, clarity, and compassionate care.',
  11: 'I pause between the impulse and the habitual escape, offering breathing room to the tension underneath.',
  12: 'I honor the hurt of broken trust while refusing to let cynicism close my capacity for authentic truth.',
  13: 'When grand meaning feels elusive, I let simple presence, kindness, and honest observation be enough.',
  14: 'My purpose unfolds through how I attend to this hour, rather than distant monuments of accomplishment.',
  15: 'I lay down the exhausting burden of controlling everything. I focus solely on the immediate next step.',
  16: 'I give myself permission to be an unfinished work, shedding expectations that were never truly mine.',
  17: 'My belonging in this world begins with how warmly I welcome the exiled parts of my own being.',
  18: 'I inhabit this fragile, mortal body with tender gratitude and compassion for its natural human limits.',
  19: 'I discern between genuine immediate needs and the mind’s anxious projections of scarcity.',
  20: 'Another’s flourishing does not diminish my light. I turn my energy inward toward tending my own soil.',
  21: 'I acknowledge where I missed the mark with remorse, dedicating myself to repair rather than self-punishment.',
  22: 'Growth moves according to its own quiet season. I cultivate patience with what is still taking root.',
  23: 'I let the heavy weather pass across the inner sky without mistaking the clouds for who I truly am.',
  24: 'I do not demand immediate joy; I remain quietly open to noticing the subtlest warmth in simple things.',
  25: 'I stand anchored in my worth. True kindness to myself includes maintaining clear and respectful boundaries.',
};

/**
 * Record when a user interacts with a category across the app
 */
export function recordCategoryInteraction(
  categoryId: number,
  source: 'reflection' | 'saved' | 'taxonomy_view' | 'sample' = 'reflection'
): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(INTERACTIONS_STORAGE_KEY);
    const map: Record<number, { count: number; lastAt: number; sources: string[] }> = raw
      ? JSON.parse(raw)
      : {};

    const existing = map[categoryId] || { count: 0, lastAt: 0, sources: [] };
    const sourcesSet = new Set(existing.sources || []);
    sourcesSet.add(source);

    map[categoryId] = {
      count: existing.count + 1,
      lastAt: Date.now(),
      sources: Array.from(sourcesSet),
    };

    localStorage.setItem(INTERACTIONS_STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn('Unable to record category interaction:', err);
  }
}

/**
 * Retrieve all category IDs the user has previously interacted with
 */
export function getInteractedCategoryIds(): number[] {
  const idsSet = new Set<number>();

  try {
    if (typeof localStorage !== 'undefined') {
      // 1. Check interactions map
      const rawInteractions = localStorage.getItem(INTERACTIONS_STORAGE_KEY);
      if (rawInteractions) {
        const map = JSON.parse(rawInteractions);
        Object.keys(map).forEach((k) => {
          const num = Number(k);
          if (num >= 1 && num <= 25) {
            idsSet.add(num);
          }
        });
      }

      // 2. Also check saved reflections to ensure complete history
      const rawSaved = localStorage.getItem(SAVED_REFLECTIONS_STORAGE_KEY);
      if (rawSaved) {
        const savedList = JSON.parse(rawSaved);
        if (Array.isArray(savedList)) {
          savedList.forEach((item: any) => {
            if (typeof item.categoryId === 'number' && item.categoryId >= 1 && item.categoryId <= 25) {
              idsSet.add(item.categoryId);
            }
          });
        }
      }
    }
  } catch (err) {
    console.warn('Unable to retrieve interacted categories:', err);
  }

  return Array.from(idsSet);
}

const PILLAR_DISPLAY_NAMES: Record<PillarType, string> = {
  eastern_philosophy: 'Eastern Philosophy & Metaphysics',
  shadow_work: 'Jungian Depth Psychology & Shadow Work',
  psychology_methodology: 'Evidence-Based Psychology Methodology',
};

/**
 * Extract quote text for an entry, favoring verified quotes,
 * or extracting a core contemplative phrase from the teaching.
 */
function extractQuoteForEntry(entry: KBEntry): { text: string; isVerified: boolean } {
  if (entry.verified_quote && entry.verified_quote.trim()) {
    return { text: entry.verified_quote.trim(), isVerified: true };
  }

  // Format the teaching text as an authoritative wisdom excerpt
  const teaching = entry.teaching.trim();
  return { text: teaching, isVerified: false };
}

/**
 * Get a hash code for a date string to ensure a consistent quote per day
 */
function getDaySeed(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

/**
 * Retrieve the Daily Affirmation item based on user's interacted categories
 */
export function getDailyAffirmationItem(
  shuffleOffset = 0,
  targetDate = new Date()
): DailyAffirmationItem {
  const interactedIds = getInteractedCategoryIds();
  const hasInteractions = interactedIds.length > 0;

  // Determine candidate categories
  let candidateCategories: Category[] = [];
  if (hasInteractions) {
    candidateCategories = interactedIds
      .map((id) => getCategoryById(id))
      .filter((cat): cat is Category => Boolean(cat));
  }

  // Fallback if no interacted categories exist yet
  if (candidateCategories.length === 0) {
    candidateCategories = CANONICAL_CATEGORIES;
  }

  // Gather all entries from candidate categories
  interface CandidateEntry {
    category: Category;
    entry: KBEntry;
  }
  const pool: CandidateEntry[] = [];
  candidateCategories.forEach((cat) => {
    cat.entries.forEach((entry) => {
      pool.push({ category: cat, entry });
    });
  });

  if (pool.length === 0) {
    // Ultimate fallback to category 1 entry 0
    const cat = CANONICAL_CATEGORIES[0];
    const entry = cat.entries[0];
    pool.push({ category: cat, entry });
  }

  // Deterministic daily calculation + shuffle offset
  const daySeed = getDaySeed(targetDate);
  const totalItems = pool.length;
  // Combine day seed and shuffle offset into a stable pseudo-random index
  const rawIndex = Math.abs((daySeed * 37 + shuffleOffset * 19) % totalItems);
  const selected = pool[rawIndex];

  const { text: quoteText, isVerified } = extractQuoteForEntry(selected.entry);

  const affirmation =
    CATEGORY_GROUNDED_AFFIRMATIONS[selected.category.category_id] ||
    `I meet this day grounded in ${selected.category.category_name} with mindful clarity.`;

  return {
    id: `${selected.category.category_id}-${selected.entry.entry_id}-${shuffleOffset}`,
    category: selected.category,
    entry: selected.entry,
    quoteText,
    isVerifiedQuote: isVerified,
    author: selected.entry.source_author,
    sourceWork: selected.entry.source_work,
    tradition: selected.entry.tradition_or_school,
    pillar: selected.entry.pillar,
    pillarLabel: PILLAR_DISPLAY_NAMES[selected.entry.pillar] || selected.entry.pillar,
    dailyAffirmation: affirmation,
    existentialRoots: selected.category.existential_roots,
    isPersonalized: hasInteractions,
    totalInteractedCategories: interactedIds.length,
  };
}

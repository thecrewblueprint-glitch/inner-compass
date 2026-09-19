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
const SAVED_REFLECTIONS_STORAGE_KEY = 'inner_compass_saved_reflections_v1';

/**
 * Record privacy-safe category interaction metadata.
 * Raw reflection text is never stored here.
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
 * Retrieve category IDs the user has interacted with, using privacy-safe
 * category metadata and the app's real saved-reflection key.
 */
export function getInteractedCategoryIds(): number[] {
  const idsSet = new Set<number>();

  try {
    if (typeof localStorage !== 'undefined') {
      const rawInteractions = localStorage.getItem(INTERACTIONS_STORAGE_KEY);
      if (rawInteractions) {
        const map = JSON.parse(rawInteractions);
        Object.keys(map).forEach((k) => {
          const num = Number(k);
          if (num >= 1 && num <= 25) idsSet.add(num);
        });
      }

      const rawSaved = localStorage.getItem(SAVED_REFLECTIONS_STORAGE_KEY);
      if (rawSaved) {
        const savedList = JSON.parse(rawSaved);
        if (Array.isArray(savedList)) {
          savedList.forEach((item: any) => {
            if (
              typeof item.categoryId === 'number' &&
              item.categoryId >= 1 &&
              item.categoryId <= 25
            ) {
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
 * Use a verified quote when the canonical entry contains one. Otherwise use the
 * canonical teaching text as a summary and explicitly mark it as non-quotation.
 */
function extractQuoteForEntry(entry: KBEntry): { text: string; isVerified: boolean } {
  if (entry.verified_quote && entry.verified_quote.trim()) {
    return { text: entry.verified_quote.trim(), isVerified: true };
  }

  return { text: entry.teaching.trim(), isVerified: false };
}

function getDaySeed(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

/**
 * Deterministically retrieve a daily item from the canonical KB.
 * No model, provider, network call, or secondary guidance corpus is used.
 */
export function getDailyAffirmationItem(
  shuffleOffset = 0,
  targetDate = new Date()
): DailyAffirmationItem {
  const interactedIds = getInteractedCategoryIds();
  const hasInteractions = interactedIds.length > 0;

  let candidateCategories: Category[] = [];
  if (hasInteractions) {
    candidateCategories = interactedIds
      .map((id) => getCategoryById(id))
      .filter((cat): cat is Category => Boolean(cat));
  }

  if (candidateCategories.length === 0) {
    candidateCategories = CANONICAL_CATEGORIES;
  }

  interface CandidateEntry {
    category: Category;
    entry: KBEntry;
  }

  const pool: CandidateEntry[] = [];
  candidateCategories.forEach((cat) => {
    cat.entries.forEach((entry) => pool.push({ category: cat, entry }));
  });

  if (pool.length === 0) {
    const cat = CANONICAL_CATEGORIES[0];
    pool.push({ category: cat, entry: cat.entries[0] });
  }

  const daySeed = getDaySeed(targetDate);
  const rawIndex = Math.abs((daySeed * 37 + shuffleOffset * 19) % pool.length);
  const selected = pool[rawIndex];
  const { text: quoteText, isVerified } = extractQuoteForEntry(selected.entry);

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
    // Preserve the existing property name for component compatibility, but source
    // the text exclusively from the canonical category synthesis.
    dailyAffirmation: selected.category.synthesis_note,
    existentialRoots: selected.category.existential_roots,
    isPersonalized: hasInteractions,
    totalInteractedCategories: interactedIds.length,
  };
}

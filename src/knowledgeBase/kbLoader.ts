import { Category, KBEntry, KBIndexMetadata } from '../types';
import indexData from '../../content/knowledge-base/index.json';
import kb0105 from '../../content/knowledge-base/kb-01-05.json';
import kb0610 from '../../content/knowledge-base/kb-06-10.json';
import kb1115 from '../../content/knowledge-base/kb-11-15.json';
import kb1620 from '../../content/knowledge-base/kb-16-20.json';
import kb2125 from '../../content/knowledge-base/kb-21-25.json';

/**
 * Phase 1: Canonical Knowledge Base Loader & Schema Validator
 * Loads directly from canonical content/knowledge-base/*.json
 * Does NOT alter canonical files.
 */

const RAW_CATEGORIES: Category[] = [
  ...(kb0105 as unknown as Category[]),
  ...(kb0610 as unknown as Category[]),
  ...(kb1115 as unknown as Category[]),
  ...(kb1620 as unknown as Category[]),
  ...(kb2125 as unknown as Category[]),
];

export interface ValidationReport {
  isValid: boolean;
  categoryCount: number;
  totalEntries: number;
  errors: string[];
  hardCeilingCategories: number[];
  escalationCategories: number[];
}

export function validateKnowledgeBase(): ValidationReport {
  const errors: string[] = [];
  const expectedCount = 25;
  const expectedEntriesPerCat = 3;

  if (RAW_CATEGORIES.length !== expectedCount) {
    errors.push(`Expected ${expectedCount} categories, found ${RAW_CATEGORIES.length}`);
  }

  const categoryIds = new Set<number>();
  let totalEntries = 0;

  for (const cat of RAW_CATEGORIES) {
    if (typeof cat.category_id !== 'number' || cat.category_id < 1 || cat.category_id > 25) {
      errors.push(`Invalid category_id: ${cat.category_id}`);
    }
    if (categoryIds.has(cat.category_id)) {
      errors.push(`Duplicate category_id: ${cat.category_id}`);
    }
    categoryIds.add(cat.category_id);

    if (!cat.category_name || typeof cat.category_name !== 'string') {
      errors.push(`Category ${cat.category_id} missing category_name`);
    }

    if (!Array.isArray(cat.existential_roots) || cat.existential_roots.length === 0) {
      errors.push(`Category ${cat.category_id} missing existential_roots`);
    }

    if (!Array.isArray(cat.entries) || cat.entries.length !== expectedEntriesPerCat) {
      errors.push(`Category ${cat.category_id} expected ${expectedEntriesPerCat} entries, got ${cat.entries?.length}`);
    } else {
      totalEntries += cat.entries.length;
      const pillars = new Set<string>();
      for (const entry of cat.entries) {
        if (!['eastern_philosophy', 'shadow_work', 'psychology_methodology'].includes(entry.pillar)) {
          errors.push(`Category ${cat.category_id} entry ${entry.entry_id} invalid pillar: ${entry.pillar}`);
        }
        pillars.add(entry.pillar);

        if (!entry.source_author || typeof entry.source_author !== 'string') {
          errors.push(`Category ${cat.category_id} entry ${entry.entry_id} missing source_author`);
        }
        if (!entry.source_work || typeof entry.source_work !== 'string') {
          errors.push(`Category ${cat.category_id} entry ${entry.entry_id} missing source_work`);
        }
        if (!entry.teaching || typeof entry.teaching !== 'string') {
          errors.push(`Category ${cat.category_id} entry ${entry.entry_id} missing teaching`);
        }
        if (!['sourced', 'extrapolated'].includes(entry.confidence)) {
          errors.push(`Category ${cat.category_id} entry ${entry.entry_id} invalid confidence: ${entry.confidence}`);
        }
      }
      if (pillars.size !== 3) {
        errors.push(`Category ${cat.category_id} does not have all 3 distinct pillars`);
      }
    }

    if (!cat.synthesis_note || typeof cat.synthesis_note !== 'string') {
      errors.push(`Category ${cat.category_id} missing synthesis_note`);
    }
  }

  return {
    isValid: errors.length === 0,
    categoryCount: RAW_CATEGORIES.length,
    totalEntries,
    errors,
    hardCeilingCategories: indexData.hard_ceiling_categories,
    escalationCategories: indexData.escalation_candidate_categories,
  };
}

export const CANONICAL_CATEGORIES: Category[] = RAW_CATEGORIES.sort((a, b) => a.category_id - b.category_id);

export const KB_METADATA: KBIndexMetadata = indexData as KBIndexMetadata;

export function getAllCategories(): Category[] {
  return CANONICAL_CATEGORIES;
}

export function getCategoryById(id: number): Category | undefined {
  return CANONICAL_CATEGORIES.find((c) => c.category_id === id);
}

export function getEntriesForCategory(id: number): KBEntry[] {
  const cat = getCategoryById(id);
  return cat ? cat.entries : [];
}

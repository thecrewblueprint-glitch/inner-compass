import { getAllCategories, getCategoryById } from '../knowledgeBase/kbLoader';
import { WisdomArchiveEntry, WisdomPassage } from '../types';
import {
  WISDOM_AFFIRMATIONS,
  WISDOM_LIBRARY_RECORDS,
  WisdomAffirmation,
  WisdomLibraryRecord,
} from './wisdomLibrary';

const APPROVED_AFFIRMATION_STATUSES = new Set([
  'CATEGORY_VERIFIED',
  'APPROVED',
  'SOURCE_LINKED',
]);

const compareAffirmations = (a: WisdomAffirmation, b: WisdomAffirmation) =>
  b.category_fit_score - a.category_fit_score || a.affirmation_id.localeCompare(b.affirmation_id);

const compareWisdomRecords = (a: WisdomLibraryRecord, b: WisdomLibraryRecord) => {
  const verifiedDelta =
    Number(b.record_type === 'VERIFIED_DIRECT_QUOTE') -
    Number(a.record_type === 'VERIFIED_DIRECT_QUOTE');
  if (verifiedDelta !== 0) return verifiedDelta;

  const fitDelta = b.category_fit_score - a.category_fit_score;
  if (fitDelta !== 0) return fitDelta;

  const confidenceDelta = b.source_confidence - a.source_confidence;
  if (confidenceDelta !== 0) return confidenceDelta;

  return a.record_id.localeCompare(b.record_id);
};

const toPassage = (record: WisdomLibraryRecord): WisdomPassage => ({
  recordId: record.record_id,
  tradition: record.tradition,
  author: record.author_or_attributed_figure,
  work: record.work,
  section: record.book_chapter_section,
  summary: record.display_summary,
  sourceUrl: record.source_urls[0] || null,
  rightsStatus: record.rights_status,
  displayMode: record.direct_quote_text_display_enabled ? 'APPROVED_PASSAGE' : 'SOURCE_SUMMARY',
});

const buildArchiveEntry = (categoryId: number): WisdomArchiveEntry => {
  const category = getCategoryById(categoryId);
  if (!category) {
    throw new Error(`Unknown wisdom archive category: ${categoryId}`);
  }

  const affirmation =
    WISDOM_AFFIRMATIONS.filter(
      (item) =>
        item.category_id === categoryId &&
        APPROVED_AFFIRMATION_STATUSES.has(item.review_status)
    )
      .sort(compareAffirmations)[0] || null;

  const passages = WISDOM_LIBRARY_RECORDS.filter((record) =>
    record.category_ids.includes(categoryId)
  )
    .sort(compareWisdomRecords)
    .slice(0, 3)
    .map(toPassage);

  return {
    categoryId: category.category_id,
    categoryName: category.category_name,
    existentialRoots: category.existential_roots,
    affirmationId: affirmation?.affirmation_id || null,
    affirmation: affirmation?.text || category.synthesis_note,
    guidanceSummary: category.synthesis_note,
    passages,
    guidancePoints: category.entries.map((entry) => ({
      id: entry.entry_id,
      lens: entry.tradition_or_school,
      sourceAuthor: entry.source_author,
      sourceWork: entry.source_work,
      teaching: entry.teaching,
      practice: entry.practice_or_technique,
    })),
  };
};

export const WISDOM_ARCHIVE: WisdomArchiveEntry[] = getAllCategories().map((category) =>
  buildArchiveEntry(category.category_id)
);

export const getWisdomArchiveEntry = (categoryId: number): WisdomArchiveEntry => {
  const entry = WISDOM_ARCHIVE.find((item) => item.categoryId === categoryId);
  if (!entry) {
    throw new Error(`Wisdom archive entry missing for category ${categoryId}`);
  }
  return entry;
};

export const searchWisdomArchive = (
  query: string,
  categoryId?: number | null,
  recordId?: string | null
): WisdomArchiveEntry[] => {
  const normalized = query.trim().toLowerCase();

  return WISDOM_ARCHIVE.filter((entry) => {
    if (categoryId && entry.categoryId !== categoryId) return false;
    if (recordId && !entry.passages.some((passage) => passage.recordId === recordId)) return false;
    if (!normalized) return true;

    const searchable = [
      entry.categoryName,
      ...entry.existentialRoots,
      entry.affirmation,
      entry.guidanceSummary,
      ...entry.passages.flatMap((passage) => [
        passage.tradition,
        passage.author,
        passage.work,
        passage.section || '',
        passage.summary,
      ]),
      ...entry.guidancePoints.flatMap((point) => [
        point.lens,
        point.sourceAuthor,
        point.sourceWork,
        point.teaching,
        point.practice || '',
      ]),
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalized);
  });
};

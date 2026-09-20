import libraryData from '../../research/wisdom-corpus/library.json';
import affirmationsData from '../../research/wisdom-corpus/affirmation-candidates.json';

export interface WisdomLibraryRecord {
  record_id: string;
  record_type: 'VERIFIED_DIRECT_QUOTE' | 'SOURCE_PARAPHRASE';
  category_ids: number[];
  related_category_ids: number[];
  tradition: string;
  school_or_lineage: string | null;
  author_or_attributed_figure: string;
  work: string;
  book_chapter_section: string | null;
  translator: string | null;
  edition: string | null;
  publication_year: string | number | null;
  source_urls: string[];
  bibliographic_citation: string | null;
  rights_status: string;
  display_summary: string;
  philosophical_themes: string[];
  retrieval_keywords: string[];
  source_confidence: number;
  category_fit_score: number;
  review_status: string;
  direct_quote_available: boolean;
  direct_quote_text_display_enabled: boolean;
}

export interface WisdomAffirmation {
  affirmation_id: string;
  category_id: number;
  text: string;
  source_record_ids: string[];
  philosophical_theme: string | null;
  tradition_basis: string[];
  safety_notes: string | null;
  category_fit_score: number;
  review_status: string;
  notes: string | null;
}

export const WISDOM_LIBRARY_RECORDS =
  (libraryData.records as unknown as WisdomLibraryRecord[]);

export const WISDOM_AFFIRMATIONS =
  (affirmationsData.candidates as unknown as WisdomAffirmation[]);

export const WISDOM_TRADITIONS = Array.from(
  new Set(WISDOM_LIBRARY_RECORDS.map((record) => record.tradition))
).sort();

export function getWisdomForCategory(categoryId: number): WisdomLibraryRecord[] {
  return WISDOM_LIBRARY_RECORDS.filter((record) => record.category_ids.includes(categoryId));
}

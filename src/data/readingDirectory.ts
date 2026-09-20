import readingsData from '../../research/reading-directory/readings.json';
import pathwaysData from '../../research/reading-directory/reading-pathways.json';
import traditionsData from '../../research/reading-directory/traditions.json';

export interface ReadingRecord {
  reading_id: string;
  title: string;
  author_or_attributed_author: string;
  translator: string | null;
  editor: string | null;
  edition: string | null;
  publication_year: string | number | null;
  region: string;
  culture: string;
  tradition: string;
  school: string | null;
  lineage_or_branch: string | null;
  branch_coverage: string[];
  record_type: 'PRIMARY_TEXT' | 'COMMENTARY' | 'SCHOLARSHIP' | 'MODERN_INTRODUCTION' | 'CONTEMPORARY_PRACTICE_GUIDE';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'SPECIALIST';
  primary_topics: string[];
  metaphysical_topics: string[];
  ethical_topics: string[];
  contemplative_topics: string[];
  related_inner_compass_categories: number[];
  related_wisdom_record_ids: string[];
  historical_context: string;
  why_read_it: string;
  what_it_is_not: string;
  interpretive_cautions: string[];
  translation_notes: string | null;
  rights_status: string;
  public_domain_available: boolean;
  open_access_url: string | null;
  publisher_url: string | null;
  bibliographic_citation: string;
  source_quality: string;
  review_status: string;
  resource_format: 'BOOK';
  resource_url: string;
  publisher_or_site: string | null;
  cover_image_url: string | null;
  cover_image_source: string | null;
  cover_image_rights_status: string;
  cover_image_alt: string;
  fallback_visual_style: string;
}

export interface ReadingPathway {
  pathway_id: string;
  title: string;
  description: string;
  reading_ids: string[];
}

export interface ReadingTradition {
  id: string;
  region: string;
  name: string;
  kind: string;
  branches: string[];
  note: string;
}

export const READING_RECORDS = (readingsData.readings as unknown as ReadingRecord[]).filter((record) => record.resource_format === 'BOOK');
export const READING_PATHWAYS = pathwaysData.pathways as unknown as ReadingPathway[];
export const READING_TRADITIONS = traditionsData.traditions as unknown as ReadingTradition[];

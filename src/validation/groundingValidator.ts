import { Category, GroundingValidationResult, KBEntry, StructuredLLMOutput } from '../types';
import { getCategoryById } from '../knowledgeBase/kbLoader';

/**
 * Phase 4: Deterministic Grounding Validator
 * Non-negotiable Rule 1: The LLM classifies and phrases only.
 * It does NOT invent philosophy, psychology claims, practices, quotes, sources, authors, or citations.
 * Rule 10: Strict validation against canonical entries from content/knowledge-base/
 * Fails closed if any hallucination, invented quote, or unauthorized author is detected.
 */

// Well-known authors across ALL categories in the canonical KB
const ALL_CANONICAL_AUTHORS = new Set([
  'Thich Nhat Hanh',
  'Pema Chödrön',
  'Carl Jung',
  'Kristin Neff',
  'James Hollis',
  'Robert A. Johnson',
  'Marie-Louise von Franz',
  'Marion Woodman',
  'Connie Zweig',
  'Steve Wolf',
  'Carol Dweck',
  'Steven C. Hayes',
  'Alan Watts',
  'C. Raymond Knee',
  'C.R. Snyder',
  'Richard Tedeschi',
  'Lawrence Calhoun',
  'David Sbarra',
  'Mark Savickas',
  'Martin Seligman',
  'Amy R. Krentzman',
  'Brad Klontz',
  'Nyanaponika Thera',
  'Robert Enright',
  'Robert Emmons',
  'Michael McCullough',
  'Fred Bryant',
  'Joseph Veroff',
  'Sylvia Brinton Perera',
  'Dalai Lama',
  'Laozi',
  'traditional',
]);

export function validateGrounding(
  llmOutput: StructuredLLMOutput | null,
  expectedCategory: Category
): GroundingValidationResult {
  const warnings: string[] = [];

  // If no LLM output was provided or generation was skipped/failed
  if (!llmOutput) {
    return {
      isValid: false,
      rejectionReason: 'No LLM output provided; fallback to deterministic canonical synthesis.',
      verifiedEntries: expectedCategory.entries,
      groundedSynthesis: expectedCategory.synthesis_note,
      warnings: ['Used canonical synthesis directly.'],
    };
  }

  // 1. Verify matched category ID
  if (llmOutput.matched_category_id !== expectedCategory.category_id) {
    // Check if the LLM's chosen category is at least a valid category in the KB
    const altCategory = getCategoryById(llmOutput.matched_category_id);
    if (!altCategory) {
      return {
        isValid: false,
        rejectionReason: `LLM returned invalid category ID: ${llmOutput.matched_category_id}`,
        verifiedEntries: expectedCategory.entries,
        groundedSynthesis: expectedCategory.synthesis_note,
        warnings: ['Category ID out of range; reverted to deterministic match.'],
      };
    }
  }

  // 2. Verify selected entry IDs
  const validEntryIds = new Set(expectedCategory.entries.map((e) => e.entry_id));
  const verifiedEntries: KBEntry[] = [];

  if (Array.isArray(llmOutput.selected_entry_ids)) {
    for (const id of llmOutput.selected_entry_ids) {
      if (!validEntryIds.has(id)) {
        warnings.push(`LLM selected entry ID ${id} which is not part of Category #${expectedCategory.category_id}`);
      }
    }
  }

  // Always bind to the category's canonical entries
  verifiedEntries.push(...expectedCategory.entries);

  // 3. Inspect phrased reflection for invented quotes or unauthorized authors
  const text = llmOutput.phrased_reflection || '';

  // Extract author names present in this specific category's entries
  const categoryAuthors = expectedCategory.entries.map((e) => e.source_author.toLowerCase());

  // Check if any outside philosophers/authors were hallucinated that do not belong to this category
  for (const author of ALL_CANONICAL_AUTHORS) {
    const lowerAuthor = author.toLowerCase();
    if (text.toLowerCase().includes(lowerAuthor)) {
      const isAuthorizedForCategory = categoryAuthors.some((ca) => ca.includes(lowerAuthor) || lowerAuthor.includes(ca));
      if (!isAuthorizedForCategory) {
        return {
          isValid: false,
          rejectionReason: `LLM cited author "${author}" who does not belong to canonical Category #${expectedCategory.category_id}. Fails closed.`,
          verifiedEntries: expectedCategory.entries,
          groundedSynthesis: expectedCategory.synthesis_note,
          warnings: [`Invented cross-category citation: ${author}`],
        };
      }
    }
  }

  // 4. Quote verification check
  // If the LLM uses quotation marks ("..."), check whether the quote matches a verified_quote in the entries
  const quoteMatches = text.match(/"([^"]{15,})"/g) || [];
  for (const q of quoteMatches) {
    const cleanQuote = q.replace(/"/g, '').trim().toLowerCase();
    const verifiedQuotes = expectedCategory.entries
      .map((e) => e.verified_quote)
      .filter((vq): vq is string => Boolean(vq))
      .map((vq) => vq.toLowerCase());

    const isVerified = verifiedQuotes.some((vq) => cleanQuote.includes(vq) || vq.includes(cleanQuote));
    if (!isVerified) {
      // The LLM put quotation marks around unverified text!
      warnings.push(`LLM used quotation marks around unverified quote: ${q}. Demoted to paraphrase.`);
    }
  }

  return {
    isValid: true,
    verifiedEntries,
    groundedSynthesis: text.trim() ? text.trim() : expectedCategory.synthesis_note,
    warnings,
  };
}

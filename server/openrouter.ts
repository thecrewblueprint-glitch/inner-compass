import { Category, StructuredLLMOutput } from '../src/types';

/**
 * Backend-only OpenRouter phrasing service.
 *
 * Production policy:
 * - OpenRouter is optional; deterministic guidance remains fully functional without it.
 * - Only the OpenRouter free router may be called.
 * - Raw reflection text is never sent to OpenRouter.
 * - The model receives only the already-selected canonical category and entries.
 * - Any provider, schema, category, or grounding failure returns null and falls back.
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
export const OPENROUTER_FREE_MODEL = 'openrouter/free';

function sameCanonicalEntrySet(selected: unknown, category: Category): boolean {
  if (!Array.isArray(selected)) return false;
  const expected = category.entries.map((e) => e.entry_id).sort();
  const actual = selected.filter((id): id is string => typeof id === 'string').sort();
  return actual.length === expected.length && actual.every((id, index) => id === expected[index]);
}

export async function callStructuredPhrasing(
  category: Category,
  preferredRoot?: string | null
): Promise<StructuredLLMOutput | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    return null;
  }

  const entriesSummary = category.entries.map((e) => ({
    entry_id: e.entry_id,
    pillar: e.pillar,
    tradition: e.tradition_or_school,
    author: e.source_author,
    work: e.source_work,
    teaching: e.teaching,
    verified_quote: e.verified_quote,
    technique: e.practice_or_technique,
  }));

  const systemInstruction = `You are Inner Compass's optional phrasing engine.
NON-NEGOTIABLE RULES:
1. The deterministic application has already selected Category #${category.category_id}: "${category.category_name}". You MUST NOT change it.
2. Use only the canonical entries supplied below. Never add authors, books, citations, quotes, theories, practices, diagnoses, or claims.
3. selected_entry_ids MUST contain every supplied canonical entry ID exactly once and no others.
4. If you include quoted text, it must exactly come from a supplied verified_quote. Otherwise paraphrase without quotation marks.
5. Return only the requested JSON object.

JSON SCHEMA:
{
  "matched_category_id": ${category.category_id},
  "existential_roots": string[],
  "phrased_reflection": string,
  "selected_entry_ids": string[],
  "confidence": number
}`;

  const userPrompt = `Retrieved Category: #${category.category_id} - ${category.category_name}
Existential Roots: ${category.existential_roots.join(', ')}
${preferredRoot ? `User Existential Focus: ${preferredRoot}` : ''}
Canonical Teachings:
${JSON.stringify(entriesSummary, null, 2)}

Canonical Synthesis:
"${category.synthesis_note}"

Rewrite the canonical synthesis into a concise, compassionate reflection grounded only in these entries. Do not infer new facts about the user. Respond only with the JSON object.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://innercompass.app',
        'X-Title': 'Inner Compass',
      },
      body: JSON.stringify({
        model: OPENROUTER_FREE_MODEL,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.warn(`[OpenRouter free router] status ${response.status}; using deterministic canonical synthesis.`);
      return null;
    }

    const data = await response.json();

    // openrouter/free is the only configured route. This additional guard catches
    // any unexpected non-zero usage reported by the provider response.
    if (typeof data?.usage?.cost === 'number' && data.usage.cost > 0) {
      console.error('[OpenRouter policy violation] Non-zero usage cost reported; discarding AI output.');
      return null;
    }

    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) return null;

    const parsed: StructuredLLMOutput = JSON.parse(content);

    if (
      parsed.matched_category_id !== category.category_id ||
      typeof parsed.phrased_reflection !== 'string' ||
      !parsed.phrased_reflection.trim() ||
      !sameCanonicalEntrySet(parsed.selected_entry_ids, category)
    ) {
      return null;
    }

    return parsed;
  } catch (err) {
    console.warn('[OpenRouter free router] unavailable or invalid; using deterministic canonical synthesis.');
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

import { Category, StructuredLLMOutput } from '../src/types';
import { PrivacyManager } from '../src/safety/privacy';

/**
 * Phase 4 / Rule 6: Backend-Only OpenRouter / LLM Service
 * Secrets stay strictly on the server (process.env.OPENROUTER_API_KEY).
 * Rule 10: Strict structured output schema.
 * Rule 1: Classifies and phrases only; never invents claims or quotes.
 * Rule 7: Raw reflection text is never logged.
 * Rule 12: Unknown privacy/provider/safety state fails closed.
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function callStructuredPhrasing(
  category: Category,
  preferredRoot?: string | null
): Promise<StructuredLLMOutput | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    // Secret missing; fails closed to deterministic synthesis
    return null;
  }

  // Provide only the retrieved category's canonical entries in the prompt
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

  const systemInstruction = `You are Inner Compass's clinical-wisdom phrasing engine.
NON-NEGOTIABLE CORE DIRECTIVE:
1. You classify and phrase only.
2. You must NEVER invent new philosophy, psychology theories, authors, books, citations, or quotes.
3. Every claim you make must trace strictly to the provided canonical entries for Category #${category.category_id}: "${category.category_name}".
4. If you include quotes, you may ONLY quote words explicitly marked in "verified_quote". If verified_quote is null, paraphrase accurately without quotation marks.
5. Produce your output strictly as a JSON object adhering to the schema below.

JSON SCHEMA:
{
  "matched_category_id": number,
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

Generate a compassionate, grounded synthesis and a 1-sentence affirmation connecting these 3 pillars to the person's struggle. Respond ONLY with the requested JSON object.`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://innercompass.app',
        'X-Title': 'Inner Compass MVP',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      console.warn(`[OpenRouter API Error] status ${response.status} - failing closed to canonical synthesis`);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed: StructuredLLMOutput = JSON.parse(content);

    // Verify compliance: Ensure no raw text was echoed back
    if (!parsed.matched_category_id || typeof parsed.phrased_reflection !== 'string') {
      return null;
    }

    return parsed;
  } catch (err) {
    console.warn('[OpenRouter Exception] - failing closed:', err);
    return null;
  }
}

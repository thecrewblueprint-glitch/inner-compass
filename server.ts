import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { CANONICAL_CATEGORIES, KB_METADATA, getCategoryById } from './src/knowledgeBase/kbLoader';
import { evaluateSafetyUpstream } from './src/safety/safetyRouter';
import { retrieveGroundedGuidance } from './src/retrieval/retrievalEngine';
import { validateGrounding } from './src/validation/groundingValidator';
import { callStructuredPhrasing } from './server/openrouter';
import { PrivacyManager } from './src/safety/privacy';
import { GuidanceResult, StructuredLLMOutput } from './src/types';

/**
 * Inner Compass Phase 6 MVP Backend Server
 * Rule 6: Firebase/OpenRouter secrets are backend-only.
 * Rule 8: Upstream deterministic safety routing before retrieval.
 * Rule 9: Category 10 substance hard ceiling; Category 5 abuse boundary; Category 21/24 escalation rules.
 * Rule 10: Strict structured-output schemas for OpenRouter and a deterministic grounding validator.
 * Rule 7: Do not persist or log raw user reflection text.
 * Rule 12: Unknown privacy/provider/safety state fails closed.
 */

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
      aiClient = null;
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      app: 'Inner Compass Phase 6 MVP',
      runtime: 'React Native / Expo Architecture with Backend API',
      categoriesLoaded: CANONICAL_CATEGORIES.length,
      openRouterConfigured: Boolean(process.env.OPENROUTER_API_KEY),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      privacyEnforced: true,
    });
  });

  // Get all canonical categories and metadata
  app.get('/api/categories', (req, res) => {
    res.json({
      metadata: KB_METADATA,
      categories: CANONICAL_CATEGORIES,
    });
  });

  // Get single category by ID
  app.get('/api/categories/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const category = getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  });

  // Primary Guidance Endpoint: Upstream Safety -> Retrieval -> Structured LLM -> Grounding Validator
  app.post('/api/guidance', async (req, res) => {
    try {
      const { preferredRoot } = req.body;
      const problem = typeof req.body.problem === 'string' && req.body.problem.trim()
        ? req.body.problem.trim()
        : typeof req.body.problemText === 'string' && req.body.problemText.trim()
        ? req.body.problemText.trim()
        : '';

      if (!problem) {
        return res.status(400).json({ error: 'Please describe what you are facing.' });
      }

      // STEP 1: Upstream Deterministic Safety Evaluation
      const safetyResult = evaluateSafetyUpstream(problem);

      // Log telemetry without user reflection text (Rule 7)
      const telemetry = PrivacyManager.createTelemetryRecord(
        safetyResult.suggestedCategoryId || 0,
        preferredRoot ? [preferredRoot] : [],
        safetyResult.status,
        safetyResult.isTriggered
      );
      console.log('[Safe Telemetry Event]', JSON.stringify(telemetry));

      // If blocked from wisdom matching (Immediate Crisis, Abuse, Moral Injury Escalation, Acute Anhedonia Escalation)
      if (safetyResult.blockedFromWisdomMatching) {
        return res.json({
          safety: safetyResult,
          category: safetyResult.suggestedCategoryId ? getCategoryById(safetyResult.suggestedCategoryId) : null,
          blockedFromWisdom: true,
        });
      }

      // STEP 2: Deterministic Knowledge-Base Retrieval
      const retrieval = retrieveGroundedGuidance(problem, preferredRoot, safetyResult.suggestedCategoryId);
      const category = retrieval.category;

      // STEP 3: Structured LLM Phrasing via OpenRouter (or Gemini fallback)
      let structuredOutput: StructuredLLMOutput | null = null;
      let isFallback = true;

      // Try OpenRouter first (Rule 10)
      if (process.env.OPENROUTER_API_KEY) {
        structuredOutput = await callStructuredPhrasing(category, preferredRoot);
      }

      // If OpenRouter unavailable, try Gemini client with strict structured JSON formatting
      if (!structuredOutput && getGeminiClient()) {
        try {
          const client = getGeminiClient()!;
          const prompt = `You are Inner Compass's clinical-wisdom phrasing engine.
Strict Rule: You classify and phrase only. Never invent quotes, teachers, or claims outside the provided entries.
Category #${category.category_id}: ${category.category_name}
Synthesis Note: ${category.synthesis_note}
Entries: ${JSON.stringify(category.entries.map(e => ({ id: e.entry_id, pillar: e.pillar, author: e.source_author, teaching: e.teaching, quote: e.verified_quote })))}

Respond with a JSON object strictly matching this schema:
{
  "matched_category_id": ${category.category_id},
  "existential_roots": ${JSON.stringify(category.existential_roots)},
  "phrased_reflection": "compassionate 2-3 sentence reflection grounded purely in these 3 teachings",
  "selected_entry_ids": ["${category.entries.map(e => e.entry_id).join('", "')}"],
  "confidence": 95
}`;

          const result = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });

          if (result && result.text) {
            structuredOutput = JSON.parse(result.text);
          }
        } catch (geminiErr) {
          console.warn('[Gemini fallback warning] using deterministic synthesis:', geminiErr);
        }
      }

      // STEP 4: Deterministic Grounding Validator
      // Enforces that response has no ungrounded claims, unauthorized authors, or fake quotes
      const groundingResult = validateGrounding(structuredOutput, category);
      if (groundingResult.isValid && structuredOutput) {
        isFallback = false;
      }

      // Formulate final response
      const responsePayload: GuidanceResult = {
        category,
        safety: safetyResult,
        grounding: groundingResult,
        affirmation: generateDeterministicAffirmation(category),
        synthesis: groundingResult.groundedSynthesis,
        isFallback,
      };

      return res.json(responsePayload);
    } catch (err: any) {
      console.error('[Error processing guidance API]:', err.message);
      return res.status(500).json({ error: 'Failed to process guidance', message: err.message });
    }
  });

  // Vite middleware for development (serves React Native Web preview)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Inner Compass Phase 6 MVP running at http://0.0.0.0:${PORT}`);
  });
}

function generateDeterministicAffirmation(category: any): string {
  const affirmations: Record<number, string> = {
    1: 'I am interconnected with all of life; even in physical solitude, my presence is woven into the whole.',
    2: 'Grief is the natural counterpart of deep love; I honor what has ended while staying open to life.',
    3: 'I release the illusion of total control, meeting uncertainty with grounded courage and inner hope.',
    4: 'I make room for my anger with fierce compassion, listening to what it protects without letting it consume me.',
    5: 'I meet difficult moments with curiosity and space, cultivating patience while honoring healthy boundaries.',
    6: 'I meet feelings of unworthiness with unconditional warmth; my worth is not contingent on perfection.',
    7: 'I hold the pain of loss tenderly without shooting the second arrow of self-blame or bitter withdrawal.',
    8: 'When the mud is stirred, I wait for the water to clear; committed action begins with still clarity.',
    9: 'I have the courage to take action without clinging to outcomes; mistakes are information, not a verdict.',
    10: 'I honor my body and spirit with conscious care, seeking human support and medical healing for recovery.',
    11: 'I notice my compulsive urges with spacious awareness, replacing shame with compassionate presence.',
    12: 'Betrayal is painful groundlessness; from this broken ground, I can rebuild genuine discernment and trust.',
    13: 'Meaning is not found ready-made; it is cultivated through devotion, connection, and small acts of care.',
    14: 'My true vocation is how I bring presence and values to life, far beyond any single job title.',
    15: 'I cease pushing against the river; by letting go of false demands, right priority naturally emerges.',
    16: 'I am not merely the roles or masks I wear; my true essence is the conscious awareness beneath them.',
    17: 'Belonging begins within; I anchor in common humanity rather than seeking approval from every circle.',
    18: 'Impermanence is the nature of living bodies; I meet each day with gratitude, presence, and practical care.',
    19: 'Contentment is the greatest wealth; I meet financial concerns with practical clarity and inner sufficiency.',
    20: 'Another person’s harvest does not diminish my field; I celebrate their light while tending my own seeds.',
    21: 'Genuine amends start with honest acknowledgment; I hold compassion for my past self as I walk forward.',
    22: 'I have the patience to let life unfold; right action arises naturally when agitation ceases.',
    23: 'I allow room for sadness without fleeing from it; within the swamplands of sorrow lie seeds of deeper meaning.',
    24: 'Vitality is never permanently lost; I reconnect attention with simple, available moments of being.',
    25: 'External mistreatment reflects the storms of others; I stand rooted in dignity and protect my peace.',
  };
  return affirmations[category.category_id] || 'I meet this moment with presence, honesty, and grounded courage.';
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});

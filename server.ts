import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { CANONICAL_CATEGORIES, KB_METADATA, getCategoryById } from './src/knowledgeBase/kbLoader';
import { evaluateSafetyUpstream } from './src/safety/safetyRouter';
import { retrieveGroundedGuidance } from './src/retrieval/retrievalEngine';
import { validateGrounding } from './src/validation/groundingValidator';
import { StructuredGroundingProbe } from './src/types';

/**
 * Inner Compass web server.
 *
 * Production responsibilities:
 * - serve the compiled web app;
 * - expose a non-sensitive health endpoint.
 *
 * Reflection classification, safety routing, retrieval, and guidance all run in
 * the browser. Production has no external decision or generation provider path and receives no reflection text.
 *
 * Development/test mode additionally exposes /api/eval/guidance so the local
 * deterministic regression harness can exercise the same classifier and safety code.
 */
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      app: 'Inner Compass Web',
      runtime: 'local-deterministic',
      categoriesLoaded: CANONICAL_CATEGORIES.length,
      externalDecisionProviders: 0,
      rawReflectionProductionTransport: false,
      privacyEnforced: true,
      preview: process.env.VITE_INNER_COMPASS_PREVIEW === 'true',
    });
  });

  app.get('/api/categories', (_req, res) => {
    res.json({ metadata: KB_METADATA, categories: CANONICAL_CATEGORIES });
  });

  app.get('/api/categories/:id', (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    const category = getCategoryById(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    return res.json(category);
  });

  if (!isProduction) {
    app.post('/api/eval/guidance', (req, res) => {
      const startedAt = Date.now();

      try {
        const problem =
          typeof req.body.problem === 'string' && req.body.problem.trim()
            ? req.body.problem.trim()
            : typeof req.body.problemText === 'string' && req.body.problemText.trim()
              ? req.body.problemText.trim()
              : typeof req.body.input === 'string' && req.body.input.trim()
                ? req.body.input.trim()
                : '';

        const preferredRoot = req.body.preferredRoot || null;
        const fixtureId = req.body.fixtureId || req.body.id || null;
        const expectedCategoryId =
          typeof req.body.expectedCategoryId === 'number'
            ? req.body.expectedCategoryId
            : typeof req.body.expected_category_id === 'number'
              ? req.body.expected_category_id
              : null;
        const probeOutput =
          req.body.groundingProbe &&
          typeof req.body.groundingProbe === 'object'
            ? (req.body.groundingProbe as StructuredGroundingProbe)
            : null;

        if (!problem) {
          return res.status(400).json({
            error: 'Input problem text is required for deterministic evaluation',
            latencyMs: Date.now() - startedAt,
          });
        }

        const safety = evaluateSafetyUpstream(problem);
        let route = 'WISDOM_GUIDANCE';
        if (safety.status === 'CRISIS_REDIRECT') route = 'CRISIS_REDIRECT';
        else if (safety.status === 'ABUSE_REDIRECT') route = 'ABUSE_REDIRECT';
        else if (safety.status === 'SUBSTANCE_HARD_CEILING') route = 'SUBSTANCE_HARD_CEILING';
        else if (safety.status === 'ESCALATION_REDIRECT') route = 'ESCALATION_REDIRECT';

        if (safety.blockedFromWisdomMatching) {
          const category = safety.suggestedCategoryId
            ? getCategoryById(safety.suggestedCategoryId)
            : null;
          return res.json({
            eval: {
              fixtureId,
              route,
              source: 'upstream_safety',
              groundingAccepted: true,
              predictedCategoryId: safety.suggestedCategoryId || null,
              predictedCategoryName: category?.category_name || null,
              expectedCategoryId,
              categoryMatch:
                expectedCategoryId !== null
                  ? safety.suggestedCategoryId === expectedCategoryId
                  : null,
              retrievalScore: 100,
              retrievalRawScore: 100,
              retrievalScoreMargin: null,
              retrievalNeedsClarification: false,
              retrievalClarificationQuestion: null,
              clarificationRequested: false,
              clarificationQuestion: null,
              safety,
              validatorResult: {
                isValid: true,
                rejectionReason: null,
                warnings: [],
                verifiedEntriesCount: 0,
              },
              selectedKbEntries: [],
              confidence: 100,
              latencyMs: Date.now() - startedAt,
              errors: [],
              consistencyHash: `${safety.suggestedCategoryId || 0}:${route}:1`,
            },
            safety,
            category,
            blockedFromWisdom: true,
          });
        }

        const retrieval = retrieveGroundedGuidance(
          problem,
          preferredRoot,
          safety.suggestedCategoryId
        );
        const category = retrieval.category;
        const grounding = validateGrounding(probeOutput, category);
        const selectedKbEntries =
          probeOutput?.selected_entry_ids || category.entries.map((entry) => entry.entry_id);

        return res.json({
          eval: {
            fixtureId,
            route,
            source: probeOutput ? 'deterministic_mock_validator' : 'deterministic_retrieval',
            groundingAccepted: grounding.isValid,
            predictedCategoryId: category.category_id,
            predictedCategoryName: category.category_name,
            expectedCategoryId,
            categoryMatch:
              expectedCategoryId !== null
                ? category.category_id === expectedCategoryId
                : null,
            retrievalScore: retrieval.score,
            retrievalRawScore: retrieval.rawScore ?? retrieval.score,
            retrievalScoreMargin: retrieval.scoreMargin ?? null,
            retrievalNeedsClarification: Boolean(retrieval.needsClarification),
            retrievalClarificationQuestion: retrieval.clarificationQuestion || null,
            clarificationRequested: Boolean(retrieval.needsClarification),
            clarificationQuestion: retrieval.clarificationQuestion || null,
            safety,
            validatorResult: {
              isValid: grounding.isValid,
              rejectionReason: grounding.rejectionReason || null,
              warnings: grounding.warnings || [],
              verifiedEntriesCount: grounding.verifiedEntries.length,
            },
            selectedKbEntries,
            confidence: retrieval.score,
            latencyMs: Date.now() - startedAt,
            errors: [],
            consistencyHash: `${category.category_id}:${route}:${grounding.isValid ? 1 : 0}`,
          },
          guidance: {
            category,
            safety,
            grounding,
            affirmation: category.synthesis_note,
            synthesis: category.synthesis_note,
            guidanceSource: 'canonical_deterministic',
          },
        });
      } catch (error: any) {
        return res.status(500).json({
          error: 'Deterministic evaluation failure',
          message: error?.message || String(error),
          latencyMs: Date.now() - startedAt,
        });
      }
    });
  }

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Inner Compass running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Fatal server startup error:', error);
  process.exit(1);
});

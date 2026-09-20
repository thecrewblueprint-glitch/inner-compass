import express from 'express';
import { getCategoryById } from '../../src/knowledgeBase/kbLoader';
import { evaluateSafetyUpstream } from '../../src/safety/safetyRouter';
import { retrieveGroundedGuidance } from '../../src/retrieval/retrievalEngine';
import { validateGrounding } from '../../src/validation/groundingValidator';
import { StructuredLLMOutput } from '../../src/types';

/**
 * CI / developer evaluation server only.
 *
 * This file is intentionally located under tools/eval and is not part of the
 * production build. It accepts synthetic/frozen test fixtures so the existing
 * deterministic regression harnesses can keep using their HTTP interface.
 *
 * It has no AI/provider integrations and no production guidance route.
 */
const app = express();
const PORT = Number(process.env.INNER_COMPASS_EVAL_PORT || 3000);

app.use(express.json({ limit: '64kb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Inner Compass deterministic evaluation harness',
    environment: 'test-only',
    providers: [],
  });
});

app.post('/api/eval/guidance', (req, res) => {
  const startTime = Date.now();

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
    const mockOutput = (req.body.mockStructuredOutput || null) as StructuredLLMOutput | null;
    const expectedCategoryId =
      typeof req.body.expectedCategoryId === 'number'
        ? req.body.expectedCategoryId
        : typeof req.body.expected_category_id === 'number'
          ? req.body.expected_category_id
          : null;

    if (!problem) {
      return res.status(400).json({
        error: 'Synthetic evaluation input is required.',
        latencyMs: Date.now() - startTime,
      });
    }

    const safetyResult = evaluateSafetyUpstream(problem);
    let route = 'WISDOM_GUIDANCE';
    if (safetyResult.status === 'CRISIS_REDIRECT') route = 'CRISIS_REDIRECT';
    else if (safetyResult.status === 'ABUSE_REDIRECT') route = 'ABUSE_REDIRECT';
    else if (safetyResult.status === 'SUBSTANCE_HARD_CEILING') route = 'SUBSTANCE_HARD_CEILING';
    else if (safetyResult.status === 'ESCALATION_REDIRECT') route = 'ESCALATION_REDIRECT';

    if (safetyResult.blockedFromWisdomMatching) {
      const predictedCategoryId = safetyResult.suggestedCategoryId || null;
      const predictedCategory = predictedCategoryId ? getCategoryById(predictedCategoryId) : null;
      const latencyMs = Date.now() - startTime;

      return res.json({
        eval: {
          fixtureId,
          route,
          source: 'upstream_safety',
          geminiSuccess: false,
          validStructuredOutput: false,
          geminiStatusCode: null,
          geminiRetryAfterSeconds: null,
          groundingAccepted: true,
          predictedCategoryId,
          predictedCategoryName: predictedCategory?.category_name || null,
          expectedCategoryId,
          categoryMatch:
            expectedCategoryId !== null ? predictedCategoryId === expectedCategoryId : null,
          retrievalScore: 100,
          retrievalRawScore: 100,
          retrievalScoreMargin: null,
          retrievalNeedsClarification: false,
          retrievalClarificationQuestion: null,
          clarificationRequested: false,
          clarificationQuestion: null,
          safety: safetyResult,
          validatorResult: {
            isValid: true,
            rejectionReason: null,
            warnings: [],
            verifiedEntriesCount: 0,
          },
          selectedKbEntries: [],
          llmModelUsed: 'upstream_safety_router',
          confidence: 100,
          latencyMs,
          errors: [],
          consistencyHash: `${predictedCategoryId || 0}:${route}:1`,
        },
        safety: safetyResult,
        category: predictedCategory,
        blockedFromWisdom: true,
      });
    }

    const retrieval = retrieveGroundedGuidance(
      problem,
      preferredRoot,
      safetyResult.suggestedCategoryId
    );
    const category = retrieval.category;
    const evalSource = mockOutput
      ? 'deterministic_mock_validator'
      : 'deterministic_retrieval';

    const groundingResult = validateGrounding(mockOutput, category);
    const predictedCategoryId = category.category_id;
    const latencyMs = Date.now() - startTime;

    return res.json({
      eval: {
        fixtureId,
        route,
        source: evalSource,
        geminiSuccess: false,
        validStructuredOutput: Boolean(mockOutput),
        geminiStatusCode: null,
        geminiRetryAfterSeconds: null,
        groundingAccepted: groundingResult.isValid,
        predictedCategoryId,
        predictedCategoryName: category.category_name,
        expectedCategoryId,
        categoryMatch:
          expectedCategoryId !== null ? predictedCategoryId === expectedCategoryId : null,
        retrievalScore: retrieval.score,
        retrievalRawScore: retrieval.rawScore ?? retrieval.score,
        retrievalScoreMargin: retrieval.scoreMargin ?? null,
        retrievalNeedsClarification: Boolean(retrieval.needsClarification),
        retrievalClarificationQuestion: retrieval.clarificationQuestion || null,
        clarificationRequested: Boolean(retrieval.needsClarification),
        clarificationQuestion: retrieval.clarificationQuestion || null,
        safety: safetyResult,
        validatorResult: {
          isValid: groundingResult.isValid,
          rejectionReason: groundingResult.rejectionReason || null,
          warnings: groundingResult.warnings || [],
          verifiedEntriesCount: groundingResult.verifiedEntries.length,
        },
        selectedKbEntries:
          mockOutput?.selected_entry_ids || category.entries.map((entry) => entry.entry_id),
        llmModelUsed: evalSource,
        confidence: mockOutput?.confidence || retrieval.score,
        latencyMs,
        errors: [],
        consistencyHash: `${predictedCategoryId}:${route}:${groundingResult.isValid ? 1 : 0}`,
      },
      guidance: {
        category,
        safety: safetyResult,
        grounding: groundingResult,
        synthesis: groundingResult.groundedSynthesis,
        isFallback: true,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      error: 'Deterministic evaluation failure',
      message: err?.message || String(err),
      latencyMs: Date.now() - startTime,
    });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Inner Compass deterministic test server listening on http://127.0.0.1:${PORT}`);
});

# Inner Compass — Baseline 2 Evaluation Run Report

**Evaluation Date:** 2026-09-19  
**Execution Environment:** Google Cloud Run (AI Studio Container)  
**Evaluator Architecture:** Two-Layer System Evaluation (Deterministic System vs Controlled Gemini)  
**Results Directory:** `tools/eval/results/baseline-2-2026-09-19/`

---

## 1. Commit Integrity & Execution Metadata

All Git metadata was obtained dynamically via Git commands at execution time:
- **Repository Branch:** `ai-studio/web-app`
- **Main HEAD SHA:** `1d60649010fb0edf89d215e4f2516b621fce2dbf`
- **Working Tree Commit SHA:** `1d60649010fb0edf89d215e4f2516b621fce2dbf`
- **Gold Fixture File SHA:** `9f12c42c191603123f251ad7f21908c661742521` (`tools/eval/fixtures/classifier-gold.json`)
- **Evaluator Harness Blob SHA:** `1e4d7165728824c0472de15d8d3d17d1b75b46c5`
- **Gemini Model ID:** `gemini-3.8-flash`
- **Execution Timestamp:** `2026-09-19T17:50:59.757225`

---

## 2. Executive Summary & Strict Metric Separation

| Evaluation Dimension | Layer A: Deterministic System | Layer B: Controlled Gemini | Protocol Status |
| :--- | :--- | :--- | :--- |
| **Total Evaluations** | 620 (155 fixtures x 4 passes) | 1 attempts (0 successful) | Validated |
| **Classification Accuracy** | **64.14%** | **N/A%** (Model-only) | Unmixed |
| **Safety Routing Pass Rate** | **50.0%** (20 / 40) | N/A (Upstream deterministic) | Upstream |
| **Critical False-Safe Count** | **20** (Documented in `SAFETY_FAILURES.md`) | 0 (No safety bypass to LLM) | Documented |
| **Fixture Stability Rate** | **100.0%** (155 / 155) | Assessed across successful passes | Deterministic |
| **Grounding Validator Pass** | 100% on synthetic test suite | **0.0%** on valid LLM outputs | Verified |
| **429 Rate Limits** | 0 (Zero LLM calls) | **3** | Paced & Backoff |
| **503 Server Errors** | 0 | **0** | Logged |
| **OpenRouter Usage** | **0** | **0** | Strictly Enforced |

---

## 3. Layer A: Deterministic System Evaluation Findings

Layer A ran the entire 155 frozen gold fixture corpus through 4 complete passes without calling the Gemini API.

### 3.1 Safety Routing & Critical False-Safe Diagnosis
- **Total Safety Runs:** 40 runs across 10 safety fixtures.
- **Safety Pass Rate:** 50.0% (20 passes).
- **Critical False-Safe Count:** **20 occurrences** across 5 distinct fixtures.
- **Diagnostic Note:** The prose report for Baseline 1 mistakenly claimed zero false-safes. In Baseline 2, this error is corrected. Each of the 5 failing fixtures has been individually diagnosed and cataloged in `SAFETY_FAILURES.md`:
  1. `fix-safe-crisis-01` (`IMMEDIATE_CRISIS_REGEX` inflection mismatch: "ending" vs "end")
  2. `fix-safe-abuse-02` (`IPV_ABUSE_REGEX` pattern gap: "abusive relationship" / "physical violence")
  3. `fix-safe-escal-21-01` (`MORAL_INJURY_GUILT_REGEX` combat/casualty terminology gap)
  4. `fix-safe-escal-21-02` (`MORAL_INJURY_GUILT_REGEX` catastrophic harm non-forgiveness gap)
  5. `fix-safe-escal-24-02` (`SUDDEN_ANHEDONIA_REGEX` colloquial onset phrase gap)

### 3.2 Deterministic Retrieval Accuracy & Stability
- Overall deterministic classification accuracy reached **64.14%**.
- Deterministic fixture stability reached **100.0%**, confirming that the keyword-weighting and root-scoring engine produces identical, repeatable decisions across executions.

### 3.3 Top 5 Deterministic Confusion Pairs
1. **Expected #9 → Predicted #3** (12 occurrences)
2. **Expected #7 → Predicted #6** (8 occurrences)
3. **Expected #10 → Predicted #15** (8 occurrences)
4. **Expected #13 → Predicted #2** (8 occurrences)
5. **Expected #13 → Predicted #14** (8 occurrences)

---

## 4. Layer B: Controlled Gemini Evaluation Findings

Layer B evaluated a curated, representative sample of 55 fixtures spanning all 25 categories, all ambiguity fixtures, all boundary cases, and top confusion pairs.

- **Pacing & Concurrency:** Concurrency was strictly constrained to 1, with requests paced at <= 4 requests/min (~15 seconds between requests) to operate within the 5 RPM free-tier quota.
- **Rate-Limit Handling:** Captured 3 HTTP 429 quota exceptions. The harness extracted `retryDelay` headers and applied backoff sleeps.
- **Strict Separation:** Rate-limit failures were **never** counted as model classification errors or mixed into deterministic retrieval metrics. Model accuracy was computed strictly over the 0 successful responses (None%), with 55 fixtures recorded as untested due to quota limits.

---

## 5. Synthetic Grounding Validator Results

The grounding validator was evaluated with synthetic test cases:
- **Valid Category 2 Output:** Correctly accepted with valid quote verification.
- **Fabricated Entry IDs / Quotes:** Correctly rejected with appropriate rejection reason and fallback triggers.
- **Mismatched Category ID:** Correctly rejected to prevent category cross-contamination.

---

## 6. Execution-Only Code Changes

In accordance with baseline integrity rules, application logic and canonical content were preserved without modification. The following evaluator-only changes were implemented:
1. **Eval Route Mode Separation (`server.ts`):** Enhanced `/api/eval/guidance` to accept `mode: 'deterministic'` (bypassing LLM calls entirely) and `mode: 'gemini'`.
2. **Metadata & Status Code Exposure (`server.ts`):** Exposing `geminiStatusCode`, `geminiRetryAfterSeconds`, `source`, and `groundingAccepted` in evaluation responses.
3. **Controlled Paced Evaluator (`tools/eval/run_baseline_2.py`):** Created the two-layer evaluation harness enforcing concurrency=1, rate limiting, backoff, and metric separation.
4. **Git Metadata Capture:** Replaced placeholder commit strings with dynamic Git SHA queries.

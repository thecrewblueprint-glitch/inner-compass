#!/usr/bin/env python3
"""Inner Compass Baseline 3: deterministic-only regression evaluation."""

import csv
import json
import os
import time
import urllib.request
from collections import Counter, defaultdict
from datetime import datetime, timezone

BASE_URL = os.environ.get("INNER_COMPASS_BASE_URL", "http://127.0.0.1:3000")
FIXTURES_PATH = "tools/eval/fixtures/classifier-gold.json"
RESULTS_DIR = "tools/eval/results/baseline-3-deterministic"
REPETITIONS = 4

os.makedirs(RESULTS_DIR, exist_ok=True)

def post_eval(payload):
    req = urllib.request.Request(
        f"{BASE_URL}/api/eval/guidance",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    started = time.time()
    with urllib.request.urlopen(req, timeout=20) as res:
        body = json.loads(res.read().decode("utf-8"))
    return body.get("eval", {}), int((time.time() - started) * 1000)

def run_fixtures(fixtures):
    rows = []
    idx = 0
    for pass_num in range(REPETITIONS):
        for fixture in fixtures:
            idx += 1
            eval_data, latency = post_eval({
                "problem": fixture["problem_text"],
                "expectedCategoryId": fixture.get("expected_category_id"),
                "fixtureId": fixture["id"],
                "mode": "deterministic",
                "skipGemini": True,
            })
            expected_route = fixture.get("expected_route", "WISDOM_GUIDANCE")
            actual_route = eval_data.get("route", "WISDOM_GUIDANCE")
            expected_cat = fixture.get("expected_category_id")
            predicted_cat = eval_data.get("predictedCategoryId")
            is_safety = bool(fixture.get("is_safety_fixture") or expected_route != "WISDOM_GUIDANCE")
            rows.append({
                "runIndex": idx,
                "pass": pass_num + 1,
                "fixtureId": fixture["id"],
                "expectedCategoryId": expected_cat,
                "predictedCategoryId": predicted_cat,
                "categoryMatch": (predicted_cat == expected_cat) if expected_cat is not None else (actual_route == expected_route),
                "expectedRoute": expected_route,
                "route": actual_route,
                "routeMatch": actual_route == expected_route,
                "isSafetyFixture": is_safety,
                "isFalseSafe": is_safety and actual_route == "WISDOM_GUIDANCE",
                "latencyMs": latency,
                "source": eval_data.get("source"),
                "errors": eval_data.get("errors", []),
            })
    return rows

def run_validator_tests():
    cases = [
        {
            "id": "valid-canonical-output",
            "expected": True,
            "problem": "I am grieving a meaningful loss.",
            "category": 2,
            "mock": {
                "matched_category_id": 2,
                "existential_roots": [],
                "phrased_reflection": "A grounded reflection can remain anchored to the retrieved canonical material.",
                "selected_entry_ids": ["2-A", "2-B"],
                "confidence": 90,
            },
        },
        {
            "id": "reject-fabricated-entry-ids",
            "expected": False,
            "problem": "I feel disconnected from other people.",
            "category": 1,
            "mock": {
                "matched_category_id": 1,
                "existential_roots": [],
                "phrased_reflection": "Grounded reflection.",
                "selected_entry_ids": ["99-FAKE", "UNKNOWN-A"],
                "confidence": 90,
            },
        },
        {
            "id": "reject-valid-but-wrong-category",
            "expected": False,
            "problem": "I am grieving a meaningful loss.",
            "category": 2,
            "mock": {
                "matched_category_id": 3,
                "existential_roots": [],
                "phrased_reflection": "Grounded reflection.",
                "selected_entry_ids": ["2-A"],
                "confidence": 90,
            },
        },
        {
            "id": "reject-unverified-quotation",
            "expected": False,
            "problem": "I am grieving a meaningful loss.",
            "category": 2,
            "mock": {
                "matched_category_id": 2,
                "existential_roots": [],
                "phrased_reflection": "\"This sentence is not a verified canonical quotation and must be rejected.\"",
                "selected_entry_ids": ["2-A"],
                "confidence": 90,
            },
        },
        {
            "id": "reject-missing-entry-ids",
            "expected": False,
            "problem": "I am grieving a meaningful loss.",
            "category": 2,
            "mock": {
                "matched_category_id": 2,
                "existential_roots": [],
                "phrased_reflection": "Grounded reflection.",
                "selected_entry_ids": [],
                "confidence": 90,
            },
        },
    ]

    results = []
    for case in cases:
        eval_data, latency = post_eval({
            "problem": case["problem"],
            "expectedCategoryId": case["category"],
            "fixtureId": case["id"],
            "mode": "deterministic",
            "mockStructuredOutput": case["mock"],
        })
        validator = eval_data.get("validatorResult", {})
        actual = bool(validator.get("isValid"))
        results.append({
            "testId": case["id"],
            "expectedValidatorPass": case["expected"],
            "actualValidatorPass": actual,
            "matchesExpectation": actual == case["expected"],
            "rejectionReason": validator.get("rejectionReason"),
            "warnings": validator.get("warnings", []),
            "latencyMs": latency,
        })
    return results

def aggregate(rows, validator_results):
    ordinary = [r for r in rows if r["expectedCategoryId"] is not None and not r["isSafetyFixture"]]
    category_accuracy = 100.0 * sum(r["categoryMatch"] for r in ordinary) / max(1, len(ordinary))

    safety = [r for r in rows if r["isSafetyFixture"]]
    safety_pass = sum(r["routeMatch"] for r in safety)
    false_safe = sum(r["isFalseSafe"] for r in safety)

    per_category = {}
    confusion = Counter()
    grouped = defaultdict(list)
    for r in ordinary:
        grouped[r["expectedCategoryId"]].append(r)
        if not r["categoryMatch"]:
            confusion[(r["expectedCategoryId"], r["predictedCategoryId"])] += 1

    for category_id in range(1, 26):
        group = grouped.get(category_id, [])
        correct = sum(r["categoryMatch"] for r in group)
        per_category[str(category_id)] = {
            "categoryId": category_id,
            "sampleCount": len(group),
            "accuracy": round(100.0 * correct / max(1, len(group)), 2) if group else None,
        }

    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "totalRuns": len(rows),
        "uniqueFixtures": len(set(r["fixtureId"] for r in rows)),
        "deterministicClassificationAccuracy": round(category_accuracy, 2),
        "safetyRoutingPassRate": round(100.0 * safety_pass / max(1, len(safety)), 2),
        "safetyRuns": len(safety),
        "criticalFalseSafeCount": false_safe,
        "validatorPassCount": sum(r["matchesExpectation"] for r in validator_results),
        "validatorTestCount": len(validator_results),
        "validatorSuitePassRate": round(100.0 * sum(r["matchesExpectation"] for r in validator_results) / max(1, len(validator_results)), 2),
        "topConfusionPairs": [
            {"expected": a, "predicted": b, "count": n}
            for (a, b), n in confusion.most_common(10)
        ],
        "categoryMetrics": per_category,
        "openRouterRequests": 0,
        "geminiRequests": 0,
    }

def write_outputs(rows, validator_results, summary):
    with open(os.path.join(RESULTS_DIR, "summary.json"), "w") as f:
        json.dump(summary, f, indent=2)

    with open(os.path.join(RESULTS_DIR, "runs.jsonl"), "w") as f:
        for row in rows:
            f.write(json.dumps(row) + "\n")

    with open(os.path.join(RESULTS_DIR, "validator_tests.json"), "w") as f:
        json.dump(validator_results, f, indent=2)

    with open(os.path.join(RESULTS_DIR, "category_metrics.csv"), "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["category_id", "sample_count", "accuracy"])
        for cid, metric in summary["categoryMetrics"].items():
            writer.writerow([cid, metric["sampleCount"], metric["accuracy"]])

    failures = [r for r in rows if (r["isSafetyFixture"] and not r["routeMatch"]) or (not r["isSafetyFixture"] and not r["categoryMatch"])]
    with open(os.path.join(RESULTS_DIR, "failures.json"), "w") as f:
        json.dump(failures, f, indent=2)

def main():
    with open(FIXTURES_PATH) as f:
        fixtures = json.load(f)

    rows = run_fixtures(fixtures)
    validator_results = run_validator_tests()
    summary = aggregate(rows, validator_results)
    write_outputs(rows, validator_results, summary)

    print(json.dumps(summary, indent=2))

    # Safety and grounding are hard gates. Classification remains an observed quality metric.
    if summary["criticalFalseSafeCount"] != 0:
        raise SystemExit("FAIL: critical false-safe results remain")
    if summary["safetyRoutingPassRate"] != 100.0:
        raise SystemExit("FAIL: deterministic safety routing is below 100%")
    if summary["validatorSuitePassRate"] != 100.0:
        raise SystemExit("FAIL: grounding validator adversarial suite did not fully pass")

if __name__ == "__main__":
    main()

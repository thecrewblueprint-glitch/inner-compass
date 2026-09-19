#!/usr/bin/env python3
"""Regression gate for deterministic clarification behavior."""

import json
import os
import urllib.request

BASE_URL = os.environ.get("INNER_COMPASS_BASE_URL", "http://127.0.0.1:3000")
FIXTURES_PATH = "tools/eval/fixtures/classifier-gold.json"

def post_eval(problem, fixture_id, expected_category_id=None):
    payload = {
        "problem": problem,
        "fixtureId": fixture_id,
        "mode": "deterministic",
        "skipGemini": True,
    }
    if expected_category_id is not None:
        payload["expectedCategoryId"] = expected_category_id

    req = urllib.request.Request(
        f"{BASE_URL}/api/eval/guidance",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=20) as res:
        return json.loads(res.read().decode("utf-8"))["eval"]

def main():
    with open(FIXTURES_PATH) as f:
        fixtures = json.load(f)

    ambiguity = [f for f in fixtures if f.get("expected_clarification")]
    if len(ambiguity) < 5:
        raise SystemExit("FAIL: expected at least five frozen ambiguity fixtures")

    failures = []

    for fixture in ambiguity:
        result = post_eval(
            fixture["problem_text"],
            fixture["id"],
            fixture.get("expected_category_id"),
        )
        if not result.get("clarificationRequested"):
            failures.append(
                f"{fixture['id']}: expected clarification, got none "
                f"(category={result.get('predictedCategoryId')}, margin={result.get('retrievalScoreMargin')})"
            )
        if not result.get("clarificationQuestion"):
            failures.append(f"{fixture['id']}: clarification question missing")

    clear_controls = [
        ("clear-isolation", "I feel deeply lonely and disconnected even when surrounded by friends and coworkers.", 1),
        ("clear-failure", "I am terrified of failing this project and looking incompetent in front of my peers.", 9),
        ("clear-anger", "I keep boiling with rage and resentment about what happened.", 4),
        ("clear-finance", "I am scared I will not be able to pay my rent and bills this month.", 19),
        ("clear-betrayal", "Someone I trusted lied to me and the broken trust is what hurts most.", 12),
    ]

    for fixture_id, problem, expected_category_id in clear_controls:
        result = post_eval(problem, fixture_id, expected_category_id)
        if result.get("clarificationRequested"):
            failures.append(
                f"{fixture_id}: clear control incorrectly requested clarification: "
                f"{result.get('clarificationQuestion')}"
            )
        if result.get("predictedCategoryId") != expected_category_id:
            failures.append(
                f"{fixture_id}: expected category {expected_category_id}, "
                f"got {result.get('predictedCategoryId')}"
            )

    if failures:
        print("\n".join(failures))
        raise SystemExit("FAIL: deterministic uncertainty gate regression")

    print(
        f"PASS: {len(ambiguity)} ambiguity fixtures request clarification and "
        f"{len(clear_controls)} clear controls proceed without clarification."
    )

if __name__ == "__main__":
    main()

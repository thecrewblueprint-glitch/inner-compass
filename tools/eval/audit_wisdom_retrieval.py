#!/usr/bin/env python3
"""Static regression audit for the deterministic reflection -> Wisdom -> source chain.

This deliberately uses repository data only. It makes no model/provider calls and
does not send reflection text off-device.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
KB_DIR = ROOT / "content" / "knowledge-base"
CORPUS = ROOT / "research" / "wisdom-corpus"
RESULTS = ROOT / "tools" / "eval" / "results" / "wisdom-retrieval"

APPROVED_AFFIRMATION_STATUSES = {"CATEGORY_VERIFIED", "APPROVED", "SOURCE_LINKED"}


def load_categories():
    categories = []
    for name in ("kb-01-05.json", "kb-06-10.json", "kb-11-15.json", "kb-16-20.json", "kb-21-25.json"):
        categories.extend(json.loads((KB_DIR / name).read_text()))
    return sorted(categories, key=lambda item: item["category_id"])


def main():
    categories = load_categories()
    library = json.loads((CORPUS / "library.json").read_text())["records"]
    affirmations = json.loads((CORPUS / "affirmation-candidates.json").read_text())["candidates"]

    record_by_id = {record["record_id"]: record for record in library}
    failures = []
    rows = []

    if [c["category_id"] for c in categories] != list(range(1, 26)):
        failures.append("Canonical taxonomy is not exactly categories 1..25.")

    for category in categories:
        cid = category["category_id"]
        approved = sorted(
            [
                item for item in affirmations
                if item["category_id"] == cid
                and item.get("review_status") in APPROVED_AFFIRMATION_STATUSES
            ],
            key=lambda item: (-item.get("category_fit_score", 0), item["affirmation_id"]),
        )
        passages = sorted(
            [record for record in library if cid in record.get("category_ids", [])],
            key=lambda record: (
                -int(record.get("record_type") == "VERIFIED_DIRECT_QUOTE"),
                -record.get("category_fit_score", 0),
                -record.get("source_confidence", 0),
                record["record_id"],
            ),
        )[:3]

        category_failures = []
        if cid != 10 and not approved:
            category_failures.append("no approved/category-verified affirmation")
        if not passages:
            category_failures.append("no Wisdom passage/source record")
        if len(category.get("entries", [])) != 3:
            category_failures.append("canonical guidance does not contain exactly 3 lenses")

        for passage in passages:
            if not passage.get("display_summary", "").strip():
                category_failures.append(f'{passage["record_id"]}: empty display summary')
            if not passage.get("source_urls"):
                category_failures.append(f'{passage["record_id"]}: no source URL')
            if passage.get("direct_quote_text_display_enabled") and passage.get("record_type") != "VERIFIED_DIRECT_QUOTE":
                category_failures.append(f'{passage["record_id"]}: passage display enabled on non-verified record')

        if approved:
            for source_id in approved[0].get("source_record_ids", []):
                if source_id not in record_by_id:
                    category_failures.append(f'affirmation source {source_id}: missing corpus record')
                elif cid not in record_by_id[source_id].get("category_ids", []) and cid not in record_by_id[source_id].get("related_category_ids", []):
                    category_failures.append(f'affirmation source {source_id}: not mapped to category')

        rows.append({
            "category_id": cid,
            "category_name": category["category_name"],
            "affirmation_id": approved[0]["affirmation_id"] if approved else None,
            "passage_record_ids": [p["record_id"] for p in passages],
            "guidance_lenses": len(category.get("entries", [])),
            "status": "FAIL" if category_failures else "PASS",
            "failures": category_failures,
        })
        failures.extend(f"Category {cid}: {failure}" for failure in category_failures)

    RESULTS.mkdir(parents=True, exist_ok=True)
    report = {
        "audit": "reflection-category-wisdom-source-chain",
        "deterministic_only": True,
        "category_count": len(categories),
        "passed_categories": sum(row["status"] == "PASS" for row in rows),
        "failed_categories": sum(row["status"] == "FAIL" for row in rows),
        "failure_count": len(failures),
        "failures": failures,
        "categories": rows,
    }
    (RESULTS / "report.json").write_text(json.dumps(report, indent=2) + "\n")
    correction_lines = ["# Wisdom Retrieval Correction Map", ""]
    if failures:
        correction_lines += [f"- {failure}" for failure in failures]
    else:
        correction_lines.append("No deterministic category → Wisdom → source integrity failures detected.")
    (RESULTS / "correction-map.md").write_text("\n".join(correction_lines) + "\n")

    print(json.dumps({k: report[k] for k in ("category_count", "passed_categories", "failed_categories", "failure_count")}, indent=2))
    if failures:
        for failure in failures:
            print("FAIL:", failure)
        raise SystemExit(1)


if __name__ == "__main__":
    main()

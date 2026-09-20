#!/usr/bin/env python3
"""Audit the static Suggested Reads directory and branch coverage."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DIR = ROOT / "research" / "reading-directory"

def load_json(name: str):
    return json.loads((DIR / name).read_text(encoding="utf-8"))

def fail(errors: list[str]) -> None:
    if errors:
        print("\n".join(f"FAIL: {error}" for error in errors))
        raise SystemExit(1)

def main() -> None:
    errors: list[str] = []
    readings = load_json("readings.json")["readings"]
    traditions = load_json("traditions.json")["traditions"]
    pathways = load_json("reading-pathways.json")["pathways"]
    categories = load_json("category-reading-map.json")["categories"]
    branch_map = load_json("branch-reading-map.json")["branches"]

    ids = [record["reading_id"] for record in readings]
    id_set = set(ids)
    if len(ids) != len(id_set):
        errors.append("duplicate reading_id values exist")

    expected_branches = {
        branch
        for tradition in traditions
        for branch in tradition.get("branches", [])
    }
    covered_branches: set[str] = set()

    for record in readings:
        rid = record["reading_id"]
        if record.get("resource_format") != "BOOK":
            errors.append(f"{rid}: Suggested Reads must be BOOK-only")
        coverage = record.get("branch_coverage") or []
        if not coverage:
            errors.append(f"{rid}: missing branch_coverage")
        covered_branches.update(coverage)
        if record.get("review_status") != "AUDITED":
            errors.append(f"{rid}: review_status must be AUDITED")
        resource_url = record.get("resource_url", "")
        cover_url = record.get("cover_image_url", "")
        if not resource_url.startswith("https://openlibrary.org/isbn/"):
            errors.append(f"{rid}: resource_url must be an Open Library ISBN record")
        if not cover_url.startswith("https://covers.openlibrary.org/b/isbn/"):
            errors.append(f"{rid}: cover_image_url must be an Open Library ISBN cover reference")
        if not record.get("cover_image_source"):
            errors.append(f"{rid}: missing cover image provenance")
        for cid in record.get("related_inner_compass_categories", []):
            if not isinstance(cid, int) or cid < 1 or cid > 25:
                errors.append(f"{rid}: invalid Inner Compass category {cid}")

    missing_branches = sorted(expected_branches - covered_branches)
    if missing_branches:
        errors.append("branches without a suggested book: " + ", ".join(missing_branches))

    jsonl_records = [
        json.loads(line)
        for line in (DIR / "readings.jsonl").read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    jsonl_ids = [record["reading_id"] for record in jsonl_records]
    if jsonl_ids != ids:
        errors.append("readings.jsonl is not an exact ordered mirror of readings.json")

    branch_rows = {row["branch"]: row for row in branch_map}
    if set(branch_rows) != expected_branches:
        errors.append("branch-reading-map.json does not exactly match traditions.json branches")
    for branch_name, row in branch_rows.items():
        refs = row.get("reading_ids", [])
        if not refs:
            errors.append(f"{branch_name}: branch map has no starter reading")
        for rid in refs:
            if rid not in id_set:
                errors.append(f"{branch_name}: unknown reading id {rid}")
            elif branch_name not in next(r for r in readings if r["reading_id"] == rid).get("branch_coverage", []):
                errors.append(f"{branch_name}: {rid} does not claim this branch")

    for pathway in pathways:
        for rid in pathway.get("reading_ids", []):
            if rid not in id_set:
                errors.append(f"{pathway['pathway_id']}: unknown reading id {rid}")

    expected_categories = {str(i) for i in range(1, 26)}
    if set(categories) != expected_categories:
        errors.append("category-reading-map.json must contain exactly categories 1-25")
    for cid, refs in categories.items():
        if not refs:
            errors.append(f"category {cid}: no suggested readings")
        for rid in refs:
            if rid not in id_set:
                errors.append(f"category {cid}: unknown reading id {rid}")

    fail(errors)
    print(
        f"PASS: {len(readings)} books, {len(expected_branches)} branches, "
        f"{len(pathways)} curated pathways, 25 category maps; all static references valid."
    )

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
import json, pathlib, collections, sys
root=pathlib.Path("research/wisdom-corpus")
sources=json.loads((root/"sources.json").read_text())["sources"]
records=[json.loads(x) for x in (root/"records.jsonl").read_text().splitlines() if x.strip()]
affs=json.loads((root/"affirmation-candidates.json").read_text())["candidates"]
source_ids={s["source_id"] for s in sources}
record_ids={r["record_id"] for r in records}
errors=[]
quote_texts=collections.defaultdict(list)
coverage=collections.Counter()
aff_cov=collections.Counter()
for r in records:
    for c in r.get("category_ids",[]): coverage[c]+=1
    if r["source_id"] not in source_ids: errors.append(f"missing source {r['source_id']} for {r['record_id']}")
    if r["record_type"]=="VERIFIED_DIRECT_QUOTE":
        for k in ("quote_text","translator","edition","book_chapter_section","bibliographic_citation"):
            if not r.get(k): errors.append(f"quote {r['record_id']} missing {k}")
        q=(r.get("quote_text") or "").strip().casefold()
        if q: quote_texts[q].append(r["record_id"])
for q,ids in quote_texts.items():
    if len(ids)>1: errors.append(f"duplicate quote wording: {ids}")
for a in affs:
    aff_cov[a["category_id"]]+=1
    for rid in a.get("source_record_ids",[]):
        if rid not in record_ids: errors.append(f"affirmation {a['affirmation_id']} missing record {rid}")
for c in range(1,26):
    if coverage[c] < 5: errors.append(f"category {c} has only {coverage[c]} records")
    if aff_cov[c] < 3: errors.append(f"category {c} has only {aff_cov[c]} affirmations")
print(json.dumps({"sources":len(sources),"records":len(records),"affirmations":len(affs),"coverage":dict(coverage),"affirmation_coverage":dict(aff_cov),"errors":errors},indent=2))
if errors: sys.exit(1)

#!/usr/bin/env python3
"""
Inner Compass Human-Like Flow Fuzz Harness

Generates thousands of deterministic, human-like test entries; exercises only
/api/eval/guidance with the deterministic local evaluation endpoint; records routing,
classification, clarification, safety, latency, errors, and correction signals.

External model cost: ZERO.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import html
import json
import math
import os
import random
import re
import time
import urllib.request
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Tuple

DEFAULT_BASE_URL = os.environ.get("INNER_COMPASS_BASE_URL", "http://127.0.0.1:3000")
DEFAULT_FIXTURES = "tools/eval/fixtures/classifier-gold.json"
DEFAULT_TARGET = 12000
DEFAULT_WORKERS = 20
DEFAULT_SEED = 20260919

SAFE_PREFIXES = [
    "", "Honestly, ", "This is hard to put into words, but ",
    "I don't really know how to explain it, but ", "For a while now, ",
    "Lately, ", "The main thing is that ", "What keeps bothering me is that ",
    "Maybe this sounds strange, but ", "I keep coming back to this: ",
]
SAFE_SUFFIXES = [
    "", " It's been sitting with me for a while.", " I keep thinking about it.",
    " I am trying to understand what is going on.", " I want to get clearer about it.",
    " It keeps coming back up for me.", " I am not sure how to make sense of it yet.",
]
STYLE_PROFILES = [
    "plain", "casual", "hesitant", "lowercase", "chat", "punctuation_light",
    "choppy", "rambling", "repetition", "context_first", "compressed", "self_correcting",
]
LOW_EVIDENCE_BASES = [
    "I don't really know what is wrong, I just feel off lately.",
    "Something feels wrong and I keep thinking about it.",
    "I need help sorting out what this is actually about.",
    "I am dealing with something difficult but I cannot name the main issue yet.",
    "A lot feels mixed together and I do not know what matters most.",
    "I am not sure what I am feeling or what the real problem is.",
    "Things have felt weird lately and I cannot tell why.",
    "I keep going in circles trying to explain what is bothering me.",
]
NEUTRAL_JOINERS = [
    " Also, ", " At the same time, ", " On top of that, ",
    " Another part of it is that ", " And there is something else too: ",
]


@dataclass
class Scenario:
    scenario_id: str
    population: str
    style_profile: str
    text: str
    expected_category_id: Optional[int]
    expected_route: str
    expected_clarification: Optional[bool]
    expectation_strength: str
    source_fixture_ids: List[str]
    seed_categories: List[int]


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--base-url", default=DEFAULT_BASE_URL)
    p.add_argument("--fixtures", default=DEFAULT_FIXTURES)
    p.add_argument("--target-scenarios", type=int, default=DEFAULT_TARGET)
    p.add_argument("--workers", type=int, default=DEFAULT_WORKERS)
    p.add_argument("--seed", type=int, default=DEFAULT_SEED)
    p.add_argument("--timeout", type=float, default=15.0)
    p.add_argument("--results-dir", default=None)
    p.add_argument("--fail-below-same-intent", type=float, default=90.0)
    p.add_argument("--fail-below-ambiguity-catch", type=float, default=90.0)
    p.add_argument("--fail-below-low-evidence-catch", type=float, default=95.0)
    p.add_argument("--no-fail-quality", action="store_true")
    return p.parse_args()


def load_fixtures(path):
    data = json.loads(Path(path).read_text())
    if not isinstance(data, list):
        raise ValueError("Fixture file must contain a JSON array.")
    return data


def stable_id(*parts):
    return hashlib.sha1("|".join(parts).encode("utf-8")).hexdigest()[:12]


def normalize_spaces(text):
    return re.sub(r"\s+", " ", text).strip()


def chatify(text):
    substitutions = [
        (r"\bI am\b", "im"), (r"\bI'm\b", "im"), (r"\bcannot\b", "cant"),
        (r"\bcan't\b", "cant"), (r"\bdo not\b", "dont"), (r"\bdon't\b", "dont"),
        (r"\bit's\b", "its"), (r"\bI've\b", "ive"), (r"\breally\b", "rly"),
    ]
    out = text
    for pattern, repl in substitutions:
        out = re.sub(pattern, repl, out, flags=re.IGNORECASE)
    return out


def apply_style(base, profile, rng):
    base = normalize_spaces(base).rstrip()
    prefix = rng.choice(SAFE_PREFIXES)
    suffix = rng.choice(SAFE_SUFFIXES)

    if profile == "plain":
        text = base
    elif profile == "casual":
        text = rng.choice(["Honestly, ", "So, ", "Basically, ", "I mean, "]) + base
    elif profile == "hesitant":
        text = rng.choice([
            "I am not sure how to say this, but ",
            "Maybe I am explaining this badly, but ",
            "This might sound odd, but ",
        ]) + base
    elif profile == "lowercase":
        text = (prefix + base + suffix).lower()
    elif profile == "chat":
        text = chatify(prefix + base + suffix).lower()
    elif profile == "punctuation_light":
        text = re.sub(r"[,.!?;:]", "", prefix + base + suffix)
    elif profile == "choppy":
        words = base.split()
        mid = max(2, len(words) // 2)
        text = " ".join(words[:mid]) + " ... " + " ".join(words[mid:])
    elif profile == "rambling":
        text = (
            rng.choice([
                "I have been trying to make sense of this and I keep circling back to it. ",
                "I keep turning it over in my head, and it comes back again. ",
                "There are a lot of little details, but the part that keeps standing out is this: ",
            ])
            + base
            + rng.choice([
                " I guess I am trying to understand what the main issue actually is.",
                " That is the part I cannot seem to shake.",
                " I keep ending up back at the same thought.",
            ])
        )
    elif profile == "repetition":
        text = base.rstrip(".!?") + ". I keep coming back to that same thing."
    elif profile == "context_first":
        text = rng.choice([
            "Nothing dramatic happened today, but this has been building for a while. ",
            "I can still get through normal routines, but this keeps taking up mental space. ",
            "From the outside things probably look normal, but internally this keeps bothering me. ",
        ]) + base
    elif profile == "compressed":
        text = re.sub(r"\b(I feel like|I feel|I am feeling)\b", "", base, flags=re.IGNORECASE)
    elif profile == "self_correcting":
        text = rng.choice([
            "At first I thought I could brush it off, but no—",
            "I keep trying to describe it, but the clearer way to say it is: ",
            "I was going to ignore it, but the clearer way to say it is: ",
        ]) + base
    else:
        text = prefix + base + suffix
    return normalize_spaces(text)


def safety_style(base, index):
    variants = [
        ("safety_plain", base),
        ("safety_lowercase", base.lower()),
        ("safety_no_punct", re.sub(r"[,.!?;:]", "", base)),
        ("safety_extra_space", re.sub(r"\s+", "  ", base).strip()),
    ]
    return variants[index % len(variants)]


def fixture_groups(fixtures):
    ordinary, ambiguity, safety = [], [], []
    for f in fixtures:
        route = f.get("expected_route", "WISDOM_GUIDANCE")
        category_id = f.get("expected_category_id")

        # Category 10 is intentionally a hard ceiling in the current product policy.
        # Older category fixtures may still label it WISDOM_GUIDANCE, so normalize
        # the harness expectation instead of misreporting correct safety routing.
        if category_id == 10:
            normalized = dict(f)
            normalized["expected_route"] = "SUBSTANCE_HARD_CEILING"
            normalized["is_safety_fixture"] = True
            safety.append(normalized)
        elif f.get("is_safety_fixture") or route != "WISDOM_GUIDANCE":
            safety.append(f)
        elif f.get("expected_clarification") or f.get("is_ambiguity_fixture"):
            ambiguity.append(f)
        elif isinstance(category_id, int):
            ordinary.append(f)
    return ordinary, ambiguity, safety


def allocations(target):
    out = {
        "same_intent": int(target * 0.70),
        "ambiguity": int(target * 0.10),
        "blended": int(target * 0.10),
        "low_evidence": int(target * 0.05),
    }
    out["safety"] = target - sum(out.values())
    return out


def build_scenarios(fixtures, target, seed):
    ordinary, ambiguity, safety = fixture_groups(fixtures)
    if not ordinary or not ambiguity or not safety:
        raise ValueError("Expected ordinary, ambiguity, and safety fixture groups.")
    counts = allocations(target)
    scenarios = []

    for i in range(counts["same_intent"]):
        f = ordinary[i % len(ordinary)]
        rng = random.Random(seed + i * 17 + f["expected_category_id"])
        profile = STYLE_PROFILES[(i // len(ordinary)) % len(STYLE_PROFILES)]
        text = apply_style(f["problem_text"], profile, rng)
        scenarios.append(Scenario(
            f"same-{f['id']}-{i:05d}-{stable_id(text)}", "same_intent", profile, text,
            f["expected_category_id"], "WISDOM_GUIDANCE", False, "hard",
            [f["id"]], [f["expected_category_id"]],
        ))

    for i in range(counts["ambiguity"]):
        f = ambiguity[i % len(ambiguity)]
        rng = random.Random(seed + 100000 + i * 19)
        profile = STYLE_PROFILES[(i // len(ambiguity)) % len(STYLE_PROFILES)]
        text = apply_style(f["problem_text"], profile, rng)
        cat = f.get("expected_category_id")
        scenarios.append(Scenario(
            f"amb-{f['id']}-{i:05d}-{stable_id(text)}", "ambiguity", profile, text,
            cat, "WISDOM_GUIDANCE", True, "hard", [f["id"]],
            [cat] if isinstance(cat, int) else [],
        ))

    by_cat = defaultdict(list)
    for f in ordinary:
        by_cat[f["expected_category_id"]].append(f)
    ids = sorted(by_cat)
    pairs = [(a, b) for pos, a in enumerate(ids) for b in ids[pos + 1:]]
    for i in range(counts["blended"]):
        a, b = pairs[i % len(pairs)]
        fa = by_cat[a][i % len(by_cat[a])]
        fb = by_cat[b][(i * 7) % len(by_cat[b])]
        rng = random.Random(seed + 200000 + i * 23)
        left = apply_style(fa["problem_text"], "compressed", rng).rstrip(".!?")
        right = apply_style(fb["problem_text"], "compressed", rng)
        joiner = NEUTRAL_JOINERS[(i // len(pairs)) % len(NEUTRAL_JOINERS)]
        text = normalize_spaces(left + "." + joiner + right)
        scenarios.append(Scenario(
            f"blend-{a:02d}-{b:02d}-{i:05d}-{stable_id(text)}", "blended",
            "multi_issue_blend", text, None, "WISDOM_GUIDANCE", True, "map_only",
            [fa["id"], fb["id"]], [a, b],
        ))

    for i in range(counts["low_evidence"]):
        base = LOW_EVIDENCE_BASES[i % len(LOW_EVIDENCE_BASES)]
        rng = random.Random(seed + 300000 + i * 29)
        profile = STYLE_PROFILES[(i // len(LOW_EVIDENCE_BASES)) % len(STYLE_PROFILES)]
        text = apply_style(base, profile, rng)
        scenarios.append(Scenario(
            f"low-{i:05d}-{stable_id(text)}", "low_evidence", profile, text,
            None, "WISDOM_GUIDANCE", True, "hard", [], [],
        ))

    for i in range(counts["safety"]):
        f = safety[i % len(safety)]
        profile, text = safety_style(f["problem_text"], i // len(safety))
        cat = f.get("expected_category_id")
        scenarios.append(Scenario(
            f"safety-{f['id']}-{i:05d}-{stable_id(text)}", "safety", profile, text,
            cat, f.get("expected_route", "WISDOM_GUIDANCE"), False, "hard",
            [f["id"]], [cat] if isinstance(cat, int) else [],
        ))

    random.Random(seed).shuffle(scenarios)
    return scenarios


def post_eval(base_url, scenario, timeout):
    payload = {
        "problem": scenario.text,
        "fixtureId": scenario.scenario_id,
        "mode": "deterministic",
        "skipexternal model": True,
    }
    if scenario.expected_category_id is not None:
        payload["expectedCategoryId"] = scenario.expected_category_id
    req = urllib.request.Request(
        base_url.rstrip("/") + "/api/eval/guidance",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    started = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as res:
            body = json.loads(res.read().decode("utf-8"))
        return {"ok": True, "body": body, "latencyMsClient": round((time.perf_counter()-started)*1000, 2)}
    except Exception as exc:
        return {
            "ok": False,
            "error": f"{type(exc).__name__}: {exc}",
            "latencyMsClient": round((time.perf_counter()-started)*1000, 2),
        }


def provider_violation(eval_data):
    source = str(eval_data.get("source", "")).lower()
    allowed = {
        "deterministic_retrieval",
        "deterministic_grounding_probe",
        "upstream_safety",
        "deterministic_fallback",
        "",
    }
    return source not in allowed


def flatten(s, response):
    row = {**asdict(s), "ok": response.get("ok", False), "latencyMsClient": response.get("latencyMsClient"), "error": response.get("error")}
    if not response.get("ok"):
        row.update({
            "actualRoute": None, "actualCategoryId": None, "actualCategoryName": None,
            "clarificationRequested": None, "clarificationQuestion": None,
            "retrievalScore": None, "retrievalRawScore": None, "retrievalScoreMargin": None,
            "source": None, "providerViolation": False,
            "serverErrors": [], "serverLatencyMs": None,
        })
        return row
    e = response.get("body", {}).get("eval", {})
    row.update({
        "actualRoute": e.get("route"),
        "actualCategoryId": e.get("predictedCategoryId"),
        "actualCategoryName": e.get("predictedCategoryName"),
        "clarificationRequested": bool(e.get("clarificationRequested")),
        "clarificationQuestion": e.get("clarificationQuestion"),
        "retrievalScore": e.get("retrievalScore"),
        "retrievalRawScore": e.get("retrievalRawScore"),
        "retrievalScoreMargin": e.get("retrievalScoreMargin"),
        "source": e.get("source"),
        "providerViolation": provider_violation(e),
        "serverErrors": e.get("errors") or [],
        "serverLatencyMs": e.get("latencyMs"),
    })
    return row


def correction_kind(row):
    if not row.get("ok"):
        return "request_error", "critical"
    if row.get("providerViolation"):
        return "external_provider_used", "critical"
    if row.get("serverErrors"):
        return "server_reported_error", "high"

    pop = row["population"]
    if pop == "safety":
        if row.get("actualRoute") == "WISDOM_GUIDANCE" and row["expected_route"] != "WISDOM_GUIDANCE":
            return "critical_false_safe", "critical"
        if row.get("actualRoute") != row["expected_route"]:
            return "safety_route_mismatch", "critical"
        return "pass", "none"

    if row.get("actualRoute") != "WISDOM_GUIDANCE":
        return "unexpected_safety_redirect", "high"

    clarified = bool(row.get("clarificationRequested"))
    if pop == "same_intent":
        if clarified:
            return "over_clarification", "medium"
        if row.get("actualCategoryId") != row.get("expected_category_id"):
            return "wrong_category", "high"
        return "pass", "none"
    if pop == "ambiguity":
        return ("pass", "none") if clarified else ("missed_clarification", "high")
    if pop == "low_evidence":
        return ("pass", "none") if clarified else ("low_evidence_overconfidence", "high")
    if pop == "blended":
        return ("pass", "none") if clarified else ("blend_overconfidence", "medium")
    return "pass", "none"


def correction_hint(row, kind):
    exp, act, margin = row.get("expected_category_id"), row.get("actualCategoryId"), row.get("retrievalScoreMargin")
    if kind == "wrong_category":
        if isinstance(margin, (int, float)) and margin <= 12:
            return f"Treat Category {exp} vs {act} as an ambiguity boundary or strengthen the intended discriminator."
        return f"Inspect weighting causing Category {act} to outrank expected Category {exp} under style {row.get('style_profile')}."
    if kind == "over_clarification":
        return f"Narrow ambiguity/tie logic for clear Category {exp} language under style {row.get('style_profile')}."
    if kind == "missed_clarification":
        return "Expand semantic ambiguity coverage for this frozen ambiguity pattern."
    if kind == "low_evidence_overconfidence":
        return "Require more category evidence before guidance."
    if kind == "blend_overconfidence":
        return f"Consider a multi-issue ambiguity rule for mixed categories {row.get('seed_categories')}."
    if kind == "critical_false_safe":
        return "CRITICAL: extend deterministic safety routing so this case cannot enter wisdom guidance."
    if kind == "safety_route_mismatch":
        return f"Correct safety route from {row.get('actualRoute')} to {row.get('expected_route')}."
    if kind == "unexpected_safety_redirect":
        return "Reduce safety false-positive matching for ordinary phrasing."
    if kind == "external_provider_used":
        return "CRITICAL: deterministic harness invoked an external provider."
    if kind in ("request_error", "server_reported_error"):
        return "Inspect server/runtime reliability before classifier tuning."
    return ""


def percentile(values, pct):
    vals = sorted(v for v in values if isinstance(v, (int, float)))
    if not vals:
        return None
    idx = (len(vals)-1) * pct
    lo, hi = math.floor(idx), math.ceil(idx)
    if lo == hi:
        return round(vals[lo], 2)
    frac = idx - lo
    return round(vals[lo]*(1-frac) + vals[hi]*frac, 2)


def compute_metrics(rows):
    for row in rows:
        kind, severity = correction_kind(row)
        row["correctionKind"] = kind
        row["severity"] = severity
        row["correctionHint"] = correction_hint(row, kind)

    by_pop = defaultdict(list)
    for row in rows:
        by_pop[row["population"]].append(row)

    def pct(num, den):
        return round(100.0*num/den, 2) if den else 0.0

    same, amb, low, blends, safety = (
        by_pop["same_intent"], by_pop["ambiguity"], by_pop["low_evidence"],
        by_pop["blended"], by_pop["safety"],
    )
    same_ok = sum(1 for r in same if r.get("ok") and r.get("actualRoute")=="WISDOM_GUIDANCE" and not r.get("clarificationRequested") and r.get("actualCategoryId")==r.get("expected_category_id"))
    amb_ok = sum(1 for r in amb if r.get("ok") and r.get("clarificationRequested"))
    low_ok = sum(1 for r in low if r.get("ok") and r.get("clarificationRequested"))
    blend_ok = sum(1 for r in blends if r.get("ok") and r.get("clarificationRequested"))
    safety_ok = sum(1 for r in safety if r.get("ok") and r.get("actualRoute")==r.get("expected_route"))

    correction_counts = Counter(r["correctionKind"] for r in rows)
    severity_counts = Counter(r["severity"] for r in rows)
    latencies = [r["latencyMsClient"] for r in rows if isinstance(r.get("latencyMsClient"), (int,float))]
    confusion = Counter(
        (r.get("expected_category_id"), r.get("actualCategoryId"))
        for r in same
        if r.get("actualCategoryId") is not None
        and r.get("expected_category_id") is not None
        and r.get("actualCategoryId") != r.get("expected_category_id")
        and not r.get("clarificationRequested")
    )

    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "totalScenarios": len(rows),
        "populationCounts": {k: len(v) for k,v in sorted(by_pop.items())},
        "sameIntentFlowAccuracy": pct(same_ok, len(same)),
        "ambiguityClarificationCatchRate": pct(amb_ok, len(amb)),
        "lowEvidenceClarificationCatchRate": pct(low_ok, len(low)),
        "blendClarificationRate": pct(blend_ok, len(blends)),
        "safetyRoutePassRate": pct(safety_ok, len(safety)),
        "criticalFalseSafeCount": correction_counts.get("critical_false_safe", 0),
        "unexpectedSafetyRedirectCount": correction_counts.get("unexpected_safety_redirect", 0),
        "providerViolationCount": correction_counts.get("external_provider_used", 0),
        "requestErrorCount": correction_counts.get("request_error", 0),
        "serverReportedErrorCount": correction_counts.get("server_reported_error", 0),
        "correctionCounts": dict(correction_counts),
        "severityCounts": dict(severity_counts),
        "latencyMs": {
            "p50": percentile(latencies, .50), "p95": percentile(latencies, .95),
            "p99": percentile(latencies, .99), "max": round(max(latencies),2) if latencies else None,
        },
        "topConfusionPairs": [
            {"expected": a, "predicted": b, "count": n}
            for (a,b), n in confusion.most_common(20)
        ],
        "externalProviderRequests": correction_counts.get("external_provider_used", 0),
    }


def group_metrics(rows, key):
    groups = defaultdict(list)
    for r in rows:
        groups[r.get(key)].append(r)
    out = []
    for group, items in sorted(groups.items(), key=lambda kv: str(kv[0])):
        out.append({
            key: group, "count": len(items),
            "passRate": round(100*sum(r["correctionKind"]=="pass" for r in items)/len(items),2),
            "clarificationRate": round(100*sum(bool(r.get("clarificationRequested")) for r in items)/len(items),2),
            "wrongCategoryCount": sum(r["correctionKind"]=="wrong_category" for r in items),
            "correctionCount": sum(r["correctionKind"]!="pass" for r in items),
            "errorCount": sum(not r.get("ok") for r in items),
        })
    return out


def write_csv(path, rows):
    if not rows:
        path.write_text("")
        return
    keys = sorted({k for r in rows for k in r.keys()})
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=keys, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            clean = {}
            for k in keys:
                v = r.get(k)
                clean[k] = json.dumps(v, ensure_ascii=False) if isinstance(v,(list,dict)) else v
            w.writerow(clean)


def route_matrix(rows):
    counts = Counter((r.get("expected_route"), r.get("actualRoute")) for r in rows)
    return [{"expectedRoute": e, "actualRoute": a, "count": n} for (e,a),n in sorted(counts.items(), key=lambda x:(-x[1],str(x[0])))]


def confusion_matrix(rows):
    counts = Counter()
    for r in rows:
        if r["population"] == "same_intent" and isinstance(r.get("expected_category_id"),int) and isinstance(r.get("actualCategoryId"),int):
            counts[(r["expected_category_id"],r["actualCategoryId"])] += 1
    return [{"expectedCategory":e,"predictedCategory":a,"count":n} for (e,a),n in sorted(counts.items())]


def flow_map(rows):
    safe_count = sum(r.get("actualRoute")=="WISDOM_GUIDANCE" for r in rows)
    redirect_count = len(rows)-safe_count
    clarify_count = sum(bool(r.get("clarificationRequested")) for r in rows)
    guidance_count = sum(r.get("ok") and r.get("actualRoute")=="WISDOM_GUIDANCE" and not r.get("clarificationRequested") for r in rows)
    kinds = Counter(r["correctionKind"] for r in rows if r["correctionKind"]!="pass")
    lines = [
        "flowchart TD",
        f'  I["Human-like input\\n{len(rows):,} scenarios"] --> S["Deterministic safety router"]',
        f'  S -->|"wisdom path {safe_count:,}"| C["Deterministic classifier"]',
        f'  S -->|"redirect {redirect_count:,}"| R["Safety route"]',
        f'  C -->|"clarify {clarify_count:,}"| Q["Clarification prompt"]',
        f'  C -->|"clear {guidance_count:,}"| G["Canonical guidance"]',
        '  Q -->|"user adds detail"| I',
    ]
    for idx,(kind,count) in enumerate(kinds.most_common(8),1):
        label = kind.replace("_"," ").title()
        lines.append(f'  C -. "{count:,}" .-> X{idx}["{label}"]')
    return "\n".join(lines)+"\n"


def correction_edges(rows):
    counts = Counter(
        (r.get("expected_category_id"), r.get("actualCategoryId"))
        for r in rows if r.get("correctionKind")=="wrong_category"
    )
    lines = ["flowchart LR"]
    if not counts:
        lines.append('  OK["No same-intent category confusion edges found"]')
    else:
        for idx,((exp,act),count) in enumerate(counts.most_common(20),1):
            lines.append(f'  E{idx}["Expected #{exp}"] -->|"{count}"| A{idx}["Predicted #{act}"]')
    return "\n".join(lines)+"\n"


def markdown_report(summary, rows, fmap, edges):
    kinds = Counter(r["correctionKind"] for r in rows if r["correctionKind"]!="pass")
    fence = chr(96)*3
    lines = [
        "# Inner Compass Human-Like Flow Correction Map","",
        f"- Scenarios: **{summary['totalScenarios']:,}**",
        f"- Same-intent flow accuracy: **{summary['sameIntentFlowAccuracy']}%**",
        f"- Ambiguity clarification catch: **{summary['ambiguityClarificationCatchRate']}%**",
        f"- Low-evidence clarification catch: **{summary['lowEvidenceClarificationCatchRate']}%**",
        f"- Multi-issue blend clarification: **{summary['blendClarificationRate']}%**",
        f"- Safety route pass: **{summary['safetyRoutePassRate']}%**",
        f"- Critical false-safes: **{summary['criticalFalseSafeCount']}**",
        f"- External provider violations: **{summary['providerViolationCount']}**","",
        "## Runtime flow","", fence+"mermaid", fmap.rstrip(), fence,"",
        "## Category correction edges","", fence+"mermaid", edges.rstrip(), fence,"",
        "## Most common correction signals","",
    ]
    if kinds:
        lines += [f"- **{kind}**: {count:,}" for kind,count in kinds.most_common(15)]
    else:
        lines.append("- No correction signals.")
    lines += [
        "", "## Interpretation","",
        "Same-intent variants are hard expectations: style should not change the intended category.",
        "Frozen ambiguity and low-evidence entries are hard clarification expectations.",
        "Multi-issue blends are map-only pressure tests: their clarification rate is diagnostic.",
        "Safety fixtures receive formatting-only perturbations and must preserve the expected deterministic route.",
        "",
    ]
    return "\n".join(lines)


def html_report(summary, rows):
    kinds = Counter(r["correctionKind"] for r in rows if r["correctionKind"]!="pass")
    table = "".join(f"<tr><td>{html.escape(k)}</td><td>{v}</td></tr>" for k,v in kinds.most_common(20)) or "<tr><td>none</td><td>0</td></tr>"
    return f"""<!doctype html><html><head><meta charset="utf-8"><title>Inner Compass Flow Report</title>
<style>body{{font-family:system-ui,sans-serif;max-width:1100px;margin:32px auto;padding:0 20px}}.cards{{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}}.card{{border:1px solid #bbb;border-radius:10px;padding:14px}}.big{{font-size:1.6rem;font-weight:700}}table{{border-collapse:collapse;width:100%;margin-top:18px}}th,td{{border:1px solid #ccc;padding:8px;text-align:left}}</style></head><body>
<h1>Inner Compass Human-Like Flow Report</h1><p>External model calls expected: <strong>zero</strong>.</p>
<div class="cards"><div class="card">Scenarios<div class="big">{summary['totalScenarios']:,}</div></div>
<div class="card">Same-intent<div class="big">{summary['sameIntentFlowAccuracy']}%</div></div>
<div class="card">Ambiguity catch<div class="big">{summary['ambiguityClarificationCatchRate']}%</div></div>
<div class="card">Low-evidence catch<div class="big">{summary['lowEvidenceClarificationCatchRate']}%</div></div>
<div class="card">Safety pass<div class="big">{summary['safetyRoutePassRate']}%</div></div>
<div class="card">False-safes<div class="big">{summary['criticalFalseSafeCount']}</div></div></div>
<h2>Correction signals</h2><table><tr><th>Signal</th><th>Count</th></tr>{table}</table></body></html>"""


def write_outputs(results_dir, scenarios, rows, summary):
    results_dir.mkdir(parents=True, exist_ok=True)
    (results_dir/"summary.json").write_text(json.dumps(summary,indent=2,ensure_ascii=False)+"\n")
    with (results_dir/"scenarios.jsonl").open("w",encoding="utf-8") as f:
        for s in scenarios:
            f.write(json.dumps(asdict(s),ensure_ascii=False)+"\n")
    with (results_dir/"raw_runs.jsonl").open("w",encoding="utf-8") as f:
        for row in rows:
            f.write(json.dumps(row,ensure_ascii=False)+"\n")
    corrections = [r for r in rows if r["correctionKind"]!="pass"]
    write_csv(results_dir/"flow_corrections.csv", corrections)
    write_csv(results_dir/"style_metrics.csv", group_metrics(rows,"style_profile"))
    write_csv(results_dir/"population_metrics.csv", group_metrics(rows,"population"))
    write_csv(results_dir/"route_matrix.csv", route_matrix(rows))
    write_csv(results_dir/"confusion_matrix.csv", confusion_matrix(rows))

    by_cat = defaultdict(list)
    for r in rows:
        if isinstance(r.get("expected_category_id"),int):
            by_cat[r["expected_category_id"]].append(r)
    cats = []
    for cat in range(1,26):
        items = by_cat.get(cat,[])
        if items:
            cats.append({
                "categoryId":cat, "count":len(items),
                "passRate":round(100*sum(r["correctionKind"]=="pass" for r in items)/len(items),2),
                "wrongCategoryCount":sum(r["correctionKind"]=="wrong_category" for r in items),
                "overClarificationCount":sum(r["correctionKind"]=="over_clarification" for r in items),
            })
    write_csv(results_dir/"category_metrics.csv",cats)

    fmap, edges = flow_map(rows), correction_edges(rows)
    (results_dir/"flow_correction_map.mmd").write_text(fmap)
    (results_dir/"category_correction_edges.mmd").write_text(edges)
    (results_dir/"FLOW_CORRECTION_MAP.md").write_text(markdown_report(summary,rows,fmap,edges))
    (results_dir/"report.html").write_text(html_report(summary,rows))


def run(args):
    fixtures = load_fixtures(args.fixtures)
    scenarios = build_scenarios(fixtures,args.target_scenarios,args.seed)
    results_dir = Path(args.results_dir) if args.results_dir else Path(
        "tools/eval/results/human-flow-" + datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    )
    print(f"Running {len(scenarios):,} scenarios with {args.workers} workers.")
    print("Provider policy: ZERO external model / ZERO external provider.")
    started = time.perf_counter()
    rows = [None]*len(scenarios)

    with ThreadPoolExecutor(max_workers=max(1,args.workers)) as pool:
        futures = {pool.submit(post_eval,args.base_url,s,args.timeout):i for i,s in enumerate(scenarios)}
        done = 0
        for fut in as_completed(futures):
            i = futures[fut]
            try:
                response = fut.result()
            except Exception as exc:
                response = {"ok":False,"error":f"worker exception: {type(exc).__name__}: {exc}","latencyMsClient":None}
            rows[i] = flatten(scenarios[i],response)
            done += 1
            if done % 1000 == 0 or done == len(scenarios):
                elapsed = max(.001,time.perf_counter()-started)
                print(f"  {done:,}/{len(scenarios):,} ({done/elapsed:.1f} scenarios/sec)")

    rows = [r for r in rows if r is not None]
    summary = compute_metrics(rows)
    summary.update({
        "seed":args.seed, "workers":args.workers, "fixtureFile":args.fixtures,
        "scenarioGeneration":"deterministic-template-perturbation",
        "providerPolicy":"deterministic-only; skipexternal model=true; no external provider path",
        "elapsedSeconds":round(time.perf_counter()-started,2),
    })
    write_outputs(results_dir,scenarios,rows,summary)
    print(json.dumps(summary,indent=2))
    print("Results:",results_dir)
    return summary


def enforce(summary,args):
    failures=[]
    if summary["criticalFalseSafeCount"] != 0:
        failures.append(f"critical false-safes={summary['criticalFalseSafeCount']}")
    if summary["safetyRoutePassRate"] != 100.0:
        failures.append(f"safety route pass={summary['safetyRoutePassRate']}%")
    if summary["providerViolationCount"] != 0:
        failures.append(f"external provider violations={summary['providerViolationCount']}")
    if summary["requestErrorCount"] or summary["serverReportedErrorCount"]:
        failures.append(f"runtime errors={summary['requestErrorCount']+summary['serverReportedErrorCount']}")
    if not args.no_fail_quality:
        if summary["sameIntentFlowAccuracy"] < args.fail_below_same_intent:
            failures.append(f"same-intent={summary['sameIntentFlowAccuracy']}% < {args.fail_below_same_intent}%")
        if summary["ambiguityClarificationCatchRate"] < args.fail_below_ambiguity_catch:
            failures.append(f"ambiguity catch={summary['ambiguityClarificationCatchRate']}% < {args.fail_below_ambiguity_catch}%")
        if summary["lowEvidenceClarificationCatchRate"] < args.fail_below_low_evidence_catch:
            failures.append(f"low-evidence catch={summary['lowEvidenceClarificationCatchRate']}% < {args.fail_below_low_evidence_catch}%")
    if failures:
        raise SystemExit("FAIL: "+"; ".join(failures))


def main():
    args=parse_args()
    if args.target_scenarios < 500:
        raise SystemExit("--target-scenarios must be at least 500")
    summary=run(args)
    enforce(summary,args)


if __name__=="__main__":
    main()

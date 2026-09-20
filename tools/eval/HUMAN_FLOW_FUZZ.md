# Human-Like Flow Fuzz Harness

Run a large, cost-free deterministic evaluation of Inner Compass:

    python3 tools/eval/human_flow_fuzz.py --target-scenarios 12000 --workers 20

The harness never calls an external model/provider. It sends every request to the local
`/api/eval/guidance` endpoint through the deterministic local evaluation endpoint.

## Populations

- **same_intent** — human-like style variations of frozen category fixtures; the category should remain stable.
- **ambiguity** — style variations of frozen ambiguity fixtures; clarification should be requested.
- **blended** — two-category human entries; clarification is preferred and mapped diagnostically.
- **low_evidence** — vague entries; clarification should be requested instead of forcing a category.
- **safety** — existing safety fixtures with formatting-only changes; the deterministic route must remain unchanged.

## Outputs

Each run writes:

- `summary.json`
- `scenarios.jsonl`
- `raw_runs.jsonl`
- `flow_corrections.csv`
- `category_metrics.csv`
- `style_metrics.csv`
- `population_metrics.csv`
- `route_matrix.csv`
- `confusion_matrix.csv`
- `flow_correction_map.mmd`
- `category_correction_edges.mmd`
- `FLOW_CORRECTION_MAP.md`
- `report.html`

The correction map distinguishes hard failures from diagnostic pressure tests.
Safety failures, provider use, and runtime errors are always hard failures.

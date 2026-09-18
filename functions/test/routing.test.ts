import assert from "node:assert/strict";
import test from "node:test";
import { decideRoute } from "../src/lib/routing.js";

test("hard safety signal overrides wisdom", () => {
  const route = decideRoute(
    {
      route_candidate: "wisdom",
      category_candidates: [{ category_id: 5, confidence: 0.99 }],
      signal_codes: ["ABUSE_BOUNDARY"]
    },
    ["NONE"]
  );

  assert.equal(route.kind, "safety_redirect");
});

test("ambiguous close candidates require clarification", () => {
  const route = decideRoute(
    {
      route_candidate: "wisdom",
      category_candidates: [
        { category_id: 13, confidence: 0.78 },
        { category_id: 14, confidence: 0.73 }
      ],
      signal_codes: ["NONE"]
    },
    ["NONE"]
  );

  assert.equal(route.kind, "needs_clarification");
});

test("clear candidate routes to wisdom", () => {
  const route = decideRoute(
    {
      route_candidate: "wisdom",
      category_candidates: [
        { category_id: 8, confidence: 0.91 },
        { category_id: 9, confidence: 0.55 }
      ],
      signal_codes: ["NONE"]
    },
    ["NONE"]
  );

  assert.deepEqual(route, { kind: "wisdom", categoryId: 8 });
});

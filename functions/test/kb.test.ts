import assert from "node:assert/strict";
import test from "node:test";
import { loadKnowledgeBase } from "../src/lib/kb.js";

test("generated KB contains canonical 25/75 baseline", () => {
  const kb = loadKnowledgeBase();

  assert.equal(kb.categories.length, 25);
  assert.equal(
    kb.categories.reduce((sum, category) => sum + category.entries.length, 0),
    75
  );
  assert.deepEqual(kb.index.hard_ceiling_categories, [10]);
  assert.deepEqual(kb.index.escalation_candidate_categories, [21, 24]);
});

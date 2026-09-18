import assert from "node:assert/strict";
import test from "node:test";
import { evaluateSafety } from "../src/lib/safetyPolicy.js";

test("ordinary dilemma remains available for reflective routing", () => {
  const result = evaluateSafety(
    "I feel stuck choosing between two career directions."
  );

  assert.equal(result.hardRedirect, false);
  assert.deepEqual(result.signalCodes, ["NONE"]);
});

test("immediate safety language redirects before wisdom", () => {
  const result = evaluateSafety("I am not safe right now.");

  assert.equal(result.hardRedirect, true);
  assert.ok(result.signalCodes.includes("OUT_OF_SCOPE_SAFETY"));
});

test("relationship safety boundary redirects before conflict material", () => {
  const result = evaluateSafety(
    "This is an unsafe relationship and I need perspective."
  );

  assert.equal(result.hardRedirect, true);
  assert.ok(result.signalCodes.includes("ABUSE_BOUNDARY"));
});

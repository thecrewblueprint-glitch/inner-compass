import fs from "node:fs";
import path from "node:path";
import { classifyProblem } from "../src/lib/classification.js";

type Fixture = {
  id: string;
  expected_category_id: number;
  text: string;
};

const apiKey = process.env.OPENROUTER_API_KEY?.trim();
const modelId = process.env.OPENROUTER_MODEL_ID?.trim();

if (!apiKey || !modelId) {
  console.error(
    "Classifier benchmark requires OPENROUTER_API_KEY and OPENROUTER_MODEL_ID."
  );
  process.exit(2);
}

const fixturePath = path.resolve(
  process.cwd(),
  "test/fixtures/classifier-gold.json"
);
const dataset = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as {
  version: string;
  target_top1_accuracy: number;
  fixtures: Fixture[];
};

let passed = 0;
const failures: Array<{
  id: string;
  expected: number;
  actual: number | null;
  route: string;
}> = [];

for (const fixture of dataset.fixtures) {
  const result = await classifyProblem({
    text: fixture.text,
    apiKey,
    modelId
  });

  const actual = result.category_candidates[0]?.category_id ?? null;
  const ok =
    actual === fixture.expected_category_id &&
    (result.route_candidate === "wisdom" ||
      result.route_candidate === "needs_clarification");

  if (ok) {
    passed += 1;
  } else {
    failures.push({
      id: fixture.id,
      expected: fixture.expected_category_id,
      actual,
      route: result.route_candidate
    });
  }
}

const accuracy = passed / dataset.fixtures.length;

console.log(
  JSON.stringify(
    {
      version: dataset.version,
      total: dataset.fixtures.length,
      passed,
      failed: failures.length,
      accuracy,
      target: dataset.target_top1_accuracy,
      failures
    },
    null,
    2
  )
);

if (accuracy < dataset.target_top1_accuracy) {
  process.exit(1);
}

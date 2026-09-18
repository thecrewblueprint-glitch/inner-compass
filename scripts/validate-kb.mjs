import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const PILLARS = new Set([
  "eastern_philosophy",
  "shadow_work",
  "psychology_methodology"
]);

export function validateKnowledgeBase(rootDir = process.cwd()) {
  const kbDir = path.join(rootDir, "content", "knowledge-base");
  const index = JSON.parse(
    fs.readFileSync(path.join(kbDir, "index.json"), "utf8")
  );

  const errors = [];
  const categories = [];

  for (const descriptor of index.files ?? []) {
    const filePath = path.join(kbDir, descriptor.file);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing KB file: ${descriptor.file}`);
      continue;
    }

    const chunk = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!Array.isArray(chunk)) {
      errors.push(`KB file is not an array: ${descriptor.file}`);
      continue;
    }

    categories.push(...chunk);
  }

  const categoryIds = new Set();
  const entryIds = new Set();
  let totalEntries = 0;

  for (const category of categories) {
    if (!Number.isInteger(category.category_id)) {
      errors.push("Category without integer category_id");
      continue;
    }

    if (categoryIds.has(category.category_id)) {
      errors.push(`Duplicate category_id: ${category.category_id}`);
    }
    categoryIds.add(category.category_id);

    if (!Array.isArray(category.entries) || category.entries.length !== 3) {
      errors.push(`Category ${category.category_id} must contain exactly 3 entries`);
      continue;
    }

    const categoryPillars = new Set();

    for (const entry of category.entries) {
      totalEntries += 1;

      if (!entry.entry_id || entryIds.has(entry.entry_id)) {
        errors.push(`Duplicate or missing entry_id: ${entry.entry_id}`);
      }
      entryIds.add(entry.entry_id);

      if (!PILLARS.has(entry.pillar)) {
        errors.push(`Invalid pillar at ${entry.entry_id}`);
      }
      categoryPillars.add(entry.pillar);

      if (
        !Array.isArray(entry.citation_urls) ||
        entry.citation_urls.length === 0 ||
        entry.citation_urls.some(
          (url) => typeof url !== "string" || !/^https?:\/\//.test(url)
        )
      ) {
        errors.push(`Invalid citation_urls at ${entry.entry_id}`);
      }

      if (!["sourced", "extrapolated"].includes(entry.confidence)) {
        errors.push(`Invalid confidence at ${entry.entry_id}`);
      }

      if (entry.confidence === "extrapolated" && !entry.confidence_note) {
        errors.push(`Missing confidence_note at ${entry.entry_id}`);
      }

      if (
        entry.verified_quote !== null &&
        typeof entry.verified_quote !== "string"
      ) {
        errors.push(`verified_quote must be string|null at ${entry.entry_id}`);
      }

      if (
        entry.practice_or_technique !== null &&
        typeof entry.practice_or_technique !== "string"
      ) {
        errors.push(
          `practice_or_technique must be string|null at ${entry.entry_id}`
        );
      }
    }

    if (categoryPillars.size !== 3) {
      errors.push(`Category ${category.category_id} is missing a pillar`);
    }
  }

  if (categories.length !== 25 || index.category_count !== 25) {
    errors.push(
      `Expected 25 categories; loaded ${categories.length}, index says ${index.category_count}`
    );
  }

  if (totalEntries !== 75 || index.total_entries !== 75) {
    errors.push(
      `Expected 75 entries; loaded ${totalEntries}, index says ${index.total_entries}`
    );
  }

  const expectedIds = Array.from({ length: 25 }, (_, i) => i + 1);
  for (const id of expectedIds) {
    if (!categoryIds.has(id)) errors.push(`Missing category_id: ${id}`);
  }

  if (
    JSON.stringify(index.hard_ceiling_categories) !== JSON.stringify([10])
  ) {
    errors.push("Hard-ceiling index invariant changed");
  }

  if (
    JSON.stringify(index.escalation_candidate_categories) !==
    JSON.stringify([21, 24])
  ) {
    errors.push("Escalation-candidate index invariant changed");
  }

  return {
    ok: errors.length === 0,
    errors,
    categoryCount: categories.length,
    entryCount: totalEntries
  };
}

const invokedPath = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : "";

if (import.meta.url === invokedPath) {
  const rootDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    ".."
  );
  const result = validateKnowledgeBase(rootDir);

  if (!result.ok) {
    console.error(result.errors.join("\n"));
    process.exit(1);
  }

  console.log(
    `KB validation passed: ${result.categoryCount} categories / ${result.entryCount} entries`
  );
}

import fs from "node:fs";
import path from "node:path";
import type { Category, KBIndex, Pillar } from "./types.js";

const KB_DIR = path.resolve(__dirname, "../../generated/kb");

let cached:
  | { index: KBIndex; categories: Category[]; byId: Map<number, Category> }
  | undefined;

const pillars: Pillar[] = [
  "eastern_philosophy",
  "shadow_work",
  "psychology_methodology"
];

function readJson<T>(filename: string): T {
  const fullPath = path.join(KB_DIR, filename);
  return JSON.parse(fs.readFileSync(fullPath, "utf8")) as T;
}

export function loadKnowledgeBase() {
  if (cached) return cached;

  const index = readJson<KBIndex>("index.json");
  const categories = index.files.flatMap(({ file }) =>
    readJson<Category[]>(file)
  );

  if (index.category_count !== 25 || categories.length !== 25) {
    throw new Error("KB_CATEGORY_COUNT_INVALID");
  }

  const entries = categories.flatMap((category) => category.entries);
  if (index.total_entries !== 75 || entries.length !== 75) {
    throw new Error("KB_ENTRY_COUNT_INVALID");
  }

  const categoryIds = new Set<number>();
  const entryIds = new Set<string>();

  for (const category of categories) {
    if (categoryIds.has(category.category_id)) {
      throw new Error("KB_DUPLICATE_CATEGORY_ID");
    }
    categoryIds.add(category.category_id);

    const presentPillars = new Set(category.entries.map((entry) => entry.pillar));
    if (presentPillars.size !== 3 || pillars.some((p) => !presentPillars.has(p))) {
      throw new Error(`KB_PILLAR_INVARIANT_${category.category_id}`);
    }

    for (const entry of category.entries) {
      if (entryIds.has(entry.entry_id)) {
        throw new Error("KB_DUPLICATE_ENTRY_ID");
      }
      entryIds.add(entry.entry_id);

      if (!entry.citation_urls.length) {
        throw new Error(`KB_MISSING_CITATION_${entry.entry_id}`);
      }

      if (entry.confidence === "extrapolated" && !entry.confidence_note) {
        throw new Error(`KB_EXTRAPOLATED_WITHOUT_NOTE_${entry.entry_id}`);
      }

      if (!pillars.includes(entry.pillar)) {
        throw new Error(`KB_INVALID_PILLAR_${entry.entry_id}`);
      }
    }
  }

  cached = {
    index,
    categories,
    byId: new Map(categories.map((category) => [category.category_id, category]))
  };

  return cached;
}

export function getCategory(categoryId: number): Category | null {
  return loadKnowledgeBase().byId.get(categoryId) ?? null;
}

export function getClassifierCatalog() {
  return loadKnowledgeBase().categories.map((category) => ({
    category_id: category.category_id,
    category_name: category.category_name,
    existential_roots: category.existential_roots
  }));
}

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateKnowledgeBase } from "./validate-kb.mjs";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

const result = validateKnowledgeBase(rootDir);
if (!result.ok) {
  console.error(result.errors.join("\n"));
  process.exit(1);
}

const sourceDir = path.join(rootDir, "content", "knowledge-base");
const targetDir = path.join(rootDir, "functions", "generated", "kb");
const index = JSON.parse(
  fs.readFileSync(path.join(sourceDir, "index.json"), "utf8")
);

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });

const files = ["index.json", ...index.files.map((entry) => entry.file)];
const manifest = {
  schema_version: index.schema_version,
  generated_at: null,
  files: {}
};

for (const filename of files) {
  const bytes = fs.readFileSync(path.join(sourceDir, filename));
  fs.writeFileSync(path.join(targetDir, filename), bytes);

  manifest.files[filename] = crypto
    .createHash("sha256")
    .update(bytes)
    .digest("hex");
}

fs.writeFileSync(
  path.join(targetDir, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
  "utf8"
);

console.log(
  `Prepared deterministic Functions KB copy: ${files.length} source files`
);

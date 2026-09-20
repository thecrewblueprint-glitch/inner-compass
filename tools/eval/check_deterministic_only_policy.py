#!/usr/bin/env python3
"""Fail CI if model/provider execution is introduced into Inner Compass."""

import json
import re
from pathlib import Path

SELF = Path("tools/eval/check_deterministic_only_policy.py")

package = json.loads(Path("package.json").read_text())
deps = {**package.get("dependencies", {}), **package.get("devDependencies", {})}

forbidden_dependency_names = {
    "@google/genai",
    "@anthropic-ai/sdk",
    "openai",
    "ai",
}
for name in deps:
    if name in forbidden_dependency_names or name.startswith("@ai-sdk/"):
        raise AssertionError(f"External generation dependency is forbidden: {name}")

runtime_files = [
    Path("server.ts"),
    Path(".env.example"),
    Path("metadata.json"),
    *Path("src").rglob("*.ts"),
    *Path("src").rglob("*.tsx"),
    *Path("tools/eval").glob("*.py"),
]
runtime_files = [p for p in runtime_files if p != SELF]

forbidden_patterns = [
    r"openrouter",
    r"gemini",
    r"@google/genai",
    r"google\s*genai",
    r"generativelanguage\.googleapis\.com",
    r"openai_api_key",
    r"anthropic_api_key",
    r"gemini_api_key",
    r"openrouter_api_key",
    r"chat/completions",
    r"generatecontent",
]
for path in runtime_files:
    text = path.read_text(errors="ignore").lower()
    for pattern in forbidden_patterns:
        if re.search(pattern, text):
            raise AssertionError(f"Forbidden model/provider path found in {path}: {pattern}")

env_text = Path(".env.example").read_text()
if re.search(r"(OPENAI|OPENROUTER|GEMINI|ANTHROPIC|GOOGLE).*KEY", env_text, re.I):
    raise AssertionError("Provider credential configuration is forbidden in .env.example")

metadata = json.loads(Path("metadata.json").read_text())
if metadata.get("majorCapabilities"):
    raise AssertionError("metadata.json must not declare external model/provider capabilities")

server = Path("server.ts").read_text()
app = Path("src/App.tsx").read_text()

assert "externalDecisionProviders: 0" in server, "Health endpoint must declare zero external decision providers"
assert "runtime: 'local-deterministic'" in server, "Server runtime must remain local-deterministic"
assert "fetch('/api/guidance'" not in app and 'fetch("/api/guidance"' not in app, "Raw reflection server transport reintroduced"
assert "retrieveGroundedGuidance" in app, "Local deterministic retrieval missing"
assert "evaluateSafetyUpstream" in app, "Local deterministic safety routing missing"
assert "blockedFromWisdomMatching" in app, "Client no longer respects deterministic safety blocking"

for obsolete in (
    Path("docs/IMPLEMENTATION_PACKET.md"),
    Path("docs/AI_STUDIO_KICKOFF.md"),
    Path("tools/eval/run_baseline_2.py"),
    Path("tools/eval/evaluate_web_app.py"),
):
    assert not obsolete.exists(), f"Obsolete provider-capable artifact must remain removed: {obsolete}"

print("PASS: Inner Compass is deterministic-only with no model/provider execution path.")

#!/usr/bin/env python3
import json
from pathlib import Path

server = Path("server.ts").read_text()
app = Path("src/App.tsx").read_text()
package = json.loads(Path("package.json").read_text())
env_example = Path(".env.example").read_text()
gitignore = Path(".gitignore").read_text()

deps = {**package.get("dependencies", {}), **package.get("devDependencies", {})}

for forbidden in ("@google/genai",):
    assert forbidden not in deps, f"Runtime AI dependency reintroduced: {forbidden}"

for forbidden in ("OPENROUTER", "GEMINI_API_KEY", "openrouter.ai", "GoogleGenAI", "generateContent", "callStructuredPhrasing"):
    assert forbidden not in server, f"Runtime AI/provider code reintroduced in server: {forbidden}"
    assert forbidden not in env_example, f"Provider credential/config reintroduced: {forbidden}"

assert "fetch('/api/guidance'" not in app and 'fetch("/api/guidance"' not in app, "Raw reflection server transport reintroduced"
assert "retrieveGroundedGuidance" in app, "Local deterministic retrieval missing"
assert "evaluateSafetyUpstream" in app, "Local deterministic safety routing missing"
assert "blockedFromWisdomMatching" in app, "Client no longer respects deterministic safety blocking"
assert "|| true" not in app, "Forced preview mode reintroduced"
assert ".env" in gitignore, "Local environment files are not ignored"

print("PASS: production runtime is local-deterministic and contains no AI provider path.")

#!/usr/bin/env python3
from pathlib import Path

openrouter = Path("server/openrouter.ts").read_text()
server = Path("server.ts").read_text()
app = Path("src/App.tsx").read_text()
gitignore = Path(".gitignore").read_text()

assert "OPENROUTER_FREE_MODEL = 'openrouter/free'" in openrouter, "Production model is not locked to openrouter/free"
assert "google/gemini-2.0-flash-001" not in openrouter, "Paid/explicit Gemini OpenRouter model reintroduced"
assert "model: OPENROUTER_FREE_MODEL" in openrouter, "OpenRouter request is not using the free-only model constant"

guidance_start = server.index("// Primary Guidance Endpoint")
eval_start = server.index("TEST-ONLY EVALUATION ENDPOINT")
guidance = server[guidance_start:eval_start]

assert "callStructuredPhrasing" in guidance, "Production guidance no longer uses the guarded OpenRouter phrasing adapter"
assert "getGeminiClient()" not in guidance, "Production Gemini fallback reintroduced"
assert "openrouter_free" in guidance, "Production AI mode is not explicitly free-only"
assert "|| true" not in app, "Forced preview mode reintroduced"
assert "blockedFromWisdomMatching" in app, "Client fallback no longer respects deterministic safety blocking"
assert ".env" in gitignore, "Local environment files are not ignored"

print("PASS: production AI policy is deterministic-first, fail-closed, and OpenRouter-free-only.")

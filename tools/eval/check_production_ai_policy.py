#!/usr/bin/env python3
"""Fail closed if production reintroduces reflection networking or AI providers."""

import json
from pathlib import Path

ROOT = Path(".")
SRC = ROOT / "src"
PACKAGE = json.loads((ROOT / "package.json").read_text())
ENV_EXAMPLE = (ROOT / ".env.example").read_text()

FORBIDDEN_DEPENDENCIES = {
    "@google/genai",
    "openai",
    "@anthropic-ai/sdk",
}

deps = PACKAGE.get("dependencies", {})
for name in FORBIDDEN_DEPENDENCIES:
    assert name not in deps, f"Forbidden production AI dependency present: {name}"

assert not (ROOT / "server.ts").exists(), "Production server.ts must not exist"
assert not (ROOT / "server" / "openrouter.ts").exists(), "OpenRouter runtime adapter must not exist"

build_script = PACKAGE.get("scripts", {}).get("build", "")
assert build_script.strip() == "vite build", "Production build must remain static Vite only"

provider_tokens = (
    "OPENROUTER_API_KEY",
    "GEMINI_API_KEY",
    "INNER_COMPASS_AI_MODE",
    "openrouter.ai",
    "@google/genai",
)
for token in provider_tokens:
    assert token not in ENV_EXAMPLE, f"Provider configuration reintroduced in .env.example: {token}"

production_source = ""
for path in sorted(SRC.rglob("*")):
    if path.suffix in {".ts", ".tsx", ".js", ".jsx"} and path.is_file():
        production_source += f"\n// FILE: {path}\n" + path.read_text(errors="ignore")

for token in (
    "/api/guidance",
    "/api/eval/guidance",
    "OPENROUTER_API_KEY",
    "GEMINI_API_KEY",
    "openrouter.ai",
    "@google/genai",
):
    assert token not in production_source, f"Forbidden production provider/API token found: {token}"

# v1 is intentionally network-free inside application source. Static assets are
# delivered by the host; reflection logic must not originate network requests.
assert "fetch(" not in production_source, "Production src/ contains fetch(); local-only invariant violated"
assert "XMLHttpRequest" not in production_source, "Production src/ contains XMLHttpRequest"
assert "navigator.sendBeacon" not in production_source, "Production src/ contains sendBeacon"
assert "new WebSocket" not in production_source, "Production src/ contains WebSocket"

app = (SRC / "App.tsx").read_text()
assert "evaluateSafetyUpstream(problemText)" in app, "Local deterministic safety routing missing"
assert "retrieveGroundedGuidance(" in app, "Local deterministic classification/retrieval missing"
assert "LAUNCH_ATTESTATION_KEY" in app, "Adult/U.S. launch gate not wired into app"
assert "About & Privacy" in app, "Privacy surface not present in app navigation"

print("PASS: production is static, deterministic, provider-free, and raw-reflection network-free.")

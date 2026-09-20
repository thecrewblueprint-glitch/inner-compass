#!/usr/bin/env python3
"""Static production-readiness contract audit for Inner Compass."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

REQUIRED_FILES = [
    "docs/legal/TERMS_OF_USE.md",
    "docs/legal/PRIVACY_NOTICE.md",
    "docs/legal/CONSUMER_HEALTH_DATA_PRIVACY_POLICY.md",
    "docs/legal/SAFETY_CRISIS_NOTICE.md",
    "docs/legal/ACCESSIBILITY_STATEMENT.md",
    "docs/legal/LEGAL_PAGE_AUDIT_2026-09-20.md",
    "src/screens/LegalScreen.tsx",
    "src/screens/DiagnosticsScreen.tsx",
    "src/debug/debugStore.ts",
    "src/components/AppErrorBoundary.tsx",
]

def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")

def main() -> None:
    errors: list[str] = []

    for path in REQUIRED_FILES:
        if not (ROOT / path).exists():
            errors.append(f"missing required release artifact: {path}")

    legal = read("src/screens/LegalScreen.tsx")
    for phrase in [
        "Terms of Use",
        "Privacy Notice",
        "Consumer Health Data Privacy Policy",
        "Safety & Crisis Notice",
        "Accessibility Statement",
        "English only",
    ]:
        if phrase not in legal:
            errors.append(f"LegalScreen missing required disclosure: {phrase}")

    home = read("src/screens/HomeScreen.tsx").lower()
    if "clinical wisdom" in home or "clinical-wisdom" in home:
        errors.append("consumer HomeScreen still uses prohibited clinical-wisdom branding")
    for phrase in ["18+", "united states", "english only", "general-wellness"]:
        if phrase not in home:
            errors.append(f"HomeScreen missing persistent launch disclosure: {phrase}")

    gate = read("src/components/LaunchGate.tsx")
    if "Review Terms, Privacy & Safety Notices" not in gate:
        errors.append("launch gate does not expose legal notices before acceptance")
    if "English only" not in gate:
        errors.append("launch gate does not disclose English-only scope")

    app = read("src/App.tsx")
    for phrase in ["Legal & Safety", "Lifelines", "Local Diagnostics"]:
        if phrase not in app:
            errors.append(f"App missing release surface: {phrase}")

    debug = read("src/debug/debugStore.ts")
    if "fetch(" in debug or "XMLHttpRequest" in debug or "sendBeacon" in debug:
        errors.append("local diagnostics contains remote transport")
    for sensitive_key in ["problemText:", "reflectionText:", "messageText:", "contentText:"]:
        if sensitive_key in debug:
            errors.append(f"debug store contains prohibited raw-text field: {sensitive_key}")
    if "MAX_EVENTS = 300" not in debug:
        errors.append("debug store is not explicitly bounded")

    safety = read("src/safety/safetyRouter.ts")
    if "SAFETY_REVIEW_REDIRECT" not in safety:
        errors.append("precautionary safety-review route is missing")
    if "blockedFromWisdomMatching: true" not in safety:
        errors.append("safety router does not visibly enforce wisdom blocking")
    if "normalizeSafetyText" not in safety:
        errors.append("safety input normalization is missing")

    health_policy = read("docs/legal/CONSUMER_HEALTH_DATA_PRIVACY_POLICY.md")
    if "RCW 19.373.020" not in health_policy:
        errors.append("consumer health data policy is missing its Washington legal source")

    if errors:
        for error in errors:
            print(f"FAIL: {error}")
        raise SystemExit(1)

    print("PASS: release surfaces, safety contract, local-only diagnostics, and legal artifacts are present and internally consistent.")

if __name__ == "__main__":
    main()

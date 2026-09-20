# Inner Compass Roadmap

## Foundation - complete

- 25-category reflection taxonomy
- four existential-root model
- three canonical content pillars per category
- 75-entry canonical production knowledge base
- deterministic safety/scope routing
- deterministic classification and uncertainty gate
- deterministic grounding validation
- journal/bookmark flow with no raw reflection persistence
- taxonomy browser and static support-resource surface

## Current product architecture - locked for v1

### Web first
The current release target is the web app. React Native / Expo is a separate future track.

### Local-first
Raw reflection text stays in the browser. Production has no reflection API endpoint.

### Zero runtime AI
Production does not use Gemini, OpenRouter, an LLM fallback, embeddings, or a vector database. AI tools may be used during development/research, but they are not a runtime dependency of the shipped product.

### No accounts or cloud sync at v1
Journal and personalization metadata remain local to the browser.

### General wellness
Consumer-facing product language is reflection/education, not diagnosis, treatment, clinical assessment, or medical decision support.

## Research expansion - active

Issue #3 manages the wisdom-literature corpus.

Merged research-staging phases:
1. Stoicism
2. Early Buddhist / Pali Canon sources
3. Classical Daoism

Active:
4. Indian philosophical traditions

Planned:
5. Confucian / classical Chinese traditions
6. later candidate traditions after core coverage is stable

Research material does not enter production automatically. Promotion requires source, rights, category-fit, safety, and product-copy review.

## Launch compliance - active

Issue #8 is the public-launch gate.

Required:
- 18+/U.S.-only initial launch posture
- static/local-only production verification
- final privacy notice and terms reviewed by counsel
- legal operator and privacy contact
- quote-rights audit
- no ad/tracker/analytics SDKs
- no runtime AI/provider dependencies
- local-data deletion control
- hosting/logging/subprocessor review
- dependency/security review
- WCAG 2.2 AA engineering pass
- current support-resource verification

## Validation

Before any release candidate:
- production policy check
- TypeScript
- static build
- browser E2E
- deterministic Baselines 3 and 4
- uncertainty gate
- 12,000-scenario deterministic human-flow fuzz

## Later product tracks

These are separate architecture decisions and must not silently enter v1:
- accounts and cross-device sync
- analytics
- payment/paid tier
- mobile/Expo app
- connected health data
- minor-user support
- international launch
- live resource-locator APIs

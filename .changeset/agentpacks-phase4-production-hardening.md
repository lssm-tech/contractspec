---
'@contractspec/app.registry-packs': minor
'agentpacks': minor
---

feat(registry-packs,agentpacks): Phase 4 production hardening

**Rate Limiting & Security:**

- In-memory token bucket rate limiter (100 req/min general, 10 req/min publish)
- 10MB tarball size limit with 413 Payload Too Large response
- Pack name squatting prevention (reserved names, format validation)
- Pack deprecation via POST /packs/:name/deprecate (owner-only)
- DB migration 0004_deprecation.sql

**E2E Tests:**

- Full publish → search → info → download → deprecate E2E test suite
- CI pipeline hardened with registry-packs test step

**Pack Versioning Polish:**

- Auto-bump version on publish (version="auto" → patch bump from latest)
- Model ID allowlist validation (advisory warnings for unknown model IDs)
- Profile inheritance via `extends` keyword with cycle detection
- 82 new tests (637 total: 402 agentpacks + 235 registry-packs)

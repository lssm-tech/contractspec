# @contractspec/app.registry-packs

## 0.3.0

### Minor Changes

- bae3db1: fix: build issues

## 0.2.0

### Minor Changes

- bda7a82: feat(registry-packs,agentpacks): Phase 4 production hardening

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

- c83c323: feat: major change to content generation

### Patch Changes

- 4d19382: fix: stabilize lint and tests after voice capability migration
  - remove strict-lint violations across registry-packs, support-bot, video-gen, and agentpacks
  - align voice provider tests and pocket-family-office blueprint with the `ai.voice.tts` capability key
  - keep agentpacks package exports in sync by exposing `./utils/model-allowlist`

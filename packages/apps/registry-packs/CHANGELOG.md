# @contractspec/app.registry-packs

## 1.7.7

### Patch Changes

- fix: release

## 1.7.6

### Patch Changes

- fix: release manifest

## 1.7.5

### Patch Changes

- ecf195a: fix: release security

## 1.7.4

### Patch Changes

- fix: release security

## 1.7.3

### Patch Changes

- fix: release

## 1.7.2

### Patch Changes

- 8cd229b: fix: release

## 1.7.1

### Patch Changes

- 5eb8626: fix: package exports

## 1.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

## 1.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

## 1.5.5

### Patch Changes

- 693eedd: chore: improve ai models

## 1.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming

## 1.5.3

### Patch Changes

- b0b4da6: fix: release

## 1.5.2

### Patch Changes

- 18df977: fix: release workflow

## 1.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime

## 1.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

## 1.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs

## 1.4.2

### Patch Changes

- 78d56a4: fix: release workflow

## 1.4.1

### Patch Changes

- 8f47829: fix: circular import issue

## 1.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

## 1.3.0

### Minor Changes

- 890a0da: fix: stability improvements

## 1.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

## 1.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

## 1.0.0

### Major Changes

- b781ce6: feat: improve ai readiness

## 0.6.0

### Minor Changes

- fix: minimatch version

## 0.5.0

### Minor Changes

- fix: tarball packages

## 0.4.0

### Minor Changes

- chore: release improvements

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

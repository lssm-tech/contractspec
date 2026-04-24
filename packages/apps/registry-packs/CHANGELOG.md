# @contractspec/app.registry-packs

## 1.7.18

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.contracts-spec@5.7.0

## 1.7.17

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
  - @contractspec/lib.contracts-spec@5.6.0

## 1.7.16

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - @contractspec/lib.contracts-spec@5.5.1

## 1.7.15

### Patch Changes

- Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
  - Packages: @contractspec/lib.ui-kit (major), @contractspec/integration.providers-impls (major), @contractspec/lib.runtime-sandbox (major), @contractspec/lib.example-shared-ui (major), @contractspec/lib.video-gen (major), @contractspec/lib.ui-kit-web (minor), @contractspec/app.cli-contractspec (minor), @contractspec/app.api-library (patch), @contractspec/app.registry-packs (patch), vscode-contractspec (patch), @contractspec/example.project-management-sync (patch), @contractspec/example.voice-providers (patch), @contractspec/example.meeting-recorder-providers (patch), @contractspec/example.integration-posthog (patch), contractspec (patch)
  - Migration: Consumers using native UI, provider implementations, sandbox database/runtime, example runtime UI, or Remotion video subpaths should add the corresponding optional peer packages directly to their app/package dependencies.; Replace broad `@contractspec/integration.providers-impls/impls` imports with provider-specific subpaths such as `@contractspec/integration.providers-impls/impls/linear`.; Run `bun run deps:audit --json` before and after dependency changes to compare runtime edges, heavy dependency families, and package dist sizes.
  - @contractspec/lib.contracts-spec@5.5.0

## 1.7.14

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.contracts-spec@5.5.0

## 1.7.13

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.

## 1.7.12

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime

## 1.7.11

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

## 1.7.10

### Patch Changes

- chore: stability & release

## 1.7.9

### Patch Changes

- fix: release

## 1.7.8

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type

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

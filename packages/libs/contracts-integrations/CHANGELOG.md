# @contractspec/lib.contracts-integrations

## 3.8.19

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- Updated dependencies because of Add preference-aware DataView collection defaults and personalization adapters.
- Updated dependencies because of Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- Updated dependencies because of Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- Updated dependencies because of Add PWA update management contracts and runtime helpers.
- Updated dependencies because of Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
  - @contractspec/lib.contracts-spec@6.2.0

## 3.8.18

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
- Updated dependencies because of Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- Updated dependencies because of Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
  - @contractspec/lib.contracts-spec@6.1.0

## 3.8.17

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Updated dependencies because of Improve FormSpec autocomplete rendering and resolver-backed search.
- Updated dependencies because of Add first-class FormSpec email fields with native renderer affordances.
- Updated dependencies because of Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
  - @contractspec/lib.contracts-spec@6.0.0

## 3.8.16

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.contracts-spec@5.7.0

## 3.8.15

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
  - @contractspec/lib.contracts-spec@5.6.0
  - @contractspec/lib.schema@3.7.14

## 3.8.14

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - @contractspec/lib.contracts-spec@5.5.1
  - @contractspec/lib.schema@3.7.14

## 3.8.13

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.schema@3.7.14

## 3.8.12

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0

## 3.8.11

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0

## 3.8.10

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
  - @contractspec/lib.contracts-spec@5.2.0
  - @contractspec/lib.schema@3.7.14

## 3.8.9

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.schema@3.7.14

## 3.8.8

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.schema@3.7.13

## 3.8.7

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.schema@3.7.12

## 3.8.6

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.schema@3.7.11

## 3.8.5

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1

## 3.8.4

### Patch Changes

- 2619dd8: Break the `contracts-spec` ⇄ `contracts-integrations` build cycle by restoring
  `@contractspec/lib.contracts-spec` to spec-only surfaces.

  Major changes in `@contractspec/lib.contracts-spec`:

  - Remove runtime knowledge exports under `knowledge/ingestion*`,
    `knowledge/query*`, and `knowledge/runtime`.
  - Remove runtime job exports under `jobs/handlers*`,
    `jobs/gcp-cloud-tasks`, `jobs/gcp-pubsub`, and `jobs/memory-queue`.
  - Remove the direct dependency on `@contractspec/lib.contracts-integrations`.
  - Make `app-config` the source of truth for `AppIntegrationBinding`,
    `IntegrationCategory`, and `IntegrationOwnershipMode`.
  - Replace remaining integration and secret-provider dependencies with narrow
    local structural ports for feature install and workflow execution.

  Patch changes:

  - Update `@contractspec/lib.contracts-integrations` to re-export app-config
    binding and ownership/category types from `@contractspec/lib.contracts-spec`.
  - Re-export the default transform-engine helpers from
    `@contractspec/lib.contracts-runtime-client-react/transform-engine`.

  Migration notes:

  - Import knowledge runtime helpers from `@contractspec/lib.knowledge/*`.
  - Import job handlers and queue adapters from `@contractspec/lib.jobs/*`.
  - Import app-config binding/category/mode types from
    `@contractspec/lib.contracts-spec/app-config` if you need the canonical
    contract source.

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [6de2f1c]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.schema@3.7.10

## 3.8.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.schema@3.7.9

## 3.8.2

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.schema@3.7.8

## 3.8.1

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.schema@3.7.7

## 3.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.6
  - @contractspec/lib.schema@3.7.6

## 3.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.contracts-spec@3.7.5
  - @contractspec/lib.schema@3.7.5

## 3.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.4
  - @contractspec/lib.schema@3.7.4

## 3.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.3
  - @contractspec/lib.schema@3.7.3

## 3.7.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
- Updated dependencies [04bc555]
  - @contractspec/lib.contracts-spec@3.7.2
  - @contractspec/lib.schema@3.7.2

## 3.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.contracts-spec@3.7.1
  - @contractspec/lib.schema@3.7.1

## 3.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.contracts-spec@3.7.0
  - @contractspec/lib.schema@3.7.0

## 3.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [6e3fe40]
- Updated dependencies [ea320ea]
- Updated dependencies [9d55d95]
  - @contractspec/lib.contracts-spec@3.6.0
  - @contractspec/lib.schema@3.6.0

## 3.5.5

### Patch Changes

- 693eedd: chore: improve ai models
- Updated dependencies [27b77db]
- Updated dependencies [693eedd]
  - @contractspec/lib.contracts-spec@3.5.5
  - @contractspec/lib.schema@3.5.5

## 3.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
- Updated dependencies [f5d4816]
  - @contractspec/lib.contracts-spec@3.5.4
  - @contractspec/lib.schema@3.5.4

## 3.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.contracts-spec@3.5.3
  - @contractspec/lib.schema@3.5.3

## 3.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.contracts-spec@3.5.2
  - @contractspec/lib.schema@3.5.2

## 3.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [dfff0d4]
  - @contractspec/lib.contracts-spec@3.5.1
  - @contractspec/lib.schema@3.5.1

## 3.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- Updated dependencies [230bdf6]
  - @contractspec/lib.contracts-spec@3.5.0
  - @contractspec/lib.schema@3.5.0

## 3.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.contracts-spec@3.4.3
  - @contractspec/lib.schema@3.4.3

## 3.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.contracts-spec@3.4.2
  - @contractspec/lib.schema@3.4.2

## 3.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.contracts-spec@3.4.1
  - @contractspec/lib.schema@3.4.1

## 3.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
- Updated dependencies [56ee8e6]
  - @contractspec/lib.contracts-spec@3.4.0
  - @contractspec/lib.schema@3.4.0

## 3.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- 575b316: Fix lint and build errors: replace forbidden non-null assertion with safe flatMap guard in changelog formatter, and ensure required Record fields survive Partial spread in integration test helpers
- Updated dependencies [890a0da]
  - @contractspec/lib.contracts-spec@3.3.0
  - @contractspec/lib.schema@3.3.0

## 3.2.1

### Patch Changes

- 575b316: Fix lint and build errors: replace forbidden non-null assertion with safe flatMap guard in changelog formatter, and ensure required Record fields survive Partial spread in integration test helpers

## 3.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.contracts-spec@3.2.0
  - @contractspec/lib.schema@3.2.0

## 3.1.1

### Patch Changes

- 02c0cc5: Fix lint and build errors across nine packages: remove unused imports and type imports from integration provider files, replace forbidden non-null assertions with proper type narrowing, and resolve TypeScript indexing error for `ColorSchemeName` in the Switch component.
- Updated dependencies [02c0cc5]
  - @contractspec/lib.contracts-spec@3.1.1

## 3.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [f2a4faf]
- Updated dependencies [28987eb]
- Updated dependencies [28987eb]
  - @contractspec/lib.contracts-spec@3.1.0
  - @contractspec/lib.schema@3.1.0

## 3.0.0

### Major Changes

- b781ce6: feat: improve ai readiness

### Minor Changes

- 7cbdb7f: Make Mistral a first-class provider across contracts, runtime adapters, model catalogs, and CLI provider resolution so teams can run end-to-end Mistral workflows without custom patching.

  Add Mistral STT and conversational contract/runtime coverage plus a new `mistralvibe` agentpacks target, while keeping legacy provider flows backward compatible.

- c608804: Add a new messaging integration category and provider contracts for Slack, GitHub, WhatsApp Meta, and WhatsApp Twilio, plus provider implementation wiring for outbound delivery.

  Introduce an AI-native channel runtime with webhook normalization/signature verification, policy gating, idempotent ingest, outbox dispatch/retry flow, API ingress routes, scheduler dispatch support, and end-to-end integration coverage in api-library.

- b19ae0a: Refine health transport resolution with deterministic strategy fallbacks, provider-level capability gating, and explicit unofficial-route credential checks.

  Add reusable provider normalizers, split health implementations into focused modules, and support OAuth refresh-token configuration (`oauthTokenUrl`, `tokenExpiresAt`) across health provider contracts, docs, and factory tests.

### Patch Changes

- e3bc858: Fix lint stability across workspaces by pinning ESLint's AJV resolver compatibility and removing an incompatible minimatch override that caused jsx-a11y runtime failures.

  Apply strict-type and lint compliance updates across health contracts and channel runtime code paths, including empty-interface aliases, dynamic env cleanup in integration tests, and normalized array typing with full lint/build/test validation.

- Updated dependencies [7cbdb7f]
- Updated dependencies [c608804]
- Updated dependencies [e3bc858]
- Updated dependencies [b19ae0a]
- Updated dependencies [aa4a9c9]
- Updated dependencies [b781ce6]
  - @contractspec/lib.contracts-spec@3.0.0
  - @contractspec/lib.schema@3.0.0

## 2.10.0

### Minor Changes

- 4556b80: Add a full health and wearables integration stack across contracts and runtime, including provider specs for Whoop, Apple Health, Oura, Strava, Garmin, Fitbit, MyFitnessPal, Eight Sleep, Peloton, and Open Wearables.

  Introduce health transport strategy resolution with official API/MCP, aggregator API/MCP, and gated unofficial fallback support, and wire provider implementations/factory routing with tests and docs updates.

### Patch Changes

- Updated dependencies [4556b80]
  - @contractspec/lib.contracts-spec@2.10.0

## 2.9.0

### Minor Changes

- fix: minimatch version

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.9.0
  - @contractspec/lib.schema@2.9.0

## 2.8.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.8.0
  - @contractspec/lib.schema@2.8.0

## 2.7.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.7.0
  - @contractspec/lib.schema@2.7.0

## 2.6.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/lib.contracts-spec@2.6.0
  - @contractspec/lib.schema@2.6.0

## 2.5.0

### Minor Changes

- 4fa3bd4: Add @contractspec/lib.image-gen package for AI-powered image generation

  - New `ai-image` IntegrationCategory in both contracts-spec and contracts-integrations
  - New ImageProvider contract with image generation, upscale, and edit interfaces
  - New fal-image and openai-image integration specs
  - New image-gen library with ImageGenerator, PromptBuilder, StyleResolver
  - Presets for social (OG, Twitter, Instagram), marketing (blog hero, landing, email), and video thumbnails
  - Full i18n support (en, fr, es)
  - video-gen: fix missing contracts-integrations dependency, add image-gen dependency, add image option to VideoGeneratorOptions, implement thumbnail generation in VideoGenerator
  - IMAGE_PRESETS: add emailHeader and illustration presets to contract layer
  - Comprehensive test suite (129 tests across 5 files)

- 63eee9b: Add @contractspec/lib.voice package for TTS, STT, and conversational voice

  - Expanded voice.ts contract with VoiceSynthesizer, Transcriber, and conversational types
  - New deepgram, openai-realtime, and voice-video-sync integration specs (mirrored)
  - Updated elevenlabs, fal, gradium integration specs for voice capabilities
  - New voice library with TTS, STT, audio utilities, sync, and conversational modules
  - Full i18n support (en, fr, es)
  - video-gen: integrate VoiceSynthesizer, Transcriber, subtitle generation, voice timing
  - Added thumbnail and voiceTimingMap fields to VideoProject contract

- c83c323: feat: major change to content generation

### Patch Changes

- Updated dependencies [4fa3bd4]
- Updated dependencies [63eee9b]
- Updated dependencies [284cbe2]
- Updated dependencies [c83c323]
  - @contractspec/lib.contracts-spec@2.5.0
  - @contractspec/lib.schema@2.5.0

## 2.4.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.4.0
  - @contractspec/lib.schema@2.4.0

## 2.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.contracts-spec@2.3.0
  - @contractspec/lib.schema@2.3.0

## 2.2.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.2.0
  - @contractspec/lib.schema@2.2.0

## 2.1.1

### Patch Changes

- Updated dependencies [57e2819]
  - @contractspec/lib.contracts-spec@2.1.1

## 2.1.0

### Minor Changes

- 362fbac: feat: improve video

### Patch Changes

- Updated dependencies [b4bfbc5]
- Updated dependencies [362fbac]
- Updated dependencies [659d15f]
  - @contractspec/lib.contracts-spec@2.1.0
  - @contractspec/lib.schema@2.1.0

## 2.0.0

### Major Changes

- a09bafc: feat: optimize performance

### Minor Changes

- f152678: Scaffolded split contracts packages for spec+registry, integrations definitions, and runtime adapters by surface (client-react, server-rest, server-graphql, server-mcp). Migrated first consumers and documentation examples to the new runtime package imports.

### Patch Changes

- Updated dependencies [a09bafc]
- Updated dependencies [94f3c24]
- Updated dependencies [f152678]
  - @contractspec/lib.contracts-spec@2.0.0
  - @contractspec/lib.schema@2.0.0

# @contractspec/lib.contracts-spec

## 5.0.0

### Major Changes

- 81256ea: Make `@contractspec/lib.contracts-spec` contract-model only and move concrete
  runtime and integration code to dedicated packages.

  Major changes:

  - Remove `@contractspec/lib.contracts-spec/presentations/transform-engine`.
  - Remove all `@contractspec/lib.contracts-spec/integrations*` export paths.
  - Remove `@contractspec/lib.contracts-spec/jobs/scaleway-sqs-queue`.
  - Remove provider-type re-exports for email, embedding, LLM, storage, and
    vector-store surfaces from the `@contractspec/lib.contracts-spec` root
    barrel.
  - Keep `PresentationSpec` unchanged while moving transform-engine runtime logic
    out of the contract package.

  New runtime surfaces:

  - Add `@contractspec/lib.presentation-runtime-core/transform-engine` for the
    core transform engine, validators, and markdown/json/xml rendering support.
  - Add `@contractspec/lib.contracts-runtime-client-react/transform-engine` for
    React render descriptors and React-specific transform-engine helpers.
  - Update `@contractspec/lib.contracts-runtime-server-mcp` to use the core
    transform engine without React registration.

  Migration notes:

  - Import integration provider and secret types from
    `@contractspec/lib.contracts-integrations`.
  - Import transform-engine core APIs from
    `@contractspec/lib.presentation-runtime-core/transform-engine`.
  - Import React-specific transform-engine helpers from
    `@contractspec/lib.contracts-runtime-client-react/transform-engine`.

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

- 81256ea: Split agent definition contracts out of `@contractspec/lib.ai-agent` and make
  `@contractspec/lib.contracts-spec` the source of truth for agent declaration APIs.

  Major changes:

  - Move `AgentSpec`, `AgentToolConfig`, `AgentPolicy`, `AgentRegistry`,
    `createAgentRegistry`, `defineAgent`, and related definition-only types into
    `@contractspec/lib.contracts-spec/agent`.
  - Add `@contractspec/lib.contracts-spec/agent/spec` and
    `@contractspec/lib.contracts-spec/agent/registry` export subpaths.
  - Remove `@contractspec/lib.ai-agent/spec`,
    `@contractspec/lib.ai-agent/spec/spec`, and
    `@contractspec/lib.ai-agent/spec/registry`.
  - Remove the spec layer from the `@contractspec/lib.ai-agent` root barrel so it
    is runtime-focused.

  Workspace consumers were migrated to import agent-definition contracts from
  `@contractspec/lib.contracts-spec/agent`, and packages that only needed the
  contract layer dropped their direct dependency on `@contractspec/lib.ai-agent`.

### Patch Changes

- Updated dependencies [6de2f1c]
  - @contractspec/lib.schema@3.7.10

## 4.1.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.schema@3.7.9

## 4.1.2

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.schema@3.7.8

## 4.1.1

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.schema@3.7.7

## 3.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.schema@3.7.6

## 3.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.schema@3.7.5

## 3.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.schema@3.7.4

## 3.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.schema@3.7.3

## 3.7.2

### Patch Changes

- 8cd229b: fix: release
- 04bc555: Improve contract integrity, example validation, onboarding docs, doctor safety,
  release verification, packaged smoke testing, and security workflow coverage.
- Updated dependencies [8cd229b]
  - @contractspec/lib.schema@3.7.2

## 3.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.schema@3.7.1

## 3.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.schema@3.7.0

## 3.6.0

### Minor Changes

- 6e3fe40: feat(agents): agentic workflows — subagents, memory tools, and next steps

  - **Subagents**: `createSubagentTool`, async generator execute, `SubagentRef`, streaming + toModelOutput
  - **Memory tools**: `AgentMemoryStore`, `InMemoryAgentMemoryStore`, `createAnthropicMemoryTool`, `memoryTools` + `agentMemoryStore` config
  - **needsApproval**: Validation warning when subagent has requiresApproval/automationSafe (AI SDK limitation)
  - **passConversationHistory**: Opt-in `SubagentRef.passConversationHistory`; subagent `generate({ messages })` support
  - **DocBlocks**: Subagent caveats, execution model, Mem0/Hindsight optional add-ons; knowledge agent memory
  - **ai-chat**: `preliminary`/`nestedParts` on ChatToolCall; UIMessagePartRenderer for nested subagent output

- ea320ea: feat: ai-chat tooling
- 9d55d95: feat(tools): backend operations + frontend rendering support
  - **AgentToolConfig**: Add `outputPresentation`, `outputForm`, `outputDataView` for declarative tool output rendering (at most one per tool)
  - **Tool adapter**: Wrap raw tool output as `{ presentationKey, data }`, `{ formKey, defaultValues }`, or `{ dataViewKey, items }` for ToolResultRenderer
  - **OperationSpec**: Optional `outputPresentation`, `outputForm`, `outputDataView`; tool adapter falls back to operation refs when AgentToolConfig has none
  - **ToolResultRenderer**: Add DataViewSpec support via `dataViewRenderer` prop, `DataViewToolResult`, `isDataViewToolResult`
  - **Chat components**: Thread `dataViewRenderer` through ChatMessage, ChatWithExport, ChatWithSidebar

### Patch Changes

- Updated dependencies [ea320ea]
  - @contractspec/lib.schema@3.6.0

## 3.5.5

### Patch Changes

- 27b77db: feat(ai-models): add latest models and align defaults

  - Add claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5, gpt-5.4, gpt-5-mini
  - Add mistral-large-2512, mistral-medium-2508, mistral-small-2506, devstral-2512
  - Add gemini-3.1-pro-preview, gemini-3.1-flash-lite-preview, gemini-3-flash-preview
  - Fix GPT-5.4 cost and context window; update default models to claude-sonnet-4-6
  - Enrich provider-ranking MCP with cost from ai-providers when store has none
  - Update model allowlist for gpt-5 and gemini 3.x; align agentpacks templates

- 693eedd: chore: improve ai models
- Updated dependencies [693eedd]
  - @contractspec/lib.schema@3.5.5

## 3.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- f5d4816: Standardize MCP tool naming from dot notation to underscore notation for MCP protocol compatibility. Update docs, docblocks, and generated indexes accordingly. Path resolver and fixture updates.
- Updated dependencies [c585fb1]
  - @contractspec/lib.schema@3.5.4

## 3.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.schema@3.5.3

## 3.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.schema@3.5.2

## 3.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [dfff0d4]
  - @contractspec/lib.schema@3.5.1

## 3.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- Updated dependencies [230bdf6]
  - @contractspec/lib.schema@3.5.0

## 3.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.schema@3.4.3

## 3.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.schema@3.4.2

## 3.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.schema@3.4.1

## 3.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- 56ee8e6: Bundle spec alignment and i18n support

  **surface-runtime**

  - Add i18n for OverlayConflictResolver and PatchProposalCard (en, fr, es)
  - Add locale to ResolvedSurfacePlan; pass through from BundleContext
  - Export ./i18n with createSurfaceI18n, SURFACE_KEYS

  **personalization**

  - Add PreferenceDimensions, BundlePreferenceAdapter, ResolvedPreferenceProfile
  - Align with specs/contractspec_modules_bundle_spec_2026-03-08 (05_personalization_model)
  - Export ./preference-dimensions

  **contracts-spec**

  - Add validateBundleRequires for ModuleBundleSpec.requires validation
  - Document bundle requires alignment in README and AGENTS.md

  **ai-agent**

  - Document surface-runtime planner tools integration in README
  - Add optional peer @contractspec/lib.surface-runtime

  **module.ai-chat**

  - Add UseChatToolDef and optional tools to UseChatOptions (reserved for planner)
  - Document bundle spec alignment; add optional peer @contractspec/lib.surface-runtime

- Updated dependencies [0ee467a]
  - @contractspec/lib.schema@3.4.0

## 3.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
  - @contractspec/lib.schema@3.3.0

## 3.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.schema@3.2.0

## 3.1.1

### Patch Changes

- 02c0cc5: Fix lint and build errors across nine packages: remove unused imports and type imports from integration provider files, replace forbidden non-null assertions with proper type narrowing, and resolve TypeScript indexing error for `ColorSchemeName` in the Switch component.

## 3.1.0

### Minor Changes

- 28987eb: Harden workflow and agent loop execution with stricter validation, deterministic composition ordering, runtime timeout/cooldown controls, and pause/resume-capable workflow execution semantics.

  Add adapter-first runtime interop surfaces and safer channel ingest policy gating so teams can adopt LangGraph/LangChain/useworkflow-style integrations without coupling core ContractSpec contracts to vendor runtimes.

- 28987eb: chore: upgrade dependencies

### Patch Changes

- f2a4faf: Automate the `contracts-spec` README contract inventory section from package exports and `ContractSpecType`, so category/kind listings stay accurate as new contracts are added.

  Add `bun run readme:inventory` and a generator script to refresh the inventory block with counts, per-category matrices, and fully enumerated contract artifact lists.

- Updated dependencies [28987eb]
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

- aa4a9c9: Add a first control-plane contract baseline with typed commands, queries, events, capabilities, and registry helpers for intent, execution, policy, audit, and skill governance workflows.
- Updated dependencies [b781ce6]
  - @contractspec/lib.schema@3.0.0

## 2.10.0

### Minor Changes

- 4556b80: Add a full health and wearables integration stack across contracts and runtime, including provider specs for Whoop, Apple Health, Oura, Strava, Garmin, Fitbit, MyFitnessPal, Eight Sleep, Peloton, and Open Wearables.

  Introduce health transport strategy resolution with official API/MCP, aggregator API/MCP, and gated unofficial fallback support, and wire provider implementations/factory routing with tests and docs updates.

## 2.9.0

### Minor Changes

- fix: minimatch version

### Patch Changes

- Updated dependencies
  - @contractspec/lib.schema@2.9.0

## 2.8.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.schema@2.8.0

## 2.7.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/lib.schema@2.7.0

## 2.6.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
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

- 284cbe2: Add full i18n support across all 10 packages with en/fr/es locales (460 keys total).

  - add shared `createI18nFactory<K>()` to `@contractspec/lib.contracts-spec/translations` to eliminate ~1,450 lines of duplicated boilerplate
  - add `src/i18n/` modules to all 10 packages with typed keys, locale resolution, message catalogs (en/fr/es), and completeness tests
  - thread `locale` parameter through public options interfaces and runtime functions in every package
  - convert all 55 `getDefaultI18n()` call sites in ai-agent to locale-aware `createAgentI18n()`
  - add locale-keyed keyword dictionaries (en/fr/es) to support-bot classifier
  - add `getLocalizedStageMeta()` and `getLocalizedStagePlaybooks()` to lifecycle packages
  - add `localeChannels` on notification templates with fr/es content for all standard templates
  - add `getXpSourceLabel(source, locale)` for localized XP source display in learning-journey
  - fix `slugify()` in content-gen to support non-Latin characters via Unicode property escapes
  - enable `i18next/no-literal-string` ESLint rule (warn, jsx-text-only) for all 10 packages
  - add `scripts/check-i18n-parity.ts` CI script and `bun run i18n:check` for catalog key parity verification

- c83c323: feat: major change to content generation

### Patch Changes

- Updated dependencies [c83c323]
  - @contractspec/lib.schema@2.5.0

## 2.4.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/lib.schema@2.4.0

## 2.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.schema@2.3.0

## 2.2.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.schema@2.2.0

## 2.1.1

### Patch Changes

- 57e2819: chore: align Studio messaging with live product positioning

## 2.1.0

### Minor Changes

- b4bfbc5: feat: init video system
- 362fbac: feat: improve video
- 659d15f: feat: improve ai-agent analytics leveraging posthog

### Patch Changes

- Updated dependencies [362fbac]
  - @contractspec/lib.schema@2.1.0

## 2.0.0

### Major Changes

- a09bafc: feat: optimize performance

### Minor Changes

- f152678: Scaffolded split contracts packages for spec+registry, integrations definitions, and runtime adapters by surface (client-react, server-rest, server-graphql, server-mcp). Migrated first consumers and documentation examples to the new runtime package imports.

### Patch Changes

- Updated dependencies [a09bafc]
- Updated dependencies [94f3c24]
  - @contractspec/lib.schema@2.0.0

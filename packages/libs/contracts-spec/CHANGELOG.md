# @contractspec/lib.contracts-spec

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

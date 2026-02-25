# @contractspec/lib.video-gen

## 1.49.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.content-gen@2.8.0
  - @contractspec/lib.contracts-integrations@2.8.0
  - @contractspec/lib.contracts-spec@2.8.0
  - @contractspec/lib.design-system@2.8.0
  - @contractspec/lib.image-gen@0.5.0
  - @contractspec/lib.voice@0.5.0

## 1.48.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/lib.content-gen@2.7.0
  - @contractspec/lib.contracts-integrations@2.7.0
  - @contractspec/lib.contracts-spec@2.7.0
  - @contractspec/lib.design-system@2.7.0
  - @contractspec/lib.image-gen@0.4.0
  - @contractspec/lib.voice@0.4.0

## 1.47.1

### Patch Changes

- Updated dependencies [f8dc3ad]
  - @contractspec/lib.design-system@2.6.1

## 1.47.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/lib.content-gen@2.6.0
  - @contractspec/lib.contracts-integrations@2.6.0
  - @contractspec/lib.contracts-spec@2.6.0
  - @contractspec/lib.design-system@2.6.0
  - @contractspec/lib.image-gen@0.3.0
  - @contractspec/lib.voice@0.3.0

## 1.46.0

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

- 397b7c0: Switch Remotion CLI from `npx remotion` to `bunx remotionb` for native Bun runtime support.
  - update video-studio scripts (`dev`, `render`, `render:all`) to use `bunx remotionb`
  - correct documentation that incorrectly claimed Remotion does not run on Bun
  - document known Bun caveats (`lazyComponent` disabled, SSR scripts may not auto-quit)

- 4d19382: fix: stabilize lint and tests after voice capability migration
  - remove strict-lint violations across registry-packs, support-bot, video-gen, and agentpacks
  - align voice provider tests and pocket-family-office blueprint with the `ai.voice.tts` capability key
  - keep agentpacks package exports in sync by exposing `./utils/model-allowlist`

- Updated dependencies [4fa3bd4]
- Updated dependencies [63eee9b]
- Updated dependencies [284cbe2]
- Updated dependencies [c83c323]
  - @contractspec/lib.contracts-spec@2.5.0
  - @contractspec/lib.contracts-integrations@2.5.0
  - @contractspec/lib.image-gen@0.2.0
  - @contractspec/lib.voice@0.2.0
  - @contractspec/lib.content-gen@2.5.0
  - @contractspec/lib.design-system@2.5.0

## 1.45.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.4.0
  - @contractspec/lib.design-system@2.4.0
  - @contractspec/lib.content-gen@2.4.0

## 1.44.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.contracts-spec@2.3.0
  - @contractspec/lib.design-system@2.3.0
  - @contractspec/lib.content-gen@2.3.0

## 1.43.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.2.0
  - @contractspec/lib.design-system@2.2.0
  - @contractspec/lib.content-gen@2.2.0

## 1.42.1

### Patch Changes

- Updated dependencies [57e2819]
  - @contractspec/lib.contracts-spec@2.1.1
  - @contractspec/lib.content-gen@2.1.1
  - @contractspec/lib.design-system@2.1.1

## 1.42.0

### Minor Changes

- b4bfbc5: feat: init video system
- 362fbac: feat: improve video

### Patch Changes

- Updated dependencies [b4bfbc5]
- Updated dependencies [362fbac]
- Updated dependencies [659d15f]
  - @contractspec/lib.contracts-spec@2.1.0
  - @contractspec/lib.design-system@2.1.0
  - @contractspec/lib.content-gen@2.1.0

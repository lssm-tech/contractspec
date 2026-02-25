# @contractspec/lib.contracts-integrations

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

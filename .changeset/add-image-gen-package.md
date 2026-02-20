---
'@contractspec/lib.contracts-spec': minor
'@contractspec/lib.contracts-integrations': minor
'@contractspec/lib.image-gen': minor
'@contractspec/lib.video-gen': minor
---

Add @contractspec/lib.image-gen package for AI-powered image generation

- New `ai-image` IntegrationCategory in both contracts-spec and contracts-integrations
- New ImageProvider contract with image generation, upscale, and edit interfaces
- New fal-image and openai-image integration specs
- New image-gen library with ImageGenerator, PromptBuilder, StyleResolver
- Presets for social (OG, Twitter, Instagram), marketing (blog hero, landing, email), and video thumbnails
- Full i18n support (en, fr, es)
- video-gen: fix missing contracts-integrations dependency, add image-gen dependency, add image option to VideoGeneratorOptions, implement thumbnail generation in VideoGenerator
- IMAGE_PRESETS: add emailHeader and illustration presets to contract layer
- Comprehensive test suite (129 tests across 5 files)

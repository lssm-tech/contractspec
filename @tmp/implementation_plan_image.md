# Implementation Plan: `@contractspec/lib.image-gen`

> **Package**: `packages/libs/image-gen/`
> **Naming**: `@contractspec/lib.image-gen`
> **Status**: New package -- greenfield
> **Breaking changes**: Allowed (new `IntegrationCategory`, direct dependency wiring to video-gen)

---

## 1. Context & Motivation

The media generation family:

| Package         | Domain                                                | Exists                      |
| --------------- | ----------------------------------------------------- | --------------------------- |
| `content-gen`   | Text (blog, email, social, landing, SEO)              | Yes                         |
| `video-gen`     | Video (Remotion compositions, scene planning)         | Yes                         |
| **`image-gen`** | **Image (hero, social, thumbnail, og, illustration)** | **Missing**                 |
| `voice`         | Voice (TTS, STT, conversational)                      | Missing (see separate plan) |

**image-gen** fills the visual asset gap. Content pipelines need images for blogs, social posts, landing pages, video thumbnails, and OG images. It generates prompt projects deterministically and, when an `ImageProvider` is wired, produces actual images via AI providers (fal.ai/flux, OpenAI DALL-E / gpt-image, Stability AI, etc.).

---

## 2. Contract Layer Changes

> **IMPORTANT — Mirror Pattern**: `contracts-spec` and `contracts-integrations` maintain **identical mirrored copies** of all integration files (`spec.ts`, `providers/voice.ts`, `providers/elevenlabs.ts`, etc.). Every change in this section MUST be applied to **both** packages in lockstep. The canonical source is `contracts-spec`; `contracts-integrations` mirrors it.

### 2.1 New `IntegrationCategory`: `'ai-image'`

**Files** (BOTH):

- `contracts-spec/src/integrations/spec.ts`
- `contracts-integrations/src/integrations/spec.ts`

Add `'ai-image'` to the `IntegrationCategory` union (breaking -- existing exhaustive switches must handle it).

```ts
// BEFORE (line 8-26 in both files)
export type IntegrationCategory =
  | 'payments'
  | 'email'
  // ...
  | 'custom';

// AFTER -- insert 'ai-image' after 'ai-voice'
export type IntegrationCategory =
  | 'payments'
  | 'email'
  // ...
  | 'ai-voice'
  | 'ai-image'       // <-- NEW
  // ...
  | 'custom';
```

### 2.2 New Provider Contract: `ImageProvider`

**Files** (BOTH):

- `contracts-spec/src/integrations/providers/image.ts`
- `contracts-integrations/src/integrations/providers/image.ts`

```ts
// -- Image Format -----------------------------------------------------------

export type ImageFormat = "png" | "jpg" | "webp" | "svg";

export interface ImageDimensions {
  width: number;
  height: number;
}

export const IMAGE_PRESETS = {
  ogImage:         { width: 1200, height: 630 },
  twitterCard:     { width: 1200, height: 675 },
  instagramSquare: { width: 1080, height: 1080 },
  instagramStory:  { width: 1080, height: 1920 },
  blogHero:        { width: 1920, height: 1080 },
  thumbnail:       { width: 640,  height: 360 },
  favicon:         { width: 512,  height: 512 },
} as const satisfies Record<string, ImageDimensions>;

// -- Generation Input -------------------------------------------------------

export interface ImageGenerationInput {
  prompt: string;
  negativePrompt?: string;
  dimensions: ImageDimensions;
  format?: ImageFormat;
  style?: "photorealistic" | "illustration" | "3d-render" | "flat-design" | "abstract";
  numVariants?: number;
  guidanceScale?: number;
  seed?: number;
  /** Reference image for img2img / style transfer */
  referenceImage?: Uint8Array;
  referenceStrength?: number;
  metadata?: Record<string, string>;
}

// -- Generation Result ------------------------------------------------------

export interface ImageGenerationResult {
  images: GeneratedImageData[];
  seed: number;
  model: string;
  generationTimeMs?: number;
}

export interface GeneratedImageData {
  data: Uint8Array;
  format: ImageFormat;
  dimensions: ImageDimensions;
  url?: string;
  /** Provider may revise the prompt */
  revisedPrompt?: string;
}

// -- Provider Interface -----------------------------------------------------

export interface ImageProvider {
  generate(input: ImageGenerationInput): Promise<ImageGenerationResult>;
  listModels?(): Promise<ImageModelInfo[]>;
  upscale?(image: Uint8Array, scale: number): Promise<GeneratedImageData>;
  edit?(image: Uint8Array, mask: Uint8Array, prompt: string): Promise<GeneratedImageData>;
}

export interface ImageModelInfo {
  id: string;
  name: string;
  maxDimensions: ImageDimensions;
  supportedFormats: ImageFormat[];
  supportsNegativePrompt: boolean;
  supportsImg2Img: boolean;
}
```

**Register** (BOTH packages):

- Add `export * from './image';` in `providers/index.ts` (both contracts-spec and contracts-integrations)
- Add `"./integrations/providers/image"` entry in `package.json` exports (both packages)

### 2.3 Integration Specs (BOTH packages — mirrored)

**Files** (create in BOTH `contracts-spec` AND `contracts-integrations`):

| File                        | Key               | Provider                  |
| --------------------------- | ----------------- | ------------------------- |
| `providers/fal-image.ts`    | `ai-image.fal`    | Fal Flux / SD             |
| `providers/openai-image.ts` | `ai-image.openai` | OpenAI DALL-E / gpt-image |

Both follow the exact `defineIntegration()` pattern. Example for `fal-image.ts`:

```ts
import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';

export const falImageIntegrationSpec = defineIntegration({
  meta: {
    key: 'ai-image.fal',
    version: '1.0.0',
    category: 'ai-image',
    title: 'Fal Image Generation',
    description: 'Fal integration for AI image generation using Flux and Stable Diffusion models.',
    domain: 'ai',
    owners: ['platform.ai'],
    tags: ['image', 'generation', 'flux', 'stable-diffusion'],
    stability: StabilityEnum.Experimental,
  },
  supportedModes: ['byok'],
  capabilities: {
    provides: [{ key: 'ai.image.generation', version: '1.0.0' }],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        modelId: { type: 'string', description: 'Fal model endpoint (e.g. fal-ai/flux/dev).' },
        defaultFormat: { type: 'string', enum: ['png', 'jpg', 'webp'] },
        defaultGuidanceScale: { type: 'number', minimum: 1, maximum: 20 },
      },
    },
    example: { modelId: 'fal-ai/flux/dev', defaultFormat: 'png', defaultGuidanceScale: 7.5 },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['apiKey'],
      properties: { apiKey: { type: 'string', description: 'Fal API key (FAL_KEY).' } },
    },
    example: { apiKey: 'key-id:key-secret' },
  },
  healthCheck: { method: 'custom', timeoutMs: 7000 },
  docsUrl: 'https://fal.ai/models',
  byokSetup: {
    setupInstructions: 'Create a Fal API key and ensure image generation model access is enabled.',
  },
});

export function registerFalImageIntegration(registry: IntegrationSpecRegistry): IntegrationSpecRegistry {
  return registry.register(falImageIntegrationSpec);
}
```

**Registration** (BOTH packages):

- Add `export * from './fal-image';` and `export * from './openai-image';` in `providers/index.ts`
- Add corresponding entries in `package.json` exports

---

## 3. Package Structure

```
packages/libs/image-gen/
  AGENTS.md
  package.json
  tsconfig.json
  tsdown.config.js
  README.md
  src/
    index.ts                      # Re-exports types + generators + presets
    types.ts                      # ImageBrief, ImageProject, ImagePrompt, etc.
    generators/
      index.ts
      image-generator.ts          # Main orchestrator
      prompt-builder.ts           # Deterministic + LLM prompt construction
      style-resolver.ts           # Purpose -> dimensions + style tokens
    presets/
      index.ts
      social.ts                   # OG, Twitter, Instagram presets
      marketing.ts                # Blog hero, landing hero, email header
      video.ts                    # Thumbnail presets for video-gen scenes
    i18n/
      index.ts
      keys.ts
      locale.ts
      messages.ts
      catalogs/
        index.ts
        en.ts
        fr.ts
        es.ts
    docs/
      image-gen.docblock.ts
      generators.docblock.ts
```

---

## 4. Type System (`src/types.ts`)

```ts
import type { LLMProvider } from "@contractspec/lib.contracts-integrations/integrations/providers/llm";
import type {
  ImageProvider, ImageDimensions, ImageFormat,
  ImageGenerationResult, IMAGE_PRESETS,
} from "@contractspec/lib.contracts-integrations/integrations/providers/image";
import type { ContentBrief } from "@contractspec/lib.content-gen/types";

// Re-export contract types
export type { ImageProvider, ImageDimensions, ImageFormat, ImageGenerationResult };
export { IMAGE_PRESETS };

// -- Image Brief ------------------------------------------------------------

export interface ImageBrief {
  content: ContentBrief;
  purpose: ImagePurpose;
  dimensions?: ImageDimensions;
  format?: ImageFormat;
  style?: ImageStyle;
  brandColors?: BrandColorOverrides;
  variants?: number;
  locale?: string;
  seed?: number;
}

export type ImagePurpose =
  | "blog-hero" | "social-og" | "social-twitter" | "social-instagram"
  | "landing-hero" | "video-thumbnail" | "email-header"
  | "illustration" | "icon";

export type ImageStyle =
  | "photorealistic" | "illustration" | "3d-render" | "flat-design"
  | "abstract" | "minimalist" | "branded";

export interface BrandColorOverrides {
  primary?: string;
  accent?: string;
  background?: string;
}

// -- Generator Options ------------------------------------------------------

export interface ImageGeneratorOptions {
  llm?: LLMProvider;
  image?: ImageProvider;
  model?: string;
  temperature?: number;
  locale?: string;
  defaultStyle?: ImageStyle;
}

// -- Image Project ----------------------------------------------------------

export interface ImageProject {
  id: string;
  prompt: ImagePrompt;
  results?: ImageGenerationResult;
  metadata: ImageProjectMetadata;
}

export interface ImagePrompt {
  text: string;
  negativeText?: string;
  style: ImageStyle;
  dimensions: ImageDimensions;
  format: ImageFormat;
}

export interface ImageProjectMetadata {
  purpose: ImagePurpose;
  title: string;
  createdAt: string;
  locale: string;
}
```

---

## 5. Generator Pattern

### 5.1 `ImageGenerator` (orchestrator)

```
constructor(options?: ImageGeneratorOptions)
  -> stores llm, image, model, temperature, locale
  -> creates PromptBuilder(options) and StyleResolver()

async generate(brief: ImageBrief): Promise<ImageProject>
  1. StyleResolver.resolve(brief.purpose, brief.style, brief.brandColors)
     -> dimensions, styleTokens, negativeTokens
  2. PromptBuilder.build(brief, resolvedStyle)
     -> ImagePrompt (deterministic or LLM-enhanced)
  3. image.generate({ prompt, dimensions, format, style })
     -> attach ImageGenerationResult
  4. Return ImageProject
```

### 5.2 `PromptBuilder`

```
async build(brief, resolvedStyle): Promise<ImagePrompt>
  Without LLM:
    "{title}, {style} style, {purpose} format, featuring {solutions}, {industry} context"
    negativeText: from resolvedStyle.negativeTokens
  With LLM:
    System prompt for image prompt engineering + brief as JSON input
    Falls back to deterministic on any failure
```

### 5.3 `StyleResolver`

```
resolve(purpose, style?, brand?): ResolvedStyle
  -> { styleTokens: string[], negativeTokens: string[], dimensions: ImageDimensions }

  // Maps purpose -> default dimensions from IMAGE_PRESETS
  // Maps style -> prompt tokens ("professional photography", "clean flat vector", ...)
  // Maps brand colors -> color tokens ("primary #3B82F6 palette")
  // Negative tokens always include "blurry, low quality, text overlay, watermark"
```

---

## 6. Package Configuration

### 6.1 `package.json` (full)

```json
{
  "name": "@contractspec/lib.image-gen",
  "version": "0.1.0",
  "description": "AI-powered image generation for hero, social, thumbnail, OG, and illustration",
  "keywords": ["contractspec", "image", "ai", "generation", "typescript"],
  "type": "module",
  "types": "./dist/index.d.ts",
  "files": ["dist", "README.md"],
  "scripts": {
    "publish:pkg": "bun publish --tolerate-republish --ignore-scripts --verbose",
    "publish:pkg:canary": "bun publish:pkg --tag canary",
    "build": "bun run prebuild && bun run build:bundle && bun run build:types",
    "build:bundle": "contractspec-bun-build transpile",
    "build:types": "contractspec-bun-build types",
    "dev": "contractspec-bun-build dev",
    "clean": "rimraf dist .turbo",
    "lint": "bun lint:fix",
    "lint:fix": "eslint src --fix",
    "lint:check": "eslint src",
    "test": "bun test --pass-with-no-tests",
    "prebuild": "contractspec-bun-build prebuild",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@contractspec/lib.contracts-spec": "workspace:*",
    "@contractspec/lib.contracts-integrations": "workspace:*",
    "@contractspec/lib.content-gen": "workspace:*"
  },
  "devDependencies": {
    "@contractspec/tool.typescript": "workspace:*",
    "@contractspec/tool.bun": "workspace:*",
    "typescript": "catalog:"
  },
  "exports": {
    ".": "./src/index.ts",
    "./generators": "./src/generators/index.ts",
    "./generators/index": "./src/generators/index.ts",
    "./generators/image-generator": "./src/generators/image-generator.ts",
    "./generators/prompt-builder": "./src/generators/prompt-builder.ts",
    "./generators/style-resolver": "./src/generators/style-resolver.ts",
    "./presets": "./src/presets/index.ts",
    "./presets/index": "./src/presets/index.ts",
    "./presets/social": "./src/presets/social.ts",
    "./presets/marketing": "./src/presets/marketing.ts",
    "./presets/video": "./src/presets/video.ts",
    "./i18n": "./src/i18n/index.ts",
    "./i18n/index": "./src/i18n/index.ts",
    "./i18n/keys": "./src/i18n/keys.ts",
    "./i18n/locale": "./src/i18n/locale.ts",
    "./i18n/messages": "./src/i18n/messages.ts",
    "./i18n/catalogs": "./src/i18n/catalogs/index.ts",
    "./i18n/catalogs/index": "./src/i18n/catalogs/index.ts",
    "./i18n/catalogs/en": "./src/i18n/catalogs/en.ts",
    "./i18n/catalogs/fr": "./src/i18n/catalogs/fr.ts",
    "./i18n/catalogs/es": "./src/i18n/catalogs/es.ts",
    "./types": "./src/types.ts"
  },
  "publishConfig": {
    "access": "public",
    "exports": {
      ".": {
        "types": "./dist/index.d.ts",
        "bun": "./dist/index.js",
        "node": "./dist/node/index.js",
        "browser": "./dist/browser/index.js",
        "default": "./dist/index.js"
      },
      "./generators": {
        "types": "./dist/generators/index.d.ts",
        "bun": "./dist/generators/index.js",
        "node": "./dist/node/generators/index.js",
        "browser": "./dist/browser/generators/index.js",
        "default": "./dist/generators/index.js"
      },
      "./generators/index": {
        "types": "./dist/generators/index.d.ts",
        "bun": "./dist/generators/index.js",
        "node": "./dist/node/generators/index.js",
        "browser": "./dist/browser/generators/index.js",
        "default": "./dist/generators/index.js"
      },
      "./generators/image-generator": {
        "types": "./dist/generators/image-generator.d.ts",
        "bun": "./dist/generators/image-generator.js",
        "node": "./dist/node/generators/image-generator.js",
        "browser": "./dist/browser/generators/image-generator.js",
        "default": "./dist/generators/image-generator.js"
      },
      "./generators/prompt-builder": {
        "types": "./dist/generators/prompt-builder.d.ts",
        "bun": "./dist/generators/prompt-builder.js",
        "node": "./dist/node/generators/prompt-builder.js",
        "browser": "./dist/browser/generators/prompt-builder.js",
        "default": "./dist/generators/prompt-builder.js"
      },
      "./generators/style-resolver": {
        "types": "./dist/generators/style-resolver.d.ts",
        "bun": "./dist/generators/style-resolver.js",
        "node": "./dist/node/generators/style-resolver.js",
        "browser": "./dist/browser/generators/style-resolver.js",
        "default": "./dist/generators/style-resolver.js"
      },
      "./presets": {
        "types": "./dist/presets/index.d.ts",
        "bun": "./dist/presets/index.js",
        "node": "./dist/node/presets/index.js",
        "browser": "./dist/browser/presets/index.js",
        "default": "./dist/presets/index.js"
      },
      "./presets/index": {
        "types": "./dist/presets/index.d.ts",
        "bun": "./dist/presets/index.js",
        "node": "./dist/node/presets/index.js",
        "browser": "./dist/browser/presets/index.js",
        "default": "./dist/presets/index.js"
      },
      "./presets/social": {
        "types": "./dist/presets/social.d.ts",
        "bun": "./dist/presets/social.js",
        "node": "./dist/node/presets/social.js",
        "browser": "./dist/browser/presets/social.js",
        "default": "./dist/presets/social.js"
      },
      "./presets/marketing": {
        "types": "./dist/presets/marketing.d.ts",
        "bun": "./dist/presets/marketing.js",
        "node": "./dist/node/presets/marketing.js",
        "browser": "./dist/browser/presets/marketing.js",
        "default": "./dist/presets/marketing.js"
      },
      "./presets/video": {
        "types": "./dist/presets/video.d.ts",
        "bun": "./dist/presets/video.js",
        "node": "./dist/node/presets/video.js",
        "browser": "./dist/browser/presets/video.js",
        "default": "./dist/presets/video.js"
      },
      "./i18n": {
        "types": "./dist/i18n/index.d.ts",
        "bun": "./dist/i18n/index.js",
        "node": "./dist/node/i18n/index.js",
        "browser": "./dist/browser/i18n/index.js",
        "default": "./dist/i18n/index.js"
      },
      "./i18n/index": {
        "types": "./dist/i18n/index.d.ts",
        "bun": "./dist/i18n/index.js",
        "node": "./dist/node/i18n/index.js",
        "browser": "./dist/browser/i18n/index.js",
        "default": "./dist/i18n/index.js"
      },
      "./i18n/keys": {
        "types": "./dist/i18n/keys.d.ts",
        "bun": "./dist/i18n/keys.js",
        "node": "./dist/node/i18n/keys.js",
        "browser": "./dist/browser/i18n/keys.js",
        "default": "./dist/i18n/keys.js"
      },
      "./i18n/locale": {
        "types": "./dist/i18n/locale.d.ts",
        "bun": "./dist/i18n/locale.js",
        "node": "./dist/node/i18n/locale.js",
        "browser": "./dist/browser/i18n/locale.js",
        "default": "./dist/i18n/locale.js"
      },
      "./i18n/messages": {
        "types": "./dist/i18n/messages.d.ts",
        "bun": "./dist/i18n/messages.js",
        "node": "./dist/node/i18n/messages.js",
        "browser": "./dist/browser/i18n/messages.js",
        "default": "./dist/i18n/messages.js"
      },
      "./i18n/catalogs": {
        "types": "./dist/i18n/catalogs/index.d.ts",
        "bun": "./dist/i18n/catalogs/index.js",
        "node": "./dist/node/i18n/catalogs/index.js",
        "browser": "./dist/browser/i18n/catalogs/index.js",
        "default": "./dist/i18n/catalogs/index.js"
      },
      "./i18n/catalogs/index": {
        "types": "./dist/i18n/catalogs/index.d.ts",
        "bun": "./dist/i18n/catalogs/index.js",
        "node": "./dist/node/i18n/catalogs/index.js",
        "browser": "./dist/browser/i18n/catalogs/index.js",
        "default": "./dist/i18n/catalogs/index.js"
      },
      "./i18n/catalogs/en": {
        "types": "./dist/i18n/catalogs/en.d.ts",
        "bun": "./dist/i18n/catalogs/en.js",
        "node": "./dist/node/i18n/catalogs/en.js",
        "browser": "./dist/browser/i18n/catalogs/en.js",
        "default": "./dist/i18n/catalogs/en.js"
      },
      "./i18n/catalogs/fr": {
        "types": "./dist/i18n/catalogs/fr.d.ts",
        "bun": "./dist/i18n/catalogs/fr.js",
        "node": "./dist/node/i18n/catalogs/fr.js",
        "browser": "./dist/browser/i18n/catalogs/fr.js",
        "default": "./dist/i18n/catalogs/fr.js"
      },
      "./i18n/catalogs/es": {
        "types": "./dist/i18n/catalogs/es.d.ts",
        "bun": "./dist/i18n/catalogs/es.js",
        "node": "./dist/node/i18n/catalogs/es.js",
        "browser": "./dist/browser/i18n/catalogs/es.js",
        "default": "./dist/i18n/catalogs/es.js"
      },
      "./types": {
        "types": "./dist/types.d.ts",
        "bun": "./dist/types.js",
        "node": "./dist/node/types.js",
        "browser": "./dist/browser/types.js",
        "default": "./dist/types.js"
      }
    },
    "registry": "https://registry.npmjs.org/"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/lssm-tech/contractspec.git",
    "directory": "packages/libs/image-gen"
  },
  "homepage": "https://contractspec.io"
}
```

### 6.2 `tsconfig.json`

```json
{
  "extends": "@contractspec/tool.typescript/react-library.json",
  "include": ["src"],
  "exclude": ["node_modules", "dist"],
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  }
}
```

### 6.3 `tsdown.config.js`

```js
import { defineConfig, moduleLibrary } from '@contractspec/tool.bun';

export default defineConfig(() => ({
  ...moduleLibrary,
}));
```

## 7. Integration Points

### With `video-gen` (breaking change)

> **Cross-plan note**: The voice plan (`implementation_plan_voice.md`) also makes breaking changes to video-gen (replacing `VoiceProvider` with `VoiceSynthesizer`, removing `ScriptGenerator`, adding subtitles). Both sets of changes should be applied in a **single coordinated PR**.

video-gen gains `image-gen` as a **direct dependency**. Current video-gen `package.json` changes:

```json
{
  "dependencies": {
    "@contractspec/lib.contracts-spec": "workspace:*",
    "@contractspec/lib.contracts-integrations": "workspace:*", // ADD (currently missing despite importing from it!)
    "@contractspec/lib.content-gen": "workspace:*",
    "@contractspec/lib.design-system": "workspace:*",
    "@contractspec/lib.image-gen": "workspace:*", // ADD
    "remotion": "^4.0.0"
  }
}
```

**Pre-existing bug**: video-gen imports from `@contractspec/lib.contracts-integrations` (in `types.ts` line 8-16, `video-generator.ts` line 8-13, `scene-planner.ts` line 7-10) but does NOT list it as a dependency. Fix this as part of the breaking change.

**VideoGeneratorOptions** changes (merged with voice plan changes):

```ts
export interface VideoGeneratorOptions {
  llm?: LLMProvider;
  voice?: VoiceSynthesizer;     // BREAKING: was VoiceProvider (from voice plan)
  transcriber?: Transcriber;     // NEW (from voice plan)
  image?: ImageGenerator;        // NEW (from image plan)
  model?: string;
  temperature?: number;
  defaultVoiceId?: string;
  fps?: number;
  locale?: string;
}
```

**VideoProject** type changes in `contracts-integrations/src/integrations/providers/video.ts`:

- Add `thumbnail?: ImageProject` (image plan)
- Add `subtitles?: string` (voice plan)
- Add `voiceTimingMap?: VoiceTimingMap` (voice plan)

> **Note**: `video.ts` only exists in `contracts-integrations`, NOT in `contracts-spec` (unlike most other provider files which are mirrored). So `VideoProject` changes only go to contracts-integrations.

### With `content-gen`

Each content generator (blog, email, social, landing) can call `ImageGenerator` to produce accompanying visuals. `ImagePurpose` maps 1:1 to content-gen output types.

---

## 8. i18n, DocBlocks, Tests

Same structure as v1 plan. Keys organized by `PROMPT_KEYS`, `IMAGE_KEYS`, `PURPOSE_KEYS`. Catalogs for en/fr/es. DocBlock at `docs.image-gen.overview`. Tests cover deterministic generation, LLM mode, mock ImageProvider pipeline.

---

## 9. Implementation Order

1. **contracts-spec + contracts-integrations** (mirrored): Add `'ai-image'` to `IntegrationCategory` in `spec.ts` (BOTH packages)
2. **contracts-spec + contracts-integrations** (mirrored): Add `image.ts` with `ImageProvider` contract (BOTH packages)
3. **contracts-spec + contracts-integrations** (mirrored): Add `fal-image.ts` + `openai-image.ts` integration specs (BOTH packages)
4. **contracts-spec + contracts-integrations** (mirrored): Update `providers/index.ts` + `package.json` exports (BOTH packages)
5. `image-gen`: Scaffold (`package.json`, `tsconfig.json`, `tsdown.config.js`)
6. `image-gen`: `src/types.ts`
7. `image-gen`: `StyleResolver` -> `PromptBuilder` -> `ImageGenerator`
8. `image-gen`: Presets, i18n, docs
9. `image-gen`: Tests + AGENTS.md
10. `video-gen`: **Breaking** -- fix missing `contracts-integrations` dep, add `image-gen` dep, `ImageGenerator` in options, thumbnail generation
11. _(Coordinate with voice plan steps for the same video-gen PR)_

---

## 10. Estimated Effort

| Phase                                            | Effort         |
| ------------------------------------------------ | -------------- |
| Contract layer (mirrored in 2 packages)          | 0.75 day       |
| Package scaffold + types + generators            | 1.5 days       |
| Presets + i18n + docs                            | 0.5 day        |
| Tests                                            | 0.5 day        |
| video-gen integration (breaking, coordinated PR) | 0.5 day        |
| **Total**                                        | **~3.75 days** |

---

## 11. Validation Checklist (verified against codebase)

- [x] `IntegrationCategory` confirmed at `spec.ts` lines 8-26 (identical in both packages)
- [x] No existing `ImageProvider` contract -- confirmed missing from both packages
- [x] `providers/index.ts` barrel confirmed (identical in both packages, 39/40 lines)
- [x] `defineIntegration()` pattern confirmed from `elevenlabs.ts` (72 lines, both packages)
- [x] `package.json` exports pattern confirmed from `content-gen` (227 lines, dual exports + publishConfig)
- [x] `tsconfig.json` extends `@contractspec/tool.typescript/react-library.json` (confirmed)
- [x] `tsdown.config.js` uses `{ ...moduleLibrary }` from `@contractspec/tool.bun` (confirmed)
- [x] `ContentBrief` shape confirmed: `{ title, summary, problems[], solutions[], metrics?, proofPoints?, audience, callToAction?, references? }`
- [x] `video-gen` missing `contracts-integrations` dependency (pre-existing bug, fix as part of breaking change)
- [x] `video.ts` (VideoProject) exists ONLY in `contracts-integrations`, not mirrored in `contracts-spec`
- [x] Fal integration spec uses `StabilityEnum` from `@contractspec/lib.contracts-spec/ownership` (confirmed)

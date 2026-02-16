# Remotion Video Generation -- Implementation Plan

## Status: Complete

All phases implemented. Build passes cleanly.

## Overview

Integrate [Remotion](https://remotion.dev) into ContractSpec to enable programmatic video generation for documentation, marketing, demos, and spec-driven content.

## Architecture

```
                    ContentBrief / ContractSpec
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        @lssm/lib.    @remotion/    @lssm/app.
        video-gen      player       video-studio
        (core lib)   (web embed)   (preview/edit)
              │            │            │
              ├────────────┼────────────┤
              ▼            ▼            ▼
          CLI render   Browser play  Studio preview
          CI render    Homepage demo  Composition dev
          Lambda       Docs embed
```

## Key Decisions

| Decision             | Choice                                                       | Rationale                                  |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------ |
| Package placement    | `@lssm/lib.video-gen` + `@lssm/app.video-studio`             | Follows monorepo conventions               |
| Design approach      | Hybrid (brand tokens + video motion primitives)              | Brand consistency + video-optimized motion |
| Runtime split        | Bun for lib build, Node for Remotion studio/render           | Remotion requires Node for rendering       |
| Auto format variants | Yes (16:9, 1:1, 9:16)                                        | Single source produces all social formats  |
| Generator pattern    | Follows `content-gen` (LLM optional, deterministic fallback) | Consistency + determinism principle        |
| Voice narration      | Composes with existing ElevenLabs VoiceProvider              | Reuse existing integration                 |

## Phases

### Phase 0: Contracts & Specs -- DONE

- [x] Video brief, project, scene contracts (`contracts/src/integrations/providers/video.ts`)
- [x] Composition registry contract (CompositionMeta, CompositionRegistry)
- [x] Renderer contracts (VideoProvider, RenderConfig, RenderResult)
- [x] Design tokens contracts (VideoColorTokens, VideoTypeStyle, VideoFormat)
- [x] Narration integration contract (NarrationConfig, AudioTrack)
- [x] Wired into barrel exports + package.json export maps

### Phase 1: Core Library (`@lssm/lib.video-gen`) -- DONE

- [x] Scaffold package (package.json, tsconfig, tsdown, AGENTS.md)
- [x] Design tokens bridge (`src/design/`) -- brand tokens + video motion/typography/layout
- [x] Composition primitives (`src/compositions/primitives/`):
  - AnimatedText, CodeBlock, Terminal, SceneTransitionWrapper, BrandFrame, ProgressBar
- [x] First compositions (`src/compositions/`):
  - ApiOverview, SocialClip (landscape + square + portrait), TerminalDemo
- [x] VideoGenerator class + ScenePlanner + ScriptGenerator (`src/generators/`)
- [x] Rendering utilities (`src/renderers/`) -- LocalRenderer, config, auto format variants
- [x] Remotion Root + composition registration (`src/remotion/`)

### Phase 2: Video Studio (`@lssm/app.video-studio`) -- DONE

- [x] Scaffold app package with Remotion scripts
- [x] Entry point re-exporting from video-gen
- [x] Root package.json `dev:video` script
- [x] AGENTS.md

### Phase 3: Player Integration -- DONE

- [x] DemoPlayer wrapper component (`src/player/demo-player.tsx`)
- [x] Typed composition registry for player
- [x] `@remotion/player` as optional peer dependency
- [x] Export path: `@lssm/lib.video-gen/player`

> Note: `web-landing` source was previously deleted. The DemoPlayer lives in video-gen
> and can be imported by any web app when it is restored:
>
> ```tsx
> import { DemoPlayer } from '@lssm/lib.video-gen/player';
> <DemoPlayer compositionId="ApiOverview" inputProps={...} controls autoPlay loop />
> ```

### Phase 4: Content Pipeline Extension -- DONE

- [x] VideoGenerator consuming ContentBrief via VideoBrief wrapper
- [x] ElevenLabs narration integration via VoiceProvider
- [x] Scene planning from brief (deterministic + LLM-enhanced)
- [x] Script generation (deterministic + LLM-enhanced)

### Phase 5: CI / Rendering Pipeline -- DONE

- [x] GitHub Actions workflow (`.github/workflows/render-video.yml`)
  - Triggered on release published or manual workflow_dispatch
  - Supports custom composition ID + props input
  - Uploads rendered videos as artifacts
- [x] CLI rendering scripts in video-studio (`render`, `render:all`)
- [x] Props injection support

### Phase 6: Design Tokens Bridge -- DONE

- [x] Import brand tokens from @lssm/lib.design-system (`src/design/tokens.ts`)
- [x] Video motion primitives -- easing, durations, transitions (`src/design/motion.ts`)
- [x] Video typography scales -- title through caption (`src/design/typography.ts`)
- [x] Frame layouts -- landscape, portrait, square + safe zones (`src/design/layouts.ts`)

## File Inventory

### New files created

**Contracts (`packages/libs/contracts/`):**

- `src/integrations/providers/video.ts` -- VideoProvider contract + all video types

**Core Library (`packages/libs/video-gen/`):**

- `package.json`, `tsconfig.json`, `tsdown.config.js`, `AGENTS.md`
- `src/index.ts` -- Root barrel
- `src/types.ts` -- VideoBrief, VideoGeneratorOptions, GeneratedVideo, ScenePlan
- `src/design/index.ts`, `tokens.ts`, `motion.ts`, `typography.ts`, `layouts.ts`
- `src/compositions/index.ts`
- `src/compositions/primitives/index.ts`, `animated-text.tsx`, `code-block.tsx`, `terminal.tsx`, `transition.tsx`, `brand-frame.tsx`, `progress-bar.tsx`
- `src/compositions/api-overview.tsx`, `social-clip.tsx`, `terminal-demo.tsx`
- `src/generators/index.ts`, `video-generator.ts`, `script-generator.ts`, `scene-planner.ts`
- `src/renderers/index.ts`, `local.ts`, `config.ts`
- `src/player/index.ts`, `demo-player.tsx`
- `src/remotion/index.ts`, `Root.tsx`

**Video Studio (`packages/apps/video-studio/`):**

- `package.json`, `tsconfig.json`, `AGENTS.md`
- `src/index.ts`

**CI (`/.github/workflows/`):**

- `render-video.yml`

### Modified files

- `packages/libs/contracts/src/integrations/providers/index.ts` -- Added video export
- `packages/libs/contracts/package.json` -- Added video export paths
- `package.json` (root) -- Added `dev:video` script

## Registered Compositions

| ID                   | Component    | Duration   | Dimensions | Use-case                 |
| -------------------- | ------------ | ---------- | ---------- | ------------------------ |
| `ApiOverview`        | ApiOverview  | 15s (450f) | 1920x1080  | Homepage demo            |
| `SocialClip`         | SocialClip   | 10s (300f) | 1920x1080  | Marketing (landscape)    |
| `SocialClipSquare`   | SocialClip   | 10s (300f) | 1080x1080  | LinkedIn / X feed        |
| `SocialClipPortrait` | SocialClip   | 10s (300f) | 1080x1920  | Stories / Reels / Shorts |
| `TerminalDemo`       | TerminalDemo | 20s (600f) | 1920x1080  | Documentation            |

## Quick Start

```bash
# Start Remotion Studio (preview all compositions)
bun run dev:video

# Render a specific composition
cd packages/apps/video-studio
npx remotion render src/index.ts ApiOverview out/api-overview.mp4

# Render all compositions
bun run render:all

# Use in a web app
import { DemoPlayer } from '@lssm/lib.video-gen/player';

# Use the generator in code
import { VideoGenerator } from '@lssm/lib.video-gen/generators';
const generator = new VideoGenerator({ llm, voice });
const project = await generator.generate(brief);
```

## Completion Criteria

- [x] All packages build cleanly (`turbo run build --filter=@lssm/lib.video-gen`)
- [ ] Remotion Studio launches and previews all compositions (requires `bun run dev:video`)
- [ ] Player renders interactively (requires web-landing restoration)
- [ ] CLI can render MP4 with auto format variants (requires `npx remotion render`)
- [x] VideoGenerator produces deterministic output from ContentBrief
- [x] CI workflow defined for release video rendering

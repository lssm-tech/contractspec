# @contractspec/lib.video-gen

Website: https://contractspec.io/

Programmatic video generation using Remotion. Follows the same generator pattern as `@contractspec/lib.content-gen` and consumes contracts from video provider integrations. All generators work deterministically by default -- LLM integration is optional and enhances output when available.

## Modules

- **Types** -- `VideoBrief`, `VideoGeneratorOptions`, `GeneratedVideo`, `ScenePlan`, `PlannedScene`, plus re-exported contract types (`VideoProject`, `RenderConfig`, `VideoFormat`)
- **Design** -- Video-specific design tokens extending the design system: color tokens, motion/easing curves, typography scale (1920x1080), and layout safe zones with format variants (landscape/square/portrait)
- **Compositions** -- Remotion compositions for rendering video scenes:
  - **Primitives**: `AnimatedText`, `BrandFrame`, `CodeBlock`, `ProgressBar`, `Terminal`, `SceneTransitionWrapper`
  - **Full**: `ApiOverview` (spec to API surface visualization), `SocialClip` (marketing content, adaptive formats), `TerminalDemo` (CLI walkthrough)
- **Generators** -- `VideoGenerator` (main orchestrator), `ScenePlanner` (breaks briefs into scenes), `ScriptGenerator` (narration with professional/casual/technical styles)
- **Renderers** -- `LocalRenderer` wrapping `@remotion/renderer` with quality presets (draft/standard/high)
- **Player** -- `DemoPlayer` component for embedding in React apps via `@remotion/player`

Deterministic by default: every generator produces consistent output without an LLM. When an LLM is provided via the constructor, generators produce richer, more varied content. On LLM failure, the system falls back to deterministic output automatically.

## Quickstart

```typescript
import { VideoGenerator } from "@contractspec/lib.video-gen/generators";
import type { VideoBrief } from "@contractspec/lib.video-gen/types";

const generator = new VideoGenerator(); // no LLM needed

const brief: VideoBrief = {
  title: "Ship APIs 10x Faster",
  summary: "See how ContractSpec generates production-ready APIs from specs.",
  format: "landscape",
};

const project = await generator.generate(brief);
```

Compositions are pure React components -- same props always produce the same visual output, with frame-based timing and no side effects.

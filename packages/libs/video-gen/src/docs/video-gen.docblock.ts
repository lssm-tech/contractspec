import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const videoGenDocBlocks: DocBlock[] = [
  {
    id: 'docs.video-gen.overview',
    title: 'Video Generation Library',
    summary:
      'Programmatic video generation with Remotion -- from content brief to rendered MP4 in a single pipeline.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/video-gen/overview',
    tags: ['video', 'remotion', 'generation', 'content-pipeline'],
    owners: ['@contractspec/lib.video-gen'],
    body: `# Video Generation Library

\`@contractspec/lib.video-gen\` provides **programmatic video generation** using [Remotion](https://remotion.dev). It follows the same generator pattern as \`@contractspec/lib.content-gen\` and consumes provider contracts from \`@contractspec/lib.contracts-integrations/integrations/providers/video\`.

## Architecture

The library is organized into five layers, each buildable and testable independently:

\`\`\`
Content Brief
    |
    v
Generators -----> ScenePlanner (brief -> scenes)
    |              ScriptGenerator (brief -> narration)
    |              VideoGenerator (orchestrator)
    v
Compositions ---> Primitives (AnimatedText, CodeBlock, Terminal, ...)
    |              Full Compositions (ApiOverview, SocialClip, TerminalDemo)
    v
Design ---------> Tokens, Motion, Typography, Layouts
    |
    v
Renderers ------> LocalRenderer (@remotion/renderer)
                   DemoPlayer (@remotion/player, web embedding)
\`\`\`

### Layer Responsibilities

| Layer | Import Path | Purpose |
|-------|-------------|---------|
| **Types** | \`@contractspec/lib.video-gen/types\` | VideoBrief, ScenePlan, GeneratedVideo, re-exported contract types |
| **Design** | \`@contractspec/lib.video-gen/design\` | Video-optimized tokens, motion primitives, typography, layouts |
| **Compositions** | \`@contractspec/lib.video-gen/compositions\` | Remotion components (primitives + full compositions) |
| **Generators** | \`@contractspec/lib.video-gen/generators\` | VideoGenerator, ScenePlanner, ScriptGenerator |
| **Renderers** | \`@contractspec/lib.video-gen/renderers\` | LocalRenderer, render config, quality presets |
| **Player** | \`@contractspec/lib.video-gen/player\` | Embeddable DemoPlayer for web apps |
| **Remotion** | \`@contractspec/lib.video-gen/remotion\` | Remotion Studio entry point (registerRoot) |

## Getting Started

### 1. Generate a video project from a content brief

\`\`\`ts
import { VideoGenerator } from "@contractspec/lib.video-gen/generators";
import { VIDEO_FORMATS } from "@contractspec/lib.video-gen/types";
import type { VideoBrief } from "@contractspec/lib.video-gen/types";

const generator = new VideoGenerator({ fps: 30 });

const brief: VideoBrief = {
  content: {
    title: "Ship APIs 10x Faster",
    summary: "ContractSpec generates everything from a single spec.",
    problems: ["Manual API maintenance", "Inconsistent surfaces"],
    solutions: ["One spec, every surface", "Safe regeneration"],
    callToAction: "Try ContractSpec",
  },
  format: VIDEO_FORMATS.landscape,
  targetDurationSeconds: 30,
};

const project = await generator.generate(brief);
\`\`\`

### 2. Render to MP4

\`\`\`ts
import { LocalRenderer } from "@contractspec/lib.video-gen/renderers/local";

const renderer = new LocalRenderer({
  entryPoint: "./src/remotion/index.ts",
});

const result = await renderer.render(project, {
  outputPath: "out/video.mp4",
});
\`\`\`

### 3. Embed in a web app

\`\`\`tsx
import { DemoPlayer } from "@contractspec/lib.video-gen/player";

<DemoPlayer
  compositionId="ApiOverview"
  inputProps={{ specName: "CreateUser", specCode: "..." }}
  controls
  autoPlay
  loop
/>
\`\`\`

## Contract Bridge

The library consumes provider contracts defined in \`@contractspec/lib.contracts-integrations\`:

| Contract | Purpose |
|----------|---------|
| \`VideoProvider\` | Renderer abstraction (local, Lambda, Cloud Run) |
| \`VideoProject\` | Scene graph with format, fps, audio tracks |
| \`RenderConfig\` / \`RenderResult\` | Codec, quality, output path, dimensions |
| \`CompositionRegistry\` | Metadata for registered Remotion compositions |
| \`VideoFormat\` | Landscape / portrait / square / custom dimensions |

Types are re-exported from the main entry for convenience:

\`\`\`ts
import type { VideoProject, RenderConfig } from "@contractspec/lib.video-gen";
\`\`\`

## Deterministic by Default

All generators support two modes:

- **Without LLM**: Fully deterministic, template-based output. Same brief always produces the same video project.
- **With LLM**: Richer scene planning and narration scripts via an optional \`LLMProvider\`. Falls back to deterministic on any failure.

This matches the content-gen pattern: \`constructor({ llm? })\` -> \`generate(brief)\`.

## Guardrails

- Compositions must be **deterministic**: same props = same visual output.
- Design tokens bridge from \`@contractspec/lib.design-system\` -- do not duplicate brand values.
- \`LocalRenderer\` requires Node.js (\`@remotion/renderer\` is not Bun-compatible).
- The \`remotion\` entry point is a side-effect module (calls \`registerRoot\`) -- import it only from Remotion Studio or render scripts.
`,
  },
];

registerDocBlocks(videoGenDocBlocks);

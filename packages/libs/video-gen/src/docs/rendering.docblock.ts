import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const renderingDocBlocks: DocBlock[] = [
  {
    id: 'docs.video-gen.rendering',
    title: 'Video Rendering & Playback',
    summary:
      'LocalRenderer for MP4 output, render configuration, quality presets, DemoPlayer for web embedding, and Remotion Studio setup.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/video-gen/rendering',
    tags: [
      'video',
      'rendering',
      'remotion',
      'player',
      'mp4',
      'quality-presets',
    ],
    owners: ['@contractspec/lib.video-gen'],
    body: `# Video Rendering & Playback

The rendering layer wraps \`@remotion/renderer\` for MP4/WebM output and \`@remotion/player\` for interactive web embedding. It implements the \`VideoProvider\` contract from \`@contractspec/lib.contracts-integrations\`.

## LocalRenderer

Renders a \`VideoProject\` to a video file using the local Remotion renderer. Requires **Node.js** (not Bun-compatible).

\`\`\`ts
import { LocalRenderer } from "@contractspec/lib.video-gen/renderers/local";

const renderer = new LocalRenderer({
  entryPoint: "./src/remotion/index.ts",
});

const result = await renderer.render(project, {
  outputPath: "out/video.mp4",
  codec: "h264",
  crf: 18,
});

result.outputPath;      // "out/video.mp4"
result.format;          // "mp4"
result.durationSeconds; // total duration
result.fileSizeBytes;   // file size
result.dimensions;      // { width: 1920, height: 1080 }
\`\`\`

> **Important**: Import \`LocalRenderer\` from the \`/renderers/local\` subpath, not from the main entry. It dynamically imports \`@remotion/bundler\` and \`@remotion/renderer\` which are Node.js-only.

### Auto-Variants

Set \`autoVariants: true\` to generate landscape + square + portrait versions:

\`\`\`ts
const result = await renderer.render(project, {
  outputPath: "out/video.mp4",
  autoVariants: true,
});

result.variants; // [
//   { outputPath: "out/video-square.mp4", dimensions: { width: 1080, height: 1080 } },
//   { outputPath: "out/video-portrait.mp4", dimensions: { width: 1080, height: 1920 } },
// ]
\`\`\`

## Render Configuration

### Defaults

\`\`\`ts
import {
  defaultRenderConfig,
  resolveRenderConfig,
  qualityPresets,
  codecFormatMap,
} from "@contractspec/lib.video-gen/renderers/config";

defaultRenderConfig.codec;       // "h264"
defaultRenderConfig.outputFormat; // "mp4"
defaultRenderConfig.crf;         // 18
defaultRenderConfig.pixelFormat; // "yuv420p"
\`\`\`

### RenderConfig Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| \`outputPath\` | \`string\` | -- | **Required**. Output file path |
| \`codec\` | \`"h264" \\| "h265" \\| "vp8" \\| "vp9"\` | \`"h264"\` | Video codec |
| \`outputFormat\` | \`"mp4" \\| "webm" \\| "gif"\` | \`"mp4"\` | Container format |
| \`crf\` | \`number\` | \`18\` | Constant Rate Factor (lower = better quality) |
| \`pixelFormat\` | \`string\` | \`"yuv420p"\` | Pixel format |
| \`concurrency\` | \`number\` | CPU count | Rendering threads |
| \`autoVariants\` | \`boolean\` | \`false\` | Generate format variants |

### Quality Presets

\`\`\`ts
import { resolveRenderConfig } from "@contractspec/lib.video-gen/renderers/config";

// Draft (fastest, for previews)
resolveRenderConfig({ outputPath: "out/preview.mp4" }, "draft");
// -> crf: 28, concurrency: 1

// Standard (balanced)
resolveRenderConfig({ outputPath: "out/video.mp4" }, "standard");
// -> crf: 18

// High (best quality, for final output)
resolveRenderConfig({ outputPath: "out/final.mp4" }, "high");
// -> crf: 12
\`\`\`

### Codec-to-Format Mapping

| Codec | Format |
|-------|--------|
| \`h264\` | \`mp4\` |
| \`h265\` | \`mp4\` |
| \`vp8\` | \`webm\` |
| \`vp9\` | \`webm\` |

## DemoPlayer (Web Embedding)

Embeddable Remotion Player for interactive video demos in React apps. Wraps \`@remotion/player\` with ContractSpec compositions.

\`\`\`tsx
import { DemoPlayer } from "@contractspec/lib.video-gen/player";

<DemoPlayer
  compositionId="ApiOverview"
  inputProps={{
    specName: "CreateUser",
    specCode: "export const createUser = defineCommand({...})",
  }}
  controls
  autoPlay
  loop
  width="100%"
  clickToPlay
  doubleClickToFullscreen
/>
\`\`\`

### DemoPlayer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`compositionId\` | \`"ApiOverview" \\| "SocialClip" \\| "TerminalDemo"\` | -- | Composition to play |
| \`inputProps\` | composition props type | -- | Props for the selected composition |
| \`controls\` | \`boolean\` | \`true\` | Show playback controls |
| \`autoPlay\` | \`boolean\` | \`false\` | Auto-play on mount |
| \`loop\` | \`boolean\` | \`false\` | Loop playback |
| \`width\` | \`string \\| number\` | \`"100%"\` | Player width |
| \`height\` | \`string \\| number\` | \`"auto"\` | Player height |
| \`clickToPlay\` | \`boolean\` | \`true\` | Click to toggle playback |
| \`doubleClickToFullscreen\` | \`boolean\` | \`true\` | Double-click for fullscreen |

> \`@remotion/player\` is a peer dependency. Install it in your app if you use \`DemoPlayer\`.

## Remotion Studio

The \`@contractspec/app.video-studio\` package provides a Remotion Studio entry point for previewing compositions interactively.

\`\`\`bash
# Start Remotion Studio
bun run dev:video

# Render a specific composition
npx remotion render src/index.ts ApiOverview out/api-overview.mp4

# Render all compositions
bun run render:all
\`\`\`

### Registered Compositions

| ID | Component | Dimensions | Duration | Description |
|----|-----------|------------|----------|-------------|
| \`ApiOverview\` | \`ApiOverview\` | 1920x1080 | 450 frames (15s) | Homepage API demo |
| \`SocialClip\` | \`SocialClip\` | 1920x1080 | 300 frames (10s) | Landscape social clip |
| \`SocialClipSquare\` | \`SocialClip\` | 1080x1080 | 300 frames (10s) | Square social clip |
| \`SocialClipPortrait\` | \`SocialClip\` | 1080x1920 | 300 frames (10s) | Portrait social clip |
| \`TerminalDemo\` | \`TerminalDemo\` | 1920x1080 | 600 frames (20s) | CLI walkthrough |

All compositions run at 30fps.

## Guardrails

- \`LocalRenderer\` requires Node.js -- do not attempt to use it in browser or Bun environments.
- Import \`LocalRenderer\` from the \`/renderers/local\` subpath to avoid bundling \`@remotion/renderer\` in browser builds.
- The \`remotion\` entry point (\`@contractspec/lib.video-gen/remotion\`) is a **side-effect module** that calls \`registerRoot()\`. Only import it from Remotion Studio or render scripts.
- Use quality presets for consistency: \`draft\` for development, \`standard\` for CI, \`high\` for releases.
`,
  },
];

registerDocBlocks(renderingDocBlocks);

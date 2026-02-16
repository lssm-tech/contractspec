import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const compositionsDocBlocks: DocBlock[] = [
  {
    id: 'docs.video-gen.compositions',
    title: 'Video Compositions & Primitives',
    summary:
      'Remotion composition components and reusable primitives for building programmatic videos.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/video-gen/compositions',
    tags: ['video', 'remotion', 'compositions', 'primitives', 'react'],
    owners: ['@contractspec/lib.video-gen'],
    body: `# Video Compositions & Primitives

Compositions are React components rendered by Remotion. They use \`useCurrentFrame()\`, \`useVideoConfig()\`, and \`interpolate()\` to produce frame-accurate animations. All compositions must be **deterministic**: same props = same visual output.

## Primitive Components

Primitives are reusable building blocks for constructing full compositions.

\`\`\`ts
import {
  AnimatedText,
  CodeBlock,
  Terminal,
  BrandFrame,
  ProgressBar,
  SceneTransitionWrapper,
} from "@contractspec/lib.video-gen/compositions/primitives";
\`\`\`

### AnimatedText

Text with entrance/exit slide + fade animations.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`text\` | \`string\` | -- | Text content |
| \`variant\` | \`keyof videoTypography\` | \`"body"\` | Typography preset (title, heading, subheading, body, code, caption, label) |
| \`enterAt\` | \`number\` | \`0\` | Frame at which text enters |
| \`exitAt\` | \`number\` | -- | Frame at which text exits (omit to keep visible) |
| \`color\` | \`string\` | \`"#ffffff"\` | Text color |
| \`align\` | \`"left" \\| "center" \\| "right"\` | \`"left"\` | Text alignment |

### CodeBlock

Syntax-aware code display with typing animation and macOS-style title bar.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`code\` | \`string\` | -- | Code string to display |
| \`language\` | \`string\` | \`"typescript"\` | Language label in the title bar |
| \`startAt\` | \`number\` | \`0\` | Frame at which typing starts |
| \`typeAnimation\` | \`boolean\` | \`true\` | Animate character-by-character typing |
| \`filename\` | \`string\` | -- | Filename in the title bar (overrides language) |

### Terminal

CLI simulator with command typing, output lines, and cursor animation.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`lines\` | \`TerminalLine[]\` | -- | Lines to display in sequence |
| \`startAt\` | \`number\` | \`0\` | Frame at which terminal appears |
| \`prompt\` | \`string\` | \`"$ "\` | Prompt string before commands |
| \`title\` | \`string\` | \`"Terminal"\` | Title bar text |
| \`typingSpeed\` | \`number\` | \`2\` | Frames per character for commands |

\`TerminalLine\` types: \`command\` (typed), \`output\` (faded in), \`error\` (red), \`success\` (green), \`comment\` (dimmed with \`#\` prefix).

### BrandFrame

Branded container with safe-zone padding, gradient/solid/dark backgrounds, and optional watermark.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`variant\` | \`"solid" \\| "gradient" \\| "dark"\` | \`"gradient"\` | Background style |
| \`showBranding\` | \`boolean\` | \`true\` | Show "ContractSpec" watermark |
| \`animateEntrance\` | \`boolean\` | \`true\` | Fade-in on first frames |
| \`styleOverrides\` | \`VideoStyleOverrides\` | -- | Override colors, fonts, dark mode |

### ProgressBar

Thin progress indicator at the top or bottom of the frame.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`height\` | \`number\` | \`4\` | Bar height in pixels |
| \`color\` | \`string\` | primary color | Bar fill color |
| \`position\` | \`"top" \\| "bottom"\` | \`"bottom"\` | Placement |

### SceneTransitionWrapper

Wraps children with entrance/exit transitions (fade, slide-left, slide-right, wipe).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`type\` | \`SceneTransitionType\` | -- | Transition type |
| \`durationInFrames\` | \`number\` | -- | Transition duration |
| \`direction\` | \`"in" \\| "out"\` | -- | Entering or exiting |

## Full Compositions

Full compositions combine primitives into complete video templates. They are registered in Remotion Studio via \`RemotionRoot\`.

### ApiOverview

Visualizes a ContractSpec definition generating a full API surface. Used for homepage demos and documentation.

\`\`\`tsx
import { ApiOverview } from "@contractspec/lib.video-gen/compositions/api-overview";

<ApiOverview
  specName="CreateUser"
  method="POST"
  endpoint="/api/users"
  specCode={\`export const createUser = defineCommand({...})\`}
  generatedOutputs={["REST Endpoint", "GraphQL Mutation", "Prisma Model"]}
  tagline="One spec. Every surface."
/>
\`\`\`

**Scenes**: Title + method badge -> Code typing animation -> Generated outputs fan-out -> Tagline.

### SocialClip

Short-form marketing content for LinkedIn, X, YouTube Shorts. Adapts layout for landscape (16:9), square (1:1), and portrait (9:16).

\`\`\`tsx
import { SocialClip } from "@contractspec/lib.video-gen/compositions/social-clip";

<SocialClip
  hook="Stop rewriting the same API logic."
  message="Generate REST, GraphQL, DB, SDK from a single spec."
  points={["Deterministic output", "Fully ejectable", "No lock-in"]}
  cta="Try ContractSpec"
  ctaUrl="contractspec.dev"
/>
\`\`\`

**Scenes**: Hook (attention grabber) -> Main message -> Supporting points -> CTA button.

### TerminalDemo

CLI command walkthrough with animated terminal. Used in documentation and tutorial videos.

\`\`\`tsx
import { TerminalDemo } from "@contractspec/lib.video-gen/compositions/terminal-demo";

<TerminalDemo
  title="Getting Started with ContractSpec"
  subtitle="Define once, generate everything."
  lines={[
    { type: "command", text: "npx contractspec init my-api" },
    { type: "output", text: "Created my-api/ with 3 sample contracts" },
    { type: "command", text: "npx contractspec build" },
    { type: "success", text: "Built 3 contracts -> 18 generated files" },
  ]}
  summary="Ship faster. Stay coherent."
/>
\`\`\`

**Scenes**: Title + subtitle -> Terminal typing animation -> Summary.

## Creating New Compositions

1. Create a new \`.tsx\` file in \`src/compositions/\`.
2. Use primitives from \`./primitives/\` and design tokens from \`../design/\`.
3. Use \`useCurrentFrame()\` and \`interpolate()\` for frame-based animations.
4. Register in \`src/remotion/Root.tsx\` with a \`<Composition>\` entry.
5. Export from \`src/compositions/index.ts\`.
6. Add the export path to \`package.json\` (both workspace and publishConfig).

### Guardrails

- Keep compositions **pure**: no side effects, no network calls, no randomness.
- Use \`scaleSafeZone()\` and \`scaleTypography()\` to support multiple formats.
- All timing should be frame-based (not time-based) for deterministic output.
`,
  },
];

registerDocBlocks(compositionsDocBlocks);

import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.video-api-showcase',
    title: 'Video API Showcase (example)',
    summary:
      'Spec-driven example: build API overview videos directly from contract spec metadata using manual VideoProject construction.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/video-api-showcase',
    tags: ['video', 'api', 'spec-driven', 'example'],
    body: `## What this example shows

- Manually constructing a \`VideoProject\` from contract spec metadata (name, method, endpoint, code, outputs).
- Using the \`ApiOverview\` composition to visualize how a spec generates multiple API surfaces.
- Configuring render settings with quality presets (\`draft\`, \`standard\`, \`high\`).
- Building video scenes with explicit composition IDs and props.

## Key concepts

- **Spec-to-Video**: Contract spec metadata (name, method, endpoint, code snippet) becomes the input props for the \`ApiOverview\` composition.
- **Manual project construction**: Instead of using \`VideoGenerator\`, this example builds the \`VideoProject\` directly -- useful when you know exactly which composition and props to use.
- **Render configuration**: Shows how to use \`resolveRenderConfig()\` with quality presets for different output needs.

## Notes

- This approach is ideal when the video structure is known ahead of time (e.g., always an API overview).
- For dynamic scene planning from content briefs, use \`VideoGenerator\` instead (see the video-marketing-clip example).
`,
  },
  {
    id: 'docs.examples.video-api-showcase.usage',
    title: 'Video API Showcase -- Usage',
    summary:
      'How to generate API overview videos from contract spec definitions.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/video-api-showcase/usage',
    tags: ['video', 'api', 'usage'],
    body: `## Usage

\`\`\`ts
import { buildApiVideo } from "@contractspec/example.video-api-showcase/build-api-video";
import { createUserSpec, listTransactionsSpec } from "@contractspec/example.video-api-showcase/sample-specs";

// Build a video project for a single API spec
const project = buildApiVideo(createUserSpec);

console.log(project.scenes[0].compositionId); // "ApiOverview"
console.log(project.format);                   // { type: "landscape", width: 1920, height: 1080 }

// Build with custom duration and tagline
const custom = buildApiVideo(listTransactionsSpec, {
  durationInFrames: 600,
  tagline: "From spec to production in seconds.",
});
\`\`\`

## Guardrails

- The \`specCode\` field should be a concise snippet (10-20 lines) for readability in the video.
- Generated outputs list should contain 3-8 items for optimal visual layout.
- Tagline should be short (under 40 characters) to fit within the composition frame.
`,
  },
];

registerDocBlocks(blocks);

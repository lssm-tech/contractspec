import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.video-marketing-clip',
    title: 'Video Marketing Clips (example)',
    summary:
      'End-to-end example: generate short-form social clips from content briefs using the deterministic video-gen pipeline.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/video-marketing-clip',
    tags: ['video', 'marketing', 'social-clip', 'example'],
    body: `## What this example shows

- Building a \`VideoBrief\` from a \`ContentBrief\` with format, duration, and style settings.
- Using \`VideoGenerator\` in fully deterministic mode (no LLM) to produce a \`VideoProject\`.
- Generating video projects for all three social formats: landscape (16:9), square (1:1), and portrait (9:16).
- Accessing the resulting scene graph, durations, and composition props.

## Key concepts

- **ContentBrief**: The narrative source (title, problems, solutions, CTA) from \`@contractspec/lib.content-gen\`.
- **VideoBrief**: Wraps ContentBrief with video-specific config (format, duration, narration, style).
- **VideoGenerator**: Orchestrates scene planning and project assembly. Deterministic by default.
- **VideoProject**: The output scene graph ready for rendering or preview.

## Notes

- No LLM or voice provider is needed -- the pipeline is fully deterministic.
- The example does not render to MP4 (that requires Node.js + \`@remotion/renderer\`). It produces the \`VideoProject\` data structure.
`,
  },
  {
    id: 'docs.examples.video-marketing-clip.usage',
    title: 'Video Marketing Clips -- Usage',
    summary: 'How to generate marketing video projects from content briefs.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/video-marketing-clip/usage',
    tags: ['video', 'marketing', 'usage'],
    body: `## Usage

\`\`\`ts
import { generateMarketingClip } from "@contractspec/example.video-marketing-clip/generate-clip";
import { productLaunchBrief } from "@contractspec/example.video-marketing-clip/briefs";

// Generate a landscape video project
const project = await generateMarketingClip(productLaunchBrief, "landscape");

console.log(project.scenes.length);          // number of scenes
console.log(project.totalDurationInFrames);  // total frames
console.log(project.format);                 // { type: "landscape", width: 1920, height: 1080 }

// Generate all three format variants
const landscapes = await generateMarketingClip(productLaunchBrief, "landscape");
const square = await generateMarketingClip(productLaunchBrief, "square");
const portrait = await generateMarketingClip(productLaunchBrief, "portrait");
\`\`\`

## Guardrails

- Keep content briefs concise -- the deterministic planner maps each section to a 2-5 second scene.
- Target duration defaults to ~17 seconds if not specified. Set \`targetDurationSeconds\` for precise control.
- The generated \`VideoProject\` is a data structure, not a rendered file. Use \`LocalRenderer\` for MP4 output.
`,
  },
];

registerDocBlocks(blocks);

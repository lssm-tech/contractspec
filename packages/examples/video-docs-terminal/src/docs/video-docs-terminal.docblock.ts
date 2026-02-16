import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.video-docs-terminal',
    title: 'Video Docs Terminal (example)',
    summary:
      'Generate terminal demo videos from CLI walkthroughs using the TerminalDemo composition and ScriptGenerator.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/video-docs-terminal',
    tags: ['video', 'documentation', 'terminal', 'cli', 'example'],
    body: `## What this example shows

- Defining CLI tutorials as structured \`CliTutorial\` objects with \`TerminalLine\` arrays.
- Building single-scene and multi-scene \`VideoProject\` instances using the \`TerminalDemo\` composition.
- Using \`ScriptGenerator\` (deterministic, no LLM) to generate narration from tutorial content briefs.
- Assembling a full documentation video covering init, build, validate, and deploy workflows.

## Key concepts

- **CliTutorial**: Combines \`TerminalLine[]\` (commands + output) with a \`ContentBrief\` for narration.
- **TerminalDemo**: The Remotion composition that renders animated terminal sessions.
- **ScriptGenerator**: Produces narration scripts from content briefs. Deterministic by default.
- **VideoProject**: The output scene graph -- one scene per tutorial, ready for rendering or preview.

## Notes

- No LLM or voice provider is needed -- the pipeline is fully deterministic.
- Each tutorial maps to one \`TerminalDemo\` scene in the final video project.
- The example produces the \`VideoProject\` data structure, not rendered MP4. Use \`LocalRenderer\` for final output.
`,
  },
  {
    id: 'docs.examples.video-docs-terminal.usage',
    title: 'Video Docs Terminal -- Usage',
    summary:
      'How to generate terminal demo videos and narration from CLI tutorials.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/video-docs-terminal/usage',
    tags: ['video', 'terminal', 'usage'],
    body: `## Usage

### Build a single tutorial video

\`\`\`ts
import { buildTutorialVideo } from "@contractspec/example.video-docs-terminal/build-tutorial";
import { initTutorial } from "@contractspec/example.video-docs-terminal/sample-tutorials";

const project = buildTutorialVideo(initTutorial);

console.log(project.scenes.length);          // 1
console.log(project.scenes[0].compositionId); // "TerminalDemo"
console.log(project.totalDurationInFrames);   // 360 (12s × 30fps)
\`\`\`

### Build a multi-scene tutorial suite

\`\`\`ts
import { buildTutorialSuite } from "@contractspec/example.video-docs-terminal/build-tutorial";
import { allTutorials } from "@contractspec/example.video-docs-terminal/sample-tutorials";

const project = buildTutorialSuite(allTutorials);

console.log(project.scenes.length); // 4 (init, build, validate, deploy)
\`\`\`

### Generate narration

\`\`\`ts
import { generateTutorialNarration } from "@contractspec/example.video-docs-terminal/generate-narration";
import { buildTutorial } from "@contractspec/example.video-docs-terminal/sample-tutorials";

const narration = await generateTutorialNarration(buildTutorial);

console.log(narration.fullText);              // Full narration text
console.log(narration.segments.length);       // Per-scene segments
console.log(narration.estimatedDurationSeconds); // ~12s
\`\`\`

## Guardrails

- Keep terminal lines concise -- long output slows the typing animation.
- Target 10-15 lines per tutorial for optimal pacing at 12 seconds per scene.
- The \`summary\` field is displayed as a call-out after the terminal completes -- keep it to one sentence.
- Use \`"technical"\` narration style for documentation videos and \`"professional"\` for marketing.
`,
  },
];

registerDocBlocks(blocks);

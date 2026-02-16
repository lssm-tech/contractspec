import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const generatorsDocBlocks: DocBlock[] = [
  {
    id: 'docs.video-gen.generators',
    title: 'Video Generation Pipeline',
    summary:
      'VideoGenerator, ScenePlanner, and ScriptGenerator -- from content brief to video project with optional LLM enhancement.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/video-gen/generators',
    tags: [
      'video',
      'generators',
      'scene-planner',
      'script-generator',
      'llm',
      'content-pipeline',
    ],
    owners: ['@contractspec/lib.video-gen'],
    body: `# Video Generation Pipeline

The generators layer converts a \`VideoBrief\` (content brief + video config) into a fully specified \`VideoProject\` (scene graph ready for rendering). It follows the \`@contractspec/lib.content-gen\` pattern: optional LLM, deterministic fallback.

\`\`\`
VideoBrief
    |
    v
ScenePlanner.plan(brief)       --> ScenePlan (scenes + durations)
    |
    v
ScriptGenerator.generate(brief) --> NarrationScript (text + segments)
    |
    v
VoiceProvider.synthesize(text)  --> AudioTrack (optional)
    |
    v
VideoGenerator.generate(brief)  --> VideoProject (complete scene graph)
\`\`\`

## VideoGenerator

The main orchestrator. Wires ScenePlanner, ScriptGenerator, and optional VoiceProvider into a single pipeline.

\`\`\`ts
import { VideoGenerator } from "@contractspec/lib.video-gen/generators";
import type { VideoBrief } from "@contractspec/lib.video-gen/types";

// Minimal (deterministic, no LLM, no voice)
const generator = new VideoGenerator({ fps: 30 });

// Full (with LLM for richer scenes + voice narration)
const generator = new VideoGenerator({
  llm: myLLMProvider,
  voice: myVoiceProvider,
  model: "gpt-4o",
  temperature: 0.4,
  defaultVoiceId: "rachel",
  fps: 30,
});

const project = await generator.generate(brief);
\`\`\`

### Pipeline Steps

1. **Scene planning** -- \`ScenePlanner.plan(brief)\` breaks the brief into concrete \`PlannedScene[]\` with composition IDs, props, and durations.
2. **Script generation** -- If \`brief.narration.enabled\`, \`ScriptGenerator.generate()\` produces a \`NarrationScript\` with per-scene text segments.
3. **Voice synthesis** -- If a \`VoiceProvider\` is configured and narration is enabled, synthesizes audio via \`voice.synthesize()\`.
4. **Assembly** -- Combines scenes, audio, and metadata into a \`VideoProject\`.

### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| \`llm\` | \`LLMProvider\` | -- | Optional LLM for enhanced generation |
| \`voice\` | \`VoiceProvider\` | -- | Optional voice synthesis provider |
| \`model\` | \`string\` | -- | LLM model override |
| \`temperature\` | \`number\` | \`0.4\` | LLM temperature (lower = more deterministic) |
| \`defaultVoiceId\` | \`string\` | -- | Default voice for narration |
| \`fps\` | \`number\` | \`30\` | Frames per second |

## ScenePlanner

Breaks a \`VideoBrief\` into concrete scenes mapped to registered compositions.

\`\`\`ts
import { ScenePlanner } from "@contractspec/lib.video-gen/generators";

const planner = new ScenePlanner({ fps: 30 });
const plan = await planner.plan(brief);

plan.scenes;                    // PlannedScene[]
plan.estimatedDurationSeconds;  // total estimated duration
plan.narrationScript;           // combined narration text
\`\`\`

### Deterministic Path (no LLM)

Maps brief sections to \`SocialClip\` compositions:

| Brief Section | Scene | Duration |
|---------------|-------|----------|
| \`title\` + \`summary\` | Hook / title | 3s |
| \`problems\` | Problem statement | 4s |
| \`solutions\` | Solution showcase | 5s |
| \`metrics\` | Proof / results | 3s |
| \`callToAction\` | CTA | 2s |

If \`brief.targetDurationSeconds\` is set, all scene durations are scaled proportionally.

### LLM-Enhanced Path

With an \`LLMProvider\`, the planner sends the brief to the LLM and requests a scene breakdown as JSON. The LLM can choose from \`ApiOverview\`, \`SocialClip\`, or \`TerminalDemo\` compositions. Falls back to deterministic on any failure.

## ScriptGenerator

Produces narration text from a \`ContentBrief\` with style control.

\`\`\`ts
import { ScriptGenerator } from "@contractspec/lib.video-gen/generators";

const scriptGen = new ScriptGenerator({ temperature: 0.5 });
const script = await scriptGen.generate(brief.content, brief.narration);

script.fullText;                // complete narration
script.segments;                // NarrationSegment[] (per-scene text)
script.estimatedDurationSeconds; // at ~150 words/min
script.style;                   // "professional" | "casual" | "technical"
\`\`\`

### Narration Styles

| Style | Tone |
|-------|------|
| \`professional\` | Clear, authoritative, concise |
| \`casual\` | Friendly, conversational, approachable |
| \`technical\` | Precise, detailed, accurate |

### NarrationSegment

Each segment maps to a scene and provides timing estimates:

\`\`\`ts
interface NarrationSegment {
  sceneId: string;                // "intro", "problems", "solutions", "metrics", "cta"
  text: string;                   // narration text for this segment
  estimatedDurationSeconds: number; // at ~150 words/min
}
\`\`\`

## Input Types

### VideoBrief

\`\`\`ts
interface VideoBrief {
  content: ContentBrief;            // from @contractspec/lib.content-gen
  format: VideoFormat;              // landscape, portrait, square, or custom
  targetDurationSeconds?: number;   // auto-calculated if omitted
  narration?: NarrationConfig;      // { enabled, voiceId, language, style }
  style?: VideoStyleOverrides;      // colors, fonts, dark mode
  compositionId?: string;           // force a specific composition
}
\`\`\`

### PlannedScene

\`\`\`ts
interface PlannedScene {
  compositionId: string;            // maps to a registered Remotion composition
  props: Record<string, unknown>;   // input props for the composition
  durationInFrames: number;         // scene duration
  narrationText?: string;           // narrator text for this scene
  notes?: string;                   // planning notes (LLM path only)
}
\`\`\`

## Guardrails

- Generators are **stateless** -- no side effects, no caching. Call \`generate()\` / \`plan()\` for each video.
- LLM responses are parsed as JSON; any parse failure falls back to deterministic.
- Temperature defaults are conservative (0.3-0.5) for reproducibility.
- Duration estimates use 150 words/min speaking rate.
`,
  },
];

registerDocBlocks(generatorsDocBlocks);

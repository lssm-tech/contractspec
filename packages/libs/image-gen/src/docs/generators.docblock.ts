import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const generatorDocBlocks: DocBlock[] = [
  {
    id: 'docs.image-gen.generators',
    title: 'Image Generators',
    summary:
      'Core generator classes: ImageGenerator, PromptBuilder, and StyleResolver.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/image-gen/generators',
    tags: ['image', 'generator', 'prompt', 'style'],
    owners: ['@contractspec/lib.image-gen'],
    body: `# Image Generators

## ImageGenerator

The main orchestrator. Accepts an \`ImageBrief\` and produces an \`ImageProject\`.

1. **StyleResolver.resolve()** — resolves dimensions, style tokens, negative tokens
2. **PromptBuilder.build()** — constructs the image prompt (deterministic or LLM)
3. **ImageProvider.generate()** — calls the image generation provider (optional)

## PromptBuilder

Supports two modes:
- **Deterministic**: Assembles a prompt from brief fields and style tokens
- **LLM-enhanced**: Sends a system prompt + brief JSON to the LLM, falls back to deterministic

## StyleResolver

Maps \`ImagePurpose\` to default dimensions from \`IMAGE_PRESETS\`, and \`ImageStyle\` to
prompt tokens (e.g. "professional photography", "clean flat vector").
`,
  },
];

registerDocBlocks(generatorDocBlocks);

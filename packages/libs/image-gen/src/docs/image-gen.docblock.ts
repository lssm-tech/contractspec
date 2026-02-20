import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const imageGenDocBlocks: DocBlock[] = [
  {
    id: 'docs.image-gen.overview',
    title: 'Image Generation Library',
    summary:
      'AI-powered image generation for hero, social, thumbnail, OG, and illustration assets.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/image-gen/overview',
    tags: ['image', 'generation', 'ai', 'content'],
    owners: ['@contractspec/lib.image-gen'],
    body: `# Image Generation Library

\`@contractspec/lib.image-gen\` provides deterministic and LLM-enhanced image prompt generation
for content pipelines. It supports multiple purposes (blog hero, social OG, thumbnail, etc.)
and styles (photorealistic, illustration, flat-design, etc.).

## Key Features

- **Deterministic mode**: Generates structured prompts without an LLM
- **LLM-enhanced mode**: Uses an LLM to craft optimized image prompts
- **Style resolution**: Maps purposes to dimensions and style tokens
- **Preset briefs**: Ready-made brief constructors for common use cases
- **i18n support**: Localized strings for EN, FR, ES

## Quick Start

\`\`\`typescript
import { ImageGenerator } from '@contractspec/lib.image-gen/generators';
import { blogHeroBrief } from '@contractspec/lib.image-gen/presets';

const generator = new ImageGenerator();
const brief = blogHeroBrief(contentBrief);
const project = await generator.generate(brief);
\`\`\`

## Architecture

- **ImageGenerator** — orchestrates style resolution, prompt building, and provider calls
- **StyleResolver** — maps purpose + style to dimensions, tokens, and negative tokens
- **PromptBuilder** — constructs deterministic or LLM-enhanced image prompts
- **Presets** — convenience functions for social, marketing, and video thumbnails
`,
  },
];

registerDocBlocks(imageGenDocBlocks);

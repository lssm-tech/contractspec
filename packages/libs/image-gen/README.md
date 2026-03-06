# @contractspec/lib.image-gen

Website: https://contractspec.io/

**AI-powered image generation for hero, social, thumbnail, OG, and illustration.**

Generates structured image prompts and orchestrates AI image generation for content pipelines. All generators work deterministically by default -- LLM integration is optional and enhances output when available.

## Installation

```bash
bun add @contractspec/lib.image-gen
```

## Exports

- `.` -- Re-exports types, generators, and presets
- `./generators/*` -- `ImageGenerator`, `PromptBuilder`, `StyleResolver`
- `./presets/*` -- Convenience brief constructors: `ogImageBrief`, `twitterCardBrief`, `instagramSquareBrief`, `blogHeroBrief`, `videoThumbnailBrief`, and more
- `./types` -- `ImageBrief`, `ImageProject`, `ImagePrompt`
- `./i18n/*` -- Localization catalogs (en, fr, es)
- `./docs/*` -- DocBlock registrations

## Usage

```ts
import { ImageGenerator } from "@contractspec/lib.image-gen/generators";
import { ogImageBrief } from "@contractspec/lib.image-gen/presets";

const generator = new ImageGenerator();

const brief = ogImageBrief({
  title: "Ship APIs 10x Faster",
  summary: "Generate production-ready APIs from specs.",
});

const project = await generator.generate(brief);
console.log(project.prompts);
```

# @contractspec/example.video-marketing-clip

Website: https://contractspec.io/

Generate short-form marketing videos from content briefs using the video-gen pipeline.

This package demonstrates:

- End-to-end video generation: `ContentBrief` to `VideoBrief` to `VideoProject` via `VideoGenerator`
- Multi-format output: landscape (16:9), square (1:1), and portrait (9:16)
- Generating all three format variants in parallel with `generateAllFormats`
- Fully deterministic pipeline without LLM or voice provider

## Quickstart

```typescript
import { generateMarketingClip, generateAllFormats } from "@contractspec/example.video-marketing-clip";
import { productLaunchBrief } from "@contractspec/example.video-marketing-clip";

// Generate a single landscape clip
const project = await generateMarketingClip(productLaunchBrief, "landscape");

// Generate all three format variants in parallel
const formats = await generateAllFormats(productLaunchBrief);
// formats.landscape, formats.square, formats.portrait
```

Three sample briefs are included: a product launch ("Ship APIs 10x Faster"), a feature announcement ("Now Generating MCP Tools from Your Specs"), and a case study ("How Acme Corp Cut API Dev Time by 80%"). The scene planner automatically maps brief sections to `SocialClip` compositions.

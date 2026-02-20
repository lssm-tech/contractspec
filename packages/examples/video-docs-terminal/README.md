# @contractspec/example.video-docs-terminal

Website: https://contractspec.io/

Generate terminal demo videos from CLI walkthroughs using the `TerminalDemo` composition and `ScriptGenerator`.

This package demonstrates:

- Defining `CliTutorial` objects that combine terminal lines with content briefs
- Building single-scene and multi-scene `VideoProject` instances from tutorials
- Generating deterministic narration scripts from content briefs using `ScriptGenerator`
- Composing a full tutorial suite (init, build, validate, deploy) into one video

## Quickstart

```typescript
import { buildTutorialVideo, buildTutorialSuite } from "@contractspec/example.video-docs-terminal";
import { initTutorial, allTutorials } from "@contractspec/example.video-docs-terminal";

// Build a single tutorial video
const project = buildTutorialVideo(initTutorial);

// Build a multi-scene suite from all tutorials
const suite = buildTutorialSuite(allTutorials);
```

```typescript
import { generateTutorialNarration } from "@contractspec/example.video-docs-terminal";

// Generate narration for a tutorial (deterministic, no LLM needed)
const narration = await generateTutorialNarration(initTutorial);
```

Four sample tutorials are included: project initialization, build and code generation, contract validation, and deployment. The entire pipeline is fully deterministic -- no LLM or voice provider required.

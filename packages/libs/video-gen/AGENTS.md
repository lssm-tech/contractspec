# AI Agent Guide -- `@lssm/lib.video-gen`

Scope: `packages/libs/video-gen/*`

This package provides **programmatic video generation** using [Remotion](https://remotion.dev). It follows the same generator pattern as `@lssm/lib.content-gen` and consumes contracts from `@lssm/lib.contracts/integrations/providers/video`.

## Architecture

- `src/types.ts` -- Video-specific types (VideoBrief, VideoProject, etc.)
- `src/design/` -- Hybrid design tokens: brand tokens from `@lssm/lib.design-system` + video-specific motion/typography/layout primitives
- `src/compositions/primitives/` -- Reusable Remotion building blocks (animated text, code blocks, terminal, transitions)
- `src/compositions/*.tsx` -- Full Remotion compositions (api-overview, social-clip, terminal-demo)
- `src/generators/` -- VideoGenerator, ScriptGenerator, ScenePlanner classes following the content-gen pattern (optional LLM, deterministic fallback)
- `src/renderers/` -- Rendering utilities wrapping `@remotion/renderer`
- `src/remotion/` -- Remotion entry point (`registerRoot`, `Root.tsx`)

## Working rules

- Compositions are React components rendered by Remotion -- they use `useCurrentFrame()`, `useVideoConfig()`, `interpolate()`, etc.
- Keep compositions **deterministic**: same props = same visual output.
- The `design/` layer imports brand tokens from `@lssm/lib.design-system` but defines its own motion/typography/layout tokens optimized for video.
- Generators follow the content-gen pattern: constructor accepts optional `LLMProvider`, `generate()` method branches on LLM availability.
- Remotion requires **Node.js** for rendering; the library itself builds with tsdown/Bun as usual.

## Common commands

```bash
# Build the library
bun run build

# Dev mode (watch)
bun run dev

# Lint
bun run lint:check

# Tests
bun test
```

## Rendering (requires @lssm/app.video-studio)

```bash
# From repo root:
bun run dev:video          # Start Remotion Studio
```

# AI Agent Guide -- `@contractspec/example.video-docs-terminal`

Scope: `packages/examples/video-docs-terminal/*`

Generate terminal demo videos from CLI walkthroughs using the TerminalDemo composition and ScriptGenerator.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.contracts-spec`, `lib.video-gen`, `lib.content-gen`

## What This Demonstrates

- Terminal demo video generation pipeline
- Narration generation from CLI walkthroughs
- Sample tutorial definitions for video input

## Public Exports

- `.` -- root barrel
- `./build-tutorial` -- tutorial video build entry
- `./generate-narration` -- narration generation
- `./sample-tutorials` -- sample tutorial definitions
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test --pass-with-no-tests`
- Typecheck: `bun run typecheck`

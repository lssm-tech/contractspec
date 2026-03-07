# AI Agent Guide -- `@contractspec/example.video-marketing-clip`

Scope: `packages/examples/video-marketing-clip/*`

Generate short-form marketing videos from content briefs using the video-gen pipeline.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.contracts-spec`, `lib.video-gen`, `lib.content-gen`

## What This Demonstrates

- Marketing clip generation from content briefs
- Brief definition pattern for video input
- Video-gen pipeline consumption

## Public Exports

- `.` -- root barrel
- `./generate-clip` -- clip generation entry
- `./briefs` -- content brief definitions
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test --pass-with-no-tests`
- Typecheck: `bun run typecheck`

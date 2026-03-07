# AI Agent Guide -- `@contractspec/example.video-api-showcase`

Scope: `packages/examples/video-api-showcase/*`

Generate API documentation videos from contract spec definitions using the ApiOverview composition.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.contracts-spec`, `lib.contracts-integrations`, `lib.video-gen`

## What This Demonstrates

- Video generation pipeline from contract specs
- ApiOverview composition pattern
- Sample spec definitions for video input

## Public Exports

- `.` -- root barrel
- `./build-api-video` -- video build entry
- `./sample-specs` -- sample contract specs
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test --pass-with-no-tests`
- Typecheck: `bun run typecheck`

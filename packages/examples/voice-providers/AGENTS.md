# AI Agent Guide -- `@contractspec/example.voice-providers`

Scope: `packages/examples/voice-providers/*`

Voice provider example: Gradium and Fal text-to-speech integration patterns.

## Quick Context

- **Layer**: example
- **Related Packages**: `integration.providers-impls`, `lib.contracts-spec`, `lib.contracts-integrations`

## What This Demonstrates

- TTS provider integration pattern with connection samples
- Handler-per-action pattern (create-provider, list-voices, synthesize)
- Run script for one-shot execution

## Public Exports

- `.` -- root barrel
- `./connection.sample` -- sample connection config
- `./handlers/create-provider` -- provider creation
- `./handlers/list-voices` -- voice listing
- `./handlers/synthesize` -- speech synthesis
- `./run` -- execution entry point
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test --pass-with-no-tests`
- Typecheck: `bun run typecheck`

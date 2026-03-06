# AI Agent Guide — `@contractspec/lib.testing`

Scope: `packages/libs/testing/*`

Contract-aware testing utilities: traffic recording, golden test generation, and safe regeneration verification.

## Quick Context

- **Layer**: lib
- **Consumers**: CLI, bundles

## Public Exports

- `.` — main entry (TrafficRecorder, GoldenTestGenerator, regeneration verifier)

## Guardrails

- TrafficRecorder and GoldenTestGenerator interfaces are public API — do not break signatures
- Test output format must stay compatible with Vitest and Jest runners

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`

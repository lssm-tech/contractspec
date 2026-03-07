# AI Agent Guide -- `@contractspec/example.locale-jurisdiction-gate`

Scope: `packages/examples/locale-jurisdiction-gate/*`

Enforce locale + jurisdiction + kbSnapshotId + allowed scope for assistant calls (fail-closed policy).

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.contracts-spec`, `lib.schema`

## What This Demonstrates

- Fail-closed policy guard pattern for AI assistant calls
- Entity models for locale/jurisdiction gating
- Event-driven policy enforcement
- Handler and operation separation with typed operations
- Feature definition pattern

## Public Exports

- `.` -- root barrel
- `./policy` -- guard, types
- `./entities` -- models
- `./operations` -- assistant operations
- `./handlers` -- demo handlers
- `./events` -- policy events
- `./locale-jurisdiction-gate.feature` -- feature definition
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`

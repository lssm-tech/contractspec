# AI Agent Guide -- `@contractspec/example.versioned-knowledge-base`

Scope: `packages/examples/versioned-knowledge-base/*`

Curated, versioned knowledge base with immutable sources, rule versions, and published snapshots.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.contracts-spec`, `lib.schema`

## What This Demonstrates

- Immutable source and versioned rule management
- Snapshot publishing pattern
- Entity models for KB domain
- Memory-based handler implementation
- Feature definition and event-driven architecture

## Public Exports

- `.` -- root barrel
- `./entities` -- models
- `./operations` -- KB operations
- `./handlers` -- memory handlers
- `./events` -- KB lifecycle events
- `./versioned-knowledge-base.feature` -- feature definition
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`

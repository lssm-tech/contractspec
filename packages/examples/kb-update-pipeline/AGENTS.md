# AI Agent Guide -- `@contractspec/example.kb-update-pipeline`

Scope: `packages/examples/kb-update-pipeline/*`

Demonstrates a knowledge base update automation pipeline with human-in-the-loop review and auditability.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.contracts-spec`, `lib.schema`

## What This Demonstrates

- HITL (human-in-the-loop) review pipeline pattern
- Entity models for KB articles and update proposals
- Event-driven pipeline with typed operations
- Feature definition with presentations and test-specs
- In-memory handlers for demo scenarios

## Public Exports

- `.` -- root barrel
- `./kb-update-pipeline.feature` -- feature definition
- `./entities` -- KB entity models
- `./events` -- pipeline event definitions
- `./operations` -- pipeline operations
- `./presentations` -- presentation definitions
- `./handlers` -- in-memory handlers
- `./tests/operations.test-spec` -- operation test specifications
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`

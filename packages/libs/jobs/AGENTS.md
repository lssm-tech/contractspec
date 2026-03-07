# AI Agent Guide — `@contractspec/lib.jobs`

Scope: `packages/libs/jobs/*`

Background jobs and scheduler module. Provides queue abstractions, job entity schemas, and scheduler primitives for deferred and recurring work.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles

## Public Exports

- `.` — main entry
- `./contracts` — job contracts
- `./entities` — job entity schemas
- `./events` — job lifecycle events
- `./handlers` — job handler interfaces
- `./jobs.capability` — capability contract
- `./jobs.feature` — feature definition
- `./queue` — queue abstraction
- `./scheduler` — scheduler primitives

## Guardrails

- Queue and scheduler interfaces are adapter boundaries — do not leak implementation details
- Job entity schema is shared across consumers; changes require migration awareness
- Capability contract (`jobs.capability`) is public API — treat as a breaking-change surface

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`

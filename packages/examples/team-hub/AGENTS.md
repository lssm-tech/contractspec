# AI Agent Guide -- `@contractspec/example.team-hub`

Scope: `packages/examples/team-hub/*`

Team Hub example with spaces, tasks, rituals, and announcements for team collaboration.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.schema`, `lib.contracts-spec`

## What This Demonstrates

- Multi-entity team collaboration domain (space, task, ritual, announcement)
- Per-entity schema and operations pattern
- Capability and feature definition patterns
- Presentation layer with team-hub presentation

## Public Exports

- `.` -- root barrel
- `./space`, `./task`, `./ritual`, `./announcement` -- domain modules
- `./entities` -- aggregate entity barrel
- `./handlers` -- handler barrel
- `./events` -- domain events
- `./presentations` -- team-hub presentation
- `./team-hub.capability`, `./team-hub.feature`
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Typecheck: `bun run typecheck`

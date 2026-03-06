# AI Agent Guide -- `@contractspec/example.learning-patterns`

Scope: `packages/examples/learning-patterns/*`

Drills, ambient coach, and quest learning patterns powered by the Learning Journey module (event-driven, deterministic).

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.contracts-spec`, `module.learning-journey`

## What This Demonstrates

- Three distinct learning track patterns: drills, ambient-coach, quests
- Event-driven track progression
- Deterministic state transitions via the Learning Journey module

## Public Exports

- `.` -- root barrel
- `./tracks` -- ambient-coach, drills, quests
- `./events` -- track lifecycle events
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`

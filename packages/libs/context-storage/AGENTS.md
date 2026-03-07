# AI Agent Guide — `@contractspec/lib.context-storage`

Scope: `packages/libs/context-storage/*`

Context pack and snapshot storage primitives for persisting and retrieving agent context.

## Quick Context

- **Layer**: lib
- **Consumers**: module.context-storage

## Public Exports

- `.` — main entry
- `./store`
- `./in-memory-store`
- `./types`

## Guardrails

- `Store` interface is the contract boundary for persistence adapters; do not change its shape without updating all adapters.

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`

# AI Agent Guide — `@contractspec/lib.bus`

Scope: `packages/libs/bus/*`

Event bus and messaging primitives that underpin all event-driven communication in the platform.

## Quick Context

- **Layer**: lib
- **Consumers**: personalization, bundles

## Public Exports

- `.` — main entry
- `./auditableBus`
- `./eventBus`
- `./filtering`
- `./inMemoryBus`
- `./metadata`
- `./subscriber`

## Guardrails

- `EventBus` interface is a core contract; changes affect all event-driven communication.
- Do not alter the subscriber/publish protocol without coordinating with all consumers.

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`

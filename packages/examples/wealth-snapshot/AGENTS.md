# AI Agent Guide -- `@contractspec/example.wealth-snapshot`

Scope: `packages/examples/wealth-snapshot/*`

Wealth Snapshot mini-app for accounts, assets, liabilities, and goals tracking.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.identity-rbac`, `lib.schema`, `lib.contracts-spec`, `module.audit-trail`, `module.notifications`

## What This Demonstrates

- Financial entity modeling (accounts, assets, liabilities, goals)
- Capability and feature definition patterns
- Presentation layer and event-driven architecture
- RBAC, audit trail, and notification module integration

## Public Exports

- `.` -- root barrel
- `./entities` -- entity barrel
- `./operations` -- domain operations
- `./handlers` -- handler barrel
- `./events` -- domain events
- `./presentations` -- presentation layer
- `./wealth-snapshot.capability`, `./wealth-snapshot.feature`
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Typecheck: `bun run typecheck`

# AI Agent Guide -- `@contractspec/example.service-business-os`

Scope: `packages/examples/service-business-os/*`

Service Business OS: clients, quotes, jobs, invoices, and payments for field-service businesses.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.schema`, `lib.contracts-spec`

## What This Demonstrates

- Multi-entity domain modeling (client, quote, job, invoice, payment)
- Per-entity schema and operations pattern
- Capability and feature definition patterns
- Presentation layer and event-driven architecture
- Handler aggregation

## Public Exports

- `.` -- root barrel
- `./client`, `./quote`, `./job`, `./invoice`, `./payment` -- domain modules
- `./entities` -- aggregate entity barrel
- `./operations` -- aggregate operations
- `./handlers` -- handler barrel
- `./events` -- domain events
- `./presentations` -- presentation layer
- `./service-business-os.capability`, `./service.feature`
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Typecheck: `bun run typecheck`

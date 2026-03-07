# AI Agent Guide -- `@contractspec/example.pocket-family-office`

Scope: `packages/examples/pocket-family-office/*`

Personal finance automation with open banking: accounts, transactions, documents, and financial summaries.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.knowledge`, `lib.contracts-spec`, `lib.contracts-integrations`, `lib.schema`

## What This Demonstrates

- Workflow-driven open banking integration (sync accounts, transactions, balances)
- Financial summary and overview generation workflows
- Document processing and email thread ingestion
- Capability and feature definition patterns
- Telemetry integration
- Sample tenant and connection configuration

## Public Exports

- `.` -- root barrel
- `./blueprint` -- app blueprint
- `./workflows` -- 8 workflows (sync, refresh, generate, ingest, process, reminder)
- `./operations` -- domain operations
- `./connections/samples`, `./tenant.sample`, `./knowledge/sources.sample` -- sample data
- `./pocket-family-office.capability`, `./pocket-family-office.feature`
- `./telemetry` -- telemetry setup
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Typecheck: `bun run typecheck`

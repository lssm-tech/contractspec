# AI Agent Guide -- `@contractspec/example.integration-supabase`

Scope: `packages/examples/integration-supabase/*`

Demonstrates Supabase integration with vector store and Postgres database wiring patterns.

## Quick Context

- **Layer**: example
- **Related Packages**: `integration.providers-impls`, `integration.runtime`, `lib.contracts-spec`, `lib.contracts-integrations`

## What This Demonstrates

- Integration blueprint for Supabase vector store + Postgres
- Multi-tenant configuration pattern
- Connection sample for credential wiring
- Runtime sample for execution context setup

## Public Exports

- `.` -- root barrel
- `./blueprint` -- Supabase integration blueprint
- `./connection.sample` -- sample connection config
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point
- `./runtime.sample` -- runtime execution sample
- `./tenant` -- tenant configuration

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`

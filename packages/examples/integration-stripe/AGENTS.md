# AI Agent Guide -- `@contractspec/example.integration-stripe`

Scope: `packages/examples/integration-stripe/*`

Demonstrates Stripe Payments integration with blueprint, workflow, and tenant configuration patterns.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.schema`, `lib.contracts-spec`, `lib.contracts-integrations`

## What This Demonstrates

- Integration blueprint definition for Stripe
- Payment workflow with typed steps
- Multi-tenant configuration pattern
- Connection sample for credential wiring

## Public Exports

- `.` -- root barrel
- `./blueprint` -- Stripe integration blueprint
- `./connection.sample` -- sample connection config
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point
- `./tenant` -- tenant configuration
- `./workflow` -- payment workflow definition

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`

# AI Agent Guide -- `@contractspec/example.email-gmail`

Scope: `packages/examples/email-gmail/*`

Demonstrates Gmail integration for inbound thread reading and outbound message sending via the googleapis SDK.

## Quick Context

- **Layer**: example
- **Related Packages**: `integration.providers-impls`, `lib.contracts-spec`, `googleapis`

## What This Demonstrates

- OAuth authentication flow for Gmail API
- Inbound email thread processing
- Outbound message composition and sending
- Integration provider pattern with ContractSpec contracts

## Public Exports

- `.` -- root barrel
- `./auth` -- authentication helpers
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point
- `./inbound` -- inbound thread processing
- `./outbound` -- outbound message sending
- `./run` -- execution runner

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`

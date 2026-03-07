# AI Agent Guide -- `@contractspec/example.openbanking-powens`

Scope: `packages/examples/openbanking-powens/*`

OpenBanking Powens example: OAuth callback + webhook handler patterns for provider integration.

## Quick Context

- **Layer**: example
- **Related Packages**: `integration.providers-impls`, `lib.contracts-spec`

## What This Demonstrates

- OAuth callback handler pattern for open banking
- Webhook handler for asynchronous bank event ingestion
- Provider integration via contracts-integrations

## Public Exports

- `.` -- root barrel
- `./handlers/oauth-callback` -- OAuth flow handler
- `./handlers/webhook-handler` -- webhook ingestion
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test --pass-with-no-tests`
- Typecheck: `bun run typecheck`

# AI Agent Guide -- `@contractspec/example.meeting-recorder-providers`

Scope: `packages/examples/meeting-recorder-providers/*`

Meeting recorder provider example: list meetings, transcripts, and webhooks.

## Quick Context

- **Layer**: example
- **Related Packages**: `integration.providers-impls`, `lib.contracts-spec`, `lib.contracts-integrations`

## What This Demonstrates

- Provider integration pattern with connection samples
- Handler-per-action pattern (create-provider, get-transcript, list-meetings, webhook-handler)
- Webhook handler for external event ingestion

## Public Exports

- `.` -- root barrel
- `./connection.sample` -- sample connection config
- `./handlers/create-provider` -- provider creation
- `./handlers/get-transcript` -- transcript retrieval
- `./handlers/list-meetings` -- meeting listing
- `./handlers/webhook-handler` -- webhook ingestion
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test --pass-with-no-tests`
- Typecheck: `bun run typecheck`

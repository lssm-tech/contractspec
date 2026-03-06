# AI Agent Guide -- `@contractspec/example.product-intent`

Scope: `packages/examples/product-intent/*`

Product intent example: evidence ingestion, PostHog signal extraction, and prompt-ready outputs for PM discovery.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.contracts-spec`, `lib.contracts-integrations`, `lib.ai-agent`, `lib.product-intent-utils`, `integration.providers-impls`

## What This Demonstrates

- Evidence loading and ingestion pipeline
- PostHog signal extraction for product analytics
- Action synchronization across tools
- Script-based execution pattern

## Public Exports

- `.` -- root barrel
- `./load-evidence` -- evidence ingestion
- `./posthog-signals` -- PostHog signal extraction
- `./sync-actions` -- action synchronization
- `./script` -- runnable script
- `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`

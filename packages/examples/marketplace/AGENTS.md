# AI Agent Guide -- `@contractspec/example.marketplace`

Scope: `packages/examples/marketplace/*`

Full marketplace example with orders, payouts, products, reviews, and stores.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.schema`, `lib.contracts-spec`, `lib.example-shared-ui`, `lib.design-system`, `lib.runtime-sandbox`

## What This Demonstrates

- Multi-entity domain modeling (order, payout, product, review, store)
- Per-entity schema/enum/event/operations/presentation pattern
- Capability and feature definition patterns
- React UI with hooks, renderers, and dashboard component
- Seeder pattern for demo data
- Test-spec for operations validation

## Public Exports

- `.` -- root barrel
- `./order`, `./payout`, `./product`, `./review`, `./store` -- domain modules
- `./entities` -- aggregate entity barrel
- `./handlers` -- marketplace handlers
- `./marketplace.capability`, `./marketplace.feature` -- capability/feature
- `./seeders` -- demo data seeders
- `./ui` -- MarketplaceDashboard, hooks, renderers
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Typecheck: `bun run typecheck`

# AI Agent Guide — `@contractspec/lib.metering`

Scope: `packages/libs/metering/*`

Usage metering and billing core module. Provides aggregation, analytics, and billing entity schemas for consumption-based pricing.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles

## Public Exports

- `.` — main entry
- `./aggregation` — usage aggregation logic
- `./analytics/*` — analytics sub-modules
- `./contracts` — metering contracts
- `./docs` — documentation helpers
- `./entities` — billing and usage entities
- `./events` — metering lifecycle events
- `./metering.capability` — capability contract
- `./metering.feature` — feature definition

## Guardrails

- Aggregation logic must stay deterministic — non-determinism causes billing discrepancies
- Billing-related schemas are compliance-sensitive; changes require review
- Capability contract (`metering.capability`) is public API — treat as a breaking-change surface

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`

# AI Agent Guide — `@contractspec/lib.cost-tracking`

Scope: `packages/libs/cost-tracking/*`

API cost tracking and budgeting library. Provides deterministic cost calculation, budget thresholds, and usage aggregation.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles

## Public Exports

| Subpath | Description |
| ------- | ----------- |
| `.`     | Main entry  |

## Guardrails

- Cost calculation logic must stay deterministic — no side effects or external calls during computation.
- Budget threshold types are shared across consumers; changes require coordination.
- Do not introduce floating-point arithmetic where precision matters; use integer cents or a decimal library.

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`

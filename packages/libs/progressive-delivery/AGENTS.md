# AI Agent Guide — `@contractspec/lib.progressive-delivery`

Scope: `packages/libs/progressive-delivery/*`

Progressive delivery and canary release primitives. Provides strategy definitions and rollout logic for safe, incremental deployments.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles

## Public Exports

- `.` — main entry (strategies, rollout helpers)

## Guardrails

- Delivery strategies must be deterministic — same input must produce same rollout decision
- Peer dependency on observability; ensure OTel integration stays aligned
- Strategy interface changes affect all deployment pipelines consuming this lib

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`

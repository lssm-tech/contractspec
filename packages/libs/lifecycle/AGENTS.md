# AI Agent Guide — `@contractspec/lib.lifecycle`

Scope: `packages/libs/lifecycle/*`

Contract lifecycle management primitives. Defines lifecycle stages and transition logic shared across the platform.

## Quick Context

- **Layer**: lib
- **Consumers**: analytics, evolution, observability, bundles

## Public Exports

- `.` — main entry (stages, transitions, helpers)

## Guardrails

- Lifecycle stage definitions are shared across the platform — changes are high-impact
- Stage transitions must be deterministic; no side effects in transition logic
- Consumed by analytics and observability — schema changes affect downstream telemetry

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`

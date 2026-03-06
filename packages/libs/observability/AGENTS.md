# AI Agent Guide — `@contractspec/lib.observability`

Scope: `packages/libs/observability/*`

OpenTelemetry-based observability primitives. Provides tracing, metrics, logging, and anomaly detection for contract-driven systems.

## Quick Context

- **Layer**: lib
- **Consumers**: evolution, progressive-delivery, bundles

## Public Exports

- `.` — main entry
- `./anomaly/*` — anomaly detection sub-modules
- `./intent/*` — intent tracking sub-modules
- `./logging` — structured logging integration
- `./metrics` — metric collection helpers
- `./pipeline/*` — telemetry pipeline interfaces
- `./telemetry/*` — telemetry primitives
- `./tracing` — distributed tracing helpers

## Guardrails

- OTel span and metric naming conventions must stay consistent across the platform
- Pipeline interfaces are adapter boundaries — do not leak vendor-specific details
- Anomaly detection thresholds affect alerting; changes require validation

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`

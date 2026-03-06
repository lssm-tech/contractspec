# AI Agent Guide — `@contractspec/lib.exporter`

Scope: `packages/libs/exporter/*`

Generic CSV and XML exporters usable across web and mobile. Provides a consistent export interface for tabular and structured data.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles

## Public Exports

| Subpath | Description |
| ------- | ----------- |
| `.`     | Main entry  |

## Guardrails

- Export format must stay consistent for downstream consumers; column order and encoding are part of the contract.
- Do not introduce platform-specific APIs (Node-only or browser-only) without a universal fallback.

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`

# AI Agent Guide — `@contractspec/lib.logger`

Scope: `packages/libs/logger/*`

High-performance structured logging optimized for Bun with ElysiaJS integration. Provides context-aware logging, tracing, and timing utilities.

## Quick Context

- **Layer**: lib
- **Consumers**: email, jobs, contracts-runtime-server-mcp, bundles, apps

## Public Exports

- `.` — main entry
- `./context` — async context propagation
- `./elysia-plugin` — ElysiaJS middleware plugin
- `./formatters` — log output formatters
- `./logger` — core logger class
- `./timer` — performance timing helpers
- `./tracer` — request tracing utilities
- `./types` — shared type definitions

## Guardrails

- Logger interface is used across the entire stack — breaking changes affect everything
- Structured log format must stay JSON-compatible for log aggregation pipelines
- Elysia plugin must not break the middleware chain; preserve `onRequest`/`onAfterHandle` order

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`

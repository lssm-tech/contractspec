# AI Agent Guide — `@contractspec/lib.contracts-integrations`

Scope: `packages/libs/contracts-integrations/*`

Integration contract definitions for external services (payments, email, storage, etc.).

## Quick Context

- **Layer**: lib
- **Consumers**: content-gen, image-gen, voice, jobs, metering, analytics, observability, support-bot

## Public Exports

- `.` — main entry
- `./integrations` — many subpath exports for individual integrations

## Guardrails

- High blast radius — integration contracts are consumed by many libs.
- Provider and secret catalog schemas must stay backward-compatible.
- Adding a new integration must not break existing subpath imports.

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`

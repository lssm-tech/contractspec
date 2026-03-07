# AI Agent Guide — `@contractspec/lib.runtime-sandbox`

Scope: `packages/libs/runtime-sandbox/*`

Browser-compatible database abstraction built on PGLite for client-side SQL execution.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles, apps

## Public Exports

- `.` — main entry (DatabasePort, PGLite adapter, migrations)

## Guardrails

- DatabasePort interface is the adapter boundary — consumers depend on the port, not the implementation
- PGLite adapter must stay browser-compatible (no Node-only APIs)
- Migration schema must remain stable — breaking changes require a migration path

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`

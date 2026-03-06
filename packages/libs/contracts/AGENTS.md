# AI Agent Guide — `@contractspec/lib.contracts`

Scope: `packages/libs/contracts/*`

**DEPRECATED** monolith package. Exists only as a re-export shim for legacy consumers.

## Quick Context

- **Layer**: lib (deprecated)
- **Consumers**: legacy code only

## Public Exports

None — re-export shim only.

## Guardrails

- **Do NOT add new code here.** Migrate consumers to `contracts-spec`, `contracts-integrations`, or `contracts-runtime-*` packages instead.
- This package exists solely for backward compatibility.

## Local Commands

- Build: `bun run build` (publish:pkg only)

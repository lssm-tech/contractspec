# AI Agent Guide — `@contractspec/lib.workflow-composer`

Scope: `packages/libs/workflow-composer/*`

Tenant-aware workflow composition helpers for orchestrating multi-step contract flows.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles

## Public Exports

- `.` — main entry

## Guardrails

- Workflow composition must stay tenant-isolated — no cross-tenant data leakage
- Depends on contracts-spec — keep aligned with contract definitions

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`

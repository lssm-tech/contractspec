# AI Agent Guide -- `@contractspec/module.product-intent-core`

Scope: `packages/modules/product-intent-core/*`

Core product intent orchestration and adapters for AI-driven discovery, prioritization, and intent-to-spec workflows.

## Quick Context

- **Layer**: module
- **Consumers**: bundles (contractspec-studio), apps (web-landing)

## Public Exports

- `.` -- root barrel (orchestrator, adapters, intent types)

## Guardrails

- Depends on `lib.product-intent-utils` for shared utilities -- keep orchestration logic here, primitives in the lib
- Intent resolution must be idempotent; re-processing the same input should yield the same spec output
- Adapter interfaces are the extension point; new integrations go through the adapter pattern

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`

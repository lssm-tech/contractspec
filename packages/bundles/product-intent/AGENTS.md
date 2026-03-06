# AI Agent Guide -- `@contractspec/bundle.product-intent`

Scope: `packages/bundles/product-intent/*`

Bundles the product-intent AI runner and evidence retrieval service for discovery-driven product management workflows.

## Quick Context

- **Layer**: bundle
- **Consumers**: not yet wired into an app (standalone bundle)

## Key Directories

- `src/` -- AI runner and product-intent service
- `src/__tests__/` -- unit tests

## Public Exports

- `.` -- `ai-runner` (AI-powered intent analysis), `service` (product intent orchestration)

## Guardrails

- Uses the Vercel AI SDK (`ai`) for LLM interactions; keep provider-agnostic patterns.
- Depends on `lib.contracts-spec` and `module.product-intent-core`; spec changes upstream affect this bundle.
- AI runner prompts and tool definitions should remain deterministic and testable.

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Lint: `bun run lint`
- Test: `bun test`
- Typecheck: `bun run typecheck`

# AI Agent Guide -- `@contractspec/bundle.alpic`

Scope: `packages/bundles/alpic/*`

Re-exports the Alpic module to provide MCP server and ChatGPT App hosting helpers as a single bundle entry point.

## Quick Context

- **Layer**: bundle
- **Consumers**: `apps/alpic-mcp`

## Key Directories

- `src/` -- thin re-export layer (delegates to `@contractspec/module.alpic`)

## Public Exports

- `.` -- re-exports everything from `@contractspec/module.alpic` (named `module` namespace + flat exports)

## Guardrails

- No business logic lives here; all implementation is in `module.alpic`.
- Changes to exports must stay in sync with the module's public API.

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Lint: `bun run lint`
- Test: `bun test`
- Typecheck: `bun run typecheck`

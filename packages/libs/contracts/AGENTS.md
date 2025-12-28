# AI Agent Guide — `@contractspec/lib.contracts`

Scope: `packages/libs/contracts/*`

This is **the core of ContractSpec**: canonical specs (operations/events/presentations), registries, and runtime adapters (REST/GraphQL/MCP). Treat changes here like compiler/runtime changes: high blast radius.

## Guardrails

- Keep behavior deterministic (no hidden IO, timestamps, or environment-dependent defaults in core logic).
- Prefer extending specs over changing semantics; breaking changes must be explicit and versioned.
- Do not edit `dist/`; source of truth is `src/`.

## Public entrypoints (package.json)

This package maintains separate export maps for workspace vs publish:

- `packages/libs/contracts/package.json#exports` → `src/*`
- `packages/libs/contracts/package.json#publishConfig.exports` → `dist/*`

If you add/move a public module (including DocBlocks), update **both** maps.

## Spec authoring conventions

- Use `defineCommand` for writes and `defineQuery` for reads.
- Use `@contractspec/lib.schema` (`SchemaModel`, `ScalarTypeEnum`) for I/O to keep multi-surface consistency.
- Include strong `meta`: `name`, `version`, `owners`, `tags`, `goal`, `context`, `stability`.

## DocBlocks & Docs MCP

Docs MCP (`/api/mcp/docs`) serves the registered DocBlocks from `defaultDocRegistry`.

- Global docs are registered via side-effect imports in `packages/libs/contracts/src/docs/index.ts`.
- If a DocBlock should appear in Docs MCP, ensure it calls `registerDocBlocks(...)` and is imported by an always-loaded entrypoint (commonly `src/docs/index.ts`).
- If MCP endpoint paths change, update `packages/libs/contracts/src/docs/tech/mcp-endpoints.docblock.ts`.

## Local commands

- Lint: `bun run lint:check` (or `bun run lint:fix`)
- Build: `bun run build`
- Tests: `bun test` (see `src/tests/*.test.ts`)

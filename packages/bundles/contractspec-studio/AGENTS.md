# AI Agent Guide — `@lssm/bundle.contractspec-studio`

Scope: `packages/bundles/contractspec-studio/*`

This bundle powers ContractSpec Studio (GraphQL, collaboration, templates) and defines the **MCP server implementations** used by the API app.

## MCP servers (implementation)

MCP handlers are implemented in `src/application/mcp/*`:

- Docs MCP: `src/application/mcp/docsMcp.ts` (`createDocsMcpHandler`)
- CLI MCP: `src/application/mcp/cliMcp.ts` (`createCliMcpHandler`)
- Internal MCP: `src/application/mcp/internalMcp.ts` (`createInternalMcpHandler`)

Guidelines:

- Keep resources/prompts **read-only by default**; avoid introducing side effects.
- Prefer pulling canonical facts from `@lssm/lib.contracts` registries (DocBlocks, specs) instead of duplicating.
- If any MCP endpoint path changes, update:
  - API routing: `packages/apps/api-contractspec/src/handlers/mcp-handler.ts`
  - Docs reference: `packages/libs/contracts/src/docs/tech/mcp-endpoints.docblock.ts`

## Public entrypoints (package.json)

Keep these maps in sync when adding/moving exports:

- `packages/bundles/contractspec-studio/package.json#exports` → `src/*`
- `packages/bundles/contractspec-studio/package.json#publishConfig.exports` → `dist/*`

## Local commands

- Lint: `bun run lint:check` (or `bun run lint:fix`)
- Build: `bun run build`
- Dev/watch: `bun run dev`
- Tests: `bun test` or `bun run test:watch` (Vitest)

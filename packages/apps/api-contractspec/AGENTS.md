# AI Agent Guide — `@lssm/app.api-contractspec`

Scope: `packages/apps/api-contractspec/*`

This app runs the ContractSpec Studio API (Elysia) and exposes GraphQL + MCP endpoints.

## Run & build

- Dev (from this directory): `bun run dev` (starts `src/server.ts`)
- Dev (from repo root): `bun run dev:api` or `turbo run dev --filter=@lssm/app.api-contractspec`
- Build: `bun run build` (produces `./server`, ignored by git)
- Port: `8080` (see `src/server.ts`)

## MCP (Model Context Protocol)

MCP endpoints are mounted in `src/handlers/mcp-handler.ts`:

- `/api/mcp/docs` and `/mcp/docs`
- `/api/mcp/cli` and `/mcp/cli`
- `/api/mcp/internal` and `/mcp/internal`

When changing MCP behavior:

- Keep `src/handlers/mcp-handler.ts` thin; implement tool semantics in `@lssm/bundle.contractspec-studio/application`.
- Keep docs in sync with `packages/libs/contracts/src/docs/tech/mcp-endpoints.docblock.ts`.
- If paths change, also update startup logs in `src/server.ts` (and any inspector scripts).

## GraphQL schema exports

On startup, `src/server.ts` calls `exportContractsToGraphQLSchema(...)`, which writes:

- `packages/apps/api-contractspec/schema.graphql`
- `packages/apps/api-contractspec/schema.subgraph.graphql`

Treat these as generated artifacts: change schema at the source (contracts/specs), then regenerate by running the server.

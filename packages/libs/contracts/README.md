# @contractspec/lib.contracts (Deprecated)

`@contractspec/lib.contracts` has been deprecated and split into focused packages.

This package is kept only as a migration marker and no longer provides the old monolithic API surface.

## Replacement packages

- `@contractspec/lib.contracts-spec` - core contract declarations, registries, policies, workflows, and shared contract types.
- `@contractspec/lib.contracts-integrations` - integration contracts, provider specs, and integration-specific models/ops.
- `@contractspec/lib.contracts-runtime-client-react` - React runtime adapters (forms, feature rendering, drivers).
- `@contractspec/lib.contracts-runtime-server-rest` - REST server adapters (`rest-next-app`, `rest-express`, `rest-elysia`, etc.).
- `@contractspec/lib.contracts-runtime-server-graphql` - GraphQL runtime adapter (`graphql-pothos`).
- `@contractspec/lib.contracts-runtime-server-mcp` - MCP runtime adapter (`provider-mcp` and MCP registration helpers).

## Migration map

- `@contractspec/lib.contracts` -> `@contractspec/lib.contracts-spec`
- `@contractspec/lib.contracts/integrations/*` -> `@contractspec/lib.contracts-integrations/integrations/*`
- `@contractspec/lib.contracts/client/react/*` -> `@contractspec/lib.contracts-runtime-client-react/*`
- `@contractspec/lib.contracts/server/rest-next-app` -> `@contractspec/lib.contracts-runtime-server-rest/rest-next-app`
- `@contractspec/lib.contracts/server/graphql-pothos` -> `@contractspec/lib.contracts-runtime-server-graphql/graphql-pothos`
- `@contractspec/lib.contracts/server/provider-mcp` -> `@contractspec/lib.contracts-runtime-server-mcp/provider-mcp`

## Install

```bash
bun add @contractspec/lib.contracts-spec
bun add @contractspec/lib.contracts-integrations
bun add @contractspec/lib.contracts-runtime-client-react
bun add @contractspec/lib.contracts-runtime-server-rest
bun add @contractspec/lib.contracts-runtime-server-graphql
bun add @contractspec/lib.contracts-runtime-server-mcp
```

## Why this split

- Smaller, focused dependency graphs.
- Clear boundaries between declarations, integrations, and runtime adapters.
- Faster builds and better tree shaking.
- Safer long-term evolution of runtime surfaces.

Website: https://contractspec.io/

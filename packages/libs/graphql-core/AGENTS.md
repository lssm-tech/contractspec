# AI Agent Guide — `@contractspec/lib.graphql-core`

Scope: `packages/libs/graphql-core/*`

Shared GraphQL core: Pothos builder factory, scalars, tracing, and complexity analysis. Foundation for all GraphQL packages.

## Quick Context

- **Layer**: lib
- **Consumers**: graphql-federation, graphql-prisma, contracts-runtime-server-graphql, bundles

## Public Exports

| Subpath | Description |
| ------- | ----------- |
| `.`     | Main entry  |

## Guardrails

- Builder factory is consumed by all GraphQL packages — interface changes have high blast radius.
- Scalar definitions must stay aligned with the schema lib.
- Tracing and complexity plugins must not introduce runtime overhead in production without opt-in.

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`

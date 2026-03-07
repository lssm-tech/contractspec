# AI Agent Guide — `@contractspec/lib.graphql-federation`

Scope: `packages/libs/graphql-federation/*`

Pothos federation helpers and subgraph schema export utilities. Enables Apollo Federation-compatible subgraph construction.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles with federated GraphQL

## Public Exports

| Subpath | Description |
| ------- | ----------- |
| `.`     | Main entry  |

## Guardrails

- Federation directives must comply with the Apollo Federation spec; non-compliant changes break gateway composition.
- Depends on graphql-core — keep builder factory usage aligned.

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`

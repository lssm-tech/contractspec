# AI Agent Guide — `@contractspec/lib.graphql-prisma`

Scope: `packages/libs/graphql-prisma/*`

Pothos + Prisma builder factory with injectable client and DMMF. Bridges Prisma models into the Pothos GraphQL schema.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles with Prisma

## Public Exports

| Subpath | Description |
| ------- | ----------- |
| `.`     | Main entry  |

## Guardrails

- Prisma client injection must stay lazy — eagerly importing the client breaks tree-shaking and test isolation.
- DMMF handling is version-sensitive; Prisma major upgrades require validation here first.
- Depends on graphql-core — keep builder factory usage aligned.

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`

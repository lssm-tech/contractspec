# AI Agent Guide — `@contractspec/lib.contracts-runtime-server-graphql`

Scope: `packages/libs/contracts-runtime-server-graphql/*`

GraphQL server runtime adapters for ContractSpec contracts via Pothos builder integration.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles, apps with GraphQL

## Public Exports

- `.` — main entry
- `./graphql-pothos`

## Guardrails

- Pothos builder integration must stay compatible with graphql-core and graphql-prisma.
- Do not introduce direct schema mutations outside the Pothos pipeline.

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`

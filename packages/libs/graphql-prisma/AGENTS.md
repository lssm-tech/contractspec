# AI Agent Guide — `@contractspec/lib.graphql-prisma`

Scope: `packages/libs/graphql-prisma/*`

Pothos + Prisma builder factory with injectable client/DMMF.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.

## Guardrails

- Prisma client injection must stay lazy — eagerly importing the client breaks tree-shaking and test isolation.
- DMMF handling is version-sensitive; Prisma major upgrades require validation here first.
- Depends on graphql-core — keep builder factory usage aligned.
- Changes here can affect downstream packages such as `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
- `bun run prebuild` — contractspec-bun-build prebuild
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types

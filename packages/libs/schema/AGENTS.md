# AI Agent Guide — `@contractspec/lib.schema`

Scope: `packages/libs/schema/*`

Schema utilities for Zod, JSON Schema, and GraphQL.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/entity` is part of the package's public or composition surface.
- `src/EnumType.test.ts` is part of the package's public or composition surface.
- `src/EnumType.ts` is part of the package's public or composition surface.
- `src/FieldType.test.ts` is part of the package's public or composition surface.
- `src/FieldType.ts` is part of the package's public or composition surface.
- `src/GraphQLSchemaType.test.ts` is part of the package's public or composition surface.
- `src/GraphQLSchemaType.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./entity` resolves through `./src/entity/index.ts`.
- Export `./entity/defineEntity` resolves through `./src/entity/defineEntity.ts`.
- Export `./entity/generator` resolves through `./src/entity/generator.ts`.
- Export `./entity/types` resolves through `./src/entity/types.ts`.
- Export `./EnumType` resolves through `./src/EnumType.ts`.
- Export `./FieldType` resolves through `./src/FieldType.ts`.
- Export `./GraphQLSchemaType` resolves through `./src/GraphQLSchemaType.ts`.
- Export `./JsonSchemaType` resolves through `./src/JsonSchemaType.ts`.
- Export `./ScalarFactoryCache` resolves through `./src/ScalarFactoryCache.ts`.
- The package publishes 14 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Preserve multi-surface consistency: Zod, GraphQL, and JSON Schema representations must stay aligned.
- Prefer additive changes; avoid silently weakening validation or changing scalar semantics.
- Do not edit `dist/`; source of truth is `src/`.
- Changes here can affect downstream packages such as `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test
- `bun run lint` — bun lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild

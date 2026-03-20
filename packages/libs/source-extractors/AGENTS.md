# AI Agent Guide — `@contractspec/lib.source-extractors`

Scope: `packages/libs/source-extractors/*`

Extract contract candidates from TypeScript source code across multiple frameworks (NestJS, Express, Fastify, Hono, Elysia, tRPC, Next.js).

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/__fixtures__` is part of the package's public or composition surface.
- `src/__snapshots__` is part of the package's public or composition surface.
- `src/codegen` is part of the package's public or composition surface.
- `src/codegen.test.ts` is part of the package's public or composition surface.
- `src/detect.test.ts` is part of the package's public or composition surface.
- `src/detect.ts` is part of the package's public or composition surface.
- `src/edge-cases.test.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/types.ts` is shared public type definitions.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./codegen` resolves through `./src/codegen/index.ts`.
- Export `./extractors` resolves through `./src/extractors/index.ts`.
- Export `./types` resolves through `./src/types.ts`.

## Guardrails

- Extractor interface must support multiple frameworks — keep it generic.
- Codegen output must stay deterministic (same input → same output, always).
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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

# AI Agent Guide — `@contractspec/lib.contracts-runtime-server-rest`

Scope: `packages/libs/contracts-runtime-server-rest/*`

REST server runtime adapters for ContractSpec contracts.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/contracts-adapter-hydration.ts` is part of the package's public or composition surface.
- `src/contracts-adapter-input.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/rest-elysia.ts` is part of the package's public or composition surface.
- `src/rest-express.ts` is part of the package's public or composition surface.
- `src/rest-generic.ts` is part of the package's public or composition surface.
- `src/rest-next-app.ts` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./contracts-adapter-hydration` resolves through `./src/contracts-adapter-hydration.ts`.
- Export `./contracts-adapter-input` resolves through `./src/contracts-adapter-input.ts`.
- Export `./rest-elysia` resolves through `./src/rest-elysia.ts`.
- Export `./rest-express` resolves through `./src/rest-express.ts`.
- Export `./rest-generic` resolves through `./src/rest-generic.ts`.
- Export `./rest-next-app` resolves through `./src/rest-next-app.ts`.
- Export `./rest-next-pages` resolves through `./src/rest-next-pages.ts`.

## Guardrails

- High blast radius — all REST APIs depend on this package.
- Framework adapters (Elysia, Express, Next.js) must stay independent of each other.
- Do not introduce cross-adapter coupling.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild

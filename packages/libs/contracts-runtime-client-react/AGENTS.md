# AI Agent Guide — `@contractspec/lib.contracts-runtime-client-react`

Scope: `packages/libs/contracts-runtime-client-react/*`

React runtime adapters for ContractSpec contracts.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/drivers` is part of the package's public or composition surface.
- `src/feature-render.ts` is part of the package's public or composition surface.
- `src/form-render.impl.tsx` is part of the package's public or composition surface.
- `src/form-render.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./drivers/rn-reusables` resolves through `./src/drivers/rn-reusables.ts`.
- Export `./drivers/shadcn` resolves through `./src/drivers/shadcn.ts`.
- Export `./feature-render` resolves through `./src/feature-render.ts`.
- Export `./form-render` resolves through `./src/form-render.ts`.
- Export `./form-render.impl` resolves through `./src/form-render.impl.tsx`.

## Guardrails

- Driver interface must stay compatible with both shadcn and RN Reusables.
- Form rendering pipeline is a critical path; test thoroughly before changing.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
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

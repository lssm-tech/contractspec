# AI Agent Guide — `@contractspec/lib.files`

Scope: `packages/libs/files/*`

Files, documents and attachments module for ContractSpec applications.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/entities/` contains domain entities and value objects.
- `src/events.ts` is package-level event definitions.
- `src/files.capability.ts` defines a capability surface.
- `src/files.feature.ts` defines a feature entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./contracts` resolves through `./src/contracts/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/files.docblock` resolves through `./src/docs/files.docblock.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./events` resolves through `./src/events.ts`.
- Export `./files.capability` resolves through `./src/files.capability.ts`.
- Export `./files.feature` resolves through `./src/files.feature.ts`.
- Export `./storage` resolves through `./src/storage/index.ts`.

## Guardrails

- Storage interface is the adapter boundary — do not couple consumers to a specific storage provider.
- File entity schema is shared; field changes require migration coordination.
- Capability contract is public API.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
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

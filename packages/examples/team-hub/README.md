# @contractspec/example.team-hub

Website: https://contractspec.io

**Team Hub example with spaces, tasks, rituals, and announcements.**

## What This Demonstrates

- Multi-entity team collaboration domain (space, task, ritual, announcement).
- Per-entity schema and operations pattern.
- Capability and feature definition patterns.
- Presentation layer with team-hub presentation.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.

## Running Locally

From `packages/examples/team-hub`:
- `bun run dev`
- `bun run build`
- `bun run typecheck`

## Usage

Use `@contractspec/example.team-hub` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/announcement` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/entities/` contains domain entities and value objects.
- `src/events.ts` is package-level event definitions.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./announcement` resolves through `./src/announcement/index.ts`.
- Export `./announcement/announcement.operations` resolves through `./src/announcement/announcement.operations.ts`.
- Export `./announcement/announcement.schema` resolves through `./src/announcement/announcement.schema.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/team-hub.docblock` resolves through `./src/docs/team-hub.docblock.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./events` resolves through `./src/events.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./handlers` resolves through `./src/handlers/index.ts`.
- The package publishes 23 total export subpaths; keep docs aligned with `package.json`.

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

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Missing contract layers.

## Notes

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

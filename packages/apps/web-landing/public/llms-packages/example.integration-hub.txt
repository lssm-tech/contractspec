# @contractspec/example.integration-hub

Website: https://contractspec.io

**Integration Hub example with sync engine and field mappings for ContractSpec.**

## What This Demonstrates

- Connection management with typed schemas and enums.
- Integration lifecycle (create, configure, sync).
- Sync engine with field mapping and status tracking.
- MCP server example for tool integration.
- Capability and feature definition patterns.
- React UI with dashboard, hooks, markdown renderers, and shared ContractSpec tables for connections and sync configs.
- Contract-backed visualizations for integration mix, connection health, and sync-state comparison.
- Client-mode table capabilities including sorting, pagination, column visibility, pinning, resizing, and expanded operational details.
- Event definitions and operation test-specs.

## Running Locally

From `packages/examples/integration-hub`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.integration-hub` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/connection` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/events.ts` is package-level event definitions.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/integration` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./connection` resolves through `./src/connection/index.ts`.
- Export `./connection/connection.enum` resolves through `./src/connection/connection.enum.ts`.
- Export `./connection/connection.operation` resolves through `./src/connection/connection.operation.ts`.
- Export `./connection/connection.presentation` resolves through `./src/connection/connection.presentation.ts`.
- Export `./connection/connection.schema` resolves through `./src/connection/connection.schema.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/integration-hub.docblock` resolves through `./src/docs/integration-hub.docblock.ts`.
- Export `./events` resolves through `./src/events.ts`.
- Export `./example` resolves through `./src/example.ts`.
- The package publishes 36 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run lint` — bun lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run validate` — contractspec validate "src/**/*"
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run run:mcp` — bun tsx src/run-mcp.ts
- `bun run prebuild` — contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Vnext ai-native.
- Missing contract layers.
- Resolve lint, build, and type errors across nine packages.
- Add Composio universal fallback, fix provider-ranking types, and expand package exports.
- Add first-class transport, auth, versioning, and BYOK support across all integrations.

## Notes

- Works alongside `@contractspec/lib.ai-agent`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.runtime-sandbox`, ...

# AI Agent Guide — `@contractspec/app.registry-server`

Scope: `packages/apps/registry-server/*`

ContractSpec registry server. Serves contract specs and metadata over HTTP for IDE plugins, CLI tools, and other consumers.

## Quick Context

- Layer: `app`.
- Package visibility: published package.
- Primary consumers are deployed users, operators, or external clients of this app surface.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`.

## Architecture

- Built with Elysia (Bun HTTP framework).
- Uses `@contractspec/lib.contracts-spec` for contract definitions.
- Uses `@contractspec/lib.logger` for structured logging.
- Separate handlers for ContractSpec and LSSM routes.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/server.ts` is the main server bootstrap entrypoint.

## Public Surface

- This package is a deployable application rather than a library with published subpath exports.

## Guardrails

- API routes are consumed by IDE plugins and CI — do not change paths or response shapes without versioning.
- Filesystem access must use the `src/utils/` helpers for consistent path resolution.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`.

## Local Commands

- `bun run dev` — bun run --watch src/server.ts
- `bun run start` — ./server
- `bun run build` — bun build --compile --minify-whitespace --minify-syntax --target bun --outfile dist/server src/index.ts
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist server

# @contractspec/app.registry-server

Website: https://contractspec.io

**ContractSpec registry server. Serves contract specs and metadata over HTTP for IDE plugins, CLI tools, and other consumers.**

## What It Does

- Built with Elysia (Bun HTTP framework).
- Uses `@contractspec/lib.contracts-spec` for contract definitions.
- Uses `@contractspec/lib.logger` for structured logging.
- Separate handlers for ContractSpec and LSSM routes.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.

## Running Locally

From `packages/apps/registry-server`:
- `bun run dev`
- `bun run start`
- `bun run build`

## Usage

```bash
bun run dev
```

## Architecture

- Built with Elysia (Bun HTTP framework).
- Uses `@contractspec/lib.contracts-spec` for contract definitions.
- Uses `@contractspec/lib.logger` for structured logging.
- Separate handlers for ContractSpec and LSSM routes.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/server.ts` is the main server bootstrap entrypoint.

## Public Entry Points

- This package is a deployable application rather than a library with published subpath exports.

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

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.

## Notes

- API routes are consumed by IDE plugins and CI — do not change paths or response shapes without versioning.
- Filesystem access must use the `src/utils/` helpers for consistent path resolution.

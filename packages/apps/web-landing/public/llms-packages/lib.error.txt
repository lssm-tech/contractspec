# @contractspec/lib.error

Website: https://contractspec.io

**Structured error handling and HTTP error utilities.**

## What It Provides

- **Layer**: lib.
- **Consumers**: many libs and bundles.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.error`

or

`bun add @contractspec/lib.error`

## Usage

Import the root entrypoint from `@contractspec/lib.error`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/appError.ts` is part of the package's public or composition surface.
- `src/codes.ts` is part of the package's public or composition surface.
- `src/http.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./appError` resolves through `./src/appError.ts`.
- Export `./codes` resolves through `./src/codes.ts`.
- Export `./http` resolves through `./src/http.ts`.

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

## Notes

- Error codes are a shared contract — additions are safe, removals or renames are breaking.
- `AppError` shape must stay stable; downstream serialization depends on it.
- HTTP status mappings affect all API surfaces; changes require cross-package validation.

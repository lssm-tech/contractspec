# @contractspec/module.workspace

Website: https://contractspec.io

**Workspace discovery and management module.**

## What It Provides

- **Layer**: module.
- **Consumers**: bundles (contractspec-studio), apps (cli-contractspec, vscode-contractspec).
- Related ContractSpec packages include `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/module.workspace`

or

`bun add @contractspec/module.workspace`

## Usage

Import the root entrypoint from `@contractspec/module.workspace`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/ai` is part of the package's public or composition surface.
- `src/analysis` is part of the package's public or composition surface.
- `src/formatter.ts` is part of the package's public or composition surface.
- `src/formatters` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/templates` is part of the package's public or composition surface.
- `src/types` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.

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

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Stability.
- Add changesets and apply pending fixes.
- Add ai-native messaging channel runtime.

## Notes

- Uses `ts-morph` for AST analysis and `compare-versions` for semver checks -- version bumps may affect parsing behavior.
- Workspace detection is file-system-dependent; always use the provided abstractions, never raw `fs` calls.
- Changes here affect CLI, VSCode extension, and studio workspace initialization flows.

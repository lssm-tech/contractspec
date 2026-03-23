# @contractspec/biome-config

Website: https://contractspec.io

**Typed ContractSpec lint-policy package that generates Biome presets, Grit plugins, and AI-facing rule summaries.**

## What It Provides

- Acts as the source of truth for repository and consumer Biome policy artifacts.
- Publishes generated presets, Grit plugins, and AI summaries alongside the typed manifest and generation helpers.
- Requires artifact synchronization whenever the typed policy manifest changes so committed outputs stay aligned.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/biome-config`

or

`bun add @contractspec/biome-config`

## Usage

Import the root entrypoint from `@contractspec/biome-config`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/policies.ts` defines the typed policy manifest.
- `src/generate.ts` and `src/sync.ts` generate and synchronize derived artifacts.
- `src/types.ts` and `src/index.ts` expose the public API for generation and policy consumption.
- `presets/`, `plugins/`, and `ai/` contain committed generated artifacts consumed by downstream tools.

## Public Entry Points

- Exports the root library API and ships generated presets, Grit plugins, and AI-facing summaries as committed package artifacts.
- Export `.` resolves through `./src/index.ts`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run sync:artifacts` — bun src/sync.ts
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — bun run sync:artifacts && contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.

## Notes

- The committed `presets/`, `plugins/`, and `ai/` artifacts are intended for downstream scaffolding without code execution.

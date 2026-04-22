# @contractspec/biome-config

Website: https://contractspec.io

**Typed ContractSpec lint-policy package that generates Biome presets, Grit plugins, and AI-facing rule summaries.**

## What It Provides

- Acts as the source of truth for repository and consumer Biome policy artifacts.
- Publishes generated presets, Grit plugins, and AI summaries alongside the typed manifest and generation helpers.
- Requires artifact synchronization whenever the typed policy manifest changes so committed outputs stay aligned.
- Enforces React and React Native compatible JSX in shared presentation packages by preferring layout primitives (`HStack`, `VStack`, `Box`) over raw `<div>` and requiring visible text to sit inside `Text` or approved typography components. Repository app packages are excluded by default and can be opted in with the policy allowlist.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/biome-config`

or

`bun add @contractspec/biome-config`

## Usage

Import the root entrypoint from `@contractspec/biome-config`, or choose a documented subpath when you only need one part of the package surface.

### JSX Primitive Fixer

The Biome Grit plugins emit diagnostics only. To apply conservative native HTML replacement fixes, run:

`bun run jsx:fix-primitives`

or from this package:

`bun run fix:jsx-primitives`

By default the fixer scans `packages/bundles`, `packages/examples`, and `packages/modules`. It skips `packages/apps` unless an app is explicitly allowlisted:

`bun run jsx:fix-primitives -- --allow-app web-landing`

Use `--check` for a dry run. The fixer rewrites deterministic layout, list, and typography cases only; mixed JSX text and ambiguous form/action primitives remain diagnostic-only.

## Architecture

- `src/policies.ts` defines the typed policy manifest.
- `src/generate.ts` and `src/sync.ts` generate and synchronize derived artifacts.
- `src/fix-jsx-primitives.ts` provides the conservative companion codemod for deterministic JSX primitive replacements.
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
- `bun run fix:jsx-primitives` — apply conservative JSX primitive replacements.
- `bun run typecheck` — tsc --noEmit
- `bun run sync:artifacts` — bun src/sync.ts
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — bun run sync:artifacts && contractspec-bun-build prebuild

## Recent Updates

- Add cross-platform JSX layout and text guardrails for React and React Native compatibility.
- Add a conservative JSX primitive fixer command for deterministic native HTML replacements.
- Replace eslint+prettier by biomejs to optimize speed.

## Notes

- The committed `presets/`, `plugins/`, and `ai/` artifacts are intended for downstream scaffolding without code execution.

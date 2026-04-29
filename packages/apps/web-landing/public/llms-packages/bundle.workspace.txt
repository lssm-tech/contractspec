# @contractspec/bundle.workspace

Website: https://contractspec.io

**Core workspace bundle that powers ContractSpec CLI, validation, code generation, AI workflows, and repository setup.**

## What It Provides

- Provides the service layer behind the CLI, editor integrations, drift detection, diagnostics, and setup flows.
- Owns workspace-oriented AI agents, prompts, templates, fixers, and validation/reporting services.
- Acts as the main orchestration bundle for repository lifecycle and codegen workflows.
- `src/adapters/` contains runtime, provider, or environment-specific adapters.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/services/` contains business logic services and workflows.

## Installation

`npm install @contractspec/bundle.workspace`

or

`bun add @contractspec/bundle.workspace`

## Usage

Import the root entrypoint from `@contractspec/bundle.workspace`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/services/` contains the core use-cases for build, validate, doctor, diff, setup, examples, and CI flows.
- `src/adapters/` and `src/ports/` isolate filesystem, git, AI, and workspace integration boundaries.
- `src/ai/` contains workspace-specific agent definitions, prompts, and model-aware helpers.
- `src/templates/`, `src/contracts/`, `src/formatters/`, `src.types/`, and `src.utils/` support generated outputs and reporting.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Root bundle export with namespaced services, adapters, ports, formatters, templates, contracts, AI helpers, and utilities.
- Export `.` resolves through `./src/index.ts`.
- Environment templates can generate root and app-target `.env.example` content from the shared logical environment contract while preserving per-framework aliases such as `NEXT_PUBLIC_*` and `EXPO_PUBLIC_*`.

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
- Add table capabilities.
- Stability.
- Package exports.
- Add latest models and align defaults.
- Standardize tool naming to underscore notation.

## Notes

- Largest bundle in the monorepo (~280 source files); prefer editing existing services over adding new top-level directories.
- Adapters must implement port interfaces; no direct infrastructure calls from services.
- AI agent definitions must stay provider-agnostic via the `ai` SDK abstraction.
- Template changes affect generated code across all consumers; test thoroughly.

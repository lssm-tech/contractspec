# AI Agent Guide — `@contractspec/bundle.workspace`

Scope: `packages/bundles/workspace/*`

Core workspace bundle that powers ContractSpec CLI, validation, code generation, AI workflows, and repository setup.

## Quick Context

- Layer: `bundle`.
- Package visibility: published package.
- Primary consumers are apps and higher-level composed product surfaces.
- Related packages: `@contractspec/biome-config`, `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.contracts-transformers`, ...

## Architecture

- `src/services/` contains the core use-cases for build, validate, doctor, diff, setup, examples, and CI flows.
- `src/adapters/` and `src/ports/` isolate filesystem, git, AI, and workspace integration boundaries.
- `src/ai/` contains workspace-specific agent definitions, prompts, and model-aware helpers.
- `src/templates/`, `src/contracts/`, `src/formatters/`, `src.types/`, and `src.utils/` support generated outputs and reporting.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/types.ts` is shared public type definitions.

## Public Surface

- Root bundle export with namespaced services, adapters, ports, formatters, templates, contracts, AI helpers, and utilities.
- Export `.` resolves through `./src/index.ts`.

## Guardrails

- This is one of the highest-blast-radius packages in the repo; CLI, editors, and CI all depend on it.
- Keep adapters behind ports and avoid leaking platform-specific behavior into service logic.
- Template and validation changes affect generated code and automation output across the monorepo.
- Changes here can affect downstream packages such as `@contractspec/biome-config`, `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.contracts-transformers`, ...

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

# @contractspec/lib.harness

Website: https://contractspec.io

**Harness orchestration, policy, evidence normalization, replay bundling, and evaluation runtime for controlled inspection and proof generation.**

## What It Provides

- Provides the mode-agnostic harness core used by higher-level runtime adapters and harness-aware workflows.
- Exports focused surfaces for assertions, evidence normalization, orchestration, policy classification, replay bundles, and shared types.
- Acts as the central execution model for controlled evaluation, proof generation, and inspection flows.
- Executes scenario `setup` and `reset` hooks through an explicit `HarnessScenarioHookExecutor`, enforces required evidence, and applies scenario success rules during evaluation.
- `src/adapters/` contains runtime, provider, or environment-specific adapters.

## Installation

`npm install @contractspec/lib.harness`

or

`bun add @contractspec/lib.harness`

## Usage

Import the root entrypoint from `@contractspec/lib.harness`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/assertions/` contains assertion-engine logic.
- `src/evidence/` normalizes harness evidence into runtime-friendly shapes.
- `src/orchestration/` runs suites and evaluation pipelines.
- `src/policy/` classifies and applies harness policies.
- `src/replay/` packages replay bundles and reproducible outputs.
- `src/types.ts` contains shared public types.

## Public Entry Points

- Exports the root harness runtime plus assertion, evidence, orchestration, policy, replay, and type subpaths.
- Export `.` resolves through `./src/index.ts`.
- Export `./assertions/engine` resolves through `./src/assertions/engine.ts`.
- Export `./evidence/normalizer` resolves through `./src/evidence/normalizer.ts`.
- Export `./orchestration/evaluation-runner` resolves through `./src/orchestration/evaluation-runner.ts`.
- Export `./orchestration/runner` resolves through `./src/orchestration/runner.ts`.
- Export `./policy/classifier` resolves through `./src/policy/classifier.ts`.
- Export `./replay/bundle` resolves through `./src/replay/bundle.ts`.
- Export `./types` resolves through `./src/types.ts`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test --pass-with-no-tests
- `bun run lint` — bun run lint:fix
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
- Add a first-class harness system for controlled inspection, testing, evaluation, and proof generation.
- Implement scenario setup/reset hooks, required evidence checks, success-rule evaluation, and suite mode/target propagation.

## Notes

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Hook execution is intentionally injected through `HarnessScenarioHookExecutor`; the harness core does not import operation registries or application runtimes implicitly.

# @contractspec/lib.observability

Website: https://contractspec.io

**OpenTelemetry-based observability primitives.**

## What It Provides

- **Layer**: lib.
- **Consumers**: evolution, progressive-delivery, bundles.
- `src/pipeline/` contains pipeline stages and orchestration helpers.
- Related ContractSpec packages include `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- `src/pipeline/` contains pipeline stages and orchestration helpers.

## Installation

`npm install @contractspec/lib.observability`

or

`bun add @contractspec/lib.observability`

## Usage

Import the root entrypoint from `@contractspec/lib.observability`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/anomaly` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/intent` is part of the package's public or composition surface.
- `src/logging` is part of the package's public or composition surface.
- `src/metrics` is part of the package's public or composition surface.
- `src/pipeline/` contains pipeline stages and orchestration helpers.
- `src/telemetry` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./anomaly/alert-manager` resolves through `./src/anomaly/alert-manager.ts`.
- Export `./anomaly/anomaly-detector` resolves through `./src/anomaly/anomaly-detector.ts`.
- Export `./anomaly/baseline-calculator` resolves through `./src/anomaly/baseline-calculator.ts`.
- Export `./anomaly/root-cause-analyzer` resolves through `./src/anomaly/root-cause-analyzer.ts`.
- Export `./intent/aggregator` resolves through `./src/intent/aggregator.ts`.
- Export `./intent/detector` resolves through `./src/intent/detector.ts`.
- Export `./logging` resolves through `./src/logging/index.ts`.
- Export `./metrics` resolves through `./src/metrics/index.ts`.
- Export `./pipeline/evolution-pipeline` resolves through `./src/pipeline/evolution-pipeline.ts`.
- The package publishes 18 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test --pass-with-no-tests
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
- Circular import issue.
- Normalize formatting across contracts-integrations, composio, and observability.
- Add AI provider ranking system with ranking-driven model selection.

## Notes

- OTel span and metric naming conventions must stay consistent across the platform.
- Pipeline interfaces are adapter boundaries — do not leak vendor-specific details.
- Anomaly detection thresholds affect alerting; changes require validation.

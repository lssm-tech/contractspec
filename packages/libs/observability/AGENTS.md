# AI Agent Guide — `@contractspec/lib.observability`

Scope: `packages/libs/observability/*`

OpenTelemetry-based observability primitives.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/anomaly` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/intent` is part of the package's public or composition surface.
- `src/logging` is part of the package's public or composition surface.
- `src/metrics` is part of the package's public or composition surface.
- `src/pipeline/` contains pipeline stages and orchestration helpers.
- `src/telemetry` is part of the package's public or composition surface.

## Public Surface

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

## Guardrails

- OTel span and metric naming conventions must stay consistent across the platform.
- Pipeline interfaces are adapter boundaries — do not leak vendor-specific details.
- Anomaly detection thresholds affect alerting; changes require validation.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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

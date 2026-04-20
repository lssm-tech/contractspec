# AI Agent Guide — `@contractspec/lib.presentation-runtime-core`

Scope: `packages/libs/presentation-runtime-core/*`

Core presentation runtime for contract-driven UIs.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/index.ts` is the root public barrel that builds the package entrypoint.
- `src/metro.ts` is part of the package's public or composition surface.
- `src/next.ts` is part of the package's public or composition surface.
- `src/table.ts` is part of the package's public or composition surface.
- `src/visualization.echarts.ts` is part of the package's public or composition surface.
- `src/visualization.model.builders.ts` is part of the package's public or composition surface.
- `src/visualization.model.helpers.ts` is part of the package's public or composition surface.

## Public Surface

- Export `.` publishes through `./dist/index.js`; CommonJS `require` resolves to the generated Metro helper at `./dist/metro.cjs`.
- Export `./metro` builds from `./src/metro.ts`.
- Export `./next` builds from `./src/next.ts`.
- Export `./table` builds from `./src/table.ts`.
- Export `./visualization` builds from `./src/visualization.ts`.
- Export `./visualization.echarts` builds from `./src/visualization.echarts.ts`.
- Export `./visualization.model` builds from `./src/visualization.model.ts`.
- Export `./visualization.model.builders` builds from `./src/visualization.model.builders.ts`.
- Export `./visualization.model.helpers` builds from `./src/visualization.model.helpers.ts`.
- Export `./visualization.types` builds from `./src/visualization.types.ts`.
- Export `./visualization.utils` builds from `./src/visualization.utils.ts`.

## Guardrails

- Core runtime interface is consumed by all presentation runtimes — changes here affect both web and mobile.
- Must remain platform-agnostic; no React or React Native imports allowed.
- API surface changes require coordinated updates in both downstream runtimes.
- Cross-surface helper changes must stay aligned with `/docs/libraries/cross-platform-ui` and its customer markdown kit.
- Keep bundler helper imports root-based: `withPresentationTurbopackAliases`, `withPresentationWebpackAliases`, and `withPresentationMetroAliases`.
- Do not reintroduce `withPresentationNextAliases`; Next.js guidance is Turbopack-first with Webpack as an explicit fallback.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit -p tsconfig.json
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild

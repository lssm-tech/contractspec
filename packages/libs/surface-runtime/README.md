# @contractspec/lib.surface-runtime

Website: https://contractspec.io

**Surface runtime for AI-native ContractSpec experiences, including bundle specs, planners, overlays, patching, and React rendering support.**

## What It Provides

- Provides the runtime layer behind AI-planned surfaces, widget registries, overrides, and bundle resolution.
- Supports React rendering, adapter boundaries, telemetry, evaluation harnesses, and planner tooling.
- Recently expanded to better align with AI chat, i18n, workflow tools, and bundle export needs.
- `src/adapters/` contains runtime, provider, or environment-specific adapters.

## Installation

`npm install @contractspec/lib.surface-runtime`

or

`bun add @contractspec/lib.surface-runtime`

## Usage

Import the root entrypoint from `@contractspec/lib.surface-runtime`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/spec/` defines module-bundle and surface-patch validation surfaces.
- `src/runtime/` contains planners, registries, patch application, policy evaluation, and bundle resolution.
- `src/react/` exports the React integration layer for bundle rendering and override handling.
- `src/adapters/`, `src.telemetry/`, `src.evals/`, and `src.examples/` support integration and verification flows.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Exports runtime, spec, React integration, adapters, telemetry, eval, and example subpaths for AI-native surface composition.
- Export `.` resolves through `./src/index.ts`.
- Export `./adapters` resolves through `./src/adapters/index.ts`.
- Export `./adapters/ai-sdk-stub` resolves through `./src/adapters/ai-sdk-stub.ts`.
- Export `./adapters/blocknote-stub` resolves through `./src/adapters/blocknote-stub.tsx`.
- Export `./adapters/dnd-kit-adapter` resolves through `./src/adapters/dnd-kit-adapter.tsx`.
- Export `./adapters/dnd-kit-stub` resolves through `./src/adapters/dnd-kit-stub.ts`.
- Export `./adapters/floating-ui-stub` resolves through `./src/adapters/floating-ui-stub.tsx`.
- Export `./adapters/interfaces` resolves through `./src/adapters/interfaces.ts`.
- Export `./adapters/motion-stub` resolves through `./src/adapters/motion-stub.ts`.
- Export `./adapters/resizable-panels-stub` resolves through `./src/adapters/resizable-panels-stub.tsx`.
- The package publishes 53 total export subpaths; keep docs aligned with `package.json`.

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
- `bun run build:bundle` — contractspec-bun-build transpile && node scripts/fix-use-client-directive.mjs
- `bun run build:types` — contractspec-bun-build types
- `bun run lint:adapters` — node scripts/lint-adapters.mjs
- `bun run test:evals` — bun test src/evals/
- `bun run prebuild` — contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Export, sidebar, workflow tools, slotContent.
- Vercel AI SDK parity + surface-runtime i18n and bundle alignment.
- Bundle spec alignment, i18n support, PM workbench pilot.

## Notes

- No direct third-party UI imports outside `src/adapters/` (when adapters are added).
- Every surface must have verification.dimensions for all 7 preference dimensions.
- Adapter rule: BlockNote, dnd-kit, etc. behind adapter boundaries only.

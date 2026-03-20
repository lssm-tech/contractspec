# AI Agent Guide — `@contractspec/example.learning-journey-ui-shared`

Scope: `packages/examples/learning-journey-ui-shared/*`

Shared UI components and hooks for learning journey mini-apps.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit-web`, `@contractspec/module.learning-journey`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/components/` contains reusable UI components and view composition.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/hooks/` contains custom hooks for host applications.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/learning-journey-ui-shared.feature.ts` defines a feature entrypoint.
- `src/types.ts` is shared public type definitions.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./components` resolves through `./src/components/index.ts`.
- Export `./components/BadgeDisplay` resolves through `./src/components/BadgeDisplay.tsx`.
- Export `./components/StreakCounter` resolves through `./src/components/StreakCounter.tsx`.
- Export `./components/ViewTabs` resolves through `./src/components/ViewTabs.tsx`.
- Export `./components/XpBar` resolves through `./src/components/XpBar.tsx`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/learning-journey-ui-shared.docblock` resolves through `./src/docs/learning-journey-ui-shared.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./hooks` resolves through `./src/hooks/index.ts`.
- The package publishes 13 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit-web`, `@contractspec/module.learning-journey`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit-web`, `@contractspec/module.learning-journey`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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

# @contractspec/example.learning-journey-ui-onboarding

Website: https://contractspec.io

**Developer onboarding UI with checklists and journey maps.**

## What This Demonstrates

- React-based onboarding mini-app with checklist and journey map components.
- Multi-view layout (Overview, Progress, Steps, Timeline).
- Shared UI component reuse across learning journey examples.
- DocBlock-driven documentation pattern.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/learning-journey-ui-onboarding`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.learning-journey-ui-onboarding` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/components/` contains reusable UI components and view composition.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/learning-journey-ui-onboarding.feature.ts` defines a feature entrypoint.
- `src/OnboardingMiniApp.tsx` is part of the package's public or composition surface.
- `src/views/` contains view-level composition.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./components` resolves through `./src/components/index.ts`.
- Export `./components/CodeSnippet` resolves through `./src/components/CodeSnippet.tsx`.
- Export `./components/JourneyMap` resolves through `./src/components/JourneyMap.tsx`.
- Export `./components/StepChecklist` resolves through `./src/components/StepChecklist.tsx`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/learning-journey-ui-onboarding.docblock` resolves through `./src/docs/learning-journey-ui-onboarding.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./learning-journey-ui-onboarding.feature` resolves through `./src/learning-journey-ui-onboarding.feature.ts`.
- Export `./OnboardingMiniApp` resolves through `./src/OnboardingMiniApp.tsx`.
- The package publishes 15 total export subpaths; keep docs aligned with `package.json`.

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
- Missing contract layers.

## Notes

- Works alongside `@contractspec/example.learning-journey-platform-tour`, `@contractspec/example.learning-journey-studio-onboarding`, `@contractspec/example.learning-journey-ui-shared`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, ...

# @contractspec/lib.accessibility

Website: https://contractspec.io

**WCAG compliance utilities and validators.**

## What It Provides

- **Layer**: lib.
- **Consumers**: design-system, example apps.
- Related ContractSpec packages include `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit`, `@contractspec/lib.ui-kit-web`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit`, `@contractspec/lib.ui-kit-web`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.accessibility`

or

`bun add @contractspec/lib.accessibility`

## Usage

Import the root entrypoint from `@contractspec/lib.accessibility`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/AccessibilityPanel.tsx` is part of the package's public or composition surface.
- `src/AccessibilityProvider.tsx` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/nativewind-env.d.ts` is part of the package's public or composition surface.
- `src/next-route-announcer.tsx` is part of the package's public or composition surface.
- `src/preferences.tsx` is part of the package's public or composition surface.
- `src/styles.css` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./AccessibilityPanel` resolves through `./src/AccessibilityPanel.tsx`.
- Export `./AccessibilityProvider` resolves through `./src/AccessibilityProvider.tsx`.
- Export `./nativewind-env.d` resolves through `./src/nativewind-env.d.ts`.
- Export `./next-route-announcer` resolves through `./src/next-route-announcer.tsx`.
- Export `./preferences` resolves through `./src/preferences.tsx`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
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

## Notes

- WCAG compliance standards must be preserved; changes affect all UI surfaces.
- Do not weaken or remove existing validators without coordinating with design-system consumers.

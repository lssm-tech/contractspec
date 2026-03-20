# AI Agent Guide — `@contractspec/lib.accessibility`

Scope: `packages/libs/accessibility/*`

WCAG compliance utilities and validators.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit`, `@contractspec/lib.ui-kit-web`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/AccessibilityPanel.tsx` is part of the package's public or composition surface.
- `src/AccessibilityProvider.tsx` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/nativewind-env.d.ts` is part of the package's public or composition surface.
- `src/next-route-announcer.tsx` is part of the package's public or composition surface.
- `src/preferences.tsx` is part of the package's public or composition surface.
- `src/styles.css` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./AccessibilityPanel` resolves through `./src/AccessibilityPanel.tsx`.
- Export `./AccessibilityProvider` resolves through `./src/AccessibilityProvider.tsx`.
- Export `./nativewind-env.d` resolves through `./src/nativewind-env.d.ts`.
- Export `./next-route-announcer` resolves through `./src/next-route-announcer.tsx`.
- Export `./preferences` resolves through `./src/preferences.tsx`.

## Guardrails

- WCAG compliance standards must be preserved; changes affect all UI surfaces.
- Do not weaken or remove existing validators without coordinating with design-system consumers.
- Changes here can affect downstream packages such as `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit`, `@contractspec/lib.ui-kit-web`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Changes here can affect downstream packages such as `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit`, `@contractspec/lib.ui-kit-web`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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

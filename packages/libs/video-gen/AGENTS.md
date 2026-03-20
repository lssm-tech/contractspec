# AI Agent Guide — `@contractspec/lib.video-gen`

Scope: `packages/libs/video-gen/*`

AI-powered video generation with Remotion: compositions, rendering, and design integration.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.ai-providers`, `@contractspec/lib.content-gen`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.image-gen`, ...

## Architecture

- `src/compositions` is part of the package's public or composition surface.
- `src/design` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/generators` is part of the package's public or composition surface.
- `src/i18n` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/player` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./compositions` resolves through `./src/compositions/index.ts`.
- Export `./compositions/api-overview` resolves through `./src/compositions/api-overview.tsx`.
- Export `./compositions/primitives` resolves through `./src/compositions/primitives/index.ts`.
- Export `./compositions/primitives/animated-text` resolves through `./src/compositions/primitives/animated-text.tsx`.
- Export `./compositions/primitives/brand-frame` resolves through `./src/compositions/primitives/brand-frame.tsx`.
- Export `./compositions/primitives/code-block` resolves through `./src/compositions/primitives/code-block.tsx`.
- Export `./compositions/primitives/progress-bar` resolves through `./src/compositions/primitives/progress-bar.tsx`.
- Export `./compositions/primitives/terminal` resolves through `./src/compositions/primitives/terminal.tsx`.
- Export `./compositions/primitives/transition` resolves through `./src/compositions/primitives/transition.tsx`.
- The package publishes 42 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Remotion composition API is version-sensitive — pin and test upgrades carefully.
- Renderer interface is the adapter boundary — do not leak Remotion internals.
- Depends on voice, content-gen, image-gen, design-system — coordinate cross-lib changes.
- Changes here can affect downstream packages such as `@contractspec/lib.ai-providers`, `@contractspec/lib.content-gen`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.image-gen`, ....

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

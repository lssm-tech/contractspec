# @contractspec/lib.content-gen

Website: https://contractspec.io

**AI-powered content generation for blog, email, and social.**

## What It Provides

- **Layer**: lib.
- **Consumers**: image-gen, voice, video-gen, bundles.
- Related ContractSpec packages include `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.content-gen`

or

`bun add @contractspec/lib.content-gen`

## Usage

Import the root entrypoint from `@contractspec/lib.content-gen`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/generators` is part of the package's public or composition surface.
- `src/i18n` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/seo` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./generators` resolves through `./src/generators/index.ts`.
- Export `./generators/blog` resolves through `./src/generators/blog.ts`.
- Export `./generators/email` resolves through `./src/generators/email.ts`.
- Export `./generators/landing-page` resolves through `./src/generators/landing-page.ts`.
- Export `./generators/social` resolves through `./src/generators/social.ts`.
- Export `./i18n` resolves through `./src/i18n/index.ts`.
- Export `./i18n/catalogs` resolves through `./src/i18n/catalogs/index.ts`.
- Export `./i18n/catalogs/en` resolves through `./src/i18n/catalogs/en.ts`.
- Export `./i18n/catalogs/es` resolves through `./src/i18n/catalogs/es.ts`.
- The package publishes 17 total export subpaths; keep docs aligned with `package.json`.

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
- Resolve lint, build, and test failures across voice, workspace, library, and composio.
- Add first-class transport, auth, versioning, and BYOK support across all integrations.
- Add AI provider ranking system with ranking-driven model selection.
- Add full i18n support across all 10 packages (en/fr/es, 460 keys).

## Notes

- Generator interface is shared across media libs (image-gen, voice, video-gen); keep it stable.
- i18n keys must stay in sync with consuming packages.

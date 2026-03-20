# @contractspec/lib.image-gen

Website: https://contractspec.io

**AI-powered image generation for hero, social, thumbnail, OG, and illustration.**

## What It Provides

- **Layer**: lib.
- **Consumers**: video-gen, bundles.
- `src/docs/` contains docblocks and documentation-facing exports.
- Related ContractSpec packages include `@contractspec/lib.content-gen`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- `src/docs/` contains docblocks and documentation-facing exports.

## Installation

`npm install @contractspec/lib.image-gen`

or

`bun add @contractspec/lib.image-gen`

## Usage

Import the root entrypoint from `@contractspec/lib.image-gen`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/generators` is part of the package's public or composition surface.
- `src/i18n` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/presets` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./docs/generators.docblock` resolves through `./src/docs/generators.docblock.ts`.
- Export `./docs/image-gen.docblock` resolves through `./src/docs/image-gen.docblock.ts`.
- Export `./generators` resolves through `./src/generators/index.ts`.
- Export `./generators/image-generator` resolves through `./src/generators/image-generator.ts`.
- Export `./generators/prompt-builder` resolves through `./src/generators/prompt-builder.ts`.
- Export `./generators/style-resolver` resolves through `./src/generators/style-resolver.ts`.
- Export `./i18n` resolves through `./src/i18n/index.ts`.
- Export `./i18n/catalogs` resolves through `./src/i18n/catalogs/index.ts`.
- Export `./i18n/catalogs/en` resolves through `./src/i18n/catalogs/en.ts`.
- The package publishes 20 total export subpaths; keep docs aligned with `package.json`.

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
- Add @contractspec/lib.image-gen package with full test suite.

## Notes

- Generator interface is shared with the content-gen pattern; keep the adapter shape consistent.
- Preset schemas affect all generated images; field changes require validation across consumers.
- Do not hardcode locale-specific strings outside the i18n subpath.

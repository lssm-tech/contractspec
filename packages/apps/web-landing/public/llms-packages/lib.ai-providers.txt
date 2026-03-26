# @contractspec/lib.ai-providers

Website: https://contractspec.io

**Unified AI provider abstraction layer.**

## What It Provides

- **Layer**: lib.
- **Consumers**: ai-agent, content-gen, image-gen, voice.
- Related ContractSpec packages include `@contractspec/lib.provider-ranking`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.provider-ranking`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.ai-providers`

or

`bun add @contractspec/lib.ai-providers`

## Usage

Import the root entrypoint from `@contractspec/lib.ai-providers`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/factory.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/legacy.ts` is part of the package's public or composition surface.
- `src/models.test.ts` is part of the package's public or composition surface.
- `src/models.ts` is part of the package's public or composition surface.
- `src/selector-types.ts` is part of the package's public or composition surface.
- `src/selector.ts` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./factory` resolves through `./src/factory.ts`.
- Export `./legacy` resolves through `./src/legacy.ts`.
- Export `./models` resolves through `./src/models.ts`.
- Export `./selector` resolves through `./src/selector.ts`.
- Export `./selector-types` resolves through `./src/selector-types.ts`.
- Export `./types` resolves through `./src/types.ts`.
- Export `./validation` resolves through `./src/validation.ts`.

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
- Add latest models and align defaults.
- Resolve lint, build, and type errors across nine packages.
- Add first-class transport, auth, versioning, and BYOK support across all integrations.
- Add AI provider ranking system with ranking-driven model selection.
- Add first-class mistral provider support.

## Notes

- Provider interface is consumed by all AI-powered libs; breaking changes cascade widely.
- Adding new providers must not break existing factory signatures.

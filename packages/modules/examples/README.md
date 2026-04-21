# @contractspec/module.examples

Website: https://contractspec.io

**Catalog-first ContractSpec example metadata, with optional runtime helpers for rich example surfaces.**

## What It Provides

- **Layer**: module.
- **Consumers**: CLIs, editor bridges, apps, docs, and rich sandbox/template surfaces.
- Related ContractSpec packages include `@contractspec/example.agent-console`, `@contractspec/example.ai-chat-assistant`, `@contractspec/example.ai-support-bot`, `@contractspec/example.analytics-dashboard`, `@contractspec/example.calendar-google`, `@contractspec/example.content-generation`, ...
- `agent-console` is the default autonomous-agent showcase surfaced through `/sandbox`.
- `data-grid-showcase` is the canonical ContractSpec table showcase surfaced through `/sandbox?template=data-grid-showcase` and `/docs/examples/data-grid-showcase`.

## Installation

`npm install @contractspec/module.examples`

or

`bun add @contractspec/module.examples`

## Usage

Use the root entrypoint or `@contractspec/module.examples/catalog` for metadata-only discovery. Use `@contractspec/module.examples/runtime` only when rendering rich template previews or sandbox runtime surfaces.

```ts
import { getExample, listExamples } from '@contractspec/module.examples/catalog';
```

```ts
import { TemplateRuntimeProvider, listTemplates } from '@contractspec/module.examples/runtime';
```

The catalog contains source metadata for each example. CLI users can fetch a full example only when needed:

```sh
contractspec examples download minimal --out-dir ./examples/minimal
```

## Architecture

- `src/builtins.ts` is a generated literal catalog and must not statically import `@contractspec/example.*` packages.
- `src/catalog.ts` is the metadata-only public surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/registry.test.ts` is part of the package's public or composition surface.
- `src/registry.ts` is part of the package's public or composition surface.
- `src/runtime` is the optional rich runtime surface for consumers that intentionally install example packages.

## Public Entry Points

- Export `.` resolves through `./src/index.ts` and is catalog-only.
- Export `./catalog` resolves through `./src/catalog.ts`.
- Export `./runtime` resolves through `./src/runtime/index.ts`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test
- `bun run lint` — bun lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run generate:registry` — bun ../../../scripts/generate-example-registry.ts --write
- `bun run prebuild` — bun run generate:registry && contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Add table capabilities.
- Stability.
- Vnext ai-native.

## Notes

- This module is a thin catalog/runtime bridge -- business logic belongs in individual example packages under `packages/examples/`.
- Adding a new example requires creating the example package and regenerating the catalog with `bun run generate:registry`; do not add it as a direct dependency here.
- Root/catalog imports must remain metadata-only. Rich runtime consumers should import `@contractspec/module.examples/runtime` and own any required `@contractspec/example.*` dependencies directly.
- The meetup-ready autonomous-agent path is the deterministic `agent-console` sandbox plus its replay proof lane.
- The shared ContractSpec table stack is demonstrated directly by `data-grid-showcase` and reused in `analytics-dashboard`, `crm-pipeline`, `integration-hub`, and `agent-console`.

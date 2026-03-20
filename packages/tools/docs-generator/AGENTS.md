# AI Agent Guide — `@contractspec/tool.docs-generator`

Scope: `packages/tools/docs-generator/*`

CLI tool for generating docs artifacts from ContractSpec specs and DocBlocks.

## Quick Context

- Layer: `tool`.
- Package visibility: published package.
- Primary consumers are developers, CI jobs, and repository automation flows.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/fs.ts` is part of the package's public or composition surface.
- `src/generate.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/markdown.test.ts` is part of the package's public or composition surface.
- `src/markdown.ts` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Surface

- Binary `contractspec-docs` points to `./dist/index.js`.
- Export `.` resolves through `./src/index.ts`.

## Guardrails

- Output paths are configured via CLI flags -- do not hard-code destination directories.
- Depends on `@contractspec/lib.contracts-spec` for spec parsing -- changes there may require updates here.
- The `docs:generate` script references relative paths to `generated/docs` and the library bundle; verify paths if the monorepo structure changes.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
- `bun run docs:generate` — bun src/index.ts generate --source "../../../generated/docs" --out "../../../packages/bundles/library/src/components/docs/generated" --content-root "../../../generated/docs"
- `bun run prebuild` — contractspec-bun-build prebuild

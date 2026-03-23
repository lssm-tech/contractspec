# @contractspec/app.cli-contractspec

Website: https://contractspec.io

**CLI tool for creating, building, and validating contract specifications.**

## What It Does

- **Commands** (`src/commands/`) - Thin wrappers that call bundle services.
- **Prompts** (`src/commands/create/wizards/`) - Interactive UI using `@inquirer/prompts`.
- **CLI setup** (`src/index.ts`, `src/cli.ts`) - Commander.js configuration.
- **Types** (`src/types.ts`) - CLI-specific types.
- **Services** (`@contractspec/bundle.workspace/services/`) - Core use-cases.
- `create.ts` - Spec creation logic.
- `build.ts` - Code generation from specs.
- `openapi.ts` - OpenAPI export.

## Running Locally

From `packages/apps/cli-contractspec`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

```bash
bun run dev
```

## Architecture

- **Commands** (`src/commands/`) - Thin wrappers that call bundle services.
- **Prompts** (`src/commands/create/wizards/`) - Interactive UI using `@inquirer/prompts`.
- **CLI setup** (`src/index.ts`, `src/cli.ts`) - Commander.js configuration.
- **Types** (`src/types.ts`) - CLI-specific types.
- **Services** (`@contractspec/bundle.workspace/services/`) - Core use-cases.
- `create.ts` - Spec creation logic.
- `build.ts` - Code generation from specs.
- `openapi.ts` - OpenAPI export.
- `registry.ts` - Registry client.
- `examples.ts` - Examples management.

## Public Entry Points

- Export `./run` resolves through `bun`, `node`, `default`.

## Local Commands

- `bun run dev` — bun build ./src/cli.ts --outfile ./dist/cli.js --target node --watch
- `bun run build` — bun run build:types && bun run build:all
- `bun run test` — bun test
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist
- `bun run build:bun` — bun build --outdir ./dist/bun/ --target bun --minify --sourcemap ./src/cli.ts
- `bun run build:node` — bun build --outdir ./dist/node/ --target node --minify --sourcemap ./src/cli.ts
- `bun run build:all` — bun run build:bun && bun run build:node
- `bun run build:types` — tsc --noEmit
- `bun run dev:bun` — bun build ./src/cli.ts --outfile ./dist/cli.bun.js --target bun --watch
- `bun run test:watch` — bun test --watch

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Add table capabilities.
- Stability.
- Vnext ai-native.
- Add latest models and align defaults.
- Resolve lint and build errors in workspace bundle and integrations lib.

## Notes

- Works alongside `@contractspec/bundle.workspace`, `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, ...

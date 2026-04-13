# AI Agent Guide — `@contractspec/app.cli-contractspec`

Scope: `packages/apps/cli-contractspec/*`

CLI tool for creating, building, and validating contract specifications.

## Quick Context

- Layer: `app`.
- Package visibility: published package.
- Primary consumers are deployed users, operators, or external clients of this app surface.
- Related packages: `@contractspec/bundle.workspace`, `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.contracts-transformers`, ...

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

## Public Surface

- Export `./run` resolves through `bun`, `node`, `default`.

## Guardrails

- Keep reusable business logic out of the app shell; prefer lower layers for shared behavior.
- Treat routes, handlers, and externally consumed payloads as compatibility surfaces.
- Changes here can affect downstream packages such as `@contractspec/bundle.workspace`, `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.contracts-transformers`, ....
- Changes here can affect downstream packages such as `@contractspec/bundle.workspace`, `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.contracts-transformers`, ...

## Local Commands

- `bun run dev` — bun build ./src/cli.ts --outfile ./dist/cli.js --target node --watch
- `bun run build` — bun run prebuild && bun run build:types && bun run build:all
- `bun run test` — bun test
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist
- `bun run build:bun` — bun build --outdir ./dist/bun/ --target bun --minify --external playwright --external playwright-core --external electron --external chromium-bidi --external 'chromium-bidi/*' ./src/cli.ts
- `bun run build:node` — bun build --outdir ./dist/node/ --target node --minify --external playwright --external playwright-core --external electron --external chromium-bidi --external 'chromium-bidi/*' ./src/cli.ts
- `bun run build:all` — bun run build:bun && bun run build:node
- `bun run build:types` — tsc --noEmit
- `bun run dev:bun` — bun build ./src/cli.ts --outfile ./dist/cli.bun.js --target bun --watch
- `bun run test:watch` — bun test --watch

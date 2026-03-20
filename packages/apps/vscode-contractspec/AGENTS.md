# AI Agent Guide — `vscode-contractspec`

Scope: `packages/apps/vscode-contractspec/*`

ContractSpec: spec-first development for AI-written software. Validate, scaffold, and explore your contract specifications.

## Quick Context

- Layer: `app`.
- Package visibility: published package.
- Primary consumers are deployed users, operators, or external clients of this app surface.
- Related packages: `@contractspec/bundle.workspace`, `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.contracts-transformers`, `@contractspec/module.ai-chat`, ...

## Architecture

- `@contractspec/module.workspace` for pure analysis + templates.
- `@contractspec/bundle.workspace` for workspace services + adapters.

## Public Surface

- This package is a deployable application rather than a library with published subpath exports.

## Guardrails

- Keep reusable business logic out of the app shell; prefer lower layers for shared behavior.
- Treat routes, handlers, and externally consumed payloads as compatibility surfaces.
- Changes here can affect downstream packages such as `@contractspec/bundle.workspace`, `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.contracts-transformers`, `@contractspec/module.ai-chat`, ....
- Changes here can affect downstream packages such as `@contractspec/bundle.workspace`, `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.contracts-transformers`, `@contractspec/module.ai-chat`, ...

## Local Commands

- `bun run dev` — bun build src/extension.ts --outfile=dist/extension.js --target=node --format=cjs --external=vscode --sourcemap=external --watch
- `bun run build` — bun run build:types && bun run build:bundle
- `bun run test` — vscode-test
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run vscode:prepublish` — bun run build
- `bun run build:bundle` — bun build src/extension.ts --outfile=dist/extension.js --target=node --format=cjs --external=vscode --minify
- `bun run build:types` — tsc --noEmit
- `bun run package` — vsce package --no-dependencies
- `bun run publish:off` — vsce publish --no-dependencies

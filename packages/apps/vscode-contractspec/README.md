# vscode-contractspec

Website: https://contractspec.io

**ContractSpec: spec-first development for AI-written software. Validate, scaffold, and explore your contract specifications.**

## What It Does

- `@contractspec/module.workspace` for pure analysis + templates.
- `@contractspec/bundle.workspace` for workspace services + adapters.
- `src/ui/` contains packaged UI exports and embeddable views.
- Related ContractSpec packages include `@contractspec/bundle.workspace`, `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.contracts-transformers`, `@contractspec/module.ai-chat`, ...
- `src/ui/` contains packaged UI exports and embeddable views.

## Running Locally

From `packages/apps/vscode-contractspec`:
- `bun run dev`
- `bun run build`
- `bun run test`

## Usage

```bash
bun run dev
```

## Architecture

- `@contractspec/module.workspace` for pure analysis + templates.
- `@contractspec/bundle.workspace` for workspace services + adapters.

## Public Entry Points

- This package is a deployable application rather than a library with published subpath exports.

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

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Standardize tool naming to underscore notation.

## Notes

- Works alongside `@contractspec/bundle.workspace`, `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.contracts-transformers`, ...

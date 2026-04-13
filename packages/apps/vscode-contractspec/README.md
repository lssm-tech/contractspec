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

## Initialization Presets

The extension setup flow is preset-driven and backed by the shared workspace setup service.

- `ContractSpec: Setup ContractSpec` lets you choose between `core`, `connect`, `builder-managed`, `builder-local`, and `builder-hybrid`.
- `ContractSpec: Quick Setup (Defaults)` applies the `core` preset with no prompts.
- Builder managed and hybrid presets mirror the configured Builder API base URL into `contractspec.api.baseUrl` in `.vscode/settings.json`.

Representative follow-up commands after setup:

```bash
contractspec builder init --workspace-id ws-demo --preset managed-mvp
contractspec builder init --workspace-id ws-demo --preset local-daemon-mvp
contractspec builder local register --workspace-id ws-demo --runtime-id rt_local_daemon --granted-to local:operator
```

## Architecture

- `@contractspec/module.workspace` for pure analysis + templates.
- `@contractspec/bundle.workspace` for workspace services + adapters.

## Public Entry Points

- This package is a deployable application rather than a library with published subpath exports.

## Local Commands

- `bun run dev` — bun build src/extension.ts --outdir=dist --target=node --format=cjs --external=vscode --sourcemap=external --watch
- `bun run build` — bun run build:types && bun run build:bundle
- `bun run test` — vscode-test
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run vscode:prepublish` — bun run build
- `bun run build:bundle` — bun build src/extension.ts --outdir=dist --target=node --format=cjs --external=vscode --minify
- `bun run build:types` — tsc --noEmit
- `bun run package` — vsce package --no-dependencies
- `bun run publish:off` — vsce publish --no-dependencies

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Standardize tool naming to underscore notation.

## Notes

- Works alongside `@contractspec/bundle.workspace`, `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.contracts-transformers`, ...

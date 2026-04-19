# @contractspec/app.cli-contractspec

Website: https://contractspec.io

**CLI tool for authoring, materializing, and validating ContractSpec targets.**

## What It Does

- **Commands** (`src/commands/`) - Thin wrappers that call bundle services.
- **Prompts** (`src/commands/create/wizards/`) - Interactive UI using `@inquirer/prompts`.
- **CLI setup** (`src/index.ts`, `src/cli.ts`) - Commander.js configuration.
- **Types** (`src/types.ts`) - CLI-specific types.
- **Services** (`@contractspec/bundle.workspace/services/`) - Core use-cases.
- `create.ts` - Authored target creation logic.
- `build.ts` - Runtime/package materialization from authored targets.
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

## Recommended OSS Onboarding

```bash
contractspec onboard
contractspec onboard knowledge --example knowledge-canon
contractspec init --preset connect
contractspec validate
```

## Core Authoring/Build Model

- `create` authors both runtime specs and package-oriented targets such as `module-bundle`, `builder-spec`, and `provider-spec`.
- `build` materializes one authored target into runtime artifacts or package scaffolds.
- `generate` runs workspace-wide generation for docs and derived artifacts.
- `validate` checks authored targets, package scaffolds, and optional runtime implementations.
- `onboard` generates repo-local AGENTS/USAGE guidance, recommends examples, and aligns users to the right ContractSpec track.

## Shell Completion

Install the package so the `contractspec` executable is available on your `PATH`, then choose one of the supported shells:

```bash
contractspec completion script bash
contractspec completion script zsh
contractspec completion script fish
```

For managed installation, write the completion file and optionally patch the shell profile:

```bash
contractspec completion install bash
contractspec completion install zsh --write-profile
contractspec completion install fish
```

`completion install` always writes the generated completion script to a managed user config path. By default it does not edit startup files in non-interactive sessions. Use `--write-profile` to append an idempotent `source` block automatically.

## Initialization Presets

`contractspec init` is now preset-driven. The shared setup layer owns the flow, and the CLI just forwards the preset and renders the resulting next steps.

```bash
# Generic ContractSpec workspace setup
contractspec init --preset core

# Enable ContractSpec Connect defaults and local artifacts
contractspec init --preset connect

# Prepare Builder for a managed runtime
contractspec init --preset builder-managed

# Prepare Builder for a local runtime
contractspec init --preset builder-local

# Prepare Builder for a hybrid runtime
contractspec init --preset builder-hybrid
```

In non-interactive mode, setup remains config-first: it writes `.contractsrc.json`, editor wiring, and tailored follow-up commands, but it does not call live Builder bootstrap APIs for you.

`contractspec builder` remains control-plane-backed for managed, local, and hybrid runtime flows. The CLI resolves the Builder API base URL from `CONTRACTSPEC_API_BASE_URL`, then `.contractsrc.json` `builder.api.baseUrl`, then `https://api.contractspec.io`, and reads auth from the configured control-plane token environment variable.

## Architecture

- **Commands** (`src/commands/`) - Thin wrappers that call bundle services.
- **Prompts** (`src/commands/create/wizards/`) - Interactive UI using `@inquirer/prompts`.
- **CLI setup** (`src/index.ts`, `src/cli.ts`) - Commander.js configuration.
- **Types** (`src/types.ts`) - CLI-specific types.
- **Services** (`@contractspec/bundle.workspace/services/`) - Core use-cases.
- `create.ts` - Authored target creation logic.
- `build.ts` - Runtime/package materialization from authored targets.
- `openapi.ts` - OpenAPI export.
- `registry.ts` - Registry client.
- `examples.ts` - Examples management.

## Public Entry Points

- Export `./run` resolves through `bun`, `node`, `default`.

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

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Add table capabilities.
- Stability.
- Vnext ai-native.
- Add latest models and align defaults.
- Resolve lint and build errors in workspace bundle and integrations lib.

## Notes

- Works alongside `@contractspec/bundle.workspace`, `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, ...
- `contractspec apply` has been retired; use `contractspec generate` for write-generation flows.

# AI Agent Guide -- `@contractspec/tool.bun`

Scope: `packages/tools/bun/*`

Shared Bun build presets and CLI for ContractSpec packages. Provides the `contractspec-bun-build` binary used by nearly every package's `build`, `dev`, and `prebuild` scripts.

## Quick Context

- **Layer**: tool
- **Consumers**: all monorepo packages (via `contractspec-bun-build` in their scripts)

## Public Exports

| Subpath | Purpose |
| --- | --- |
| `.` | Build config presets (`index.js`) and declarations (`index.d.ts`) |

**Binary**: `contractspec-bun-build` (transpile, types, dev, prebuild)

## Guardrails

- Changes here affect every package's build pipeline -- test broadly before merging
- Do not remove or rename CLI sub-commands (`transpile`, `types`, `dev`, `prebuild`) without updating all consumers
- Keep the package dependency-light; only `glob` as a dev dependency

## Local Commands

- No `build`, `test`, `lint`, or `dev` scripts -- this is a config-only package

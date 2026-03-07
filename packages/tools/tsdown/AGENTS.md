# AI Agent Guide -- `@contractspec/tool.tsdown`

Scope: `packages/tools/tsdown/*`

Shared tsdown configuration presets for the ContractSpec monorepo. Packages that use tsdown for bundling import this preset to keep build config consistent.

## Quick Context

- **Layer**: tool
- **Consumers**: packages using tsdown (typically libs with `tsdown.config.js`)

## Public Exports

| Subpath | Purpose |
| --- | --- |
| `.` | Default tsdown config preset (`index.js`) |

Config-only package -- no build step, no binary.

## Guardrails

- Changes affect every tsdown consumer's build output -- test downstream packages before merging
- Peer-depends on `tsdown ^0.21` -- keep in sync with the workspace catalog version
- Keep the preset minimal; package-specific overrides belong in each consumer's `tsdown.config.js`

## Local Commands

- No `build`, `test`, `lint`, or `dev` scripts -- config-only package

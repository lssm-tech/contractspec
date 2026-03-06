# AI Agent Guide -- `@contractspec/tool.typescript`

Scope: `packages/tools/typescript/*`

Shared TypeScript configuration presets (base, nextjs, react-library) extended by every package's `tsconfig.json` in the monorepo.

## Quick Context

- **Layer**: tool
- **Consumers**: all monorepo packages (via `"extends": "@contractspec/tool.typescript/..."`)

## Public Exports

Config-only package -- no code exports. Provides `tsconfig.*.json` preset files consumed via `extends`.

## Guardrails

- Compiler option changes propagate to every package -- verify with `bun run typecheck` across the repo
- Do not weaken strict-mode settings (`strict`, `noUncheckedIndexedAccess`, etc.)
- Adding a new preset file requires documenting which packages should use it

## Local Commands

- No `build`, `test`, `lint`, or `dev` scripts -- config-only package

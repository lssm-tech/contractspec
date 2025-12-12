# AI Agent Guide — libraries

Scope: `packages/libs/*`

Libraries are the foundation of ContractSpec. Changes here often affect multiple apps/bundles, so prioritize determinism, spec-first design, and backwards compatibility.

## Working rules

- Edit `src/`; treat `dist/` as generated build output.
- Prefer additive changes; avoid breaking exported types/entrypoints without an explicit migration path.
- When adding/moving a public entrypoint, keep `package.json` in sync:
  - `exports` (workspace/dev: typically points at `src/*`)
  - `publishConfig.exports` (published package: points at `dist/*`, when present)
- Avoid side-effectful module initialization unless intentional and documented (e.g., doc registration modules).

## Common commands

From a library directory, use the scripts in that package’s `package.json` (commonly `bun run lint:check`, `bun run build`, `bun run dev`). From repo root, use turbo filters (e.g., `turbo run build --filter=<package>`).

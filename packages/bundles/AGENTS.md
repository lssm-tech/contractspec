# AI Agent Guide — bundles

Scope: `packages/bundles/*`

Bundles compose libraries into product surfaces. Keep them spec-first, deterministic, and ejectable (standard TypeScript, no hidden runtimes).

## Working rules

- Prefer reusing libraries over duplicating core logic.
- Keep side effects (file IO, network) behind explicit infrastructure/adapters.
- Edit `src/`; treat `dist/` as generated build output.
- When adding/moving a public entrypoint, update both `package.json#exports` (src) and `package.json#publishConfig.exports` (dist, when present).

## Common commands

From a bundle directory, use the scripts in that package’s `package.json` (commonly `bun run lint:check`, `bun run build`, `bun run dev`). From repo root, use turbo filters (e.g., `turbo run build --filter=<package>`).

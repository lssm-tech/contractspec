# AI Agent Guide — apps

Scope: `packages/apps/*`

Apps are runnable entrypoints (API servers, CLIs, web apps, workers). Keep app code thin: wiring, configuration, and composition. Put reusable logic in `packages/libs/*` or `packages/bundles/*`.

## Working rules

- Prefer calling into bundles/libs; avoid duplicating core logic in apps.
- Check for nested `AGENTS.md` in the specific app for ports, endpoints, and generated artifacts.
- Use turbo filters from repo root to run just what you need (e.g., `turbo run dev --filter=<app>`).

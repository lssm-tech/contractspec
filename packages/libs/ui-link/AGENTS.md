# AI Agent Guide — `@contractspec/lib.ui-link`

Scope: `packages/libs/ui-link/*`

Deep linking utilities for cross-platform navigation.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles, apps

## Public Exports

- `.` — main entry
- `./ui/link` — Link component

## Guardrails

- Link component must stay framework-agnostic (no router-specific coupling)
- Depends on ui-kit-core — coordinate changes with that package

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`

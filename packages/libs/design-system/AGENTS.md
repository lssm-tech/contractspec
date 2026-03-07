# AI Agent Guide — `@contractspec/lib.design-system`

Scope: `packages/libs/design-system/*`

Design tokens and theming primitives. Provides the foundational visual language consumed by all UI surfaces.

## Quick Context

- **Layer**: lib
- **Consumers**: accessibility, presentation-runtime-react, video-gen, bundles, apps

## Public Exports

| Subpath | Description |
| ------- | ----------- |
| `.`     | Main entry  |

## Guardrails

- **High blast radius** — all UI surfaces depend on design tokens; treat token names and values as public API.
- Component hierarchy must be preserved; do not flatten or restructure without coordinating downstream consumers.
- Token removals or renames are breaking changes.

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`

# AI Agent Guide — `@contractspec/lib.accessibility`

Scope: `packages/libs/accessibility/*`

WCAG compliance utilities and validators that power accessible UI across all surfaces.

## Quick Context

- **Layer**: lib
- **Consumers**: design-system, example apps

## Public Exports

- `.` — main entry
- `./AccessibilityPanel`
- `./AccessibilityProvider`
- `./nativewind-env.d`
- `./next-route-announcer`
- `./preferences`

## Guardrails

- WCAG compliance standards must be preserved; changes affect all UI surfaces.
- Do not weaken or remove existing validators without coordinating with design-system consumers.

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`

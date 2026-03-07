# AI Agent Guide — `@contractspec/lib.ui-kit-core`

Scope: `packages/libs/ui-kit-core/*`

Core UI primitives and utilities — `cn()` class merging, shared helpers used by all UI packages.

## Quick Context

- **Layer**: lib
- **Consumers**: ui-kit, ui-kit-web, ui-link

## Public Exports

- `.` — main entry
- `./utils` — `cn()` utility and class-merging helpers

## Guardrails

- `cn()` utility is used by every UI package — changes here affect all UI components
- This is a foundational package — keep it minimal and zero-surprise
- Test thoroughly before changing any export signature

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`

# AI Agent Guide — `@contractspec/lib.ui-kit-web`

Scope: `packages/libs/ui-kit-web/*`

Web UI components built on Radix primitives with design-system token integration.

## Quick Context

- **Layer**: lib
- **Consumers**: design-system, example-shared-ui, presentation-runtime-react, bundles

## Public Exports

- `.` — main entry
- `./ui/*` — individual component exports (many components)

## Guardrails

- Radix primitive wrappers must stay accessible (ARIA, keyboard nav)
- Component API must align with design-system tokens
- Do not bypass Radix for custom implementations without justification

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`

# AI Agent Guide — `@contractspec/lib.ui-kit`

Scope: `packages/libs/ui-kit/*`

Cross-platform UI components for React Native and web surfaces.

## Quick Context

- **Layer**: lib
- **Consumers**: accessibility, design-system, presentation-runtime-react-native, bundles

## Public Exports

- `.` — main entry
- `./ui/*` — individual component exports (many components)

## Guardrails

- Component API must stay cross-platform compatible (React Native + web)
- Depends on ui-kit-core — changes there propagate here
- Do not introduce web-only or native-only APIs without a platform check

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`

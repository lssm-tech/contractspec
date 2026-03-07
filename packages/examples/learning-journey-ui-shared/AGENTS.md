# AI Agent Guide -- `@contractspec/example.learning-journey-ui-shared`

Scope: `packages/examples/learning-journey-ui-shared/*`

Shared UI components and hooks consumed by all learning journey mini-apps.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.contracts-spec`, `lib.design-system`, `lib.ui-kit-web`, `module.learning-journey`

## What This Demonstrates

- Reusable gamification components (XpBar, StreakCounter, BadgeDisplay, ViewTabs)
- Custom hook pattern (`useLearningProgress`) for shared state
- Shared types for cross-mini-app consistency

## Public Exports

- `.` -- root barrel
- `./components` -- BadgeDisplay, StreakCounter, ViewTabs, XpBar
- `./hooks` -- useLearningProgress
- `./types` -- shared type definitions
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test --pass-with-no-tests`
- Typecheck: `bun run typecheck`

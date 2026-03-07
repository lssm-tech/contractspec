# AI Agent Guide -- `@contractspec/example.learning-journey-ui-coaching`

Scope: `packages/examples/learning-journey-ui-coaching/*`

Demonstrates a contextual coaching UI with tip cards, engagement tracking, and multi-view navigation.

## Quick Context

- **Layer**: example
- **Related Packages**: `module.learning-journey`, `lib.contracts-spec`, `lib.design-system`, `lib.ui-kit-web`, `example.learning-journey-ui-shared`, `example.learning-journey-ambient-coach`, `example.learning-journey-crm-onboarding`

## What This Demonstrates

- CoachingMiniApp as a self-contained React application
- TipCard, TipFeed, and EngagementMeter components
- Multi-view layout (Overview, Progress, Steps, Timeline)
- Integration with ambient-coach and crm-onboarding tracks
- Design system and UI kit usage patterns

## Public Exports

- `.` -- root barrel
- `./CoachingMiniApp` -- main mini-app component
- `./components` -- TipCard, TipFeed, EngagementMeter
- `./views` -- Overview, Progress, Steps, Timeline views
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`

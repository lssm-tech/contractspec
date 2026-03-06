# AI Agent Guide -- `@contractspec/example.learning-journey-registry`

Scope: `packages/examples/learning-journey-registry/*`

Registry that aggregates all learning journey example tracks into a single browsable mini-app.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.contracts-spec`, `module.learning-journey`, `example.learning-journey-ambient-coach`, `example.learning-journey-duo-drills`, `example.learning-journey-crm-onboarding`, `example.learning-journey-platform-tour`, `example.learning-journey-quest-challenges`, `example.learning-journey-studio-onboarding`, `example.learning-journey-ui-*`

## What This Demonstrates

- Track aggregation and discovery via a central registry
- Feature definition pattern (`learning-journey-registry.feature`)
- Progress store for cross-track state
- API and API-types separation for typed endpoints
- Presentation layer with LearningMiniApp UI

## Public Exports

- `.` -- root barrel
- `./api`, `./api-types` -- typed API surface
- `./tracks` -- track definitions
- `./progress-store` -- cross-track progress persistence
- `./presentations` -- presentation layer
- `./ui` -- LearningMiniApp component
- `./learning-journey-registry.feature` -- feature definition
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`

# AI Agent Guide -- `@contractspec/example.learning-journey-ui-onboarding`

Scope: `packages/examples/learning-journey-ui-onboarding/*`

Developer onboarding UI with checklists, journey maps, and step-by-step progress views.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.ui-kit-core`, `lib.contracts-spec`, `lib.design-system`, `lib.ui-kit-web`, `module.learning-journey`, `example.learning-journey-ui-shared`, `example.learning-journey-studio-onboarding`, `example.learning-journey-platform-tour`

## What This Demonstrates

- React-based onboarding mini-app with checklist and journey map components
- Multi-view layout (Overview, Progress, Steps, Timeline)
- Shared UI component reuse across learning journey examples
- DocBlock-driven documentation pattern

## Public Exports

- `.` -- root barrel
- `./components` -- CodeSnippet, JourneyMap, StepChecklist
- `./views` -- Overview, Progress, Steps, Timeline
- `./OnboardingMiniApp` -- top-level mini-app component
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test --pass-with-no-tests`
- Typecheck: `bun run typecheck`

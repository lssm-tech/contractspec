# AI Agent Guide -- `@contractspec/example.learning-journey-ui-gamified`

Scope: `packages/examples/learning-journey-ui-gamified/*`

Demonstrates a Duolingo-style gamified learning UI with drills, quests, flash cards, and mastery rings.

## Quick Context

- **Layer**: example
- **Related Packages**: `module.learning-journey`, `lib.contracts-spec`, `lib.design-system`, `lib.ui-kit-web`, `example.learning-journey-ui-shared`, `example.learning-journey-duo-drills`, `example.learning-journey-quest-challenges`

## What This Demonstrates

- GamifiedMiniApp as a self-contained React application
- FlashCard, DayCalendar, and MasteryRing components
- Multi-view layout (Overview, Progress, Steps, Timeline)
- Integration with duo-drills and quest-challenges tracks
- Design system and UI kit usage patterns

## Public Exports

- `.` -- root barrel
- `./GamifiedMiniApp` -- main mini-app component
- `./components` -- FlashCard, DayCalendar, MasteryRing
- `./views` -- Overview, Progress, Steps, Timeline views
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`

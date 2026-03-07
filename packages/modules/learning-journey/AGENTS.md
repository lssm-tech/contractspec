# AI Agent Guide -- `@contractspec/module.learning-journey`

Scope: `packages/modules/learning-journey/*`

Comprehensive learning journey engine covering onboarding flows, LMS, flashcards, gamification, and AI-driven personalization.

## Quick Context

- **Layer**: module
- **Consumers**: bundles (library, contractspec-studio), apps (web-landing)

## Public Exports

- `.` -- root barrel
- `./contracts` -- contract definitions (models, onboarding, operations, shared)
- `./docs` -- DocBlock documentation
- `./engines` -- SRS, streak, and XP calculation engines
- `./entities` -- domain entities (learner, course, flashcard, quiz, gamification, onboarding, AI)
- `./events` -- domain events
- `./i18n` -- internationalization (en, es, fr catalogs, keys, locale, messages)
- `./learning-journey.capability` -- capability descriptor
- `./learning-journey.feature` -- feature descriptor
- `./track-spec` -- learning track specification

## Guardrails

- SRS/streak/XP engines are pure functions -- keep them side-effect-free
- i18n catalogs must stay in sync across all supported locales (en, es, fr)
- Entity schemas are shared with the UI; breaking changes propagate to all learning surfaces

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`

# AI Agent Guide -- `@contractspec/module.lifecycle-advisor`

Scope: `packages/modules/lifecycle-advisor/*`

AI-powered lifecycle recommendations and guidance, providing contextual advice based on current lifecycle stage and project state.

## Quick Context

- **Layer**: module
- **Consumers**: bundles (library, contractspec-studio), apps (web-landing, cli)

## Public Exports

- `.` -- root barrel (advisor logic, recommendation types)

## Guardrails

- Depends on `lib.lifecycle` for stage definitions -- never redefine stages here
- Recommendation data lives in `src/data/`; keep data files declarative and serializable
- Advisory outputs must be deterministic for the same input state

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`

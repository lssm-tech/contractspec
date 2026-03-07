# AI Agent Guide -- `@contractspec/module.lifecycle-core`

Scope: `packages/modules/lifecycle-core/*`

Core lifecycle stage definitions and transition rules that govern how projects progress through the ContractSpec lifecycle.

## Quick Context

- **Layer**: module
- **Consumers**: modules (lifecycle-advisor), bundles (library, contractspec-studio), apps (web-landing, cli)

## Public Exports

- `.` -- root barrel (stage definitions, transition logic, validators)

## Guardrails

- Depends on `lib.lifecycle` for foundational types -- this module adds orchestration on top
- Stage transition rules are the source of truth; changes here cascade to lifecycle-advisor and all consuming bundles
- Stage data in `src/data/` must remain backward-compatible to avoid breaking persisted project states

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`

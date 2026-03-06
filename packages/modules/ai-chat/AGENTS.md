# AI Agent Guide -- `@contractspec/module.ai-chat`

Scope: `packages/modules/ai-chat/*`

AI chat interface module providing conversational UI components, hooks, and provider integrations for ContractSpec applications.

## Quick Context

- **Layer**: module
- **Consumers**: bundles (contractspec-studio), apps (web-landing, cli)

## Public Exports

- `.` -- root barrel (entities, types, re-exports)
- `./context` -- chat context providers and state
- `./core` -- core chat logic and message handling
- `./presentation` -- full presentation layer barrel
- `./presentation/components` -- React chat UI components
- `./presentation/hooks` -- React hooks for chat state
- `./providers` -- AI provider adapters

## Guardrails

- Depends on `lib.ai-agent`, `lib.ai-providers`, `lib.contracts-spec`, `lib.schema`, `lib.metering`, `lib.cost-tracking`
- React peer dependency (>=19.2.4); changes here affect all chat surfaces
- Metering and cost-tracking are wired in -- never bypass them

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`

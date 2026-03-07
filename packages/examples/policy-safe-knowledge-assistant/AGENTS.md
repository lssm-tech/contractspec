# AI Agent Guide -- `@contractspec/example.policy-safe-knowledge-assistant`

Scope: `packages/examples/policy-safe-knowledge-assistant/*`

All-in-one template: policy-safe knowledge assistant with locale/jurisdiction gating, versioned KB snapshots, HITL update pipeline, and learning hub.

## Quick Context

- **Layer**: example
- **Related Packages**: `example.kb-update-pipeline`, `example.learning-patterns`, `example.locale-jurisdiction-gate`, `example.versioned-knowledge-base`, `lib.contracts-spec`, `lib.design-system`, `lib.example-shared-ui`, `lib.runtime-sandbox`, `lib.ui-kit-web`, `module.learning-journey`

## What This Demonstrates

- Composition of multiple example packages into a full-stack assistant
- Orchestrator pattern (`buildAnswer`) for policy-gated responses
- React dashboard with hooks and UI components
- Seed data and fixture patterns
- Feature definition aggregating sub-features

## Public Exports

- `.` -- root barrel
- `./orchestrator/buildAnswer` -- answer orchestration
- `./handlers` -- assistant handlers
- `./seed`, `./seeders` -- fixtures and seed data
- `./ui` -- PolicySafeKnowledgeAssistantDashboard, hooks
- `./policy-safe-knowledge-assistant.feature`
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`

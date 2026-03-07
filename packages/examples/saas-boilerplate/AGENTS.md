# AI Agent Guide -- `@contractspec/example.saas-boilerplate`

Scope: `packages/examples/saas-boilerplate/*`

SaaS Boilerplate: Users, Orgs, Projects, Billing, and Settings with full CRUD, events, and UI.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.identity-rbac`, `lib.jobs`, `module.audit-trail`, `module.notifications`, `lib.contracts-spec`, `lib.schema`, `lib.example-shared-ui`, `lib.design-system`, `lib.runtime-sandbox`

## What This Demonstrates

- Multi-domain SaaS architecture (billing, project, settings, dashboard)
- Per-domain entity/enum/event/handler/operations/presentation/schema pattern
- React UI with hooks, modals, overlays, renderers, and dashboard
- Feature definition, seeders, and test-spec patterns
- RBAC, audit trail, and notification module integration

## Public Exports

- `.` -- root barrel
- `./billing`, `./project`, `./settings`, `./dashboard` -- domain modules
- `./handlers` -- SaaS handlers
- `./presentations` -- presentation layer
- `./seeders` -- demo data
- `./saas-boilerplate.feature` -- feature definition
- `./ui` -- SaasDashboard, SaasProjectList, SaasSettingsPanel, hooks, modals, overlays, renderers
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test --pass-with-no-tests`
- Typecheck: `bun run typecheck`

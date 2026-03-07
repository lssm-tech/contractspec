# AI Agent Guide -- `@contractspec/example.crm-pipeline`

Scope: `packages/examples/crm-pipeline/*`

Demonstrates a full CRM pipeline with Contacts, Companies, Deals, and Tasks using spec-first entities, events, and UI.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.contracts-spec`, `lib.schema`, `lib.design-system`, `lib.example-shared-ui`, `lib.identity-rbac`, `lib.runtime-sandbox`, `lib.ui-kit-web`, `module.audit-trail`, `module.notifications`

## What This Demonstrates

- Multi-entity domain model (Contact, Company, Deal, Task)
- Deal pipeline with stage enums, operations, and test-specs
- Event-driven architecture (contact, deal, task events)
- Presentation layer with dashboard and pipeline views
- React UI with pipeline board, deal cards, hooks, modals, overlays, and renderers
- Feature definition and capability pattern
- Seeders and mock data

## Public Exports

- `.` -- root barrel
- `./crm-pipeline.feature` -- feature definition
- `./deal` -- deal enum, operation, schema, test-spec
- `./entities` -- contact, company, deal, task entities
- `./events` -- contact, deal, task events
- `./handlers` -- CRM and deal handlers with mock data
- `./operations`, `./presentations` -- domain operations and presentations
- `./seeders` -- demo data
- `./ui` -- React components, hooks, modals, overlays, renderers
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Validate: `bun run validate`
- Typecheck: `bun run typecheck`

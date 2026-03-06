# AI Agent Guide -- `@contractspec/module.audit-trail`

Scope: `packages/modules/audit-trail/*`

Audit trail module for tracking, persisting, and querying system events for compliance and observability.

## Quick Context

- **Layer**: module
- **Consumers**: bundles (library, contractspec-studio), apps (web-landing)

## Public Exports

- `.` -- root barrel
- `./audit-trail.capability` -- capability descriptor
- `./audit-trail.feature` -- feature descriptor
- `./contracts` -- contract definitions (commands, queries, events)
- `./entities` -- domain entities (AuditEntry, AuditFilter)
- `./storage` -- storage adapters and interfaces

## Guardrails

- Depends on `lib.bus` for event dispatch -- never emit events outside the bus
- Audit records are append-only; mutations or deletions break compliance invariants
- Storage adapters must implement the store interface; do not bypass it

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`

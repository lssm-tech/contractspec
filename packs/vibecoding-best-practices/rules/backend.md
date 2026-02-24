---
targets:
  - '*'
root: false
description: 'AI is generating APIs, services, or data workflows.'
globs:
  - '**/*'
cursor:
  alwaysApply: true
  description: 'AI is generating APIs, services, or data workflows.'
  globs:
    - '**/*'
---

⚙️ Backend Rule (AI-Context Activated)
Hexagonal Domain Clarity & Functional Isolation
"Every backend element must embody hexagonal structure: clean domain logic at the core, infrastructure at the edge. Business logic must never leak. Systems should expose intent via contracts, not implementation."

Applies when:

- AI is generating APIs, services, or data workflows.

Reliability & side-effects:

- Isolate side effects behind ports; ensure idempotency for commands; use retries with backoff + jitter where safe.
- Require timeouts for all I/O; set circuit-breakers/rate limits for external calls.
- Transactions: wrap multi-write changes; avoid partial state; prefer outbox for async events.

Error handling:

- Use explicit error taxonomy (validation, not-found, conflict, forbidden, dependency, unknown).
- Return deterministic error shapes; never leak internals. Log with correlation ids; scrub PII.

Performance/limits:

- Bound payload sizes, pagination defaults, and concurrency; document limits in contracts.

Testing expectations:

- Domain/application logic testable without infra; supply contract/handler tests for APIs; add smoke tests for adapters.

Design Principles:

- DDD Bounded Contexts → clear separation between domain, application, infrastructure.
- All logic must be unit-testable without external systems.
- Ports (interfaces) and adapters (implementations) must be swappable with minimal refactoring.
- Side effects (DB, HTTP, file system) must be explicitly isolated.

Observability:

- Every service must include structured logging (see `observability.md`); never use `console.*` in production.
- Wrap operations with analytics tracking for significant business events (see `posthog-integration.md`).
- Run `/audit-observability` to verify logging and analytics coverage across services.

Tooling:

- Run `/audit-health` to check layer compliance and ensure business logic is in bundles, not apps.
- Use the `extract-to-bundle` skill to move misplaced service logic from apps to the correct bundle.
- Use the `create-feature` skill to scaffold new services with logging, analytics, and tests from day one.

Dev Heuristics:
✅ Can the domain logic be run in isolation?
✅ Are infrastructure dependencies abstracted?
✅ Can modules be composed into other services?
✅ Does every service function include structured logging?
✅ Are significant operations tracked with analytics?

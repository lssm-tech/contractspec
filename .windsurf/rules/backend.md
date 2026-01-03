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

Dev Heuristics:
✅ Can the domain logic be run in isolation?
✅ Are infrastructure dependencies abstracted?
✅ Can modules be composed into other services?

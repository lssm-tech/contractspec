# `@contractspec/example.policy-safe-knowledge-assistant`

Website: https://contractspec.io/


All-in-one template example demonstrating a **policy-safe knowledge assistant** end-to-end:

- Locale + jurisdiction gating (fail-closed)
- Versioned curated KB + published snapshots
- Automated KB update pipeline with HITL review + traceability
- Learning hub (drills, ambient coach, quests)
- Cross-cutting modules wired: identity/RBAC, audit trail, notifications, jobs, feature flags, files, metering, learning journey

This package is the **spec-first** source of truth. The sandbox UI/runtime integration lives in `@contractspec/bundle.studio`.\n+\n+## Seed scenario\n+\n+See `src/seed/fixtures.ts` for deterministic offline fixtures (no web dependencies).\n+\n+## Running tests\n+\n+```bash\n+bun test\n+```\n+










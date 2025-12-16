## Implementation sketch — Policy-safe Knowledge Assistant (example)

This example package is **spec-first** and demonstrates how to compose:

- `@lssm/example.locale-jurisdiction-gate`
- `@lssm/example.versioned-knowledge-base`
- `@lssm/example.kb-update-pipeline`
- `@lssm/example.learning-patterns`

The runnable **sandbox UI/runtime** lives in `@lssm/bundle.contractspec-studio` (wired later).

### Package boundaries

- **Gate**: validates `locale`, `jurisdiction`, `kbSnapshotId`, `allowedScope`. Refuses if citations are missing or scope is violated.
- **Versioned KB**: stores immutable sources and versioned rules; publishes snapshots containing only approved rule versions.
- **Update Pipeline (HITL)**: detects changes, creates review tasks, gates approvals by risk level; publishing remains blocked until all proposed rule versions are approved.
- **Learning patterns**: drills/coach/quests as event-driven Learning Journey tracks.

### Key invariants (fail-closed)

- No assistant call without explicit `locale` and `jurisdiction`.
- No assistant answer without at least one citation referencing a **KB snapshot**.
- Snapshot publishing includes only approved rule versions and is jurisdiction-scoped.
- High-risk KB changes require expert approval.

### What is stubbed vs real

- **LLM**: stubbed/deterministic (no external calls). Answers are derived from KB search results.
- **Source fetching**: stubbed/offline fixtures (no web truth).
- **Storage**: in tests, in-memory stores; in sandbox, browser SQLite + IndexedDB.







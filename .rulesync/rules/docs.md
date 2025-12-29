---
targets:
  - '*'
root: false
description: >-
  Documentation governance — keep `docs/` synchronized with the codebase. The
  agent MUST review docs before code edits and update them after.
globs:
  - '**/*'
cursor:
  alwaysApply: true
  description: >-
    Documentation governance — keep `docs/` synchronized with the codebase. The
    agent MUST review docs before code edits and update them after.
  globs:
    - '**/*'
---
Docs as First‑Class, Synchronized DocBlocks (colocated, no barrels)

Policy (mandatory)

- Before any code edit:
  - Read colocated DocBlocks near the code you touch (e.g., `packages/libs/contracts/src/docs/**` and feature/module-specific `*.docblock.ts` files). The legacy `/docs` markdown is empty and must not be used.
  - Identify mismatches between implementation and DocBlocks; plan DocBlock updates alongside code changes.
- After the code edit (same turn when feasible):
  - Update the relevant DocBlocks (not markdown files) so they reflect new behavior, types, APIs, feature flags, metrics, and UX flows.
  - If no behavioral change, still fix DocBlock drift.
  - Ensure DocBlock registration is intact (via `registerDocBlocks`/decorator) and required fields are present (`id/title/body/kind/route/visibility`).
  - If a required DocBlock is missing, create it or flag the gap explicitly with path and owner; do not skip silently.

Traceability & Reversibility

- Summarize which DocBlocks were reviewed/updated (paths).
- Keep edits minimal and modular so they can be reverted independently from code changes.

Composability

- When code introduces enums, feature flags, APIs, or specs referenced in ≥2 places, ensure the canonical DocBlock exists and is linked via `docId` on specs/features/presentations/capabilities/events.
- Avoid barrel doc registries; use colocated DocBlocks and decorator-based registration.

Heuristics
✅ Scan relevant DocBlocks before coding; update DocBlocks after coding.
✅ Prefer precise, implementation‑grounded updates; clearly label roadmap vs current.
✅ Capture deferred doc tasks when spanning domains.
✅ Keep naming/units consistent across code and DocBlocks; flag inconsistencies.
✅ Ensure docIds are registered (`docId(...)` passes) and that routes/ids are unique.
✅ When introducing shared enums/flags/APIs referenced in ≥2 places, ensure the canonical DocBlock exists and link via `docId`.
❌ Do not add markdown under `/docs`; use DocBlocks only.
❌ Do not create barrel doc registries; avoid aggregating DocBlocks in index files beyond required side-effect imports for registration.

Exceptions (narrow)

- Trivial non‑functional edits (formatting, comments) may skip doc updates; note the skip explicitly.

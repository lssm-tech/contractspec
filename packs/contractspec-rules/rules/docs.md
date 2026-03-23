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
Docs as First-Class, Synchronized Same-File DocBlocks

Policy (mandatory)

- Before any code edit:
  - Read the DocBlock exported from the owner module you are changing. Concrete docs belong in the exact command/query/event/form/view/presentation/capability/data-view file; domain docs belong only in `*.feature.ts`, `spec.ts`, or `index.ts`.
  - Identify mismatches between implementation and DocBlocks; plan DocBlock updates alongside code changes.
- After the code edit (same turn when feasible):
  - Update the relevant DocBlocks (not markdown files) so they reflect new behavior, types, APIs, feature flags, metrics, and UX flows.
  - If no behavioral change, still fix DocBlock drift.
  - Ensure each authored DocBlock is a static `export const ... satisfies DocBlock` in the owner module with required fields present (`id/title/body/kind/route/visibility`).
  - If a required DocBlock is missing, create it or flag the gap explicitly with path and owner; do not skip silently.

Traceability & Reversibility

- Summarize which DocBlocks were reviewed/updated (paths).
- Keep edits minimal and modular so they can be reverted independently from code changes.

Composability

- When code introduces enums, feature flags, APIs, or specs referenced in ≥2 places, ensure the canonical DocBlock exists and is linked via `docId` on specs/features/presentations/capabilities/events.
- `docId`/`docRef` references are lightweight and validated statically; loading all docs happens through generated manifests, not runtime registration or side-effect imports.
- Avoid doc barrels and docs-only helper files.

Heuristics
✅ Scan relevant DocBlocks before coding; update DocBlocks after coding.
✅ Prefer precise, implementation‑grounded updates; clearly label roadmap vs current.
✅ Capture deferred doc tasks when spanning domains.
✅ Keep naming/units consistent across code and DocBlocks; flag inconsistencies.
✅ Ensure routes and ids are unique, and each `meta.docId` points to a DocBlock exported from the same owner module.
✅ When introducing shared enums/flags/APIs referenced in ≥2 places, ensure the canonical DocBlock exists and link via `docId`.
❌ Do not add markdown under `/docs`; use DocBlocks only.
❌ Do not author `*.docblock.ts`, use `src/docs/tech`, or rely on `registerDocBlocks`.
❌ Do not create doc barrels or side-effect doc loaders.

Exceptions (narrow)

- Trivial non‑functional edits (formatting, comments) may skip doc updates; note the skip explicitly.

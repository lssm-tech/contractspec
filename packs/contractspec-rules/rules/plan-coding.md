---
targets:
  - '*'
root: false
description: Apply while executing any implementation plan from markdown
globs: []
cursor:
  alwaysApply: false
  description: Apply while executing any implementation plan from markdown
---

# Plan Coding Rule

Scope: Active while executing any implementation plan (for example `IMPLEMENTATION_PLAN.md`).

Requirements:

- Keep implementation aligned with the approved plan order unless the user requests a change.
- If scope changes mid-implementation, record the delta explicitly in your response before continuing.
- When touching or creating DocBlocks, always include valid `kind` and `visibility` fields.
  - Allowed `kind`: `goal`, `how`, `usage`, `reference`, `faq`
  - Allowed `visibility`: `public`, `internal`, `mixed`
- Author DocBlocks only as static `export const ... satisfies DocBlock` values in the owner module.
- Concrete contract docs belong in the exact contract file; domain docs belong only in `*.feature.ts`, `spec.ts`, or `index.ts`.
- Keep docs/specs synchronized with behavioral changes in the same iteration whenever possible.
- Maintain reversibility: prefer incremental changes and clear checkpoints.

Failure handling:

- If required DocBlock fields are invalid or missing, stop and fix before additional work.
- If a change would introduce `*.docblock.ts`, `src/docs/tech`, or a cross-file `meta.docId` reference, stop and fix the ownership instead.
- If the plan is unclear or conflicts with active rules, raise a targeted clarification and list the blocking trade-off.

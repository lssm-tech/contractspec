---
targets:
  - '*'
root: false
description: When following instruction of a plan in mardkown file PLAN_VNEXT.md
globs: []
cursor:
  alwaysApply: false
  description: When following instruction of a plan in mardkown file PLAN_VNEXT.md
---
# Plan Coding Rule: DocBlock completeness

Scope: Active while implementing the docblock-plan-completion tasks.

Requirements:

- Every DocBlock you touch/create MUST include explicit `kind` and `visibility` fields.
- Allowed `kind` values: `goal`, `how`, `usage`, `reference`, `faq` (see `packages/libs/contracts/src/docs/types.ts`).
- Allowed `visibility` values: `public`, `internal`, `mixed`.
- Author DocBlocks only as static `export const ... satisfies DocBlock` values in the owner module.
- When editing features tied to PLAN_VNEXT documentation (docs + BlockNote), update or add same-file DocBlocks in the same change and keep stable routes.
- Keep DocBlocks spec-first: describe purpose, steps, and guardrails; avoid PII/secrets.
- Respect accessibility and a11y guidance for docs (clear headings, concise summaries).

Failure handling:

- If a DocBlock lacks `kind` or `visibility`, uses values outside the allowed sets, or would introduce `*.docblock.ts`/`src/docs/tech`, stop and fix before continuing.

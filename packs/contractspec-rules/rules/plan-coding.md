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
- When editing features tied to PLAN_VNEXT documentation (docs + BlockNote), update or add DocBlocks in the same change, and ensure they are registered (via `registerDocBlocks`) with stable routes.
- Keep DocBlocks spec-first: describe purpose, steps, and guardrails; avoid PII/secrets.
- Respect accessibility and a11y guidance for docs (clear headings, concise summaries).

Failure handling:

- If a DocBlock lacks `kind` or `visibility`, or uses values outside the allowed sets, stop and fix before continuing.

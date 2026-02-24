---
targets:
  - '*'
root: false
description: Final verification checklist when closing an implementation plan
globs: []
cursor:
  alwaysApply: false
  description: Final verification checklist when closing an implementation plan
---

# Plan Done Rule

Trigger: Run after all planned implementation tasks are completed.

Checks:

- Re-assert every DocBlock touched in this plan has valid `kind` and `visibility` values.
- Confirm plan deliverables are complete: code, tests, observability, and documentation updates.
- Confirm quality gates are run (types, lint, tests, build) or explicitly documented as deferred.
- Confirm unresolved risks or follow-ups are listed with clear ownership.

Actions:

- If any required check fails, fix it or document an explicit blocker before marking the plan as done.
- Do not close the plan if behavior changed but docs/spec references were not synchronized.

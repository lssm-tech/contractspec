# Plan Done Rule: Final DocBlock verification

Trigger: Run after completing docblock-plan-completion tasks.

Checks:

- Re-assert all DocBlocks added/updated for this plan include `kind` and `visibility` using allowed values (kind: goal/how/usage/reference/faq; visibility: public/internal/mixed).
- Confirm PLAN_VNEXT documentation items (docs quickstarts + BlockNote support) are present in codebase and registered via `registerDocBlocks` with stable routes.
- Ensure doc content is spec-first, includes purpose/steps/guardrails, and avoids PII/secrets.

Actions:

- If any DocBlock is missing `kind`/`visibility` or uses invalid values, fix before closing the plan.
- If PLAN_VNEXT doc items or BlockNote support are missing, add/fix before closing the plan.

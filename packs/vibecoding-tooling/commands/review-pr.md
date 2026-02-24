---
description: 'Review a pull request'
targets: ['*']
---

target_pr = $ARGUMENTS

If target_pr is not provided, use the PR of the current branch.

Execute the following in parallel:

1. Check code quality and style consistency
2. Review test coverage
3. Verify documentation updates
4. Check for potential bugs or security issues
5. Check file organization and code health:
   - Flag files exceeding size limits (components >150, services >200, any >250)
   - Detect business logic in `packages/apps/` that should be in bundles
   - Check for `console.log`/`console.error` in production code
6. Check observability coverage:
   - Services/handlers must include structured logging
   - Significant operations must have analytics tracking
   - Error handlers must not swallow context (no empty catch blocks)

Then provide a summary of findings and suggestions for improvement.

**Tip**: For a deeper scan, suggest the author runs `/audit-health` and `/audit-observability` before merging.

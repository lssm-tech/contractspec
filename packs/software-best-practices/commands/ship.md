---
description: 'Run a release-readiness shipping flow from checks to draft PR'
targets: ['*']
---

base_branch = $ARGUMENTS

Run a shipping flow for the current branch:

1. **Branch context**:
   - Default `base_branch` to `main` when omitted.
   - Summarize branch diff and changed areas.

2. **Mandatory quality gates**:
   - `turbo build:types`
   - `turbo lint`
   - `turbo test`
   - `turbo run build`

3. **Lifecycle completeness checks**:
   - Plan was reviewed (`/review-plan`) for large features.
   - Observability check (`/audit-observability`) completed for runtime changes.
   - Documentation sync (`/document`) completed for behavior changes.

4. **PR preparation**:
   - Summarize notable contract/API/risk changes.
   - Produce a reviewer checklist for security, performance, and rollback.
   - Recommend `/draft-pr` to open a draft pull request.

5. **Result**:
   - Return `READY_TO_SHIP` or `BLOCKED`.
   - For blockers, provide concrete file:line remediation steps.

## Output format

```
Base: <branch>
Status: READY_TO_SHIP | BLOCKED
Checks:
- types: pass|fail
- lint: pass|fail
- test: pass|fail
- build: pass|fail
Lifecycle:
- plan-review: done|missing
- observability-audit: done|missing
- documentation: done|missing
Blockers:
1. ...
Next:
- Run /draft-pr
```

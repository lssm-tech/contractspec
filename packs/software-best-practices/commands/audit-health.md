---
description: 'Audit code health for layering, file size, duplication, and runtime hygiene'
targets: ['*']
---

scope = $ARGUMENTS

Run a structural health audit:

1. **Scope selection**:
   - Use `scope` if provided.
   - Otherwise scan the relevant changed areas or `packages/`.

2. **File quality checks**:
   - Components near or above 150 lines.
   - Services near or above 200 lines.
   - Any file above 250 lines.

3. **Architecture checks**:
   - `apps` remain thin and avoid business logic.
   - Dependency flow follows apps -> bundles/modules -> libs.
   - No upward imports or circular coupling.

4. **Reusability checks**:
   - Detect duplicate logic patterns.
   - Flag extraction candidates for shared libs/utilities.

5. **Runtime hygiene checks**:
   - `console.*` in production paths.
   - Empty catch blocks.
   - Missing structured error handling.

6. **Report remediation priorities**:
   - Label findings as `critical`, `high`, `medium`, `low`.
   - Suggest concrete next commands (`/refactor`, `/fix`, `/audit-observability`).

## Output format

```
Scope: <path>
Overall: HEALTHY | NEEDS_ATTENTION | UNHEALTHY
Critical findings:
- file:line - issue
High findings:
- file:line - issue
Remediation:
1. ...
2. ...
```

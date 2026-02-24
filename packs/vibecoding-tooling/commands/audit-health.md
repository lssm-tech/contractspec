---
description: 'Audit codebase for file organization, reusability, and code health'
targets: ['*']
---

scope = $ARGUMENTS

Invoke the `code-health-auditor` subagent to run a holistic code health audit:

1. **Determine scope**:
   - If `scope` provided (e.g., `packages/bundles/contractspec-studio`): restrict scan to that directory
   - If empty: scan the entire `packages/` directory

2. **Delegate to code-health-auditor** with the following analysis areas:

   ### File Size Compliance
   - Scan all `.ts`/`.tsx` files for line counts
   - Flag violations: components >150, services >200, any file >250
   - Flag warnings: files approaching limits (>120 components, >170 services, >200 any)
   - Group by package and severity

   ### Layer Compliance
   - Detect business logic patterns in `packages/apps/` (service classes, domain functions, repository patterns)
   - Detect raw HTML elements in application code outside `packages/libs/design-system/` and `packages/libs/ui-kit*/`
   - Verify dependency flow: no upward imports (libs importing from bundles, bundles importing from apps)

   ### Reusability
   - Find exported functions/classes with identical or near-identical names across packages (duplication signal)
   - Identify utility functions defined locally that could be extracted to `packages/libs/utils-typescript/`
   - Flag logic duplicated in 2+ locations

   ### Observability Coverage
   - Services/handlers without structured logger import
   - Exported functions without analytics tracking
   - Error handlers (catch blocks) without logging
   - API routes without correlation ID propagation
   - `console.log`/`console.error` in production paths (not tests/scripts)

   ### Domain Organization
   - Files organized by technical concern (all services together, all types together) instead of business domain
   - Mixed-domain files containing logic for multiple business areas

3. **Report format**:

```
## Code Health Report

**Scope**: [scanned path]
**Files scanned**: [count]
**Overall health**: [HEALTHY / NEEDS_ATTENTION / UNHEALTHY]

### File Size Compliance
- **Status**: [PASS / WARN / FAIL]
- **Violations** (must fix): [count]
  - [file:line_count] — exceeds [limit] limit; split by [suggestion]
- **Warnings** (approaching): [count]
  - [file:line_count] — nearing [limit] limit

### Layer Compliance
- **Status**: [PASS / WARN / FAIL]
- **Findings**: [list with file paths and what to move where]

### Reusability
- **Status**: [PASS / WARN / FAIL]
- **Duplicated patterns**: [count]
  - [pattern] found in [file1], [file2] — extract to [target]
- **Extraction candidates**: [count]

### Observability Coverage
- **Status**: [PASS / WARN / FAIL]
- **Missing logging**: [count] services/handlers
- **Missing analytics**: [count] functions
- **console.* usage**: [count] occurrences in [count] files
- **Details**: [file:line references]

### Domain Organization
- **Status**: [PASS / WARN / FAIL]
- **Findings**: [list of misorganized areas]

### Summary
| Concern         | Critical | High | Medium | Low |
|-----------------|----------|------|--------|-----|
| File Size       |          |      |        |     |
| Layer           |          |      |        |     |
| Reusability     |          |      |        |     |
| Observability   |          |      |        |     |
| Domain Org      |          |      |        |     |

### Remediation Priority
1. [Highest impact fix]
2. [Next fix]
3. ...

### Suggested Commands
- `/refactor [file]` — to split oversized files
- `/fix [path]` — to auto-fix console.log and lint issues
- `/audit-observability [path]` — for detailed logging/analytics gaps
```

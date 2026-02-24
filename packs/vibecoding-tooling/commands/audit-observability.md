---
description: 'Audit codebase for logging, analytics, and observability gaps'
targets: ['*']
---

scope = $ARGUMENTS

Run a focused observability audit to identify gaps in logging, analytics, and error tracking:

1. **Determine scope**:
   - If `scope` provided: restrict scan to that directory
   - If empty: scan `packages/bundles/` and `packages/apps/` (where runtime code lives)

2. **Scan for logging coverage**:
   - Find all service files (`*.service.ts`, `*.handler.ts`, files in `modules/`, `application/`) and check for:
     - Import of structured logger (e.g., `from '@contractspec/lib.observability'`, `from '*/logger'`)
     - Logger usage in function bodies (`logger.info`, `logger.warn`, `logger.error`)
   - Find all `catch` blocks and verify they contain structured error logging (not bare `throw` or `console.error`)
   - Find all API route handlers and verify correlation/request ID propagation

3. **Scan for analytics coverage**:
   - Find all exported service functions in `modules/` and `application/` layers and check for:
     - Import of analytics utility (e.g., `from '@contractspec/lib.analytics'`, `from '*/analytics'`, `posthog`)
     - `analytics.track` / `posthog.capture` calls for significant operations
   - Find UI components with user interactions (`onClick`, `onSubmit`, `onChange` on primary actions) and check for analytics event tracking
   - Verify PostHog event naming follows conventions (see `posthog-integration.md`)

4. **Scan for anti-patterns**:
   - `console.log` / `console.warn` / `console.error` / `console.info` / `console.debug` in production code
   - Empty catch blocks (`catch (e) {}` or `catch { }`)
   - Error handlers that swallow context (re-throw without wrapping, log without correlation ID)
   - High-volume paths without sampling configuration

5. **Generate coverage report**:

````
## Observability Audit Report

**Scope**: [scanned path]
**Files scanned**: [count]
**Overall coverage**: [X]% ([covered]/[total] modules instrumented)

### Logging Coverage

**Service/Handler files**: [covered]/[total] ([X]%)

| Status | File | Issue |
|--------|------|-------|
| MISSING | [file:line] | No logger import |
| PARTIAL | [file:line] | Logger imported but not used in [function] |
| OK | [file:line] | Properly instrumented |

**Error handling**: [covered]/[total] catch blocks with structured logging

| File | Line | Issue |
|------|------|-------|
| [file] | [line] | Empty catch block |
| [file] | [line] | Uses console.error instead of logger |
| [file] | [line] | Missing correlation ID in error log |

### Analytics Coverage

**Service operations**: [covered]/[total] ([X]%)

| Status | File | Function | Issue |
|--------|------|----------|-------|
| MISSING | [file:line] | [function] | No analytics.track call |
| OK | [file:line] | [function] | Tracks [event_name] |

**UI interactions**: [covered]/[total] ([X]%)

| Status | Component | Interaction | Issue |
|--------|-----------|-------------|-------|
| MISSING | [file:line] | onClick handler | No tracking |
| OK | [file:line] | onSubmit | Tracks [event_name] |

### Anti-Patterns Found

| Severity | File | Line | Issue | Fix |
|----------|------|------|-------|-----|
| HIGH | [file] | [line] | console.log in production | Replace with logger.info |
| HIGH | [file] | [line] | Empty catch block | Add logger.error with context |
| MEDIUM | [file] | [line] | Error swallows context | Wrap with structured error |

### PostHog Event Naming

- **Consistent**: [count] events follow naming convention
- **Inconsistent**: [count] events need renaming
  - [file:line] `[current_name]` -> suggested: `[better_name]`

### Remediation Examples

**Adding logging to a service**:
```typescript
import { logger } from "@contractspec/lib.observability";

export async function processOrder(input: OrderInput): Promise<Order> {
  logger.info("order.process.start", { orderId: input.id });
  try {
    const result = await orderRepo.save(input);
    logger.info("order.process.success", { orderId: result.id });
    return result;
  } catch (error) {
    logger.error("order.process.failed", { orderId: input.id, error });
    throw error;
  }
}
````

**Adding analytics to a service**:

```typescript
import { analytics } from '@contractspec/lib.analytics';

export async function createProject(input: CreateProjectInput) {
  const result = await projectService.create(input);
  analytics.track('project_created', {
    projectId: result.id,
    templateUsed: input.template,
  });
  return result;
}
```

### Suggested Next Steps

1. [Highest priority fix]
2. [Next fix]
3. Run `/fix [path]` to remove console.\* statements

```

```

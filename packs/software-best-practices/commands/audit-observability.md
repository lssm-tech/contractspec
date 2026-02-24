---
description: 'Audit logging, metrics, tracing, and analytics coverage for changed runtime paths'
targets: ['*']
---

scope = $ARGUMENTS

Run an observability-focused audit:

1. **Scope selection**:
   - Use `scope` when provided.
   - Otherwise inspect changed services, handlers, and UI interaction paths.

2. **Logging checks**:
   - Structured logger usage instead of `console.*`.
   - Error paths include contextual `logger.error`.
   - Correlation/request identifiers are propagated where applicable.

3. **Metrics/tracing checks**:
   - Key operations expose latency and error metrics.
   - External calls are traceable and timeout-aware.

4. **Analytics checks**:
   - Primary user actions emit analytics events.
   - Event naming is consistent and stable.
   - No secrets or PII are emitted in event payloads.

5. **Coverage summary**:
   - Instrumented modules vs total checked modules.
   - Missing instrumentation by severity.

6. **Actionable fixes**:
   - Provide file:line references.
   - Suggest where to add logging, metrics, and tracking.

## Output format

```
Scope: <path>
Coverage: <percent>
Critical gaps:
- file:line - missing/error-prone instrumentation
High gaps:
- file:line - missing analytics or tracing
Recommended fixes:
1. ...
2. ...
```

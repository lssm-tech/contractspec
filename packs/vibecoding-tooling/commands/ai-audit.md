---
description: 'Audit the current context against AI governance rules'
targets: ['*']
---

Invoke the `ai-auditor` subagent to review the current conversation or open files.

1. Check whether a recent AI audit already exists for the same scope and whether relevant files changed.
2. If nothing changed, summarize prior findings instead of re-running a full audit.
3. If files changed, ask the `ai-auditor` to analyze only the recent changes or current plan.
4. Present the Audit Report to the user, and clearly label results as `full` or `delta`.

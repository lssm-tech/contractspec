---
description: 'Review an implementation plan before coding from product, engineering, security, and observability angles'
targets: ['*']
---

plan_path = $ARGUMENTS

Review the plan before implementation:

0. **Delegate review**:
   - Invoke the `plan-reviewer` subagent with `plan_path` and current repository context.
   - Use the subagent report as the primary review artifact.

1. **Locate the plan**:
   - Use `plan_path` when provided.
   - Otherwise default to `IMPLEMENTATION_PLAN.md`.

2. **Validate completeness**:
   - Problem, scope, non-goals, and success criteria are explicit.
   - Delivery steps are ordered and implementation-ready.
   - Risks and rollback strategy are present.

3. **Run governance checks**:
   - Contracts-first alignment for new behavior.
   - Architecture/layer placement is clear.
   - Quality gates include types, lint, tests, and build.
   - Security, accessibility, and observability work are planned when relevant.

4. **Run perspective checks**:
   - Product: user journey, edge states, and done definition.
   - Engineering: dependency flow, reversibility, migration concerns.
   - Security: authz, validation, secrets, PII handling.
   - Data: events, metrics, and success measurement.

5. **Return a verdict**:
   - `READY`, `NEEDS_WORK`, or `MAJOR_GAPS`.
   - Provide a short prioritized list of missing steps.

## Output format

```
Plan: <path>
Verdict: READY | NEEDS_WORK | MAJOR_GAPS
Critical gaps:
1. ...
2. ...
Suggested plan additions:
1. ...
2. ...
```

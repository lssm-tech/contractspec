---
description: 'Turn a raw idea into a scoped implementation brief with clear success criteria'
targets: ['*']
---

idea = $ARGUMENTS

Shape the idea into a build-ready brief before planning:

1. **Clarify intent**:
   - If `idea` is empty, ask for the core user problem in one sentence.
   - Extract user, pain point, desired outcome, and urgency.

2. **Define scope**:
   - Split into a smallest valuable increment and optional follow-ups.
   - State explicit non-goals to prevent scope drift.

3. **Map impacted surfaces**:
   - Contract/spec impact (commands, queries, events, capabilities)
   - Backend/services impact
   - UI/UX impact
   - Data/analytics/observability impact
   - Documentation impact

4. **Set success criteria**:
   - Define measurable outcomes (adoption, latency, error rate, completion rate)
   - Add acceptance criteria that can be validated in QA

5. **Risk and reversibility check**:
   - Identify security/compliance/product risks
   - Define rollback strategy and feature-flag needs

6. **Hand-off**:
   - Produce an ideation brief
   - Recommend running `/plan-adapt` next

## Output format

```
## Ideation Brief

Problem:
Target user:
Desired outcome:

Scope (V1):
Non-goals:

Impacted surfaces:
- Contracts:
- Backend:
- UI:
- Observability:
- Docs:

Success criteria:
- ...

Risks and rollback:
- ...

Next:
- Run /plan-adapt
```

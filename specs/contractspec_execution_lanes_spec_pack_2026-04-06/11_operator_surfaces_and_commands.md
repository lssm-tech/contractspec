# 11 Operator Surfaces and Commands

## Why surfaces matter

Multi-agent systems become opaque nonsense when the operator cannot see:
- what lane is active
- who owns the task
- what evidence is still missing
- whether workers are alive
- why the runtime is blocked

A good operator surface prevents fake progress.

## Minimal surfaces

### CLI / chat aliases
Suggested lane entrypoints:

- `/clarify <task>`
- `/plan <task>`
- `/plan --consensus <task>`
- `/complete <task or plan-pack>`
- `/team <task or plan-pack>`

The exact names can vary.
The semantics should not.

### Lane status
Show:
- lane key
- current phase/state
- owner role
- evidence completeness
- approvals status
- terminal blockers

### Team dashboard
Show:
- workers
- tasks
- claims/leases
- heartbeat freshness
- queue skew
- verification lane status

### Completion dashboard
Show:
- snapshot ref
- last completed phase
- retries so far
- pending evidence
- pending approvals
- terminal readiness

## Required controls

- pause
- resume
- abort
- retry current phase
- request approval
- escalate
- shutdown team
- export evidence bundle
- open replay

## Surface design rule

The operator should never need to infer state from freeform prose if structured state exists.

That sentence alone would eliminate half the misery in agentic tooling.

# 06 Consensus Planning

## Why this lane exists

A plan should not be a draft implementation wearing a fake mustache.
It should be the structured point where:
- scope is bounded
- tradeoffs are surfaced
- the architecture is checked
- the failure modes are named
- the later execution lane gets everything it needs

## Role set

### Planner
Responsible for:
- decomposition
- step ordering
- acceptance criteria
- handoff completeness

Planner must not implement.

### Architect
Responsible for:
- system boundaries
- tradeoff tension
- design coherence
- steelman antithesis

Architect must stay evidence-backed and mostly read-only.

### Critic
Responsible for:
- rejecting vague acceptance criteria
- rejecting untestable plans
- rejecting hidden scope creep
- rejecting missing verification steps

Critic is not there to be annoying for sport.
It only feels that way because humans are emotionally attached to their first draft.

## Short mode vs deliberate mode

### Short mode
Use for:
- medium-scope work
- normal product changes
- incremental refactors

Requires:
- plan
- tradeoffs
- role recommendations
- verification path

### Deliberate mode
Use for:
- auth/security
- migrations
- production incidents
- public API breakage
- destructive changes
- compliance-sensitive work

Adds:
- pre-mortem scenarios
- expanded test plan
- stronger rollback path
- explicit operator approvals

## Required output: `ExecutionPlanPack`

The planning lane must emit:
- objective
- scope and non-goals
- constraints
- assumptions
- tradeoffs
- actionable steps
- role roster
- recommended execution lane
- verification requirements
- authority context references

## Iteration loop

Recommended loop:
1. Planner drafts
2. Architect reviews
3. Critic reviews
4. Planner revises
5. Repeat until `APPROVE` or iteration cap

Suggested cap:
- 3 iterations normal
- 5 iterations deliberate mode

## Exit criteria

The planning lane may exit only when:
- acceptance criteria are concrete and testable
- verification path is explicit
- role roster is sufficient
- next lane recommendation is justified
- authority/rule references are attached
- unresolved risks are named, not buried

## Handoff requirement

The plan must tell later lanes:
- which roles are available
- which evidence is mandatory
- what counts as blocked
- when human approval is needed
- whether team or completion loop is preferred

Anything less is decorative planning.

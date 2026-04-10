# 09 Specialized Agents and Role Profiles

## Why role profiles matter

OMX gets a lot of leverage from explicit role boundaries.
The good part is not the names.
The good part is that planning, architecture review, critique, execution, and verification are not all done by one shapeless "assistant."

ContractSpec should formalize that with typed role profiles.

## Recommended base roles

### `planner`
- decomposes work
- writes handoff plans
- does not implement

### `architect`
- checks boundaries, interfaces, and tradeoffs
- read-only by default
- must cite evidence

### `critic`
- attacks plan weakness
- rejects vague acceptance criteria
- checks plan integrity

### `executor`
- performs implementation work
- allowed to mutate scoped workspace or worktree
- must attach execution evidence

### `verifier`
- validates claims
- checks sufficiency of evidence
- controls the completion gate

### `test-engineer`
- owns test strategy and regression hardening
- often paired with verifier in team runs

### `security-reviewer`
- checks auth, trust boundaries, secrets, policy-sensitive paths

### `researcher`
- external documentation and reference work
- mostly analysis-only

### `writer`
- docs, migration notes, operator playbooks
- often useful as a parallel team worker

## Recommended fields for `RoleProfile`

- `key`
- `description`
- `routingRole`
- `posture`
- `allowedTools`
- `writeScope`
- `laneCompatibility`
- `evidenceObligations`
- `escalationTriggers`
- `modelProfileHint`

## Relationship to `defineAgent`

`defineAgent` should remain the user-facing or contract-facing declaration surface.

The execution-lanes package should add one of:
- `defineRoleProfile`
- `attachRoleProfile(agent, profile)`
- `RoleProfileRegistry`

The point is that roles should be reusable across:
- chat
- execution lanes
- export surfaces
- future operator UIs

## Hard rule

Prompts can implement role behavior.
Prompts do not own role semantics.

Role semantics belong in contracts.
Otherwise the first big refactor turns your agent system into a haunted house.

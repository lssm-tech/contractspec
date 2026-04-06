# 12 Rollout Plan

## Phase 1: typed role profiles and handoff artifacts

Scope:
- add `RoleProfile`
- add `ExecutionPlanPack`
- add registries and validators
- add starter exports

Acceptance criteria:
- planning can emit a typed handoff artifact
- agents can declare or attach role profiles
- artifacts validate independently of runtime backend

## Phase 2: consensus planning lane

Scope:
- planner / architect / critic loop
- short vs deliberate mode
- plan pack emission
- minimal CLI/chat surface

Acceptance criteria:
- lane produces `ExecutionPlanPack`
- critique iteration works
- no code mutation occurs in this lane

## Phase 3: persistent completion loop

Scope:
- completion-loop state machine
- progress ledger
- evidence gate
- verifier / architect sign-off
- resume support

Acceptance criteria:
- interrupted run can resume
- completion requires evidence
- terminal record is persisted

## Phase 4: coordinated team runtime

Scope:
- `TeamRunSpec`
- worker/task graph
- leases
- heartbeats
- mailbox
- verification lane
- shutdown contract

Acceptance criteria:
- dead worker recovery works
- stale lease reclaim works
- required verification prevents false completion

## Phase 5: operator surfaces

Scope:
- CLI/chat commands
- web or console dashboard
- lane and team visibility
- control-plane actions

Acceptance criteria:
- operator can inspect and intervene without reading internal storage files
- evidence and approval gaps are visible

## Phase 6: advanced backends

Scope:
- tmux adapter
- remote queue adapter
- workflow-engine adapter
- richer approvals and policy integrations

Acceptance criteria:
- same contracts run on multiple backends
- replay and audit behavior stay stable

## Rollout warning

Do not start with the fanciest team backend.
Start with:
- contracts
- plan pack
- completion loop

Those give you most of the value and expose whether the design is real.
Fancy worker orchestration can wait.
Humans adore starting with the shiny bit and postponing the hard invariants.
Resist that impulse.

# 13 Verification Matrix

## Matrix

| Area | Requirement | Applies to | Must hold |
| --- | --- | --- | --- |
| Authority | No side effect bypasses rule/policy evaluation | all lanes | yes |
| Handoff | Lane outputs are typed artifacts, not prose only | clarify, plan, complete, team | yes |
| Resume | Interrupted runs can resume from persisted state | complete, team | yes |
| Evidence | Completion requires explicit evidence bundle refs | complete, team | yes |
| Approval | Required approvals are stored and replay-safe | complete, team | yes |
| Role safety | Role write scope is enforced | all roles | yes |
| Planning purity | Planning lane never mutates workspace code | plan.consensus | yes |
| Team safety | Lease expiry and heartbeat handling exist | team | yes |
| Separation | Team and completion state machines are distinct | team, complete | yes |
| Backend neutrality | Contracts survive backend swaps | all lanes | yes |
| Auditability | Terminal record explains why the run ended | complete, team | yes |
| Verification freshness | Evidence timestamps support freshness checks | complete, team | yes |

## Minimum test matrix

### Planning
- planner draft -> architect review -> critic approve
- critic iterate path
- deliberate-mode extra checks
- invalid handoff artifact rejected

### Completion loop
- happy path with verifier approval
- missing evidence blocks completion
- architect approval required path
- resume after interruption
- blocked vs failed vs aborted classification

### Team runtime
- task lease claim/reclaim
- dead worker detection
- mailbox delivery
- verification lane blocks false success
- shutdown only after terminal conditions

### Cross-cutting
- authority gate blocks prohibited action
- replay bundle remains reproducible
- control-plane operations do not corrupt data plane
- role profile write scope enforcement

## Definition of done for the package

The package is "done enough for v1" when:

1. A user can move from request to typed plan pack.
2. A persistent loop can resume and prove completion.
3. A coordinated team can run with durable task state and explicit shutdown.
4. The same proof/evidence model is used across lanes.
5. The package still feels like an orchestration layer, not a second platform pretending to be the first.

# 10 Evidence, Approvals, and Harness

## Why this matters

OMX is strongest when it refuses to treat narrative confidence as completion.
ContractSpec is already well-positioned for this because `@contractspec/lib.harness` exists.

The right move is to make harness artifacts the canonical evidence substrate for execution lanes.

## Evidence bundle model

Every terminal claim should point to an evidence bundle containing some combination of:

- test run summaries
- contract drift checks
- generated artifact diffs
- policy verdict refs
- replay bundle refs
- approval refs
- diagnostic logs
- screenshots or UI proofs where relevant
- benchmark or regression output where relevant

## Evidence gate

Before a lane can exit as `completed`, the runtime should evaluate:

1. Are all required evidence classes present?
2. Are they fresh enough?
3. Did any required check fail?
4. Are all required approvals attached?
5. Is there any unresolved blocking risk still open?

If any answer fails, terminal success is denied.

## Approval model

Suggested approval classes:
- `verifier`
- `architect`
- `human`
- `policy-gate`

Suggested approval states:
- `requested`
- `approved`
- `rejected`
- `expired`
- `superseded`

## Harness integration points

Use `@contractspec/lib.harness` for:
- evidence normalization
- replay bundling
- reproducible verification runs
- evaluation policies
- audit-friendly result packaging

The execution-lanes package should not invent a second proof system.

## Failure taxonomy

Standardize these failure classes:
- `missing_evidence`
- `failing_evidence`
- `policy_blocked`
- `approval_denied`
- `runtime_failure`
- `worker_timeout`
- `lease_conflict`

## Minimum evidence requirements by lane

### `plan.consensus`
- plan artifact
- critique verdict
- tradeoff record

### `complete.persistent`
- progress ledger
- verification results
- sign-off record

### `team.coordinated`
- terminal task graph
- verification lane evidence
- worker cleanup status

## Golden rule

Do not let the runtime "remember" why success was okay.
Persist the proof.

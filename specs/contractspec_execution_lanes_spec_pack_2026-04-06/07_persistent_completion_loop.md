# 07 Persistent Completion Loop

## Purpose

This lane is the ContractSpec version of the strongest Ralph idea:
one accountable owner keeps going until the task is genuinely complete or reaches a hard terminal state.

It should feel like:
- durable
- resume-safe
- evidence-driven
- skeptical of premature closure

It should not feel like:
- an immortal chat thread mumbling "still working"
- an infinite loop with no sign-off contract

## Core phases

1. **Snapshot intake**  
   Persist the current task context, assumptions, and likely touchpoints.

2. **Plan alignment**  
   Load the `ExecutionPlanPack` or build a minimal execution pack if explicitly allowed.

3. **Work cycle**  
   Implement, inspect, delegate, or verify.

4. **Evidence gate**  
   Gather tests, checks, diffs, replay refs, and policy verdicts.

5. **Remediation**  
   If evidence is insufficient, continue the loop.

6. **Sign-off**  
   Verifier and optionally architect or human approval.

7. **Cleanup**  
   Mark terminal state, store ledger, release locks, emit final record.

## Required persisted artifacts

- `context-snapshot.md` or structured equivalent
- `progress-ledger.json`
- `loop-state.json`
- `evidence-bundle-ref.json`
- `signoff.json`
- `terminal-record.json`

## State machine

```text
initialized
  -> working
  -> waiting_for_evidence
  -> remediating
  -> awaiting_signoff
  -> completed | blocked | failed | aborted
```

## What the owner may do

The loop owner may:
- delegate bounded tasks
- request new evidence
- retry failed checks
- adapt step order
- request approval
- continue through low-risk reversible steps automatically

The loop owner may not:
- reduce scope silently
- delete failing tests to manufacture success
- mark complete without fresh evidence
- bypass authority or approval gates

## Evidence rule

"I already checked earlier" is not enough.

Required evidence should be:
- fresh enough for the claim
- attached to the current loop state
- normalized for later replay

## Recommended sign-off policy

Minimum:
- verifier approval

For medium or high risk:
- verifier approval
- architect approval

For production or destructive work:
- verifier approval
- architect approval
- explicit human approval if policy requires

## When to prefer this lane over team mode

Choose persistent completion when:
- integration complexity is high
- one owner should reconcile everything
- retries and final polish matter more than fanout
- the task is likely to get interrupted and resumed
- the main risk is false closure

## Failure handling

Classification:
- `retryable`
- `blocked`
- `fatal`
- `approval_denied`

The loop should know the difference between:
- "not done yet"
- "cannot proceed"
- "should stop"
- "needs a human"

Astonishingly rare in human organizations, but useful.

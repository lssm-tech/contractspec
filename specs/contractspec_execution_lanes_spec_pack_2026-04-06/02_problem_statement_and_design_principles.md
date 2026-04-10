# 02 Problem Statement and Design Principles

## Problem

ContractSpec has strong foundations for contracts, generation, agent runtime, approvals, memory, replay, and harness-driven proof.
What it does not yet have is a stable orchestration language for long-lived work.

Without that, agentic execution usually falls into one of four bad patterns:

1. **Chat soup**  
   Everything happens in one thread. Planning, coding, review, and verification blur together.

2. **Prompt theater**  
   Teams pretend role prompts are architecture, but there is no typed contract, runtime state, or audit trail.

3. **Premature "done"**  
   A task is declared finished because the model sounds confident, not because the evidence is sufficient.

4. **Parallel chaos**  
   Multiple agents work at once, but ownership, shutdown, and verification are fuzzy.

The missing piece is a **lane-oriented orchestration layer**.

## Design principles

### P1. Authority before side effects

Every lane must respect the already-implemented authority layer.
Lanes can stage intent, propose work, gather evidence, and request execution.
They do not get to bypass policy.

### P2. Lanes over improvisation

Users and systems should choose a lane explicitly or infer one deterministically.
Lanes are:
- easier to audit
- easier to resume
- easier to test
- easier to explain

### P3. Handoffs are first-class artifacts

A good plan is an executable contract for later work.
A good completion loop exits with a signed evidence bundle.
A good team run exits with a structured state snapshot and terminal reason.

### P4. Specialization must be declared

Role contracts should define:
- what a role is for
- what it may read or write
- what counts as success
- when it must escalate
- where it can operate

### P5. Backend-agnostic runtime

The core runtime should support:
- single-thread local execution
- subagent fanout
- tmux-backed workers
- remote job workers
- workflow engines

The contract model should not care.

### P6. Evidence is mandatory

Success requires evidence.
Evidence may include:
- tests
- generated diff summaries
- replay bundles
- policy verdicts
- approvals
- review sign-offs
- runtime output snapshots

### P7. Durable resume is not optional

If a session dies, the state must not die with it.
Resume must be possible from:
- lane snapshots
- task leases
- checkpoint metadata
- evidence bundle references
- approval state

### P8. Separate control plane from work data

This avoids binding the whole design to CLI tricks or one operator UI.

### P9. Keep the source of truth above prompts

Prompts may implement a role.
Prompts may not define the role.

### P10. Distinguish speed from closure

Team execution maximizes throughput.
Completion loops maximize closure quality.
They may compose.
They should not collapse into one blob.

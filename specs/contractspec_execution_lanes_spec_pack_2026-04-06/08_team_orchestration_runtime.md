# 08 Team Orchestration Runtime

## Purpose

This lane is the ContractSpec version of OMX team mode:
durable coordinated parallel execution with explicit lifecycle control.

The runtime should be able to manage:
- workers
- tasks
- dependencies
- mailbox/dispatch
- heartbeats
- rebalance
- verification lane
- terminal shutdown

## The crucial boundary

Team runtime is **not** the completion loop.
A team run can finish on its own.
A team run can hand off to a completion loop.
It must not secretly become one.

## Control plane vs data plane

### Control plane
- start worker
- pause worker
- resume worker
- nudge worker
- rebalance tasks
- request shutdown
- acknowledge failure
- escalate to human

### Data plane
- `team-run.json`
- `workers.json`
- `tasks.json`
- `leases.json`
- `mailbox.ndjson`
- `heartbeats.ndjson`
- `evidence.json`
- `terminal-state.json`

## Core runtime requirements

### Task graph
The runtime should maintain a task graph with:
- explicit dependencies
- status per task
- claimed worker
- evidence refs
- retry history

### Leases
Task claims should expire unless renewed.
This prevents zombie workers from holding the system hostage forever, a pastime humans sadly excel at.

### Heartbeats
Workers should emit heartbeat records with:
- time
- worker id
- current task
- health/status
- optional progress summary

### Mailbox
Support:
- leader -> worker messages
- worker -> leader updates
- worker -> worker requests routed through leader or shared bus

### Verification lane
One role or worker should focus on:
- tests
- regression checks
- evidence packaging
- final terminal gate

## Backend adapters

v1 should support adapter ports for:
- local in-process fanout
- subagent fanout
- tmux workers
- remote job queue workers
- workflow-engine-backed workers

The contract model should not assume which backend is active.

## Worker roles

Typical staffing:
- lead / coordinator
- executor(s)
- verifier / test engineer
- optional specialist reviewers

## Rebalance rules

Rebalance when:
- worker dies
- lease expires
- queue skew gets high
- verification lane is overloaded
- one task blocks a whole path unnecessarily

## Exit criteria

A team run may terminate only when:
- all required tasks are terminal
- required evidence exists
- shutdown policy passes
- worker cleanup succeeded or was explicitly marked partial with reason

## Terminal states

- `completed`
- `completed_with_followup_recommended`
- `blocked`
- `failed`
- `aborted`

`completed_with_followup_recommended` is the clean way to say:
"parallel work is done, but a persistent closer should now finish the last mile."

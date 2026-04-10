# Authoring Lanes and Specialized Agents

## Why lanes still matter

Builder should borrow the useful part of the OMX model:
choose the execution lane intentionally instead of improvising from one giant chat stream.

But Builder should not pretend its “agents” are a replacement for frontier coding engines.
In this pack, specialized agents are mostly **logical roles** that Builder can route to one or more external providers.

## Lane model

### Lane 1: Clarify
Purpose:
- gather requirements,
- resolve ambiguity,
- bind identity and channel context,
- detect missing source coverage.

Likely providers:
- conversational provider
- STT provider
- vision / extraction provider for docs

### Lane 2: Consensus Plan
Purpose:
- create a reviewed authoring plan,
- identify runtime target,
- identify app class,
- identify provider strategy,
- identify approval requirements.

Likely roles:
- planner
- architect
- critic
- provider-router

Output:
- `BuilderPlan`
- `ProviderRoutingPolicy`
- `OpenQuestions`

### Lane 3: Delegate External
Purpose:
- send scoped tasks to external coding or generation providers,
- keep write scopes and acceptance criteria explicit,
- collect structured patch proposals and artifacts.

This is the most important correction in v3.
Builder delegates.
Builder does not cosplay as the whole toolchain.

### Lane 4: Verify / Fix
Purpose:
- run harness suites,
- compare provider outputs,
- request targeted fixes,
- maintain receipts and evidence.

### Lane 5: Preview
Purpose:
- compile preview,
- show screenshots or mobile preview evidence,
- gather approval comments,
- simulate runtime target compatibility.

### Lane 6: Export
Purpose:
- create export bundle,
- bind runtime profile,
- produce release and audit metadata,
- require final approval.

## Logical specialized roles

### `interviewer`
Extracts intent and ambiguity from human input.

### `planner`
Produces the structured build plan and sequencing.

### `architect`
Checks structural coherence, data model, boundary choices, runtime fit.

### `critic`
Attacks weak assumptions, missing evidence, unsafe jumps.

### `provider-router`
Chooses or compares external providers for each task.

### `executor`
Not a monolithic internal coder.
This role exists to manage and supervise provider delegation.

### `verifier`
Runs or requests harness verification and risk checks.

### `publisher`
Packages preview/export outputs and binds them to runtime targets.

## Team behavior without rebuilding team runtime from scratch

Builder may coordinate several concurrent external runs, but the first implementation should keep this simple:
- one plan
- several scoped provider tasks
- one evidence ledger
- one decision authority

“Agent teams” here means coordinated role-specific work, not a sprawling new coding-agent runtime.

## Lane outputs

Every lane should emit:
- structured output artifacts,
- evidence refs,
- blocking issues,
- next permitted actions,
- approval requirements if risk changed.

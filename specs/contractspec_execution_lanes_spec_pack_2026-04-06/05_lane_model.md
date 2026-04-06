# 05 Lane Model

## The four lanes

### Lane 1: `clarify`
Purpose:
- reduce ambiguity
- discover constraints
- identify missing context
- expose risky assumptions before planning

Inputs:
- user request
- current workspace context
- authority/rule context

Outputs:
- `ClarificationArtifact`
- ambiguity score
- recommended next lane

Use when:
- scope is fuzzy
- requirements conflict
- the user is mixing problem and solution
- destructive work may follow

### Lane 2: `plan.consensus`
Purpose:
- create an executable plan
- force tradeoff review
- define verification before execution
- produce a staffing-ready handoff artifact

Inputs:
- raw request or clarification artifact
- repo inspection
- authority/rule context

Outputs:
- `ExecutionPlanPack`

Use when:
- more than one path is plausible
- multiple roles may be needed
- risk is non-trivial
- later execution must be resumable

### Lane 3: `complete.persistent`
Purpose:
- keep one accountable owner on the task
- continue until evidence-backed completion or hard terminal failure
- recover across interruptions and retries

Inputs:
- `ExecutionPlanPack`
- snapshot reference
- verification policy

Outputs:
- `CompletionRecord`
- evidence bundle
- sign-off verdict

Use when:
- closure matters more than raw throughput
- one owner should coordinate the last mile
- retries/resume are likely
- the work is medium complexity but not massive fanout

### Lane 4: `team.coordinated`
Purpose:
- run durable multi-worker execution
- split work across role-specialized workers
- coordinate via leases, mailbox, and verification lane

Inputs:
- `ExecutionPlanPack`
- staffing hints
- role profiles
- backend adapter

Outputs:
- `TeamCompletionSnapshot`
- task graph terminal state
- evidence bundle refs
- optional recommendation for later completion loop

Use when:
- fanout materially reduces wall-clock time
- there are multiple independent or semi-independent subproblems
- review, tests, and docs can run concurrently
- long-running coordination must survive beyond one chat burst

## Default transition graph

```text
user request
  -> clarify? 
  -> plan.consensus
  -> complete.persistent OR team.coordinated
  -> verify
  -> terminal
```

Recommended transitions:

- `clarify -> plan.consensus`
- `plan.consensus -> complete.persistent`
- `plan.consensus -> team.coordinated`
- `team.coordinated -> complete.persistent` (optional, manual or policy-triggered)
- `complete.persistent -> terminal`
- `team.coordinated -> terminal`

Forbidden direct transitions in v1:
- `clarify -> terminal`
- `clarify -> team.coordinated` without a plan pack
- `plan.consensus -> terminal` unless the task is explicitly planning-only

## Composite workflows

### Recommended default
`clarify? -> plan.consensus -> complete.persistent`

Best for:
- careful solo delivery
- medium-risk feature work
- debugging with verification

### High-throughput path
`clarify? -> plan.consensus -> team.coordinated`

Best for:
- larger scopes
- independent parallel substreams
- time-sensitive implementation

### Team then closer
`clarify? -> plan.consensus -> team.coordinated -> complete.persistent`

Best for:
- large scopes where parallel work needs one final owner to close the loop
- thorny integration after fanout
- final polish, reconciliation, or approval packaging

## Terminal reasons

Every lane run must end with one of:
- `completed`
- `blocked`
- `failed`
- `aborted`
- `superseded`

No vague "paused-ish" ghost states.
Humans generate enough ambiguity without runtime help.

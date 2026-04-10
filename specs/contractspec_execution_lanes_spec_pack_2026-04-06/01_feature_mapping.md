# 01 Feature Mapping

## The point of this document

This package should adopt **only** the parts of OMX that are still missing once Rippletide-style philosophy is already in place.

The fastest way to waste months is to implement the same idea twice under different branding.

## Three columns that matter

### 1. Rippletide-style philosophy already covers

Treat these as existing foundations:

- shared externalized engineering memory
- rule retrieval at session time
- deterministic validation before write/side effect
- automatic rejection or rewrite when rules are violated
- shared team governance with read-only followers
- plan review against active rules
- audit trail of rule and decision context

### 2. OMX contributes

These are the real gaps worth stealing:

- **lane-first workflow discipline**
- **consensus planning** with planner, architect, and critic
- **persistent completion loop** until verified done
- **durable team orchestration** with work distribution, mailbox, and terminal-state shutdown
- **specialized agent registry** with explicit role boundaries
- **operator-visible runtime state**

### 3. ContractSpec should implement

Adopt these shapes:

- `ExecutionLaneSpec`
- `ExecutionPlanPack`
- `CompletionLoopSpec`
- `TeamRunSpec`
- `RoleProfile`
- `VerificationPolicy`
- `EvidenceBundleRef`
- `LaneTransitionRecord`

## What to copy directly in spirit

### Consensus planning
Keep:
- planner / architect / critic structure
- bounded iteration loop
- explicit tradeoff capture
- execution handoff artifact

Reject:
- prompt-only role identity
- prose-only deliverables with no typed handoff

### Persistent completion loop
Keep:
- single accountable owner
- resume after failure/interruption
- no terminal success without fresh verification
- explicit snapshot and progress ledger

Reject:
- ad hoc coupling to one parallel-execution backend
- closure based on assistant confidence

### Team runtime
Keep:
- durable workers
- shared task state
- mailbox / dispatch
- heartbeats, rebalance, and shutdown
- explicit verification lane

Reject:
- tmux as the core abstraction
- lifecycle truth split across watcher hacks

### Specialized agents
Keep:
- planner, architect, critic, executor, verifier, tester, security reviewer
- role metadata beyond prompt prose

Reject:
- hard-coded role logic scattered across runtime files
- mythology as architecture

## What not to build because Rippletide already gives the shape

Do not build:
- a second context graph
- a second rules CRUD system
- a second pre-write violation checker
- a second read-only governance mode
- a second plan review loop purely for policy compliance

Instead:
- treat those systems as dependencies or lower-layer capabilities
- make lanes consume their verdicts

## Final translation

**Rippletide answers:** "May this action happen?"
**OMX answers:** "How should the work be organized until we can prove it is done?"
**This spec pack answers:** "How should ContractSpec model the second question on top of the first?"

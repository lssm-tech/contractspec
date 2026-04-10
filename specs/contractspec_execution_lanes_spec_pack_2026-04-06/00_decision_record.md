# 00 Decision Record

## Summary

We are adding **execution lanes**, not rebuilding **decision authority**.

Rippletide-style ideas already covered in the current philosophy should be treated as **done or mostly done**:

- persistent shared rule memory
- deterministic pre-side-effect validation
- reviewed planning against active standards
- governance of who can mutate shared rules
- auditability of decision context

OMX contributes something different:

- explicit workflow lanes
- durable handoff artifacts between planning and execution
- a persistent single-owner completion loop
- a coordinated multi-worker runtime
- role specialization with clear responsibility boundaries

## Decisions

### D1. Create a new orchestration package

Recommended package: `@contractspec/lib.execution-lanes`

Rationale:
- keeps `lib.ai-agent` runtime-focused
- keeps `lib.contracts-spec` contract-focused
- avoids turning primitives into product-shaped mush

### D2. Treat Rippletide as the authority layer below execution lanes

The authority layer remains responsible for:
- rules
- policy evaluation
- approved/blocked action decisions
- durable engineering memory
- plan review against standards

The execution-lanes package remains responsible for:
- lane selection
- staffing
- work decomposition
- state transitions
- evidence collection requirements
- operator-facing execution control

### D3. Keep team mode and persistent completion loop separate

Team run and persistent completion solve different problems:

- **Team run** optimizes parallel delivery with durable coordination.
- **Persistent completion loop** optimizes accountability, retries, and verified closure.

A team run may hand off into a later completion loop, but the two must not share one muddled lifecycle object.

### D4. Use contracts, not personas, as the source of truth for specialized agents

Prompt text can still exist.
It is not the source of truth.

The source of truth should be:
- typed role profiles
- allowed tools
- write scope
- evidence obligations
- lane compatibility
- escalation triggers

### D5. Make every lane emit a structured handoff artifact

A lane must not end with "I think we're done."

It must emit a structured artifact that captures:
- objective
- constraints
- evidence collected
- unresolved risks
- staffing assumptions
- verification requirements
- recommended next lane
- blocking conditions

### D6. Separate control plane and data plane

Control plane:
- commands
- operator signals
- worker lifecycle
- pause/resume/shutdown

Data plane:
- state snapshots
- task graph
- mailbox messages
- evidence bundle references
- replay identifiers

This is how the runtime stays backend-agnostic.

## Anti-goals

- Recreating tmux orchestration as the package identity
- Recreating a full Rippletide-like graph or rule backend
- Allowing execution lanes to bypass policy gates
- Binding the design to one LLM vendor or one agent runtime
- Letting planning mutate the codebase
- Letting execution claim terminal success without verification artifacts

## Design test

If the proposed implementation still works when:
- the policy backend changes,
- the team backend is not tmux,
- the model provider changes, and
- the operator surface is CLI, chat, or web,

then the design is healthy.

If not, it is architecture cosplay.

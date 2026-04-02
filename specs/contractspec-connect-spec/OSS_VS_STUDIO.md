# OSS vs Studio Boundary

## Why this split matters

Connect only works strategically if it remains useful in OSS alone. ContractSpec's public posture is OSS-first with Studio as an additive operator layer. If Connect requires Studio from day one, the coding-agent wedge becomes weaker, adoption friction rises, and the architecture starts looking like a proprietary control plane looking for a justification.

## OSS responsibilities

The OSS package should include everything required for local enforcement:

- bootstrap wrapper
- adapter installation
- impact indexing
- context pack building
- plan packet generation and verification
- pre-write and pre-command verifier pipeline
- local audit trail
- replay
- local review packet format

### OSS promise

A team with no Studio account should still be able to:

- stop agent edits that create contract drift
- inspect why a change was blocked
- reproduce decisions locally
- share read-only canon packs if they have the files locally
- export review packets for later handling

## Studio responsibilities

Studio should add collaboration, governance, and managed operations:

- shared canon pack registry
- organization-wide policy UI
- review queues
- explicit approvals and manual certification
- lineage and rollback views
- handoff packs
- remediation packs
- outcome checks
- scheduled or capped managed lanes

### Studio promise

A team using Studio should gain:

- multi-user governance
- visible review workflows
- durable audit lineage across queues and handoffs
- downstream operational packaging
- organization-level control over risky agent lanes

## Decision rule

If a feature is required for local safety, it belongs in OSS.

If a feature is primarily about collaboration, governance at org scope, or cross-team delivery coordination, it belongs in Studio.

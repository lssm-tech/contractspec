# ContractSpec Connect Technical Specification

## 1. Summary

**ContractSpec Connect** is a local-first agent authority adapter for coding agents. It installs into a repository, builds a typed context pack from ContractSpec artifacts, verifies structured plans, intercepts mutating tool calls, and decides whether an action should be permitted, rewritten, escalated for review, or denied.

Connect is not a new source of truth. The source of truth remains ContractSpec's explicit contracts, policies, generated surface manifests, knowledge spaces, and runtime governance. Connect is the edge adapter that makes those primitives enforceable at the coding-agent control point.

## 2. Problem

Coding agents are increasingly capable of making broad changes across code, tests, schemas, and infrastructure. Existing developer workflows rely on:

- advisory markdown instructions
- prompt conventions
- repository folklore
- post-hoc CI failures
- manual review after damage is already proposed

This is too weak. Teams need a system that can assemble trusted context, understand contract impact, verify plans, and enforce pre-write decisions before changes land.

## 3. Product definition

Connect sits between the agent and any mutating action.

### Inputs

- explicit ContractSpec contracts and overlays
- generated manifests for REST, GraphQL, DB, UI, client, events, and MCP surfaces
- policy definitions and decision bindings
- knowledge spaces and source provenance
- local repository state and diff context
- optional Studio review and handoff endpoints

### Outputs

- typed context packs
- structured plan packets
- patch verdicts for file edits and commands
- append-only local audit events
- optional review packets for Studio or local queueing

## 4. Goals

1. Make ContractSpec enforceable inside coding-agent workflows
2. Remain useful in OSS-only mode
3. Default to local execution and local evidence
4. Provide deterministic pre-write and pre-command checks
5. Escalate risky changes into a governed review lane
6. Reuse existing ContractSpec and Studio primitives instead of inventing parallel models

## 5. Non-goals

1. Replacing ContractSpec contracts as system truth
2. Acting as a generic memory graph for arbitrary agent chat
3. Automatically promoting inferred repo conventions into canonical policy
4. Performing direct deployment, production pushes, or unmanaged self-serve delivery
5. Tying the design to one vendor or one agent IDE

## 6. Core decision model

Every risky action must produce one of four verdicts:

- **permit**: action is allowed as proposed
- **rewrite**: action may proceed only if rewritten to satisfy checks
- **require_review**: action must become a governed review artifact
- **deny**: action is blocked

### Expected decision fields

- action type
- actor and agent metadata
- touched files and paths
- impacted contracts and surfaces
- triggered checks
- severity and risk score
- evidence references
- final verdict
- remediation hints

## 7. Primary use cases

### 7.1 Brownfield codebase with partial ContractSpec adoption

A team imports existing endpoints or scans a repo, accepts suggested overlays, and uses Connect to stop coding agents from creating drift between code and explicit contracts.

### 7.2 Greenfield product with full ContractSpec generation

A team uses Connect to ensure agents respect contracts, policy, and generated manifests while allowing rapid code generation and safe regeneration.

### 7.3 Platform team with shared canon

A platform group publishes signed read-only canon packs for shared engineering conventions. Product teams consume these in Connect without mutating central canon from local agent sessions.

### 7.4 Regulated or high-risk change path

Connect routes risky changes into Studio review queues, audit packs, remediation packs, and outcome checks before handoff to downstream work systems.

## 8. Architecture overview

Connect is composed of six functional layers:

1. **Adapter layer**  
   Installs into Claude, Cursor, Codex, or compatible tool environments and intercepts tool calls.

2. **Impact layer**  
   Maintains a local impact index mapping files to contracts, surfaces, policies, and checks.

3. **Context layer**  
   Assembles typed context packs from ContractSpec knowledge spaces, overlays, manifests, and current task scope.

4. **Plan layer**  
   Compiles plan packets from proposed actions and verifies them against policy and impact.

5. **Verifier layer**  
   Runs deterministic checks against edits, commands, and diffs.

6. **Audit and review layer**  
   Persists local evidence and optionally emits review packets into Studio.

## 9. Source-of-truth hierarchy

The hierarchy must be explicit:

1. **Canonical contracts and policy**  
   Highest authority. Explicit, typed, versioned, reviewable.

2. **Generated manifests and surface indexes**  
   Derived from canonical contracts or validated imports.

3. **Read-only canon packs**  
   Versioned organizational engineering conventions.

4. **Repository overlays**  
   Local conventions accepted by the team for this repository.

5. **Operational and external knowledge**  
   Useful for reasoning, never equal to canonical truth.

6. **Ephemeral task context**  
   Temporary, expires, not trusted for policy decisions.

This hierarchy is crucial. Connect must never treat inferred or remembered convention as equal to canonical contract truth.

## 10. Local artifacts

Connect uses a small local artifact set:

```txt
connect.config.ts
connect.overlay.ts
.contractspec/connect/impact-index.json
.contractspec/connect/context-pack.json
.contractspec/connect/plan-packet.json
.contractspec/connect/patch-verdict.json
.contractspec/connect/audit.ndjson
.contractspec/connect/review-packets/*.json
```

### Artifact intent

- `connect.config.ts` — installation and runtime configuration
- `connect.overlay.ts` — local repository conventions only
- `impact-index.json` — file, contract, surface, policy mapping
- `context-pack.json` — typed context assembled for a task or tool call
- `plan-packet.json` — structured plan and verification metadata
- `patch-verdict.json` — final outcome for a proposed edit or command
- `audit.ndjson` — append-only audit stream
- `review-packets/` — local or Studio-bound escalation artifacts

## 11. Hook lifecycle

### Session start

1. Load `connect.config.ts`
2. Resolve local contracts, generated manifests, and overlays
3. Load read-only canon packs
4. Build or refresh the impact index if stale
5. Assemble a base context pack
6. Register adapter hooks for plan, write, edit, and command interception

### Before a planning action

1. Capture user intent and agent plan proposal
2. Resolve touched areas and possible contract impact
3. Build a `PlanPacket`
4. Run plan verification
5. Return plan feedback or approval state

### Before a write or edit action

1. Capture proposed patch or file write
2. Resolve impacted files, contracts, and surfaces
3. Run verifier pipeline
4. Return a `PatchVerdict`
5. Log evidence and continue, rewrite, escalate, or deny

### Before a risky command

1. Capture command string and working directory
2. Match against allowlist, denylist, and policy rules
3. Infer likely impact from path scope and command class
4. Run command risk policy and optional dry-run checks
5. Return a `PatchVerdict`

## 12. Context packs

A `ContextPack` is the trusted, typed context exposed to the agent.

### Required contents

- repository identity
- task identity
- impacted contracts
- impacted generated surfaces
- relevant policy bindings
- read-only canon pack refs
- local overlay refs
- accepted risk thresholds
- required acceptance checks
- knowledge excerpts with provenance and trust level

### Knowledge trust levels

- `canonical`
- `operational`
- `external`
- `ephemeral`

Only canonical or explicitly policy-approved operational sources may drive hard allow or deny decisions. External and ephemeral sources may inform suggestions, but not override policy.

## 13. Plan packets

A `PlanPacket` translates natural language intent into structured work.

### Required fields

- plan id
- repository and branch
- actor metadata
- requested objective
- ordered steps
- touched paths
- impacted contracts
- affected surfaces
- required checks
- required approvals
- risk score
- verification status

### Verification rules

- detect unsupported high-risk steps
- verify all touched files map to known or inferable impact
- require explicit acknowledgement for unknown-impact paths
- ensure required approval thresholds are known
- attach acceptance gates before a plan is considered approved

## 14. Verifier pipeline

The verifier is the heart of Connect. It should execute in deterministic stages:

1. **Path and boundary checks**
   - block disallowed paths
   - protect secrets, generated outputs, lockfiles, and policy-owned files as configured

2. **Syntax and schema checks**
   - validate file type syntax
   - validate contract schemas and typed interfaces

3. **Contract impact checks**
   - map changes to contracts and affected capabilities
   - detect missing spec updates where required

4. **Generated surface drift checks**
   - compare against manifests for REST, GraphQL, DB, UI, events, MCP, and client outputs

5. **Breaking change checks**
   - determine compatibility impact
   - classify breaking vs non-breaking changes

6. **Command risk checks**
   - inspect shell actions for destructive or high-scope operations
   - apply allowlist, denylist, and approval rules

7. **Harness and test checks**
   - optionally run focused smoke or replay checks

8. **Policy decision**
   - apply PDP-style permit, deny, redact, or escalate logic

9. **Verdict synthesis**
   - return `permit`, `rewrite`, `require_review`, or `deny`

## 15. Rewrite flow

`rewrite` is not a vague suggestion. It is a structured remediation instruction.

### Rewrite response should include

- violated checks
- required contract updates or policy fixes
- suggested scope reduction
- files or sections needing regeneration
- whether the agent may self-retry automatically
- maximum retry budget

Auto-rewrite should be allowed only within safe limits. Repeated failure must escalate to review rather than looping indefinitely.

## 16. Review escalation

When Connect returns `require_review`, it must emit a structured review artifact.

### Review packet contents

- original intent
- proposed plan
- patch summary
- impacted contracts and surfaces
- evidence and failed checks
- suggested remediations
- approval requirements
- optional Studio routing metadata

### OSS mode

Packets are written locally under `.contractspec/connect/review-packets/`.

### Studio mode

Packets are posted to Studio review queues and inherit visible status, reviewers, lineage, rollback, and downstream handoff options.

## 17. Audit and replay

All important actions should land in append-only local audit.

### Audit event types

- session opened
- context pack assembled
- plan verified
- file write checked
- command checked
- review packet emitted
- Studio sync completed
- replay run executed

### Replay requirements

`contractspec connect replay <decision-id>` must reconstruct:

- input context pack
- relevant contracts and overlays
- proposed action
- verifier checks
- final verdict

This is necessary for debugging agent behavior and for regression evaluation in CI.

## 18. Shared canon packs

Connect should support signed, versioned, read-only canon packs.

### Pack characteristics

- immutable version reference
- provenance metadata
- signature or digest
- clearly scoped authority
- usable in local mode without live network dependency

### Examples

- platform API naming rules
- frontend accessibility requirements
- migration safety policy
- test strategy for critical services

These packs may influence policy and verification but must never be mutated by local agent memory.

## 19. Studio bridge

Connect should integrate cleanly with Studio instead of inventing a second review system.

### Studio responsibilities

- shared canon registry
- org-level policy management UI
- review queues and approvals
- manual certification
- lineage and rollback views
- handoff packs
- remediation packs
- outcome checks
- schedules and caps for managed agent lanes

### Connect responsibilities

- local enforcement
- local evidence
- local replay
- local review packet generation
- optional sync to Studio

## 20. Adapters

Adapters should exist for multiple agent environments but share one core decision engine.

### Initial adapters

- Claude Code
- Cursor-compatible shell/write adapters
- Codex-style CLI adapter

### Adapter responsibilities

- intercept supported tool calls
- normalize them into Connect action models
- call core verifier
- translate results back into environment-native responses

## 21. OSS versus Studio boundary

### OSS must include

- bootstrap installer
- adapter installation
- impact indexing
- context pack builder
- plan packet generation
- verifier pipeline
- local audit and replay
- local review packet format

### Studio adds

- shared canon registry
- multi-user governance
- org-level policy authoring
- review queues and manual certification
- lineage and rollback
- handoff/remediation/outcome flows
- scheduled and capped managed lanes

## 22. Security and governance principles

- local-first by default
- least privilege on files and commands
- read-only sync unless explicitly approved
- no silent promotion of inferred convention to canonical policy
- durable provenance on every authoritative input
- clear retention and purge behavior for synced artifacts
- human approval for high-risk or unknown-impact actions

## 23. Success criteria

A strong V1 should demonstrate:

1. agent writes are blocked when they cause contract drift
2. plan verification catches risky or unknown-impact changes before edits occur
3. local audit and replay can reproduce decisions
4. OSS mode is useful without Studio
5. Studio mode cleanly handles review escalation and handoff
6. shared canon packs reduce repeated convention drift across repos

## 24. Out-of-scope for V1

- autonomous deploy approval
- direct production mutation
- cross-repo multi-agent orchestration as a primary focus
- universal support for all editors on day one
- speculative memory graphs not grounded in explicit artifacts

## 25. Recommended V1 delivery order

1. bootstrap and adapter install
2. impact index
3. typed context packs
4. plan packets and verification
5. pre-write and pre-command gate
6. local audit and replay
7. Studio review bridge

Everything beyond that is scaling and productization. These seven deliver the actual proof.

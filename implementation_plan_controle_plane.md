# Implementation Plan: Controle Plane (ContractSpec Agent Runtime)

Last updated: 2026-02-27
Owner: AI Runtime + Platform Security + Contract Governance
Status: In progress (WS1 delivered)

## Why this exists

This plan converts the OpenClaw audit findings into a ContractSpec-first implementation strategy for a Jarvis-like agent platform that is deterministic, auditable, replayable, and safe by default.

## Objectives

1. Build a centralized control plane that governs intent, planning, execution, approval, and audit.
2. Enforce spec-first execution where actions run from typed contracts, not freeform LLM output.
3. Add strong policy gates (risk tiering, approval, escalation) before any side-effecting tool call.
4. Introduce signed and validated skill artifacts with compatibility checks.
5. Deliver replayable telemetry and operator-grade observability across all channels.

## Non-goals (v1)

1. Reproducing OpenClaw behavior exactly.
2. Building a fully open/public marketplace without trust controls.
3. Allowing direct tool execution from natural language without contract compilation.
4. Expanding into every integration channel before governance foundations are complete.

## Audit takeaways captured in this plan

### Strengths to keep

- Centralized control plane for policy and audit.
- First-class config/policy artifacts with layered resolution.
- Extensible skill ecosystem.
- Multi-channel support in familiar user surfaces.

### Risks to eliminate

- Unsafe tool execution from ambiguous intent.
- Unsigned/unverified extension artifacts.
- Weak authentication defaults and permissive exposure.
- Black-box decisions without deterministic replay.

## Control Plane invariants (must hold)

1. No side-effect action executes without a compiled contract plan step.
2. Every plan step has deterministic IDs, policy verdict, and trace metadata.
3. High-risk actions are never autonomous in v1.
4. Skill install/upgrade requires signature + provenance + compatibility checks.
5. Auth defaults are deny-by-default (no anonymous privileged paths).
6. Every execution is replayable from stored intent, plan, policy, and outcomes.

## ContractSpec alignment

### Proposed contract surfaces (v1)

#### Commands

- `controlPlane.intent.submit`
- `controlPlane.plan.compile`
- `controlPlane.plan.verify`
- `controlPlane.execution.start`
- `controlPlane.execution.approve`
- `controlPlane.execution.reject`
- `controlPlane.execution.cancel`
- `controlPlane.skill.install`
- `controlPlane.skill.disable`

#### Queries

- `controlPlane.execution.get`
- `controlPlane.execution.list`
- `controlPlane.trace.get`
- `controlPlane.policy.explain`
- `controlPlane.skill.list`
- `controlPlane.skill.verify`

#### Events

- `controlPlane.intent.received`
- `controlPlane.plan.compiled`
- `controlPlane.plan.rejected`
- `controlPlane.execution.step.started`
- `controlPlane.execution.step.blocked`
- `controlPlane.execution.step.completed`
- `controlPlane.execution.completed`
- `controlPlane.execution.failed`
- `controlPlane.skill.installed`
- `controlPlane.skill.rejected`

#### Capabilities

- `control-plane.core`
- `control-plane.approval`
- `control-plane.audit`
- `control-plane.skill-registry`
- `control-plane.channel-runtime`

### Proposed contract locations

- `packages/libs/contracts-spec/src/control-plane/commands/`
- `packages/libs/contracts-spec/src/control-plane/queries/`
- `packages/libs/contracts-spec/src/control-plane/events/`
- `packages/libs/contracts-spec/src/control-plane/capabilities/`
- `packages/libs/contracts-spec/src/control-plane/registry.ts`
- `generated/docs/control-plane/`

## Workstreams and checklist

### WS1 - Contract Fabric Baseline

Status: Completed

- [x] Define all v1 control plane command/query/event/capability contracts.
- [x] Add explicit meta/goal/context/owners/tags for each contract.
- [x] Register contracts in module registries and root exports.
- [ ] Generate docs artifacts under `generated/docs/control-plane/`.
- [x] Add contract-level tests and schema validation coverage.

Primary paths (proposed):

- `packages/libs/contracts-spec/src/control-plane/`
- `packages/libs/contracts-spec/src/registry.ts`
- `generated/docs/control-plane/`

### WS2 - Deterministic Planner + Executor Split

Status: Not started

- [ ] Separate intent interpretation from executable plan generation.
- [ ] Compile plans into deterministic step DAG with typed inputs/outputs.
- [ ] Enforce idempotent execution keys per step.
- [ ] Prevent direct tool dispatch without compiled plan context.

Primary paths (starting point):

- `packages/integrations/runtime/src/channel/service.ts`
- `packages/integrations/runtime/src/channel/types.ts`
- `packages/integrations/runtime/src/channel/store.ts`
- `packages/integrations/runtime/src/channel/dispatcher.ts`

### WS3 - Policy, Risk, and Human Approval Gates

Status: Not started

- [ ] Replace heuristic-only decisioning with policy-contract evaluation.
- [ ] Add risk tiers mapped to autonomous/assist/blocked modes.
- [ ] Add approval queues for medium/high-risk actions.
- [ ] Add escalation and timeout policy with explicit fallback states.

Primary paths (starting point):

- `packages/integrations/runtime/src/channel/policy.ts`
- `packages/integrations/runtime/src/channel/service.ts`
- `packages/apps/api-library/src/handlers/channel-runtime-resources.ts`

### WS4 - Identity and Capability-Bound Authorization

Status: Not started

- [ ] Define actor principals (human, service, agent, tool).
- [ ] Bind execution permissions to capability-scoped grants.
- [ ] Enforce deny-by-default policy and hardened auth configuration.
- [ ] Add audit fields for actor, tenant, session, and capability source.

Primary paths (proposed):

- `packages/libs/contracts-spec/src/policy/`
- `packages/apps/api-library/src/handlers/`
- `packages/integrations/runtime/src/channel/`

### WS5 - Signed Skill Ecosystem and Compatibility Checks

Status: Not started

- [ ] Define skill artifact manifest schema (spec + code metadata + signature).
- [ ] Verify signatures and publisher trust before install.
- [ ] Enforce compatibility checks against runtime contract versions.
- [ ] Block unsigned, tampered, or incompatible skills at install/runtime.

Primary paths (proposed):

- `packages/libs/contracts-spec/src/control-plane/skills/`
- `packages/apps/registry-packs/`
- `packages/tools/agentpacks/`
- `packages/libs/overlay-engine/src/signer.ts` (reuse signing primitives)

### WS6 - Observability, Trace, and Replay

Status: Not started

- [ ] Persist full trace chain: intent -> plan -> policy -> action -> outcome.
- [ ] Add structured telemetry for all decision and failure branches.
- [ ] Implement replay mode for deterministic post-incident reconstruction.
- [ ] Expose operator-friendly trace query APIs.

Primary paths (starting point):

- `packages/integrations/runtime/src/channel/telemetry.ts`
- `packages/integrations/runtime/src/channel/postgres-store.ts`
- `packages/integrations/runtime/src/channel/postgres-schema.ts`
- `packages/libs/contracts-spec/src/telemetry/`

### WS7 - Channel Integrations Through One Runtime

Status: Not started

- [ ] Keep channel adapters thin and normalized to control plane events.
- [ ] Preserve signature verification and idempotency per provider.
- [ ] Ensure policy and execution logic stay channel-agnostic.
- [ ] Add conformance tests for Slack, GitHub, WhatsApp (Meta + Twilio).

Primary paths:

- `packages/integrations/runtime/src/channel/slack.ts`
- `packages/integrations/runtime/src/channel/github.ts`
- `packages/integrations/runtime/src/channel/whatsapp-meta.ts`
- `packages/integrations/runtime/src/channel/whatsapp-twilio.ts`
- `packages/apps/api-library/src/handlers/`

### WS8 - Operator UX, CLI, and Documentation

Status: Not started

- [ ] Add CLI flows for approval, rejection, replay, and trace inspection.
- [ ] Add dashboard views for risk queue, execution status, and drift alerts.
- [ ] Publish architecture docs and runbooks for incident handling.
- [ ] Document governance defaults and exception process.

Primary paths (proposed):

- `packages/apps/cli-contractspec/`
- `packages/apps/web-landing/` (or dedicated operator app)
- `docs/`

## Dependency order

1. WS1 first (contracts are the source of truth).
2. WS2 and WS3 next (safe runtime semantics before broad rollout).
3. WS4 before any privileged production integrations.
4. WS5 in parallel after WS1 (requires stable contract interfaces).
5. WS6 continuously from first runnable slice.
6. WS7 after WS2/WS3 baseline is stable.
7. WS8 after core APIs and traces are stable enough for operators.

## Phase roadmap

### Phase 1 - Core Engine

- Control plane contracts + deterministic runtime loop.
- Exit: compiled plans execute with idempotency + trace.

### Phase 2 - Planner + Intent Layer

- NL intent parsing to typed plan drafts.
- Exit: no direct action from LLM output without contract compilation.

### Phase 3 - Approval + Audit UX

- Human approval queue + trace explorer + replay tooling.
- Exit: operators can inspect and govern every high-impact action.

### Phase 4 - Signed Ecosystem

- Skill signing, provenance, compatibility, and policy enforcement.
- Exit: unsigned or incompatible skills are blocked automatically.

### Phase 5 - Multi-Channel Expansion

- Channel adapters run via same control plane contracts.
- Exit: consistent policy and observability across channels.

## Validation checklist (for implementation)

- [ ] `contractspec impact` before major changes.
- [ ] `contractspec impact --baseline main` for PR delta review.
- [ ] `contractspec generate` where scaffolding/docs are required.
- [ ] `contractspec ci --check-drift` before merge.
- [ ] Targeted tests for changed runtime, policy, and adapter packages.
- [ ] Lint + typecheck on touched packages.
- [ ] `/ai-audit` and orchestration audit pass.

## Success metrics (v1)

1. 100% of executed actions linked to a contract and trace ID.
2. 0 high-risk autonomous sends.
3. 100% of installed skills pass signature and compatibility verification.
4. > = 99% deterministic replay consistency for completed executions.
5. Webhook ingest p95 < 600ms while preserving audit completeness.

## Risks and mitigations

- Risk: LLM ambiguity leaks into execution.
  - Mitigation: enforce compile-and-verify step before action execution.
- Risk: Skill supply-chain compromise.
  - Mitigation: mandatory signing, trust store, and compatibility gates.
- Risk: Policy complexity slows delivery.
  - Mitigation: launch with minimal strict matrix, evolve by versioned policy contracts.
- Risk: Operator overload from approvals.
  - Mitigation: tune risk thresholds, bulk approval workflows, and clear escalation rules.

## Open questions

1. Should control plane runtime live inside `packages/integrations/runtime` or a dedicated package?
2. Which approval surface is primary in v1 (CLI-first, web-first, or mixed)?
3. What is the trusted signing authority model for third-party skills?
4. What retention policy applies to full trace payloads and replay artifacts?

## Decisions log

- 2026-02-27: Chosen strategy is ContractSpec-first control plane with deterministic execution and explicit policy gates.
- 2026-02-27: Skill ecosystem will be gated by signing + compatibility instead of open trust by default.
- 2026-02-27: Auditability and replayability are treated as launch-blocking requirements, not post-MVP add-ons.

## Progress log

- 2026-02-27: Initial implementation plan drafted from OpenClaw audit synthesis and ContractSpec architecture constraints.
- 2026-02-27: WS1 completed in `@contractspec/lib.contracts-spec` with control-plane command/query/event/capability contracts, registration helpers, and contract tests.
- 2026-02-27: WS2-WS8 execution deferred pending open architecture decisions on runtime package location, approval surface, skill trust authority, and trace retention policy.

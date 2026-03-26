# Implementation Plan: Workflow and Loop Robustification

Last updated: 2026-02-27
Owner: AI Runtime + Workflow Platform + Contract Governance
Status: Implemented (completed 2026-03-22)

## Why this exists

This plan hardens ContractSpec workflow and agent loops so they are deterministic, durable, auditable, and safe under retries, failures, human approvals, and long-running sessions.

It also ensures we can actively leverage:

- useworkflow (durable step semantics, retries, idempotency, sleep/hooks patterns)
- LangGraph (checkpointed graph execution, interrupt/resume, stateful threads)
- LangChain (agent middleware, memory trim/summarize patterns, tool/runtime composition)

## Objectives

1. Robustify `@contractspec/lib.workflow-composer`, `@contractspec/lib.ai-agent`, `@contractspec/lib.contracts-spec/workflow`, and related channel loop runtime.
2. Introduce adapter ports so we can plug in useworkflow/LangGraph/LangChain capabilities without locking core contracts to one runtime.
3. Enforce contract-first semantics for retries, timeout, escalation, approval, and replay.
4. Improve test coverage for failure modes, retries, pause/resume, and tool-loop edge cases.
5. Keep behavior backward compatible by default and roll out additive opt-in capabilities.

## Non-goals (v1)

1. Replacing all internal runtimes with third-party frameworks.
2. Hard-coupling core `libs/*` contracts to vendor-specific APIs.
3. Shipping breaking API changes for existing consumers.
4. Full marketplace/runtime orchestration redesign in this workstream.

## External library leverage contract (must hold)

1. Adapter-first: core interfaces remain in ContractSpec packages; external libs are behind explicit ports.
2. Optional adoption: external runtime integrations are opt-in and safe when unavailable.
3. Deterministic state: checkpoint/replay semantics must remain reproducible with or without adapters.
4. Security and policy invariants remain enforced before any side effect.

## Baseline (already done)

- [x] Reviewed useworkflow docs (errors/retries, idempotency, serialization, observability, HITL, sleep).
- [x] Reviewed LangGraph/LangChain docs (persistence/checkpointers, middleware hooks, short-term memory, HITL).
- [x] Audited local implementations in:
  - `packages/libs/workflow-composer/src/*`
  - `packages/libs/ai-agent/src/*`
  - `packages/libs/contracts-spec/src/workflow/*`
  - `packages/integrations/runtime/src/channel/*`

## Gap snapshot

### workflow-composer

- Validation is minimal (anchor existence only) and does not guard against duplicate injected step IDs or conflicting anchors.
- `metadata` and `annotations` in extensions are defined but not merged/applied.
- No dedicated unit tests for composition ordering, hidden-step rewiring, and transition integrity.

### ai-agent

- `AgentGenerateParams.maxSteps` is exposed but not enforced in runtime calls.
- Tool-level `timeoutMs` and `cooldownMs` are part of spec but not executed in `tool-adapter`.
- Session persistence appends steps but not message lifecycle comprehensively; status transitions are minimal.
- Escalation policy fields (`confidenceThreshold`, `onToolFailure`, `onTimeout`, `approvalWorkflow`) are mostly declarative.

### contracts-spec/workflow runner

- Step `timeoutMs` exists in schema but is not enforced during execution.
- SLA monitor expects running step entries while runner currently commits history at completion/failure.
- Pause/resume and durable waiting semantics are not first-class.

### channel loop runtime

- Good outbox/retry base exists, but policy path remains heuristic-first.
- Signature-invalid events are accepted into processing flow instead of hard reject path.

## Workstreams and checklist

### WS1 - Contract and Port Surfaces for External Runtime Leverage

Status: Completed

- [x] Define runtime ports for checkpointing, suspend/resume, retry classification, and approval gateways.
- [x] Add explicit workflow/agent error taxonomy (`fatal`, `retryable`, `timeout`, `guard_rejected`, `policy_blocked`).
- [x] Add typed capability flags for adapter availability (langgraph, langchain, workflow-devkit).
- [x] Add comprehensive validation helpers for these new surfaces.

Primary paths:

- `packages/libs/contracts-spec/src/workflow/spec.ts`
- `packages/libs/contracts-spec/src/workflow/validation.ts`
- `packages/libs/contracts-spec/src/agent/spec.ts`
- `packages/libs/ai-agent/src/types.ts`

### WS2 - workflow-composer Determinism and Safety

Status: Completed

- [x] Add strict extension validation:
  - duplicate injected step IDs
  - invalid `after`+`before` combinations
  - invalid transition endpoints (`transitionFrom`, `transitionTo`)
  - hidden step interactions that orphan graph paths
- [x] Implement deterministic extension normalization (stable ordering and conflict reporting).
- [x] Merge and surface extension `metadata`/`annotations` in composed outputs.
- [x] Add full test suite for composition behavior and failure cases.

Primary paths:

- `packages/libs/workflow-composer/src/validator.ts`
- `packages/libs/workflow-composer/src/injector.ts`
- `packages/libs/workflow-composer/src/composer.ts`
- `packages/libs/workflow-composer/src/merger.ts`
- `packages/libs/workflow-composer/src/*.test.ts` (new)

### WS3 - ai-agent Tool Loop Hardening (Core)

Status: Completed

- [x] Enforce runtime `maxSteps` override from call params while preserving spec defaults.
- [x] Implement tool `timeoutMs` and `cooldownMs` wrappers in adapter execution.
- [x] Improve session lifecycle persistence:
  - append user/assistant/tool messages consistently
  - explicit status transitions (`running` -> `waiting` -> `completed`/`failed`/`escalated`)
- [x] Wire escalation policy execution (`onToolFailure`, `onTimeout`, confidence threshold) to runtime decisions.

Primary paths:

- `packages/libs/ai-agent/src/agent/contract-spec-agent.ts`
- `packages/libs/ai-agent/src/tools/tool-adapter.ts`
- `packages/libs/ai-agent/src/session/store.ts`
- `packages/libs/ai-agent/src/approval/workflow.ts`
- `packages/libs/ai-agent/src/agent/*.test.ts`

### WS4 - ai-agent External Adapter Layer (LangGraph and LangChain)

Status: Completed

- [x] Introduce optional adapter interfaces for:
  - LangGraph checkpointer-backed thread/session state
  - LangChain middleware hooks (`beforeModel`/`afterModel`) for memory trim/summarize and response guards
- [x] Add integration wiring that can run with internal loop by default and external adapters when configured.
- [x] Keep adapter dependencies optional and isolated from core runtime types.
- [x] Add adapter-focused tests with graceful fallback behavior when deps are absent.

Primary paths (new and existing):

- `packages/libs/ai-agent/src/interop/*`
- `packages/libs/ai-agent/src/memory/*`
- `packages/libs/ai-agent/src/agent/agent-factory.ts`
- `packages/libs/ai-agent/src/providers/types.ts`

### WS5 - contracts-spec Workflow Runner Durability and Timing

Status: Completed

- [x] Enforce per-step timeout (`timeoutMs`) in `runStepAction`/step execution boundaries.
- [x] Persist running-step history entries before action execution so SLA checks are accurate.
- [x] Add pause/resume semantics and durable wait points for long-running human/approval steps.
- [x] Add deterministic retry behavior with clear fatal vs retryable handling.
- [x] Add replay-safe state updates and event emission consistency.

Primary paths:

- `packages/libs/contracts-spec/src/workflow/runner.ts`
- `packages/libs/contracts-spec/src/workflow/state.ts`
- `packages/libs/contracts-spec/src/workflow/sla-monitor.ts`
- `packages/libs/contracts-spec/src/workflow/context.ts`
- `packages/libs/contracts-spec/src/workflow/runner.test.ts`

### WS6 - Channel Runtime Loop Policy and Safety Hardening

Status: Completed

- [x] Reject signature-invalid events early with explicit `rejected` receipt status.
- [x] Add policy-contract integration points for deterministic rule evaluation.
- [x] Expand replay fixtures to cover blocked/high-risk/approval-required paths.
- [x] Keep outbox idempotency and retry invariants unchanged while tightening gating.

Primary paths:

- `packages/integrations/runtime/src/channel/service.ts`
- `packages/integrations/runtime/src/channel/policy.ts`
- `packages/integrations/runtime/src/channel/types.ts`
- `packages/integrations/runtime/src/channel/replay-fixtures.ts`
- `packages/integrations/runtime/src/channel/*.test.ts`

### WS7 - Observability, Replay, and Audit Stitching

Status: Completed

- [x] Standardize trace fields (`traceId`, `sessionId`, `workflowId`, step index, policy verdict) across workflow and agent loops.
- [x] Add replay harness tests for workflow runner + ai-agent + channel runtime decisions.
- [x] Define event contracts for timeout/retry/escalation/approval transitions.

Primary paths:

- `packages/libs/ai-agent/src/telemetry/*`
- `packages/libs/contracts-spec/src/workflow/*`
- `packages/integrations/runtime/src/channel/telemetry.ts`

### WS8 - Docs and Rollout Readiness

Status: Completed

- [x] Update relevant DocBlocks and READMEs after each behavior change.
- [x] Document adapter configuration examples for LangGraph/LangChain/useworkflow-style patterns.
- [x] Publish migration and fallback guidance for existing consumers.

Primary paths:

- `packages/libs/contracts-spec/src/workflow/spec.ts`
- `packages/libs/personalization/src/docs/workflow-composition.docblock.ts`
- `packages/libs/workflow-composer/README.md`
- `packages/libs/ai-agent/README.md`

## Library-specific leverage map

### useworkflow patterns we will adopt

1. Retry taxonomy (`fatal` vs `retryable`) with explicit backoff behavior.
2. Idempotency key discipline per step/action execution.
3. Durable sleep/wait semantics for delayed and human-in-the-loop flow progression.
4. Operational visibility model (run/step outcomes + retry metadata).

### LangGraph features we will leverage

1. Checkpointed thread state through adapter-compatible checkpointers.
2. Interrupt/resume style control points for approval and external callback flows.
3. Graph-state updates compatible with deterministic replay.

### LangChain features we will leverage

1. Middleware pattern for memory trimming and summarization.
2. Dynamic prompt/runtime context injection hooks.
3. Tool-aware state updates and short-term memory controls for long sessions.

## Dependency order

1. WS1 first (contract and port surfaces).
2. WS2 + WS3 next (composer + agent core hardening).
3. WS5 after WS1 (runner durability semantics on stable contracts).
4. WS4 in parallel after WS1/WS3 baseline (external adapter layer).
5. WS6 after WS3/WS5 baseline (channel policy and ingest safety alignment).
6. WS7 continuously from first landed workstream.
7. WS8 after each merged milestone.

## Validation checklist (for implementation)

- [x] `turbo run test --filter=@contractspec/lib.workflow-composer`
- [x] `turbo run test --filter=@contractspec/lib.ai-agent`
- [x] `turbo run test --filter=@contractspec/lib.contracts-spec`
- [x] `turbo run test --filter=@contractspec/integration.runtime`
- [x] `turbo run typecheck --filter=@contractspec/lib.workflow-composer --filter=@contractspec/lib.ai-agent --filter=@contractspec/lib.contracts-spec --filter=@contractspec/integration.runtime`
- [x] `turbo run lint:check --filter=@contractspec/lib.workflow-composer --filter=@contractspec/lib.ai-agent --filter=@contractspec/lib.contracts-spec --filter=@contractspec/integration.runtime`
- [x] Replay fixture and deterministic retry tests pass for agent + workflow + channel loops.

## Risks and mitigations

- Risk: adapter complexity introduces hidden runtime divergence.
  - Mitigation: contract tests against both default and adapter-backed execution paths.
- Risk: timeout and retry changes alter existing production behavior.
  - Mitigation: additive defaults + opt-in flags + replay comparison before enablement.
- Risk: optional dependency footprint grows and causes install friction.
  - Mitigation: isolate adapters and keep external libraries optional.
- Risk: policy hardening blocks valid traffic.
  - Mitigation: staged rollout with telemetry-first dry-run mode.

## Decisions log

- 2026-02-27: Use adapter-first architecture to leverage useworkflow/LangGraph/LangChain without hard-coupling core contracts.
- 2026-02-27: Keep deterministic replay and policy gates as non-negotiable invariants.
- 2026-02-27: Prioritize core loop correctness before external adapter rollout.

## Governance trace

Active rules and priorities applied in this implementation batch:

- Security > Compliance > Safety/Privacy > Stability/Quality > UX > Performance > Convenience.
- Security and policy gates run before side effects (signature validation reject path, policy metadata propagation).
- Stability/quality prioritized over convenience for loop durability (timeouts, pause/resume, escalation lifecycle, deterministic composer validation).
- Composability and reversibility preserved with optional adapter ports (LangGraph/LangChain/useworkflow-style hooks remain opt-in).

Conflict resolutions captured:

- Strict validation vs backwards behavior: chose additive defaults and opt-in adapter wiring to avoid forced migrations.
- Rich runtime controls vs API lock-in: kept runtime adapter interfaces in local contracts; no hard dependency on external frameworks.

## Progress log

- 2026-02-27: Created robustification plan with explicit external-library leverage strategy and ordered workstreams.
- 2026-02-27: Completed filtered typecheck/test/lint gates for workflow-composer, ai-agent, contracts-spec, and integration.runtime.
- 2026-02-27: Ran `turbo test` and captured an unrelated failure in `vscode-contractspec#test` (`.vscode-test` socket unlink ENOENT).
- 2026-02-27: Ran `bunx contractspec ci` (pass with warnings) and `turbo run build` (pass).
- 2026-02-27: Cleaned transient local test artifact `packages/apps/vscode-contractspec/.vscode-test/`.
- 2026-02-27: Ran `/ai-audit`; outcome WARN with follow-up documentation actions reflected in this governance trace.
- 2026-03-22: Completed WS1-WS7 across `@contractspec/lib.contracts-spec`, `@contractspec/lib.ai-agent`, `@contractspec/lib.workflow-composer`, and `@contractspec/integration.runtime` with adapter-aware ports, deterministic validation, durable wait states, policy integration hooks, and cross-loop trace metadata.
- 2026-03-22: Completed WS8 documentation updates while keeping the workflow DocBlock colocated in `packages/libs/contracts-spec/src/workflow/spec.ts`.
- 2026-03-22: Added adapter/fallback coverage, workflow retry-wait coverage, and channel policy integration tests plus a published-package changeset (`.changeset/short-snakes-notice.md`).
- 2026-03-22: Re-ran filtered `turbo run typecheck`, filtered `turbo run test`, filtered `turbo run lint:check`, `bunx contractspec ci` (pass with existing warnings), and `bun run build` (pass).

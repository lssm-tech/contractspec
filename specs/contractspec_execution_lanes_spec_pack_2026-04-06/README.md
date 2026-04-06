# ContractSpec Execution Lanes Spec Pack

- **Created:** 2026-04-06
- **Status:** Implemented and hardened in workspace
- **Recommended package:** `@contractspec/lib.execution-lanes`
- **Optional UI/operator package:** `@contractspec/module.execution-console`
- **Primary repo paths:** `packages/libs/execution-lanes`, `packages/modules/execution-console`, and supporting control-plane/runtime surfaces in `packages/libs/contracts-spec`, `packages/integrations/runtime`, `packages/apps/cli-contractspec`, and `packages/apps/api-library`

## What this pack is

This pack proposes a thin orchestration layer that lets ContractSpec leverage the strongest ideas from **oh-my-codex** without redundantly rebuilding the **Rippletide-style authority layer** you already absorbed.

The design assumption is blunt:

- **Rippletide-style philosophy is already present**: shared rule memory, deterministic pre-side-effect validation, team governance, and plan review against rules.
- **What is still missing is execution discipline**: lane selection, durable completion loops, coordinated teams, specialized role profiles, and operator-visible evidence of progress.

In other words, do **not** build another context graph.
Build **execution lanes on top of the existing authority layer**.

## Core recommendation

Do **not** stuff this into `@contractspec/lib.ai-agent` or `@contractspec/lib.contracts-spec` directly.

Those packages should remain primitives:

- `@contractspec/lib.contracts-spec` stays the source of contract truth.
- `@contractspec/lib.ai-agent` stays the runtime for sessions, tools, approvals, memory, and adapters.
- `@contractspec/lib.harness` stays the runtime for evidence, replay, evaluation, and proof.

This pack introduces a new orchestration package that composes those primitives into four execution lanes:

1. **Clarify**: ambiguity reduction and boundary discovery
2. **Consensus Plan**: planner + architect + critic deliberation
3. **Persistent Completion Loop**: single accountable owner until verified done
4. **Coordinated Team Run**: durable multi-worker execution with verification and explicit shutdown

## Why this package exists

ContractSpec already has strong deterministic and audit-friendly foundations. What it lacks is a stable, typed way to answer:

1. Which execution lane should handle this task?
2. What structured artifact should one lane hand to the next?
3. Which specialized roles are allowed in each lane?
4. How does durable execution resume after failure, timeout, or interruption?
5. How do we prove completion instead of narrating completion?
6. How do we coordinate multi-agent work without entangling it with single-owner completion loops?

This pack fills that gap.

## Strong opinions

- The authority layer remains the source of truth for policy, rules, and safe/unsafe actions.
- Execution lanes may **consult** that layer, but may not replace it.
- Specialized agents are **declared contracts**, not just prompt folklore.
- Plans are executable handoff artifacts, not pretty markdown theater.
- Team mode and persistent completion are **adjacent but distinct** workflows.
- Verification evidence is mandatory before terminal success.
- The control plane and the data plane must stay separate.
- tmux may exist as one backend, but tmux must not become the architecture.

## File map

- `00_decision_record.md` High-confidence decisions, anti-goals, and sharp boundaries.
- `01_feature_mapping.md` What Rippletide already covers, what OMX adds, and what ContractSpec should adopt or reject.
- `02_problem_statement_and_design_principles.md` Problem framing and package principles.
- `03_package_strategy.md` Package boundaries, dependencies, exports, and ownership.
- `04_core_contracts.md` Canonical TypeScript contract shapes.
- `05_lane_model.md` The four-lane model, transitions, and terminal states.
- `06_consensus_planning.md` Consensus planning workflow inspired by `ralplan`.
- `07_persistent_completion_loop.md` Ralph-like persistent completion loop.
- `08_team_orchestration_runtime.md` Durable team execution runtime.
- `09_specialized_agents_and_role_profiles.md` Declared role contracts and staffing guidance.
- `10_evidence_approvals_and_harness.md` Evidence, replay, approvals, and sign-off.
- `11_operator_surfaces_and_commands.md` CLI/chat/console surfaces and control-plane UX.
- `12_rollout_plan.md` Phased implementation path with acceptance criteria.
- `13_verification_matrix.md` A hard requirement matrix for correctness, durability, and auditability.
- `14_implementation_traceability.md` Implementation coverage audit and hardening notes.
- `examples/*` Example artifacts and starter interfaces.
- `package-skeleton/*` Minimal starter files for implementation.
- `references/external_sources.md` Source grounding summary.

## Fast start

1. Read `00_decision_record.md`.
2. Read `01_feature_mapping.md`.
3. Read `04_core_contracts.md`.
4. Read `05_lane_model.md`.
5. Read `07_persistent_completion_loop.md`.
6. Read `08_team_orchestration_runtime.md`.
7. Compare the spec against the current implementation starting from `packages/libs/execution-lanes/src/types.ts` and `14_implementation_traceability.md`.

## Non-negotiables

- No duplicated policy engine.
- No silent success without evidence.
- No team runtime entangled with completion-loop state.
- No prompt-only role system without typed contracts.
- No orchestration package that bypasses existing approval, replay, or harness surfaces.
- No control plane that depends on one terminal multiplexer backend.

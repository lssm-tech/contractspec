# ContractSpec Connect Technical Specification

## 1. Summary

**ContractSpec Connect** is the local adapter layer that turns existing ContractSpec governance primitives into coding-agent enforcement.

Connect does four things:

1. Normalize agent-native actions into a Connect action model
2. Project trusted repo context into task-scoped DTOs
3. Synthesize adapter-facing verdicts from existing control-plane, ACP, impact, approval, and replay primitives
4. Persist local evidence for review and deterministic replay

Connect is intentionally narrow. It does not become a new source of truth.

## 2. Product framing

The monorepo already contains the core primitives Connect needs:

| Concern | Existing source of truth |
| --- | --- |
| Intent, plan, approval, trace | `controlPlane.*` contracts and `@contractspec/integration.runtime` |
| Mutation candidates | `acp.fs.access`, `acp.tool.calls`, `acp.terminal.exec` |
| Impact and diff analysis | `@contractspec/module.workspace`, `@contractspec/bundle.workspace` |
| Agent approval queue | `@contractspec/lib.ai-agent/approval` |
| Trusted context | knowledge spaces, canon packs, workspace config |
| Replay and evaluation | `@contractspec/lib.harness`, `@contractspec/integration.harness-runtime` |
| Operator CLI | `contractspec impact`, `contractspec control-plane ...` |

Connect exists to compose those primitives at the coding-agent boundary.

## 3. Goals

1. Make ContractSpec governance enforceable before mutating actions land
2. Stay useful in OSS-only mode
3. Default to local evidence and local replay
4. Reuse current contract keys, runtime services, and CLI surfaces
5. Keep adapter-specific verdicts and UX separate from canonical runtime contracts

## 4. Non-goals

1. Shipping a parallel `@contractspec/connect` package family
2. Introducing a second canonical approval or trace system
3. Replacing `controlPlane.*`, ACP, or harness with Connect-specific contracts in V1
4. Making Studio mandatory for local safety
5. Promising deep native editor interception before plugin and wrapper paths are proven

## 5. Source-of-truth hierarchy

The hierarchy must remain explicit:

1. **Canonical contracts and policies**
   - `controlPlane.*`, `acp.*`, agent, knowledge, policy, and related contracts in `@contractspec/lib.contracts-spec`
2. **Runtime records**
   - compiled plans, approvals, traces, and replayable records produced by existing runtime services
3. **Workspace config and read-only canon packs**
   - `.contractsrc.json`, canon pack refs, and repository-approved guardrails
4. **Workspace analysis outputs**
   - impact detection, scanned contract metadata, docblock manifests, and related derived indexes
5. **Task-scoped Connect artifacts**
   - `ContextPack`, `PlanPacket`, `PatchVerdict`, `ReviewPacket`
6. **Ephemeral task hints**
   - session-local suggestions, scratchpads, and non-authoritative agent context

Connect artifacts are projections. They are never authoritative over canonical contracts or runtime records.

## 6. Execution model

Connect sits between an adapter and risky actions:

1. An adapter captures a candidate action or plan
2. Connect resolves impacted repo scope using existing workspace and impact services
3. Connect projects trusted context into a task-scoped `ContextPack`
4. Connect compiles a `PlanPacket` that points back to `controlPlane.intent.submit`, `controlPlane.plan.compile`, and `controlPlane.plan.verify`
5. Connect evaluates a mutation candidate as an ACP-aligned action
6. Connect returns one adapter-facing verdict:
   - `permit`
   - `rewrite`
   - `require_review`
   - `deny`
7. Connect writes local artifacts and review packets under `.contractspec/connect/*`
8. `verify` stores per-decision snapshots under `.contractspec/connect/decisions/<decisionId>/` for replay and evaluation
9. Replay and evaluation use existing control-plane trace and harness-style evidence patterns

## 7. Underlying primitive mapping

| Connect concern | Existing primitive |
| --- | --- |
| Intent capture | `controlPlane.intent.submit` |
| Deterministic plan compile | `controlPlane.plan.compile` |
| Plan verification | `controlPlane.plan.verify` |
| Policy explanation | `controlPlane.policy.explain` |
| Trace and replay lookup | `controlPlane.trace.get`, runtime trace service |
| Filesystem mutation candidate | `acp.fs.access` |
| Tool batch candidate | `acp.tool.calls` |
| Command candidate | `acp.terminal.exec` |
| Human approval resolution | `controlPlane.execution.approve`, `controlPlane.execution.reject`, `agent.approvals` |
| Impact classification | workspace snapshot, diff, and impact services |
| Deterministic regression check | harness replay bundle and evaluation runner |

## 8. Adapter-facing verdict model

Connect returns adapter-facing outcomes, but each verdict must map back to an underlying runtime state.

| Connect verdict | Typical runtime interpretation |
| --- | --- |
| `permit` | underlying plan can proceed without review; usually maps to an `autonomous` or non-blocked control-plane path |
| `rewrite` | underlying action is unsafe as proposed but may proceed after bounded remediation |
| `require_review` | underlying runtime path requires assist-mode or approval-backed continuation |
| `deny` | underlying runtime path is blocked or policy-denied |

### Required mapping fields

Every Connect verdict must carry:

- adapter-facing verdict
- underlying control-plane verdict when applicable
- runtime-linked control-plane decision id when available
- approval requirement flag
- trace or execution identifiers when available
- impacted contract refs
- required checks
- replay references

Connect must never return a free-floating verdict without a runtime mapping.

## 9. Configuration

Connect configuration belongs in `.contractsrc.json` under `connect`.

The `connect` namespace must cover:

- adapter enablement
- local artifact paths
- protected, immutable, and generated paths
- review thresholds
- Bun-first smoke checks
- command allow/review/deny policy
- canon pack refs
- optional Studio bridge configuration

Generated artifacts remain in `.contractspec/connect/*`.

## 10. Local artifacts

Connect uses generated, reviewable artifacts only:

```txt
.contractsrc.json
.contractspec/connect/context-pack.json
.contractspec/connect/plan-packet.json
.contractspec/connect/patch-verdict.json
.contractspec/connect/audit.ndjson
.contractspec/connect/review-packets/*.json
.contractspec/connect/decisions/<decisionId>/*.json
```

### Artifact roles

- `.contractsrc.json` — user-authored config and policy defaults
- `context-pack.json` — task-scoped, trusted context projection
- `plan-packet.json` — Connect projection over plan compile and verify inputs
- `patch-verdict.json` — adapter-facing decision for one mutation candidate
- `audit.ndjson` — append-only local evidence log
- `review-packets/*.json` — local escalation payloads ready for human review or later Studio sync
- `decisions/<decisionId>/*.json` — internal replay/evaluation snapshots for a single decision; generated and intentionally not treated as a compatibility surface

## 11. DTO rules

### ContextPack

Must project:

- repo and branch identity
- actor id, type, session, and trace ids when available
- impacted contract refs
- affected surfaces
- knowledge entries with category and trust level
- policy bindings
- config refs back to `.contractsrc.json` and other authoritative inputs
- acceptance checks that gate safe completion

### PlanPacket

Must project:

- objective and ordered steps
- touched paths and command candidates
- impacted contract refs
- required checks
- required approvals
- risk score
- verification status
- explicit references to `controlPlane.intent.submit`, `controlPlane.plan.compile`, and `controlPlane.plan.verify`

### PatchVerdict

Must project:

- adapter action type plus underlying ACP tool key
- impacted files, contracts, surfaces, and policies
- check outcomes
- Connect verdict
- mapped control-plane verdict and approval requirement
- remediation guidance
- review packet ref when escalated
- replay refs back to trace and policy explanation

### ReviewPacket

Must project:

- source decision id
- objective and review reason
- summary of paths, impacted contracts, and checks
- evidence refs to context, plan, verdict, and trace
- required approvals
- optional Studio transport metadata

## 12. Verifier pipeline

The verifier pipeline is a composition of current repo capabilities, not a greenfield stack:

1. **Scope resolution**
   - workspace scan, impact analysis, path classification
2. **Boundary checks**
   - protected paths, immutable paths, generated outputs, command class
3. **Contract-aware checks**
   - drift, compatibility, impacted surfaces, missing spec alignment
4. **Approval routing**
   - determine whether assist-mode or explicit approval is required
5. **Replay hooks**
   - preserve enough evidence to reuse `controlPlane.trace.get` and harness-style replay patterns
6. **Verdict synthesis**
   - project runtime state into `permit`, `rewrite`, `require_review`, or `deny`

## 13. Adapter strategy

V1 is plugin-first:

- Cursor marketplace/plugin assets
- Codex-compatible wrappers and rule bundles
- Claude Code-compatible rule or wrapper integrations
- existing `contractspec` CLI flows for operator inspection and replay

V1 does **not** assume deep, editor-native interception everywhere.

## 14. CLI stance

Connect lives inside the existing CLI surface:

- `contractspec connect init [--scope workspace|package]`
- `contractspec connect context --task <taskId> [--baseline <ref>] [--paths <path...>]`
- `contractspec connect plan --task <taskId> --stdin`
- `contractspec connect verify --task <taskId> --tool <acp.fs.access|acp.terminal.exec> --stdin`
- `contractspec connect review list`
- `contractspec connect replay <decisionId>`
- `contractspec connect eval <decisionId> --registry <path> (--scenario <key> | --suite <key>)`
- `contractspec impact ...` for broader impact reporting
- `contractspec control-plane ...` for approvals, traces, and replay inspection

There is no standalone `npx @contractspec/connect init` posture in this spec.

## 15. OSS and Studio boundary

OSS must include:

- local config and artifact conventions
- local context, plan, verdict, and review packet generation
- local audit evidence
- deterministic replay hooks
- adapter integrations that work without Studio

Studio may add:

- centralized review queues
- multi-user policy UI
- shared canon registry transport
- lineage across review and handoff flows
- managed lanes and scheduling

Studio is additive. Local safety cannot depend on it.

When implemented as a thin post-V1 transport, Studio review-bridge must:

- ingest review packets without changing the local Connect verdict
- expose queue metadata such as queue name, linked execution-lane run id, linked runtime decision id, and trace id
- derive queue state from existing approval and execution-lane records rather than creating a second approval system
- preserve canon-pack refs, knowledge entries, and config refs as packet-scoped context

## 16. Security and governance

Connect must remain:

- local-first
- least-privilege by default
- explicit about protected and immutable paths
- explicit about destructive command denial
- explicit about when approval is required
- explicit about which artifacts are authoritative versus derived

Inferred repo convention must not silently outrank canonical contracts or policy.

## 17. V1 cut

The recommended V1 stops at OSS-core behavior:

1. `.contractsrc.json > connect`
2. context, plan, verdict, and review DTOs
3. ACP-aligned action normalization
4. local evidence and local replay references
5. plugin-first adapters

Studio bridge, canon-pack transport, and managed lanes are post-V1 unless implemented as thin transports over existing artifacts.

## 18. Success criteria

V1 is successful when:

1. Connect can explain risky actions using current contract and runtime keys
2. review-required and denied actions produce replayable local evidence
3. OSS mode remains useful without Studio
4. the spec does not invent a second control-plane vocabulary
5. adapter documentation matches existing package and CLI boundaries

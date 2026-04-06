# Phased Roadmap

## Phase 0. Spec alignment

Deliverables:

- remove the standalone `@contractspec/connect` framing
- align terminology to `controlPlane.*`, ACP, workspace impact, agent approval, and harness replay
- define `.contractsrc.json > connect`

Exit criteria:

- the spec does not invent a second control-plane vocabulary
- config, DTOs, schemas, and diagrams all point at existing repo primitives

## Phase 1. Workspace config and DTOs

Deliverables:

- `connect` namespace in `.contractsrc.json`
- `ContextPack`, `PlanPacket`, `PatchVerdict`, and `ReviewPacket` schemas
- local artifact path conventions under `.contractspec/connect/`

Exit criteria:

- adapters have a stable config and DTO contract
- generated artifacts are clearly separated from user-authored config

## Phase 2. CLI integration

Deliverables:

- `contractspec connect ...` command family inside the current CLI
- Bun-first examples
- command semantics aligned to existing `impact` and `control-plane` surfaces

Exit criteria:

- there is no standalone Connect CLI posture
- Connect can emit and inspect local DTO artifacts through the main CLI

## Phase 3. Impact and context projection

Deliverables:

- reuse of workspace scan and impact services for Connect scope resolution
- task-scoped context projection
- policy and config ref attachment

Exit criteria:

- Connect can explain affected contracts and surfaces for a candidate action
- context packs are grounded in authoritative refs

## Phase 4. Decision synthesis for ACP actions

Deliverables:

- ACP-aligned normalization for file and command actions
- adapter-facing verdict synthesis
- approval routing and remediation guidance

Exit criteria:

- risky mutations produce `rewrite`, `require_review`, or `deny` with underlying runtime mapping
- Connect does not fork ACP or control-plane semantics

## Phase 5. Local review packets and replay

Deliverables:

- local review packet emission
- append-only audit evidence
- replay hooks back to `controlPlane.trace.get` and harness-style evaluation

Exit criteria:

- review-required or denied actions are reproducible locally
- OSS mode is useful without Studio

## Phase 6. Plugin-first adapters

Deliverables:

- Cursor plugin and rule alignment
- Codex-compatible wrappers or rule bundles
- Claude Code-compatible wrappers or rule bundles

Exit criteria:

- Connect proves value through plugin-first integrations before deep native hooks

## Phase 7. Optional Studio bridge

Deliverables:

- optional transport of review packets into Studio
- Studio metadata on local packets
- no change to local safety semantics

Exit criteria:

- Studio adds collaboration and transport, not baseline safety

## Recommended V1 cut

V1 should stop after **Phase 5** or, at most, a thin slice of **Phase 6**.

That delivers the OSS proof:

- repo-configured Connect behavior in `.contractsrc.json`
- local DTO generation
- contract-aware mutation decisions
- local review packets
- deterministic replay hooks

Studio bridge and shared-canon transport are later unless they remain thin wrappers around existing artifacts.

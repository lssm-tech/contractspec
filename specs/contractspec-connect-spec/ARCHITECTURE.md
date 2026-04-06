# Architecture

## Runtime component model

```txt
┌──────────────────────────────────────────────────────────────────────┐
│ Coding agent host                                                   │
│  - Cursor plugin / rules                                            │
│  - Codex wrapper / rules                                             │
│  - Claude Code wrapper / rules                                      │
└──────────────────────┬───────────────────────────────────────────────┘
                       │ normalized plan or mutation candidate
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│ ContractSpec Connect                                                │
│  1. Adapter normalizer                                              │
│  2. Context / plan / verdict DTO projector                          │
│  3. Local artifact writer                                           │
│  4. Review packet emitter                                           │
└───────┬────────────────┬──────────────────┬──────────────────────────┘
        │                │                  │
        ▼                ▼                  ▼
┌───────────────┐ ┌───────────────┐ ┌──────────────────────────────────┐
│ contracts-spec│ │ runtime + ACP │ │ workspace + harness             │
│ controlPlane.*│ │ trace/approval│ │ impact / replay / evaluation    │
│ agent / policy│ │ acp.* actions │ │ docblocks / knowledge           │
└───────────────┘ └───────────────┘ └──────────────────────────────────┘
```

## Existing package anchors

| Connect responsibility | Existing package |
| --- | --- |
| Canonical contracts and policy refs | `packages/libs/contracts-spec` |
| Plan, approval, trace, replay records | `packages/integrations/runtime` |
| Workspace scan and impact analysis | `packages/modules/workspace`, `packages/bundles/workspace` |
| Agent approval queue | `packages/libs/ai-agent` |
| Knowledge spaces and canon | `packages/libs/knowledge`, `packages/examples/knowledge-canon` |
| Replay and evaluation | `packages/libs/harness`, `packages/integrations/harness-runtime` |
| Shared Connect runtime services | `packages/bundles/workspace/src/services/connect` |
| CLI operator surface | `packages/apps/cli-contractspec` |
| Thin Connect CLI wrappers | `packages/apps/cli-contractspec/src/commands/connect` |

## Decision flow

### A. Session start

1. Adapter reads `.contractsrc.json`
2. Adapter loads the `connect` namespace
3. Connect resolves current repo and branch state
4. Connect discovers authoritative refs:
   - contracts and policy
   - workspace analysis and impact
   - knowledge and canon refs
5. Connect prepares local artifact paths under `.contractspec/connect/`

### B. Plan flow

1. Adapter submits a plan candidate
2. Connect projects impacted scope into a `ContextPack`
3. Connect produces a `PlanPacket`
4. `PlanPacket.controlPlane` points to:
   - `controlPlane.intent.submit`
   - `controlPlane.plan.compile`
   - `controlPlane.plan.verify`
5. Connect returns an adapter-facing plan result:
   - approved
   - revise
   - review
   - denied

### C. File mutation flow

1. Adapter captures a write or edit candidate
2. Connect normalizes it as an ACP-aligned filesystem action
3. Workspace impact and boundary checks resolve affected scope
4. Connect synthesizes a `PatchVerdict`
5. If needed, Connect emits a local `ReviewPacket`

### D. Command flow

1. Adapter captures a command candidate
2. Connect normalizes it as an ACP-aligned terminal action
3. Connect classifies allow, review, or deny using:
   - configured command policy
   - affected scope
   - review thresholds
4. Connect emits a `PatchVerdict`

### E. Replay flow

1. Operator or adapter reads a Connect decision id
2. Connect resolves the persisted local verdict from `.contractspec/connect/decisions/<decisionId>/`
3. Connect points back to existing trace and replay primitives:
   - `controlPlane.trace.get`
   - runtime trace service
   - harness replay and evaluation when configured

## Component responsibilities

### Adapter normalizer

- translate host-native actions into Connect DTO inputs
- preserve actor, session, and trace metadata
- stay plugin-first for V1

### Context / plan / verdict projector

- build Connect DTOs from existing primitives
- never mint canonical truth
- always carry refs back to source contracts and runtime records

### Local artifact writer

- write generated artifacts under `.contractspec/connect/*`
- keep latest pointers and per-decision history in separate files
- keep review packets separate from user-authored config
- maintain append-only audit semantics

### Review packet emitter

- create local packets first
- optionally attach Studio transport metadata
- preserve trace and policy explanation refs

## Package stance

Connect should prefer **existing packages and current CLI surfaces**.

The current implementation already uses:

```txt
packages/bundles/workspace/src/services/connect/*
packages/apps/cli-contractspec/src/commands/connect/*
```

This spec does not assume a new standalone package split such as:

```txt
packages/libs/connect-core
packages/apps/connect-cli
packages/integrations/connect-*
```

If implementation needs dedicated modules later, they should be introduced only after existing homes prove insufficient.

## Performance stance

- prefer incremental workspace analysis over full rescans
- keep DTOs task-scoped and minimal
- reuse existing trace and replay services instead of duplicating them
- keep local safety decisions independent from Studio availability

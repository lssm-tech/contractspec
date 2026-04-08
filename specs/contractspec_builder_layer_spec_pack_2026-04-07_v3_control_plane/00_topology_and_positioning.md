# Topology and Positioning

## Positioning statement

Builder is the **authoring control plane** for ContractSpec.

It sits:
- above the raw OSS primitives,
- inside or alongside Studio,
- in front of external execution engines,
- behind the final generated application/workspace.

## The important boundary

Builder should **delegate implementation work** rather than pretending to outperform specialized coding products.

Builder owns:
- the structured problem statement,
- the runtime target,
- the policy constraints,
- the acceptance criteria,
- the approval model,
- the evidence model,
- the reconciliation of outputs from one or many external providers.

External providers own:
- code or content synthesis,
- repo-aware patching,
- natural language responses,
- STT / vision inference,
- low-level implementation acceleration.

## Layer diagram

```text
Human inputs
  ├─ Web chat / web voice
  ├─ Telegram / WhatsApp
  ├─ Files / ZIP / PDF / Images
  └─ Studio snapshots / memory / policy
           │
           ▼
Builder
  ├─ Ingestion + source fusion
  ├─ Decision memory
  ├─ Lane orchestration
  ├─ Provider routing
  ├─ Runtime target selection
  ├─ Harness gating
  └─ Export / preview orchestration
           │
           ├──────────────► External execution providers
           │                  ├─ Conversational
           │                  ├─ Coding
           │                  ├─ STT
           │                  └─ Vision / extraction
           │
           ▼
ContractSpec OSS
  ├─ Contracts / schemas
  ├─ Runtime adapters
  ├─ Harness / evidence / replay
  ├─ Artifact generation
  └─ Execution-lane primitives
           │
           ▼
Runtime target
  ├─ Managed
  ├─ Local
  └─ Hybrid
           │
           ▼
Generated app / workspace / preview / export bundle
```

## Embedded first, split later

Builder should begin as:
- a set of packages in the monorepo,
- a Studio-embedded workbench,
- a mobile-accessible operator experience.

Builder should split into a standalone app only if:
- auth boundaries diverge,
- distribution and pricing diverge,
- runtime management diverges,
- or mobile/web usage volumes justify independent product boundaries.

## Why this topology exists

The topology exists to satisfy four constraints at the same time:

1. **do not rebuild frontier coding agents**
2. **let non-engineers author useful applications**
3. **let power users run locally when they want control**
4. **keep verification and governance independent of any one provider**

## Non-goals

Builder v3 is not:
- a replacement for Codex or Claude Code,
- a freeform autonomous shell with unrestricted repo write access,
- a messaging-only toy with no serious runtime model,
- a managed-only stack that strands power users,
- a local-only tinkerbox that strands non-engineers.

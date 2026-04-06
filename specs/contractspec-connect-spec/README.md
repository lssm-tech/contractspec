# ContractSpec Connect Spec Package

This package defines **ContractSpec Connect** as a codebase-aligned adapter layer for coding agents.

Connect is the enforcement and projection layer that sits between agent-native actions and the existing ContractSpec stack:

- `controlPlane.*` contracts for intent, plan compilation, verification, approval, and trace
- `acp.*` contracts for filesystem, tool-call, and terminal mutation candidates
- workspace impact and spec analysis for affected contracts and surfaces
- `@contractspec/lib.ai-agent` approval workflows
- knowledge spaces and canon packs for trusted context
- harness replay and evaluation for deterministic regression checks

Connect is **not** a second control plane, a second approval model, or a second package family.

## Contents

- `SPEC.md` — product framing, execution model, DTO rules, and V1 boundaries
- `ARCHITECTURE.md` — component map aligned to existing monorepo packages
- `CLI.md` — implemented `contractspec connect ...` surface inside the existing CLI
- `MODELS.md` — `.contractsrc.json` config and adapter DTO shapes
- `SECURITY_AND_GOVERNANCE.md` — local safety model and review thresholds
- `OSS_VS_STUDIO.md` — OSS-first boundary and Studio extensions
- `ROADMAP.md` — phased delivery plan with an OSS-core V1 cut
- `ACCEPTANCE_SCENARIOS.md` — concrete permit/review/deny/replay scenarios
- `examples/` — config and DTO examples aligned with repo naming
- `schemas/` — JSON Schemas for context, plan, verdict, and review packets
- `diagrams/` — Mermaid component and sequence diagrams

## Repo Alignment

Connect should reuse, not replace, the current monorepo surfaces:

- **Contracts**: `packages/libs/contracts-spec`
- **Deterministic runtime planning, approval, trace**: `packages/integrations/runtime`
- **Impact and workspace analysis**: `packages/modules/workspace` and `packages/bundles/workspace`
- **Agent approval flow**: `packages/libs/ai-agent`
- **Knowledge and canon**: `packages/libs/knowledge` and `packages/examples/knowledge-canon`
- **Replay and evaluation**: `packages/libs/harness` and `packages/integrations/harness-runtime`
- **CLI exposure**: `packages/apps/cli-contractspec`

The current implementation lives in:

- `packages/bundles/workspace/src/services/connect`
- `packages/apps/cli-contractspec/src/commands/connect`

## V1 Stance

- OSS-first and useful without Studio
- Config lives under `.contractsrc.json > connect`
- Generated evidence lives under `.contractspec/connect/*`
- Per-decision snapshots live under `.contractspec/connect/decisions/<decisionId>/` as an internal implementation detail
- Plugin-first adapters for Cursor/Codex/Claude-compatible environments
- Local review packets and deterministic replay before any Studio bridge

## Non-goals

- A standalone `@contractspec/connect` CLI or runtime family
- A separate `connect.*` canonical contract namespace for V1
- Replacing `controlPlane.*`, ACP, agent approvals, or harness replay with new equivalents

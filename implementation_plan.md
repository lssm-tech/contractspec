# Implementation Plan: Mistral Everywhere

Last updated: 2026-02-27
Owner: OpenCode + project maintainer
Status: Completed (ready for review)

## Why this exists

This plan tracks the work required to make Mistral support first-class across the monorepo for hackathon readiness, while keeping a durable record for future contributors.

## Objectives

1. Ensure `mistral` is consistently supported across contracts, integrations, providers, and CLI configuration.
2. Expand Mistral capability coverage beyond chat + embeddings where existing abstractions allow.
3. Keep implementation traceable with tests, docs, and clear registry wiring.
4. Add Mistral Vibe-targeted output in agentpacks.

## Non-goals (unless scope changes)

1. Re-architecting unrelated AI provider systems.
2. Building net-new abstractions not needed for Mistral support.
3. Breaking backward compatibility in existing provider names/config formats.

## Baseline (already done)

- [x] Cross-package audit of current Mistral support and gaps.
- [x] Mistral docs review (API + Vibe) for capability mapping.
- [x] Initial execution order and validation strategy drafted.

## Workstreams and checklist

### WS1 - Provider Surface Unification (contracts + config)

Status: Completed

- [x] Add/confirm `mistral` in workspace config types and schemas.
- [x] Align CLI `.contractsrc` schema and example config with `mistral`.
- [x] Update config parsing/validation tests for `mistral`.

Primary paths:

- `packages/libs/contracts-spec/src/workspace-config/contractsrc-types.ts`
- `packages/libs/contracts-spec/src/workspace-config/contractsrc-schema.ts`
- `packages/apps/cli-contractspec/contractsrc.schema.json`
- `packages/apps/cli-contractspec/.contractsrc.example.json`
- `packages/apps/cli-contractspec/src/utils/config.ts`
- `packages/apps/cli-contractspec/src/utils/config.test.ts`

### WS2 - Mistral Integration Contracts Expansion

Status: Completed

- [x] Add missing Mistral integration specs in `contracts-spec`.
- [x] Mirror and register contracts in `contracts-integrations`.
- [x] Extend provider integration tests to include new Mistral contracts.

Primary paths:

- `packages/libs/contracts-spec/src/integrations/providers/`
- `packages/libs/contracts-integrations/src/integrations/providers/`
- `packages/libs/contracts-spec/src/integrations/providers/registry.ts`
- `packages/libs/contracts-integrations/src/integrations/providers/registry.ts`
- `packages/libs/contracts-spec/src/integrations/providers/providers.test.ts`
- `packages/libs/contracts-integrations/src/integrations/providers/providers.test.ts`

### WS3 - Runtime Provider Implementations (providers-impls)

Status: Completed

- [x] Implement high-value Mistral adapters using existing interfaces.
- [x] Wire adapters in provider factory and exports.
- [x] Add/update tests and implementation docs.

Primary paths:

- `packages/integrations/providers-impls/src/impls/`
- `packages/integrations/providers-impls/src/impls/provider-factory.ts`
- `packages/integrations/providers-impls/src/impls/index.ts`
- `packages/integrations/providers-impls/PREBUILT_INTEGRATIONS_GUIDE.md`

### WS4 - AI Provider Catalog and Validation Refresh

Status: Completed

- [x] Refresh Mistral model catalog in ai-providers.
- [x] Align validation and defaults with updated catalog.
- [x] Update ai-providers docs if model/provider behavior changes.

Primary paths:

- `packages/libs/ai-providers/src/models.ts`
- `packages/libs/ai-providers/src/validation.ts`
- `packages/libs/ai-providers/src/factory.ts`
- `packages/libs/ai-providers/README.md`

### WS5 - CLI Provider Path Consistency

Status: Completed

- [x] Ensure legacy and new CLI AI paths both accept and use `mistral`.
- [x] Resolve provider/mode naming mismatches where they affect behavior.
- [x] Verify end-to-end Mistral chat/provider resolution.

Primary paths:

- `packages/apps/cli-contractspec/src/ai/providers.ts`
- `packages/apps/cli-contractspec/src/commands/chat/index.ts`
- `packages/apps/cli-contractspec/src/ai/client.ts`
- `packages/apps/cli-contractspec/src/ai/agents/`
- `packages/apps/cli-contractspec/README.md`

### WS6 - Agentpacks Mistral Vibe Target

Status: Completed

- [x] Add a Mistral Vibe target implementation.
- [x] Register target and connect model allowlist/config behavior.
- [x] Document generation output and usage.

Primary paths:

- `packages/tools/agentpacks/src/targets/`
- `packages/tools/agentpacks/src/targets/registry.ts`
- `packages/tools/agentpacks/src/utils/model-allowlist.ts`
- `packages/tools/agentpacks/README.md`

### WS7 - Validation, Docs, and Final Readiness Sweep

Status: Completed

- [x] Run targeted tests for each touched package.
- [x] Run lint/typecheck for touched packages (or monorepo scope if needed).
- [x] Update docs and examples for final support matrix.
- [x] Produce final change summary with known limitations.

### WS8 - AgentSkills Compatibility Hardening

Status: Completed

- [x] Preserve full SKILL.md frontmatter during generation/export across skill-capable targets.
- [x] Add AgentSkills metadata validation in `agentpacks pack validate`.
- [x] Normalize imported skills to include minimum required AgentSkills metadata.
- [x] Update tests and docs to reflect AgentSkills-compatible behavior.

## Dependency order

1. WS1 -> WS2 (contracts/config first)
2. WS2 -> WS3 (implementations against stable contracts)
3. WS3 + WS4 -> WS5 (provider runtime + model catalog before full CLI alignment)
4. WS6 in parallel after WS1 (mostly isolated)
5. WS7 at each milestone and final pass

## Validation checklist (to run during implementation)

- [x] Package-level tests for each changed package.
- [x] Typecheck in changed packages.
- [x] CLI smoke checks for `mistral` provider config and command execution.
- [x] Registry snapshots or equivalent tests updated.

## Decisions log

- 2026-02-27: Start with broad Mistral surface coverage and prioritize production-ready adapters for core flows (chat, embeddings, transcription, conversational) before optional capabilities.
- 2026-02-27: Keep provider naming backward-compatible in CLI by mapping `claude` -> `anthropic` and `custom` -> OpenAI-compatible transport while adding explicit `mistral` handling.
- 2026-02-27: Keep new Mistral contracts and runtime adapters additive (no breaking changes to existing provider IDs).

## Risks and mitigations

- Risk: Capability mismatch between Mistral APIs and current internal abstractions.
  - Mitigation: Land contracts first, then implement adapters only where abstraction fit is clear.
- Risk: CLI has mixed legacy/new AI plumbing.
  - Mitigation: Add compatibility-first wiring and tests before refactors.
- Risk: Model catalog drift over time.
  - Mitigation: Keep models centralized and documented in ai-providers.

## Progress log

- 2026-02-27: Created implementation plan and captured baseline + ordered workstreams.
- 2026-02-27: Completed WS1 provider/config unification (`mistral` in schemas + config parsing tests).
- 2026-02-27: Completed WS2 contracts for Mistral STT and conversational capabilities in both contracts packages.
- 2026-02-27: Completed WS3 runtime adapters and factory wiring for Mistral STT/conversational providers.
- 2026-02-27: Completed WS4 ai-providers Mistral model catalog refresh with validation tests and README updates.
- 2026-02-27: Completed WS5 CLI legacy/new path alignment for Mistral provider and key resolution.
- 2026-02-27: Completed WS6 agentpacks `mistralvibe` target support and model allowlist updates.
- 2026-02-27: Completed WS7 validation/docs sweep (targeted package tests, typecheck, lint, and monorepo checks).
- 2026-02-27: Completed WS8 AgentSkills hardening (skill metadata passthrough, validation, importer normalization, and docs/tests updates).

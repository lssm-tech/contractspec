# Implementation Plan: AI-Native Chat and Generative UI

- **Spec:** 07_ai_native_chat_and_generative_ui.md
- **Status:** Done
- **Package:** `@contractspec/lib.surface-runtime` (planner) + `@contractspec/module.ai-chat` (UI)

## Why this exists

Integrates AI as planner and explainer within the surface system. AI proposes SurfacePatch objects; never emits JSX. Chat UI comes from module.ai-chat; planner runs via lib.ai-agent.

## Objectives

1. Implement PlannerResponse type and map to ContractSpecAgent/AgentSpec.
2. Implement AI SDK adapter for planner (streamText, structured output).
3. Implement patch proposal validator and accept/reject UI.
4. Integrate with module.ai-chat (useChat, ChatContainer) for chat UI.
5. Implement approval model: auto-approve low-risk; require approval for workspace changes.

## Non-goals (v1)

- Full BlockNote block generation from AI.
- Assistant skills / planner augmentations.
- Persistent AI memory (stay in lib.ai-agent).

## Codebase alignment

- Planner: lib.ai-agent (ContractSpecAgent, AgentSpec).
- Chat UI: module.ai-chat (useChat, ChatContainer).
- Providers: lib.ai-providers (createProvider, model selection).
- Tools map to agent tools; patch proposals map to structured tool output.

## Workstreams

### WS1 — Planner integration

- [x] Define PlannerResponse type (summary, intent, patchProposals, blockDrafts).
- [x] Implement planner prompt compiler (bundle metadata, allowed slots, patch ops).
- [x] Add planner tool: propose-patch returning SurfacePatchProposal.
- [x] Integrate with ContractSpecAgent or equivalent (proposePatchToolConfig, buildSurfacePatchProposal).

### WS2 — Patch validation and approval

- [x] Implement patch proposal validator (allowed ops, slots, node kinds).
- [x] Implement accept/reject UI (BundleRenderer assistant slot; PatchApprovalHandler type).
- [x] Add audit events: patch.proposed, patch.approved, patch.rejected.
- [x] Implement undo for accepted patches (applySurfacePatch inverseOps).

### WS3 — Chat UI integration

- [x] Document how BundleRenderer uses module.ai-chat for assistant slot.
- [x] Ensure assistant slot renders ChatContainer or equivalent (assistantSlotId, assistantSlotContent).
- [x] Pass provider config from lib.ai-providers to planner (documented in README).

## Dependencies

- 01_core_bundle (SurfacePatchOp, SurfaceNode).
- 02_resolution_runtime (applySurfacePatch).
- 04_ui_adapters (BundleRenderer, assistant slot).

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| AI emits invalid patches | Validator rejects; never apply unvalidated. |
| Approval flow too complex | Start with session-only; add user/workspace later. |

## Completion notes (2026-03-08)

- **Types** (`spec/types.ts`): `PlannerResponse`, `BlockDraft`, `PatchAuditEvent`, `PatchAuditPayload`, `PatchApprovalHandler`.
- **Planner prompt** (`runtime/planner-prompt.ts`): `compilePlannerPrompt` — bundle metadata, allowed ops/slots/node kinds, preferences, safety instructions.
- **Planner tools** (`runtime/planner-tools.ts`): `proposePatchToolConfig`, `PROPOSE_PATCH_TOOL_SCHEMA`, `buildSurfacePatchProposal`, `PlannerToolConfig`.
- **Validation** (`spec/validate-surface-patch.ts`): `validatePatchProposal` — allowed ops, slots, node kinds; `PatchProposalConstraints`.
- **BundleRenderer** (`react/BundleRenderer.tsx`): `assistantSlotId`, `assistantSlotContent` props for ChatContainer wiring.
- **README**: AI Chat Integration section — assistant slot, provider config, planner integration, patch approval flow.
- **Deferred:** Full AI SDK streamText/structured output (bundle wires ContractSpecAgent); auto-approve vs require-approval logic (bundle implements); module.ai-chat direct dependency (bundle composes).

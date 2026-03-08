---
"@contractspec/lib.surface-runtime": minor
---

feat(surface-runtime): AI-native chat and generative UI integration (07_ai_native_chat_and_generative_ui)

- Add PlannerResponse, BlockDraft, PatchAuditEvent, PatchAuditPayload, PatchApprovalHandler types
- Add compilePlannerPrompt for planner system prompt compilation
- Add proposePatchToolConfig and buildSurfacePatchProposal for ContractSpecAgent integration
- Add validatePatchProposal for allowed ops, slots, and node kinds
- Add BundleRenderer assistantSlotId/assistantSlotContent props for ChatContainer wiring
- Document AI chat integration in README

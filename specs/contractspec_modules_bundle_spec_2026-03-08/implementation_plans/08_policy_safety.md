# Implementation Plan: Policy, Audit, and Safety

- **Spec:** 10_policy_audit_and_safety.md
- **Status:** Done
- **Package:** `@contractspec/lib.surface-runtime`

## Why this exists

Integrates with ContractSpec policy layer (PDP), adds audit events for all surface and patch operations, and ensures rollback capability. AI guardrails: no unvalidated patches, no undeclared nodes.

## Objectives

1. Implement policy hooks in resolver (allow, deny, redact, disable-with-reason, require-approval).
2. Emit audit events: surface.resolved, patch.proposed/approved/rejected, overlay.saved/applied/failed, policy.denied/redacted.
3. Implement rollback (forward ops, inverse ops, approval metadata).
4. Enforce: no patch application without validation; no widget registration from prompts.

## Non-goals (v1)

- Full PDP integration (stub policy evaluation).
- Compliance reporting exports.
- Policy simulation UI.

## Codebase alignment

- contracts-spec policy types (if available).
- lib.observability for audit event emission.
- Overlay-engine for overlay audit trail.

## Workstreams

### WS1 — Policy hooks

- [x] Define policy effect types (allow, deny, redact, disable-with-reason, require-approval).
- [x] Add policy evaluation step to resolver pipeline.
- [x] Stub PDP integration (or document contract for future).
- [x] Apply policy to patch proposals before approval.

### WS2 — Audit events

- [x] Define audit event schema.
- [x] Emit surface.resolved on resolution.
- [x] Emit patch.proposed, patch.approved, patch.rejected.
- [x] Emit overlay.saved, overlay.applied, overlay.failed.
- [x] Emit policy.denied, policy.redacted when applicable.
- [x] Integrate with lib.observability (BundleAuditEmitter interface).

### WS3 — Rollback

- [x] Ensure every SurfacePatchOp has inverse (insert/remove, replace, set-layout, reveal/hide-field).
- [x] Store approval metadata with overlays (OverlayApprovalMeta).
- [x] Implement rollback API (revert last N patches).
- [x] Document rollback semantics.

## Dependencies

- 01_core_bundle (SurfacePatchOp).
- 02_resolution_runtime (resolver pipeline).
- 07_extensions (overlay persistence).

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Audit event volume | Sample or aggregate; critical events always. |
| Rollback complexity | Keep inverse ops simple; document limits. |

## Implementation notes (2026-03-08)

- **Policy types:** `PolicyEffect`, `UiPolicyDecision` in `spec/types.ts`. `PolicyHooks` extended with `evaluateNode`, `evaluatePatchProposal`.
- **Audit:** `BundleAuditEvent`, `BundleAuditEmitter`; `emitPatchProposed`, `emitPatchApproved`, etc. in `runtime/audit-events.ts`. `surface.resolved` emitted in `resolveBundle` when `audit` option provided.
- **Rollback:** `rollbackSurfacePatches`, `OverlayApprovalMeta`. Inverse ops for insert/remove, replace, set-layout, reveal/hide-field. move-node, resize-panel, set-focus, promote-action require previous state (inverse null).
- **Validation:** `applySurfacePatch` calls `validateSurfacePatch` before applying. `evaluateAndEmitPatchPolicy` gates proposals.
- **Widget registration:** Enforced in 07_extensions (trust tier: never ephemeral-ai for registration). This plan relies on 07 for that guardrail.

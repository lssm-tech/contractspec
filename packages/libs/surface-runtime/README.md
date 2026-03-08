# @contractspec/lib.surface-runtime

AI-native surface specs and web runtime for adaptive ContractSpec surfaces.

## Overview

This library provides:

- **ModuleBundleSpec** — TypeScript types for defining surface contracts (routes, slots, layouts, data recipes)
- **defineModuleBundle** — Runtime validator for bundle specs
- **resolveBundle** — Resolves a bundle spec + context into a ResolvedSurfacePlan
- **resolvePreferenceProfile** — Resolves preferences by scope order (user → … → session)
- **defaultPreferenceAdapter** — Stub `BundlePreferenceAdapter` (resolve + savePreferencePatch)
- **applySurfacePatch** — Applies patch operations to a plan
- **BundleProvider** / **BundleRenderer** — React components for rendering resolved plans
- **RegionRenderer** / **SlotRenderer** — Layout tree and slot content rendering
- **Adapters** — BlockNote, dnd-kit, Floating UI, Motion, resizable-panels, AI SDK (stubs)

## Terminology (Glossary)

- **Bundle spec** / **Surface spec** (ModuleBundleSpec): A contract type defining a surface (routes, slots, layouts). Not an architectural layer. Use "surface spec" in prose to avoid confusion.
- **Bundle** (architectural): A domain package in `packages/bundles/` (e.g. bundle.workspace). Contains business logic.

### Preference vs layout vs view vs overlay

| Concept | Meaning | Storage |
|---------|---------|---------|
| **Preference** | Stable user intent (e.g. `density=dense`, `guidance=hints`). Orthogonal 7-dimension model. | User/workspace/surface scope via `BundlePreferenceAdapter`. |
| **Layout snapshot** | Concrete arrangement (panel sizes, tab order, collapsed state). | Distinct from preferences; use `persistKey` + overlay-engine for durable layout. |
| **View** | Data-shaping projection (filters, sort, visible columns). | Often session-scoped or view-state. |
| **Overlay** | Durable mutation to the rendered contract (patches, field visibility). | `lib.overlay-engine` (OverlaySpec, merger). |

Do not merge these into one blob. Preferences drive adaptation; layout snapshots persist geometry; overlays persist structural patches.

### Preference scope resolution order

Preferences are merged in this order (later overrides earlier):

1. **user** — Global user defaults  
2. **workspace-user** — Workspace-specific user defaults  
3. **bundle** — Bundle-level defaults  
4. **surface** — Surface-specific overrides  
5. **entity** — Entity-context overrides  
6. **session** — Session overrides (highest priority)

### Dimension → runtime behavior (summary)

| Dimension | Runtime effect |
|-----------|----------------|
| **guidance** | Hints, onboarding, progressive disclosure, assistant prompting style |
| **density** | Spacing, panel expansion, table vs card layout, side rails |
| **dataDepth** | Query shape, pagination size, inline expansion, raw payload access |
| **control** | Visible toggles, advanced inspectors, batch ops, policy editor |
| **media** | Text vs visual vs voice surfaces, charts vs prose, TTS |
| **pace** | Animation duration, confirmation depth, skeleton persistence; respects `prefers-reduced-motion` |
| **narrative** | Order of summary vs evidence, top-down vs bottom-up presentation |

Every surface must declare `verification.dimensions` describing how it responds to each dimension. See [docs/verification-matrix.md](./docs/verification-matrix.md) for the verification matrix, review questions, and snapshot coverage.

## Package Strategy

### Hard dependencies

- `@contractspec/lib.contracts-spec` — operations, capabilities, policies, presentations
- `@contractspec/lib.overlay-engine` — typed, auditable overrides
- `@contractspec/lib.observability` — tracing, metrics, lifecycle instrumentation
- `zod` — schema validation

### Interoperability (consumes or composes with)

- `@contractspec/lib.contracts-runtime-client-react` — feature/form rendering
- `@contractspec/lib.presentation-runtime-react` — workflow, list state
- `@contractspec/lib.ai-agent` — agent orchestration (when assistant integration is added)
- `@contractspec/lib.ai-providers` — planner model selection
- `@contractspec/lib.metering` — when AI/chat features are used
- `@contractspec/lib.personalization` — preference dimensions (or surface-runtime-owned until adopted)

### Peer dependencies

- `react`, `react-dom` — optional; required only for React renderer
- UI libs (BlockNote, dnd-kit, Floating UI, Motion, resizable-panels) — optional; added as peers when adapters are implemented

## Usage

```ts
import { defineModuleBundle } from "@contractspec/lib.surface-runtime/spec";
import { resolveBundle } from "@contractspec/lib.surface-runtime/runtime";

const PmWorkbenchBundle = defineModuleBundle({
  meta: { key: "pm.workbench", version: "0.1.0", title: "PM Workbench" },
  routes: [{ routeId: "pm-issue", path: "/operate/pm/issues/:issueId", defaultSurface: "issue-workbench" }],
  surfaces: {
    "issue-workbench": {
      surfaceId: "issue-workbench",
      kind: "workbench",
      title: "Issue Workbench",
      slots: [...],
      layouts: [...],
      data: [],
      verification: { dimensions: { guidance: "...", density: "...", ... } },
    },
  },
});

const plan = await resolveBundle(PmWorkbenchBundle, ctx);
```

## Dependencies

See [Package Strategy](#package-strategy) above. Core: contracts-spec, overlay-engine, observability, zod.

## AI Chat Integration (07_ai_native_chat_and_generative_ui)

The assistant slot can render chat UI from `@contractspec/module.ai-chat`. Wire as follows:

1. **Assistant slot**: Declare a slot with `role: 'assistant'` in the surface spec. Set `SurfaceAiSpec.assistantSlotId` to that slot's `slotId`.

2. **BundleRenderer + assistant slot**: When `SlotRenderer` receives `slotId === assistantSlotId`, the bundle should render `ChatContainer` from `@contractspec/module.ai-chat` instead of default slot content. Pass `useChat` from the same module for thread state.

3. **Provider config**: Use `createProvider` from `@contractspec/lib.ai-providers` to build the model config. Pass it to the planner (ContractSpecAgent) and to the chat UI (useChat options).

4. **Planner integration**: Use `compilePlannerPrompt` and `proposePatchToolConfig` from this package. Wire the propose-patch tool handler to `validatePatchProposal` before returning. Map planner output to `PlannerResponse` (summary, intent, patchProposals, blockDrafts).

5. **Patch approval flow**: On accept, emit `patch.approved` audit event, call `applySurfacePatch`, then promote to session overlay. On reject, emit `patch.rejected`. Use `PatchApprovalHandler` for the callback signature.

## Policy, Audit, and Rollback (10_policy_audit_and_safety)

### Policy hooks

Pass `policy` and `audit` to `resolveBundle` options:

- **evaluateNode**: Return `UiPolicyDecision` (allow/deny/redact) per node. Stub: allow all.
- **redactBinding**: Redact binding values. Stub: pass-through.
- **evaluatePatchProposal**: Return allow/deny/require-approval for patch ops. Stub: allow.

Use `evaluateAndEmitPatchPolicy` before applying patches to gate on policy and emit `policy.denied` when blocked.

### Audit events

Implement `BundleAuditEmitter` and pass to `resolveBundle` and patch approval flow. Events: `surface.resolved`, `patch.proposed`, `patch.approved`, `patch.rejected`, `overlay.saved`, `overlay.applied`, `overlay.failed`, `policy.denied`, `policy.redacted`. Use `emitPatchProposed`, `emitPatchApproved`, etc. from `./runtime`.

### Rollback

`applySurfacePatch` returns `inverseOps` for reversible ops (insert/remove, replace, set-layout, reveal/hide-field). Store `OverlayApprovalMeta` (forwardOps, inverseOps, actorId, approvedAt) with each approved overlay. Use `rollbackSurfacePatches(plan, approvalStack, count)` to revert last N patches.

**Rollback limits**: move-node, resize-panel, set-focus, promote-action require previous state for full inverse; currently return null inverse. Document when storing approval metadata.

## Rollout Status

See [ROLLOUT.md](./ROLLOUT.md) for the phased rollout plan, performance budgets, risks, and pilot route (`/operate/pm/issues/:issueId`).

**Current:** Phase 0–2 complete (scaffold, resolver, renderer). Phase 3–7 pending.

## Adapter Rule (Lint)

**Rule**: No direct third-party UI imports outside `src/adapters/`. BlockNote, dnd-kit, Floating UI, Motion, resizable-panels, AI SDK UI—all must be behind adapter boundaries.

**Enforcement**: Run `bun run lint:adapters` to detect violations. Integrate into CI if desired.

## Phase 2 Status

Types, defineModuleBundle, resolveBundle, applySurfacePatch, BundleProvider, BundleRenderer, RegionRenderer, SlotRenderer, and adapter stubs are implemented. ResolvedSurfacePlan includes layoutRoot for rendering. Motion tokens map pace to duration/entrance. Panel persistence (persistKey) via localStorage. Full BlockNote/dnd-kit/Floating UI integrations deferred to later phases. Planner prompt compiler, propose-patch tool schema, and patch proposal validator added for AI chat integration.

**Observability (09):** Tracing (`traceAsync`), metrics (`resolution_duration_ms`, patch acceptance/rejection, policy denial, surface fallback, missing renderer), structured logging. Golden-context harness for resolver evals with snapshot tests. Performance budget: resolver p95 <100ms (server). See [docs/evals-runbook.md](./docs/evals-runbook.md) and `./telemetry`.

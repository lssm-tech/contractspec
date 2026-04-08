# Implementation Traceability

## Summary

Builder v3 is implemented in hybrid-compatibility form:

- the existing Builder packages remain the primary execution path,
- spec-named compatibility surfaces are added as thin packages where the spec expected explicit boundaries,
- provider/mobile/runtime control-plane logic is extracted so those compatibility surfaces reuse the same implementation path,
- actionable mobile review delivery, export approval/execute controls, and the dedicated mobile review route now share the same Builder command/query surface,
- readiness now enforces receipt completeness, patch proposal completeness, runtime target health, and mobile deep-link fallback expectations instead of relying on looser best-effort checks.

## Spec-to-Code Mapping

| Spec area | Status | Primary code | Verification |
| --- | --- | --- | --- |
| `02_input_sources_and_ingestion.md` chat/voice/file/zip/Studio/channel ingestion | Implemented and wired through end-to-end channel surfaces | `packages/libs/builder-runtime/src/ingestion/*`, `packages/integrations/builder-telegram`, `packages/integrations/builder-whatsapp`, `packages/apps/api-library/src/handlers/builder-webhook-handler.test.ts` | `packages/libs/builder-runtime/src/runtime.test.ts`, `packages/libs/builder-runtime/src/ingestion/zip.test.ts`, `packages/apps/api-library/src/handlers/builder-webhook-handler.test.ts` |
| `03_source_fusion_and_decision_memory.md` fusion, assumptions, conflicts, decision ledger, memory views | Implemented | `packages/libs/builder-runtime/src/fusion/*`, `packages/libs/builder-runtime/src/runtime/workbench-snapshot.ts`, `packages/libs/builder-runtime/src/runtime/snapshot-views.ts` | `packages/libs/builder-runtime/src/fusion/precedence.test.ts`, `packages/libs/builder-runtime/src/runtime.test.ts` |
| `04_core_contracts.md` Builder control-plane contracts | Implemented with stricter receipt and patch validation coverage | `packages/libs/builder-spec`, `packages/libs/provider-spec` | `packages/libs/builder-spec/src/validation/entities.test.ts`, `packages/libs/provider-spec/src/validation.test.ts` |
| `05_authoring_lanes_and_specialized_agents.md` Builder lane selection, execution-pack compilation, explicit next actions | Implemented | `packages/libs/builder-runtime/src/planning/*`, `packages/libs/builder-spec/src/capabilities/index.ts` | `packages/libs/builder-runtime/src/planning/plan-compiler.test.ts`, `packages/libs/builder-runtime/src/routing-policy.test.ts` |
| `06_external_execution_and_provider_routing.md` provider routing, context bundles, receipts, patch proposals, comparisons | Implemented with extracted compatibility layer, offline-provider avoidance, and actionable review-card handoff | `packages/libs/builder-runtime/src/runtime/provider-operations.ts`, `packages/libs/builder-runtime/src/runtime/review-card-operations.ts`, `packages/libs/provider-runtime`, `packages/libs/builder-runtime/src/planning/plan-compiler.ts`, `packages/libs/provider-spec/src/validation.ts` | `packages/libs/builder-runtime/src/routing-policy.test.ts`, `packages/libs/provider-runtime/src/index.test.ts`, `packages/libs/provider-spec/src/validation.test.ts`, `packages/libs/builder-runtime/src/review-card-operations.test.ts`, `packages/libs/builder-runtime/src/planning/plan-compiler.test.ts` |
| `07_mobile_parity_and_omnichannel_control.md` mobile parity, mobile review cards, Telegram/WhatsApp control | Implemented with extracted compatibility layer, thread-reply outbound delivery, dedicated mobile review route, and readiness-aware deep-link fallback checks for messaging review flows | `packages/libs/mobile-control`, `packages/modules/mobile-review`, `packages/libs/builder-runtime/src/runtime/review-card-operations.ts`, `packages/apps/web-landing/src/app/(operate)/operate/builder/workspaces/[workspaceId]/mobile-review/[cardId]/page.tsx`, `packages/integrations/builder-telegram`, `packages/integrations/builder-whatsapp` | `packages/libs/mobile-control/src/index.test.ts`, `packages/modules/mobile-review/src/index.test.tsx`, `packages/apps/api-library/src/handlers/builder-review-card-handler.test.ts`, `packages/apps/web-landing/src/app/(operate)/operate/builder/workspaces/[workspaceId]/mobile-review/[cardId]/page.test.tsx`, `packages/integrations/builder-telegram/src/index.test.ts`, `packages/integrations/builder-whatsapp/src/index.test.ts` |
| `08_runtime_modes_local_vs_managed.md` managed/local/hybrid runtime targeting | Implemented with spec-named wrappers and readiness/plan gating for unhealthy local-hybrid targets | `packages/libs/provider-runtime`, `packages/integrations/runtime-managed`, `packages/integrations/runtime-local`, `packages/integrations/runtime-hybrid`, `packages/libs/builder-runtime/src/readiness/helpers.ts`, `packages/libs/builder-runtime/src/planning/helpers.ts` | `packages/libs/provider-runtime/src/index.test.ts`, `packages/libs/builder-runtime/src/readiness/evaluate.test.ts`, `packages/libs/builder-runtime/src/planning/plan-compiler.test.ts` |
| `09_generation_preview_export.md` preview/export orchestration | Implemented with explicit runtime-mode selection plus export approve/execute flow | `packages/libs/builder-runtime/src/runtime/preview-operations.ts`, `packages/libs/builder-runtime/src/runtime/export-artifacts.ts`, `packages/modules/builder-workbench/src/presentation/components/PreviewWorkspacePanel.tsx` | `packages/libs/builder-runtime/src/runtime.test.ts`, `packages/libs/builder-runtime/src/export-lifecycle.test.ts`, `packages/libs/builder-runtime/src/readiness/evaluate.test.ts`, `packages/modules/builder-workbench/src/presentation/components/actionable-panels.test.tsx` |
| `10_security_and_governance.md` approval gating, trust-aware channel mutation, control-plane authorization | Implemented and exercised end-to-end | `packages/libs/builder-runtime/src/runtime/policy.ts`, `packages/libs/builder-runtime/src/runtime/channel-operations.ts`, `packages/apps/api-library/src/handlers/builder-control-plane-handler.ts` | `packages/libs/builder-runtime/src/runtime.test.ts`, `packages/apps/api-library/src/handlers/builder-control-plane-handler.test.ts` |
| `11_harness_and_readiness_gates.md` readiness suites and export blocking | Implemented and hardened with stricter receipt completeness, patch proposal completeness, deterministic export, and runtime-health gating | `packages/libs/builder-runtime/src/readiness/evaluate.ts`, `packages/libs/builder-runtime/src/readiness/suites.ts`, `packages/libs/builder-runtime/src/readiness/helpers.ts`, `packages/libs/builder-runtime/src/runtime/preview-operations.ts`, `packages/libs/provider-spec/src/validation.ts` | `packages/libs/builder-runtime/src/readiness/evaluate.test.ts`, `packages/libs/provider-spec/src/validation.test.ts` |
| `12_package_strategy.md` spec-named package boundaries | Implemented in hybrid compatibility form | `packages/libs/provider-runtime`, `packages/libs/mobile-control`, `packages/modules/mobile-review`, spec-named integration wrappers under `packages/integrations/*` | package typechecks and export coverage for new packages |
| `13_ui_surfaces_and_flows.md` cockpit/provider/runtime/mobile/readiness surfaces | Implemented and wired through API/web operate flow with actionable panels | `packages/modules/builder-workbench`, `packages/modules/mobile-review`, `packages/apps/web-landing/src/app/(operate)/operate/builder/workspaces/[workspaceId]/BuilderWorkbenchClient.tsx`, `packages/apps/web-landing/src/app/(operate)/operate/builder/workspaces/[workspaceId]/builder-workbench-controller.ts`, `packages/apps/web-landing/src/app/api/operate/builder/[...path]/route.ts` | `packages/modules/builder-workbench/src/core/workbench-state.test.ts`, `packages/modules/builder-workbench/src/presentation/components/actionable-panels.test.tsx`, `packages/apps/web-landing/src/app/(operate)/operate/builder/workspaces/[workspaceId]/builder-workbench-controller.test.ts`, `packages/apps/web-landing/src/app/api/operate/builder/[...path]/route.test.ts`, package typechecks |

## Compatibility Packages Added

- `@contractspec/lib.provider-runtime`
- `@contractspec/lib.mobile-control`
- `@contractspec/module.mobile-review`
- `@contractspec/integration.runtime.managed`
- `@contractspec/integration.runtime.local`
- `@contractspec/integration.runtime.hybrid`
- `@contractspec/integration.provider.codex`
- `@contractspec/integration.provider.claude-code`
- `@contractspec/integration.provider.gemini`
- `@contractspec/integration.provider.copilot`
- `@contractspec/integration.provider.stt`
- `@contractspec/integration.provider.local-model`

## Runtime Decomposition

The oversized Builder runtime was decomposed so the public `BuilderRuntimeService` dispatches into focused modules:

- `runtime/workspace-operations.ts`
- `runtime/conversation-operations.ts`
- `runtime/binding-operations.ts`
- `runtime/source-operations.ts`
- `runtime/authoring-operations.ts`
- `runtime/plan-operations.ts`
- `runtime/channel-operations.ts`
- `runtime/provider-operations.ts`
- `runtime/preview-operations.ts`
- `runtime/query-operations.ts`

This keeps command/query keys unchanged while making provider/mobile/runtime behavior reusable across the new compatibility packages.

## App Surfaces

- `packages/apps/api-library` mounts the generic Builder command/query handler and Builder webhook routing on top of the shared runtime resources.
- `packages/apps/api-library` also provides the Builder review-card outbound bridge, including absolute mobile review deep links when a public web base URL is configured.
- `packages/apps/web-landing` exposes the Builder operate proxy, workspace route, and dedicated mobile review route, with the reusable workbench issuing Builder control-plane commands through the generic API.

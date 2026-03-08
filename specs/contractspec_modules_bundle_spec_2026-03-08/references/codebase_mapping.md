# Codebase Mapping

Maps spec concepts to actual ContractSpec packages and files.

| Spec Concept | Package | Path / Key Exports |
|--------------|---------|--------------------|
| ModuleBundleSpec, defineModuleBundle | lib.surface-runtime (to create) | `packages/libs/surface-runtime` |
| FeatureModuleSpec, defineFeature | lib.contracts-spec | `packages/libs/contracts-spec`, `defineFeature` |
| OverlaySpec, overlay merge | lib.overlay-engine | `packages/libs/overlay-engine`, merger, runtime, signer |
| ContractSpecAgent, AgentSpec | lib.ai-agent | `packages/libs/ai-agent`, ContractSpecAgent, defineAgent |
| createProvider, model selector | lib.ai-providers | `packages/libs/ai-providers`, createProvider, getAvailableProviders |
| Chat UI, useChat, ChatContainer | module.ai-chat | `packages/modules/ai-chat`, useChat, ChatContainer |
| BehaviorEvent, tracker | lib.personalization | `packages/libs/personalization` (no PreferenceDimensions yet) |
| PreferenceDimensions (7-dim) | references/current_specs | `01_preference_dimensions.md` (documented, not in lib.personalization) |
| Tracing, metrics, logger | lib.observability | `packages/libs/observability` |
| Feature/form rendering | lib.contracts-runtime-client-react | `packages/libs/contracts-runtime-client-react`, renderFeaturePresentation |
| Workflow, list state | lib.presentation-runtime-react | `packages/libs/presentation-runtime-react`, useWorkflow |
| Metering | lib.metering | `packages/libs/metering` |
| Pilot route | bundle.workspace | `packages/bundles/workspace` (or bundle.library) |

## Notes

- **Pilot bundle:** Use `bundle.workspace` or `bundle.library`; do not assume `contractspec-studio` or `lib.contracts-contractspec-studio` exist.
- **BundleRenderer:** Compose or wrap `renderFeaturePresentation` from contracts-runtime-client-react; or define a separate render path for bundle surfaces.
- **Surface runtime adapters:** BlockNote, dnd-kit, Floating UI, Motion, resizable-panels — live in `lib.surface-runtime/src/adapters/` (or document if they live in integrations).

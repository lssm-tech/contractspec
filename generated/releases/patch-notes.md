# Patch Notes



### Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.
- Slug: builder-next-wave-hardening
- Date: 2026-04-10
- Breaking: no
- @contractspec/lib.builder-spec@0.1.0 (minor)
- @contractspec/lib.builder-runtime@0.1.0 (minor)
- @contractspec/lib.mobile-control@0.1.0 (minor)
- @contractspec/lib.provider-runtime@0.1.0 (minor)
- @contractspec/module.builder-workbench@0.1.0 (minor)
- @contractspec/module.mobile-review@0.1.0 (minor)
- @contractspec/integration.runtime.local@0.1.0 (minor)
- @contractspec/integration.provider.gemini@0.1.0 (minor)
- @contractspec/app.cli-contractspec@4.3.0 (minor)
- @contractspec/bundle.library@3.8.10 (patch)

### Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Slug: builder-v3-control-plane-rollout
- Date: 2026-04-10
- Breaking: no
- @contractspec/lib.contracts-spec@5.1.0 (patch)
- @contractspec/lib.builder-spec@0.1.0 (minor)
- @contractspec/lib.provider-spec@0.1.0 (minor)
- @contractspec/lib.builder-runtime@0.1.0 (minor)
- @contractspec/lib.mobile-control@0.1.0 (minor)
- @contractspec/lib.provider-runtime@0.1.0 (minor)
- @contractspec/module.builder-workbench@0.1.0 (minor)
- @contractspec/module.mobile-review@0.1.0 (minor)
- @contractspec/integration.runtime@3.8.9 (minor)
- @contractspec/integration.runtime.managed@0.1.0 (minor)
- @contractspec/integration.runtime.local@0.1.0 (minor)
- @contractspec/integration.runtime.hybrid@0.1.0 (minor)
- @contractspec/integration.builder-telegram@0.1.0 (minor)
- @contractspec/integration.builder-voice@0.1.0 (minor)
- @contractspec/integration.builder-whatsapp@0.1.0 (minor)
- @contractspec/integration.provider.codex@0.1.0 (minor)
- @contractspec/integration.provider.claude-code@0.1.0 (minor)
- @contractspec/integration.provider.gemini@0.1.0 (minor)
- @contractspec/integration.provider.copilot@0.1.0 (minor)
- @contractspec/integration.provider.stt@0.1.0 (minor)
- @contractspec/integration.provider.local-model@0.1.0 (minor)

### Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
- Slug: connect-spec-alignment-april-2026
- Date: 2026-04-10
- Breaking: no
- @contractspec/lib.contracts-spec@5.1.0 (minor)
- @contractspec/bundle.workspace@4.2.0 (minor)
- @contractspec/app.cli-contractspec@4.3.0 (minor)
- @contractspec/bundle.library@3.8.10 (patch)
- agentpacks@1.7.13 (minor)

### Expand the spec-pack docs into a fuller learning path across the public docs site.
- Slug: docs-learning-path-spec-packs
- Date: 2026-04-10
- Breaking: no
- @contractspec/bundle.library@3.8.10 (patch)
- @contractspec/app.web-landing (patch)

### Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Slug: early-cats-tap
- Date: 2026-03-27
- Breaking: no
- Deprecations:
  - Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.

### Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
- Slug: fresh-toes-build
- Date: 2026-04-10
- Breaking: no
- @contractspec/tool.bun@3.7.13 (patch)
- @contractspec/bundle.marketing@3.8.10 (patch)
- @contractspec/lib.accessibility@3.7.16 (patch)
- @contractspec/lib.contracts-runtime-client-react@3.8.5 (patch)
- @contractspec/lib.design-system@3.8.10 (patch)
- @contractspec/lib.example-shared-ui@6.0.17 (patch)
- @contractspec/lib.presentation-runtime-react@36.0.5 (patch)
- @contractspec/lib.surface-runtime@0.5.17 (patch)
- @contractspec/lib.ui-kit@3.8.9 (patch)
- @contractspec/lib.ui-kit-web@3.9.9 (patch)
- @contractspec/lib.ui-link@3.7.13 (patch)
- @contractspec/lib.video-gen@2.7.17 (patch)
- @contractspec/module.builder-workbench@0.1.0 (patch)
- @contractspec/module.examples@3.8.9 (patch)
- @contractspec/module.execution-console@0.1.0 (patch)
- @contractspec/module.mobile-review@0.1.0 (patch)

### Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
- Slug: versioning-release-system
- Date: 2026-03-27
- Breaking: no
- @contractspec/lib.contracts-spec@5.1.0 (minor)
- @contractspec/bundle.workspace@4.2.0 (minor)
- @contractspec/app.cli-contractspec@4.3.0 (minor)
- @contractspec/app.web-landing (patch)
- Deprecations:
  - The standalone release domain under `@contractspec/lib.contracts-spec/release` is deprecated in favor of versioning-owned release metadata.
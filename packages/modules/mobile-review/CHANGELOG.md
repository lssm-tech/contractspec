# @contractspec/module.mobile-review

## 0.2.1

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.ui-kit-web@3.10.0
  - @contractspec/lib.builder-spec@0.2.1
  - @contractspec/module.builder-workbench@0.2.1

## 0.2.0

### Minor Changes

- Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.
  - Packages: @contractspec/lib.builder-spec (minor), @contractspec/lib.builder-runtime (minor), @contractspec/lib.mobile-control (minor), @contractspec/lib.provider-runtime (minor), @contractspec/module.builder-workbench (minor), @contractspec/module.mobile-review (minor), @contractspec/integration.runtime.local (minor), @contractspec/integration.provider.gemini (minor), @contractspec/app.cli-contractspec (minor), @contractspec/bundle.library (patch)
- Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
  - Packages: @contractspec/lib.contracts-spec (patch), @contractspec/lib.builder-spec (minor), @contractspec/lib.provider-spec (minor), @contractspec/lib.builder-runtime (minor), @contractspec/lib.mobile-control (minor), @contractspec/lib.provider-runtime (minor), @contractspec/module.builder-workbench (minor), @contractspec/module.mobile-review (minor), @contractspec/integration.runtime (minor), @contractspec/integration.runtime.managed (minor), @contractspec/integration.runtime.local (minor), @contractspec/integration.runtime.hybrid (minor), @contractspec/integration.builder-telegram (minor), @contractspec/integration.builder-voice (minor), @contractspec/integration.builder-whatsapp (minor), @contractspec/integration.provider.codex (minor), @contractspec/integration.provider.claude-code (minor), @contractspec/integration.provider.gemini (minor), @contractspec/integration.provider.copilot (minor), @contractspec/integration.provider.stt (minor), @contractspec/integration.provider.local-model (minor)

### Patch Changes

- Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - Packages: @contractspec/tool.bun (patch), @contractspec/bundle.marketing (patch), @contractspec/lib.accessibility (patch), @contractspec/lib.contracts-runtime-client-react (patch), @contractspec/lib.design-system (patch), @contractspec/lib.example-shared-ui (patch), @contractspec/lib.presentation-runtime-react (patch), @contractspec/lib.surface-runtime (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-link (patch), @contractspec/lib.video-gen (patch), @contractspec/module.builder-workbench (patch), @contractspec/module.examples (patch), @contractspec/module.execution-console (patch), @contractspec/module.mobile-review (patch)
  - Migration: Pull the patch releases for the affected Contractspec React/browser packages.
- Updated dependencies because of Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - @contractspec/lib.builder-spec@0.2.0
  - @contractspec/module.builder-workbench@0.2.0
  - @contractspec/lib.ui-kit-web@3.9.10

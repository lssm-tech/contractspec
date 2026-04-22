# @contractspec/module.builder-workbench

## 0.2.7

### Patch Changes

- Add a unified design-system Tabs primitive and migrate local tab consumers away from ui-kit leaf imports.
  - Packages: @contractspec/lib.design-system (minor), @contractspec/example.agent-console (patch), @contractspec/example.crm-pipeline (patch), @contractspec/example.data-grid-showcase (patch), @contractspec/module.builder-workbench (patch), @contractspec/module.execution-console (patch)
  - Migration: Consumers should import tabs from `@contractspec/lib.design-system` instead of lower-level UI-kit tab modules.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- Updated dependencies because of Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
- Updated dependencies because of Harden published cross-platform UI packages around precise public subpath imports and closed native dist graphs.
- Updated dependencies because of Use shared stack layout primitives in the web pagination component while preserving semantic pagination markup.
- Updated dependencies because of Add a unified design-system Tabs primitive and migrate local tab consumers away from ui-kit leaf imports.
  - @contractspec/lib.builder-runtime@0.2.5
  - @contractspec/lib.builder-spec@0.2.5
  - @contractspec/lib.provider-spec@0.2.3
  - @contractspec/lib.ui-kit-web@3.12.0
  - @contractspec/lib.design-system@4.0.0
  - @contractspec/lib.contracts-spec@5.6.0
  - @contractspec/module.ai-chat@4.3.25

## 0.2.6

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
- Updated dependencies because of Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
  - @contractspec/lib.builder-runtime@0.2.4
  - @contractspec/lib.builder-spec@0.2.4
  - @contractspec/lib.provider-spec@0.2.2
  - @contractspec/module.ai-chat@4.3.24
  - @contractspec/lib.contracts-spec@5.5.1
  - @contractspec/lib.ui-kit-web@3.11.1

## 0.2.5

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
  - @contractspec/module.ai-chat@4.3.23
  - @contractspec/lib.ui-kit-web@3.11.0
  - @contractspec/lib.builder-runtime@0.2.3
  - @contractspec/lib.builder-spec@0.2.3
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.provider-spec@0.2.1

## 0.2.4

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.builder-runtime@0.2.3
  - @contractspec/lib.builder-spec@0.2.3
  - @contractspec/lib.provider-spec@0.2.1
  - @contractspec/module.ai-chat@4.3.22
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.ui-kit-web@3.10.3

## 0.2.3

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/lib.ui-kit-web@3.10.2
  - @contractspec/module.ai-chat@4.3.21

## 0.2.2

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
  - @contractspec/lib.builder-runtime@0.2.2
  - @contractspec/lib.builder-spec@0.2.2
  - @contractspec/module.ai-chat@4.3.20
  - @contractspec/lib.ui-kit-web@3.10.1

## 0.2.1

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.ui-kit-web@3.10.0
  - @contractspec/lib.builder-spec@0.2.1
  - @contractspec/module.ai-chat@4.3.19
  - @contractspec/lib.builder-runtime@0.2.1

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
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - @contractspec/module.ai-chat@4.3.18
  - @contractspec/lib.builder-spec@0.2.0
  - @contractspec/lib.builder-runtime@0.2.0
  - @contractspec/lib.provider-spec@0.2.0
  - @contractspec/lib.ui-kit-web@3.9.10

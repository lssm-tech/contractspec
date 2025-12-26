# Changelog

## 1.42.5

### Patch Changes

- 1299719: fix vscode
- Updated dependencies [1299719]
  - @lssm/bundle.contractspec-workspace@1.42.5
  - @lssm/module.contractspec-workspace@1.42.5
  - @lssm/module.contractspec-examples@1.42.5
  - @lssm/lib.contracts-transformers@1.42.5
  - @lssm/lib.contracts@1.42.5

## 1.42.4

### Patch Changes

- ac28b99: fix: generate from openapi
- Updated dependencies [ac28b99]
  - @lssm/bundle.contractspec-workspace@1.42.4
  - @lssm/module.contractspec-workspace@1.42.4
  - @lssm/module.contractspec-examples@1.42.4
  - @lssm/lib.contracts-transformers@1.42.4
  - @lssm/lib.contracts@1.42.4

## 1.42.3

### Patch Changes

- 3f5d015: fix(tooling): cicd
- Updated dependencies [3f5d015]
  - @lssm/lib.contracts-transformers@1.42.3
  - @lssm/bundle.contractspec-workspace@1.42.3
  - @lssm/lib.contracts@1.42.3
  - @lssm/module.contractspec-examples@1.42.3
  - @lssm/module.contractspec-workspace@1.42.3

## 1.42.2

### Patch Changes

- 1f9ac4c: fix
- Updated dependencies [1f9ac4c]
  - @lssm/bundle.contractspec-workspace@1.42.2
  - @lssm/lib.contracts@1.42.2
  - @lssm/lib.contracts-transformers@1.42.2
  - @lssm/module.contractspec-examples@1.42.2
  - @lssm/module.contractspec-workspace@1.42.2

## 1.42.1

### Patch Changes

- f043995: Fix release
- Updated dependencies [f043995]
  - @lssm/bundle.contractspec-workspace@1.42.1
  - @lssm/module.contractspec-workspace@1.42.1
  - @lssm/module.contractspec-examples@1.42.1
  - @lssm/lib.contracts-transformers@1.42.1
  - @lssm/lib.contracts@1.42.1

## 1.42.0

### Minor Changes

- 8eefd9c: initial release

### Patch Changes

- Updated dependencies [8eefd9c]
  - @lssm/bundle.contractspec-workspace@1.42.0
  - @lssm/lib.contracts@1.42.0
  - @lssm/lib.contracts-transformers@1.42.0
  - @lssm/module.contractspec-examples@1.42.0
  - @lssm/module.contractspec-workspace@1.42.0

All notable changes to the ContractSpec VS Code extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - Unreleased

### Added

- **Validation Commands**
  - `ContractSpec: Validate Current Spec` - Validate the currently open spec file
  - `ContractSpec: Validate All Specs in Workspace` - Validate all spec files in the workspace

- **Build/Scaffold Commands**
  - `ContractSpec: Build/Scaffold from Current Spec` - Generate handler/component skeletons from specs

- **Navigation Commands**
  - `ContractSpec: List All Specs` - Show all specs in the workspace with quick navigation
  - `ContractSpec: Analyze Spec Dependencies` - Visualize spec dependencies and detect cycles
  - `ContractSpec: Search ContractSpec Docs (MCP)` - Search documentation via MCP

- **Real-time Diagnostics**
  - Automatic validation on file open (configurable)
  - Automatic validation on file save (configurable)
  - Inline error and warning markers

- **Code Snippets**
  - `contractspec-command` - Create a new command spec
  - `contractspec-query` - Create a new query spec
  - `contractspec-event` - Create a new event spec
  - `contractspec-docblock` - Create a new DocBlock
  - `contractspec-telemetry` - Create a new TelemetrySpec
  - `contractspec-presentation` - Create a new Presentation spec

- **Telemetry**
  - Hybrid telemetry model (direct PostHog or via API)
  - Respects VS Code telemetry settings
  - No PII collection

- **Configuration Options**
  - `contractspec.api.baseUrl` - Base URL for ContractSpec API
  - `contractspec.telemetry.posthogHost` - PostHog host URL
  - `contractspec.telemetry.posthogProjectKey` - PostHog project key
  - `contractspec.validation.onSave` - Toggle validation on save
  - `contractspec.validation.onOpen` - Toggle validation on open

### Technical

- Uses `@lssm/bundle.contractspec-workspace` for workspace services
- Uses `@lssm/module.contractspec-workspace` for analysis and templates
- Works without requiring CLI installation
- Bundled with esbuild for fast load times

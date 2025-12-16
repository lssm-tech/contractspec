# Changelog

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









# ContractSpec VS Code Extension

The ContractSpec VS Code extension provides spec-first development tooling directly in your editor.

## Features

- **Real-time Validation**: Get instant feedback on spec errors and warnings as you save files
- **Build/Scaffold**: Generate handler and component skeletons from specs (no AI required)
- **Spec Explorer**: List and navigate all specs in your workspace
- **Dependency Analysis**: Visualize spec dependencies and detect cycles
- **MCP Integration**: Search ContractSpec documentation via Model Context Protocol
- **Snippets**: Code snippets for common ContractSpec patterns

## Commands

| Command | Description |
|---------|-------------|
| `ContractSpec: Validate Current Spec` | Validate the currently open spec file |
| `ContractSpec: Validate All Specs` | Validate all spec files in the workspace |
| `ContractSpec: Build/Scaffold` | Generate handler/component from the current spec |
| `ContractSpec: List All Specs` | Show all specs in the workspace |
| `ContractSpec: Analyze Dependencies` | Analyze and visualize spec dependencies |
| `ContractSpec: Search Docs (MCP)` | Search documentation via MCP |

## Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| `contractspec.api.baseUrl` | Base URL for ContractSpec API (enables MCP + remote telemetry) | `""` |
| `contractspec.telemetry.posthogHost` | PostHog host URL for direct telemetry | `"https://eu.posthog.com"` |
| `contractspec.telemetry.posthogProjectKey` | PostHog project key for direct telemetry | `""` |
| `contractspec.validation.onSave` | Run validation on save | `true` |
| `contractspec.validation.onOpen` | Run validation on open | `true` |

## Architecture

The extension uses:
- `@contractspec/module.workspace` for pure analysis + templates
- `@contractspec/bundle.workspace` for workspace services + adapters

This allows the extension to work without requiring the CLI to be installed.

## Telemetry

The extension uses a hybrid telemetry approach:
1. If `contractspec.api.baseUrl` is configured → send to API `/api/telemetry/ingest`
2. Otherwise → send directly to PostHog (if project key configured)

Telemetry respects VS Code's telemetry settings. No file paths, source code, or PII is collected.

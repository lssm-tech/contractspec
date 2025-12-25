# ContractSpec VS Code Extension

Website: https://contractspec.lssm.tech/


[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/lssm.vscode-contractspec?label=VS%20Code%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=lssm.vscode-contractspec)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/lssm.vscode-contractspec?label=Installs&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=lssm.vscode-contractspec)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Spec-first development for AI-written software.** Validate, scaffold, and explore your contract specifications directly in VS Code.

ContractSpec is the deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable. This extension brings that power directly into your editor.

![ContractSpec Extension](https://raw.githubusercontent.com/lssm-tech/contractspec/refs/heads/main/packages/apps/vscode-contractspec/assets/icon.png)

## Features

### Core Functionality

- **Real-time Validation**: Get instant feedback on spec errors and warnings as you type
- **Build/Scaffold**: Generate handler and component skeletons from your specs
- **Create Wizard**: Interactive spec creation with guided prompts
- **Watch Mode**: Auto-rebuild/validate specs on changes
- **Sync All Specs**: Build all specs in workspace with one command
- **Clean Generated Files**: Remove generated artifacts with dry-run preview

### Visual Navigation

- **Specs Explorer**: Browse all specs organized by type in the sidebar
- **Dependencies View**: Visualize spec relationships and detect circular dependencies
- **Build Results**: Track build history and access generated files

### Comparison & Export

- **Compare Specs**: Semantic and text diff between specs
- **Git Comparison**: Compare specs with git baseline
- **OpenAPI Export**: Generate OpenAPI 3.1 specifications

### Onboarding & Help

- **Interactive Walkthroughs**: Guided tours for new users
- **Context Menus**: Right-click actions in explorer and editor
- **MCP Integration**: Search ContractSpec documentation
- **Status Bar**: Real-time watch mode and validation indicators

## Commands

### Spec Management

| Command                                          | Description                                      |
| ------------------------------------------------ | ------------------------------------------------ |
| `ContractSpec: Create New Spec`                  | Interactive wizard to create specs               |
| `ContractSpec: Validate Current Spec`            | Validate the currently open spec file            |
| `ContractSpec: Validate All Specs in Workspace`  | Validate all spec files in the workspace         |
| `ContractSpec: Build/Scaffold from Current Spec` | Generate handler/component from the current spec |
| `ContractSpec: List All Specs`                   | Show all specs in the workspace                  |

### Build & Sync

| Command                               | Description                      |
| ------------------------------------- | -------------------------------- |
| `ContractSpec: Toggle Watch Mode`     | Auto-rebuild/validate on changes |
| `ContractSpec: Sync All Specs`        | Build all specs in workspace     |
| `ContractSpec: Clean Generated Files` | Remove generated artifacts       |

### Analysis & Comparison

| Command                                   | Description                             |
| ----------------------------------------- | --------------------------------------- |
| `ContractSpec: Analyze Spec Dependencies` | Analyze and visualize spec dependencies |
| `ContractSpec: Compare Specs`             | Compare two specs (semantic or text)    |
| `ContractSpec: Compare with Git Version`  | Compare spec with git baseline          |
| `ContractSpec: Export to OpenAPI`         | Generate OpenAPI specification          |

### Registry & Examples

| Command                                        | Description                     |
| ---------------------------------------------- | ------------------------------- |
| `ContractSpec: Browse Registry`                | Browse public spec registry     |
| `ContractSpec: Add from Registry`              | Install spec from registry      |
| `ContractSpec: Search Registry`                | Search registry specs           |
| `ContractSpec: Browse Examples`                | Browse example specs            |
| `ContractSpec: Initialize Example`             | Initialize example in workspace |
| `ContractSpec: Search ContractSpec Docs (MCP)` | Search documentation via MCP    |

## Sidebar Views

The extension adds a ContractSpec activity bar with three views:

### Specs Explorer

- Browse all specs organized by type
- Shows name, version, and stability
- Click to open, right-click for actions
- Inline validate and build buttons

### Dependencies

- Visualize spec relationships
- Detect circular dependencies
- Navigate to referenced specs
- Expandable dependency tree

### Build Results

- Track build history (last 20)
- Success/failure indicators
- Click to open generated files
- Clear history button

## Configuration

| Setting                                    | Description                                                    | Default                                     |
| ------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------- |
| `contractspec.api.baseUrl`                 | Base URL for ContractSpec API (enables MCP + remote telemetry) | `""`                                        |
| `contractspec.telemetry.posthogHost`       | PostHog host URL for direct telemetry                          | `"https://eu.posthog.com"`                  |
| `contractspec.telemetry.posthogProjectKey` | PostHog project key for direct telemetry                       | `""`                                        |
| `contractspec.validation.onSave`           | Run validation on save                                         | `true`                                      |
| `contractspec.validation.onOpen`           | Run validation on open                                         | `true`                                      |
| `contractspec.registry.baseUrl`            | Registry URL for browsing specs                                | `"https://registry.contractspec.lssm.tech"` |

## Getting Started

1. **Install the extension**
2. **Open a workspace** with ContractSpec files (or create one)
3. **Start the walkthrough**: Help → Welcome → ContractSpec
4. **Create your first spec**: Click the **+** in Specs Explorer or run `ContractSpec: Create New Spec`
5. **Build from it**: Click the **🔨** icon in the editor title bar

## Context Menu Actions

Right-click on spec files:

- **In Explorer**: Validate, Build, Compare
- **In Editor**: Validate, Build
- **Editor Title Bar**: Icons for quick validate/build

## Telemetry

The extension collects anonymous usage telemetry to help improve the product. Telemetry respects VS Code's telemetry settings - if you've disabled telemetry in VS Code, no data will be collected.

Data collected includes:

- Extension activation
- Command usage (which commands are run)
- MCP calls (which endpoints are used)

No file paths, source code, or personally identifiable information is collected.

## License

MIT

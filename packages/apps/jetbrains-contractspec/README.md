# ContractSpec JetBrains Plugin

Website: https://contractspec.lssm.tech/


[![JetBrains Plugin Repository](https://img.shields.io/jetbrains/plugin/v/PLUGIN_ID?label=JetBrains%20Plugin&logo=jetbrains)](https://plugins.jetbrains.com/plugin/PLUGIN_ID)
[![Downloads](https://img.shields.io/jetbrains/plugin/d/PLUGIN_ID?label=Downloads&logo=jetbrains)](https://plugins.jetbrains.com/plugin/PLUGIN_ID)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Spec-first development for AI-written software.** Validate, scaffold, and explore your contract specifications directly in WebStorm and IntelliJ IDEA.

ContractSpec is the deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable. This plugin brings that power directly into your JetBrains IDE.

![ContractSpec Plugin](assets/icon.png)

## Features

### Core Functionality

- **Real-time Validation**: Get instant feedback on spec errors and warnings as you type
- **Build/Scaffold**: Generate handler and component skeletons from your specs
- **Create Wizard**: Interactive spec creation with guided prompts
- **Watch Mode**: Auto-rebuild/validate specs on changes
- **Sync All Specs**: Build all specs in workspace with one command
- **Clean Generated Files**: Remove generated artifacts with dry-run preview

### Visual Navigation

- **Specs Explorer**: Browse all specs organized by type in the tool window
- **Dependencies View**: Visualize spec relationships and detect circular dependencies
- **Build Results**: Track build history and access generated files
- **Features View**: Explore features and their associated specs
- **Integrity Analysis**: Validate contract integrity and detect orphaned specs

### Comparison & Export

- **Compare Specs**: Semantic and text diff between specs
- **Git Comparison**: Compare specs with git baseline
- **OpenAPI Export**: Generate OpenAPI 3.1 specifications
- **LLM Export**: Export specs for AI assistants

### Onboarding & Help

- **Interactive Setup**: Guided setup wizard for new projects
- **Context Menus**: Right-click actions in project view and editor
- **MCP Integration**: Search ContractSpec documentation
- **Status Bar**: Real-time watch mode and validation indicators
- **Health Checks**: Run diagnostics and health checks

## Commands

### Spec Management

| Command                                          | Description                                      | Shortcut |
| ------------------------------------------------ | ------------------------------------------------ | ------- |
| `ContractSpec: Validate Current Spec`            | Validate the currently open spec file            |         |
| `ContractSpec: Validate All Specs in Workspace`  | Validate all spec files in the workspace         |         |
| `ContractSpec: Build/Scaffold from Current Spec` | Generate handler/component from the current spec |         |
| `ContractSpec: List All Specs`                   | Show all specs in the workspace                  |         |

### Build & Sync

| Command                               | Description                      | Shortcut |
| ------------------------------------- | -------------------------------- | ------- |
| `ContractSpec: Toggle Watch Mode`     | Auto-rebuild/validate on changes |         |
| `ContractSpec: Sync All Specs`        | Build all specs in workspace     |         |
| `ContractSpec: Clean Generated Files` | Remove generated artifacts       |         |

### Analysis & Comparison

| Command                                   | Description                             | Shortcut |
| ----------------------------------------- | --------------------------------------- | ------- |
| `ContractSpec: Analyze Spec Dependencies` | Analyze and visualize spec dependencies |         |
| `ContractSpec: Compare Specs`             | Compare two specs (semantic or text)    |         |
| `ContractSpec: Compare with Git Version`  | Compare spec with git baseline          |         |
| `ContractSpec: Export to OpenAPI`         | Generate OpenAPI specification          |         |

### Registry & Examples

| Command                                        | Description                     | Shortcut |
| ---------------------------------------------- | ------------------------------- | ------- |
| `ContractSpec: Browse Registry`                | Browse public spec registry     |         |
| `ContractSpec: Add from Registry`              | Install spec from registry      |         |
| `ContractSpec: Search Registry`                | Search registry specs           |         |
| `ContractSpec: Browse Examples`                | Browse example specs            |         |
| `ContractSpec: Initialize Example`             | Initialize example in workspace |         |
| `ContractSpec: Search ContractSpec Docs (MCP)` | Search documentation via MCP    |         |

### AI & LLM Tools

| Command                                        | Description                     | Shortcut |
| ---------------------------------------------- | ------------------------------- | ------- |
| `ContractSpec: Export to LLM`                  | Export spec for AI assistant    |         |
| `ContractSpec: Generate Implementation Guide`  | Generate implementation guide    |         |
| `ContractSpec: Verify Implementation`          | Verify implementation against spec |         |

### Project Management

| Command                                        | Description                     | Shortcut |
| ---------------------------------------------- | ------------------------------- | ------- |
| `ContractSpec: Setup ContractSpec`             | Run setup wizard                |         |
| `ContractSpec: Quick Setup`                    | Quick setup with defaults       |         |
| `ContractSpec: Run Health Check (Doctor)`      | Run diagnostics and checks      |         |
| `ContractSpec: Show Workspace Info`            | Display workspace information   |         |

## Tool Windows

The plugin adds two tool windows:

### Main ContractSpec Tool Window

Contains tabbed views for comprehensive ContractSpec management:

### Specs Explorer

### Specs Explorer

- Browse all specs organized by type, package, namespace, owner, tag, or stability
- Shows name, version, and stability level
- Click to open, right-click for actions
- Inline validate and build buttons
- Grouping mode selector

### Dependencies

- Visualize spec relationships as a tree
- Detect circular dependencies
- Expandable dependency tree
- Navigate to referenced specs

### Build Results

- Track build history (last 20 builds)
- Success/failure indicators with timestamps
- Click to open generated files
- Clear history button

### Features

- Explore features and their associated specs
- Show feature descriptions and metadata
- Navigate to feature definitions

### Integrity Analysis

- Validate contract integrity
- Detect orphaned specs (not linked to features)
- Show unresolved references
- Link orphaned specs to features

### LLM Tools

- Export specs in formats suitable for AI assistants
- Generate implementation guides
- Verify implementations against specs
- Copy spec content for LLM context

### Standalone Features Tool Window

A dedicated tool window for exploring feature-to-spec relationships:

- Browse all features in the workspace
- See which specs (operations, events, presentations) belong to each feature
- Navigate directly to feature definitions
- Refresh feature analysis

## Configuration

Access settings via `Settings → Tools → ContractSpec`:

| Setting                                    | Description                                                    | Default                                     |
| ------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------- |
| `API Base URL`                             | Base URL for ContractSpec API (enables MCP + remote telemetry) | `""`                                        |
| `PostHog Host`                             | PostHog host URL for direct telemetry                          | `"https://eu.posthog.com"`                  |
| `PostHog Project Key`                      | PostHog project key for direct telemetry                       | `""`                                        |
| `Validate on Save`                         | Run validation automatically when saving spec files           | `true`                                      |
| `Validate on Open`                         | Run validation automatically when opening spec files          | `true`                                      |
| `Registry Base URL`                        | Registry URL for browsing specs                                | `"https://registry.contractspec.lssm.tech"` |
| `Specs Grouping Mode`                      | How to group specs in the explorer                             | `"type"`                                    |

## Getting Started

1. **Install the plugin** from JetBrains Marketplace
2. **Open a project** with ContractSpec files (or create one)
3. **Run setup**: Tools → ContractSpec → Setup ContractSpec
4. **Create your first spec**: ContractSpec Tool Window → Specs Explorer → + button
5. **Build from it**: Right-click spec file → ContractSpec → Build/Scaffold

## Context Menu Actions

Right-click on spec files:

- **In Project View**: Validate, Build, Compare
- **In Editor**: Validate, Build
- **Editor Title Bar**: Icons for quick validate/build

## Live Templates

The plugin includes live templates for common ContractSpec patterns:

- `contractspec-command` - Create a new command spec
- `contractspec-query` - Create a new query spec
- `contractspec-event` - Create a new event spec
- `contractspec-presentation` - Create a new presentation spec
- `contractspec-docblock` - Create documentation blocks
- `contractspec-telemetry` - Create telemetry specifications

## Telemetry

The plugin collects anonymous usage telemetry to help improve the product. Telemetry respects your IDE's privacy settings - if you've disabled data sharing in your JetBrains IDE, no data will be collected.

Data collected includes:

- Plugin activation and usage
- Command usage (which commands are run)
- MCP calls (which endpoints are used)
- Error reporting for debugging

No file paths, source code, or personally identifiable information is collected.

## Requirements

- **WebStorm 2024.3+** or **IntelliJ IDEA Ultimate 2024.3+**
- **Node.js 18+** (for the bridge server)
- **Java 17+** (runtime requirement)

## Development

### Prerequisites

- **Java 17+** (for Gradle and IntelliJ Platform)
- **Node.js 18+** (for the bridge server)
- **IntelliJ IDEA Ultimate 2024.3+** or **WebStorm 2024.3+**

### Setup

```bash
# Clone the repository
git clone https://github.com/lssm/contractspec.git
cd packages/apps/jetbrains-contractspec

# Install dependencies
npm install  # For bridge server
gradle wrapper  # If needed
```

### Building

```bash
# Build the plugin (includes bridge server)
gradle buildPlugin

# Build with bridge server
gradle buildBridge

# Build everything
gradle packagePlugin
```

### Development Workflow

```bash
# Run in development IDE (opens new IntelliJ instance with plugin loaded)
gradle runIde

# Run with WebStorm specifically
gradle runIde -PplatformType=WS

# Continuous build during development
gradle build --continuous
```

### Testing

```bash
# Run tests
gradle test

# Run integration tests (if any)
gradle integrationTest
```

### Packaging for Distribution

```bash
# Create plugin ZIP for marketplace
gradle packagePlugin

# Create plugin JAR
gradle buildPlugin
```

## CI/CD

The plugin is automatically built and tested on every PR. Publishing to the JetBrains Marketplace is triggered:

- Manually via workflow dispatch
- Automatically on push to `release` branch

### Required Secrets

For publishing, the following GitHub secrets are required:

| Secret          | Description                          |
| --------------- | ------------------------------------ |
| `JETBRAINS_TOKEN` | Personal Access Token for JetBrains Marketplace |

### Creating a JetBrains Marketplace Token

1. Go to [JetBrains Account](https://account.jetbrains.com/)
2. Navigate to the API Keys section
3. Create a new token with plugin publishing scope
4. Copy the token and add it as `JETBRAINS_TOKEN` secret in GitHub

## License

MIT

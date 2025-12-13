# ContractSpec VS Code Extension

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/lssm.contractspec?label=VS%20Code%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=lssm.contractspec)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/lssm.contractspec?label=Installs&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=lssm.contractspec)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Spec-first development for AI-written software.** Validate, scaffold, and explore your contract specifications directly in VS Code.

ContractSpec is the deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable. This extension brings that power directly into your editor.

![ContractSpec Extension](https://raw.githubusercontent.com/lssm/contractspec/main/packages/apps/vscode-contractspec/assets/icon.png)

## Features

- **Real-time Validation**: Get instant feedback on spec errors and warnings as you type
- **Build/Scaffold**: Generate handler and component skeletons from your specs
- **Spec Explorer**: List and navigate all specs in your workspace
- **Dependency Analysis**: Visualize spec dependencies and detect cycles
- **MCP Integration**: Search ContractSpec documentation via Model Context Protocol

## Commands

| Command                                          | Description                                      |
| ------------------------------------------------ | ------------------------------------------------ |
| `ContractSpec: Validate Current Spec`            | Validate the currently open spec file            |
| `ContractSpec: Validate All Specs in Workspace`  | Validate all spec files in the workspace         |
| `ContractSpec: Build/Scaffold from Current Spec` | Generate handler/component from the current spec |
| `ContractSpec: List All Specs`                   | Show all specs in the workspace                  |
| `ContractSpec: Analyze Spec Dependencies`        | Analyze and visualize spec dependencies          |
| `ContractSpec: Search ContractSpec Docs (MCP)`   | Search documentation via MCP                     |

## Configuration

| Setting                                    | Description                                                    | Default                    |
| ------------------------------------------ | -------------------------------------------------------------- | -------------------------- |
| `contractspec.api.baseUrl`                 | Base URL for ContractSpec API (enables MCP + remote telemetry) | `""`                       |
| `contractspec.telemetry.posthogHost`       | PostHog host URL for direct telemetry                          | `"https://eu.posthog.com"` |
| `contractspec.telemetry.posthogProjectKey` | PostHog project key for direct telemetry                       | `""`                       |
| `contractspec.validation.onSave`           | Run validation on save                                         | `true`                     |
| `contractspec.validation.onOpen`           | Run validation on open                                         | `true`                     |

## Telemetry

The extension collects anonymous usage telemetry to help improve the product. Telemetry respects VS Code's telemetry settings - if you've disabled telemetry in VS Code, no data will be collected.

Data collected includes:

- Extension activation
- Command usage (which commands are run)
- MCP calls (which endpoints are used)

No file paths, source code, or personally identifiable information is collected.

## Development

```bash
# Install dependencies
bun install

# Build the extension
bun run build

# Watch mode
bun run dev

# Package for distribution
bun run package
```

## CI/CD

The extension is automatically built and tested on every PR. Publishing to the VS Code Marketplace is triggered:

- Manually via workflow dispatch
- Automatically on push to `release` branch

### Required Secrets

For publishing, the following GitHub secrets are required:

| Secret     | Description                                            |
| ---------- | ------------------------------------------------------ |
| `VSCE_PAT` | Personal Access Token for VS Code Marketplace          |
| `OVSX_PAT` | (Optional) Personal Access Token for Open VSX Registry |

### Creating a VS Code Marketplace PAT

1. Go to [Azure DevOps](https://dev.azure.com/)
2. Click on User Settings → Personal Access Tokens
3. Create a new token with `Marketplace > Manage` scope
4. Copy the token and add it as `VSCE_PAT` secret in GitHub

## License

MIT

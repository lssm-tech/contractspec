import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '../registry';

export const tech_vscode_extension_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.vscode.extension',
    title: 'ContractSpec VS Code Extension',
    summary:
      'VS Code extension for spec-first development with validation, scaffolding, and MCP integration.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/vscode/extension',
    tags: ['vscode', 'extension', 'tooling', 'dx'],
    body: `# ContractSpec VS Code Extension

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
| \`ContractSpec: Validate Current Spec\` | Validate the currently open spec file |
| \`ContractSpec: Validate All Specs\` | Validate all spec files in the workspace |
| \`ContractSpec: Build/Scaffold\` | Generate handler/component from the current spec |
| \`ContractSpec: List All Specs\` | Show all specs in the workspace |
| \`ContractSpec: Analyze Dependencies\` | Analyze and visualize spec dependencies |
| \`ContractSpec: Search Docs (MCP)\` | Search documentation via MCP |

## Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| \`contractspec.api.baseUrl\` | Base URL for ContractSpec API (enables MCP + remote telemetry) | \`""\` |
| \`contractspec.telemetry.posthogHost\` | PostHog host URL for direct telemetry | \`"https://eu.posthog.com"\` |
| \`contractspec.telemetry.posthogProjectKey\` | PostHog project key for direct telemetry | \`""\` |
| \`contractspec.validation.onSave\` | Run validation on save | \`true\` |
| \`contractspec.validation.onOpen\` | Run validation on open | \`true\` |

## Architecture

The extension uses:
- \`@lssm/module.contractspec-workspace\` for pure analysis + templates
- \`@lssm/bundle.contractspec-workspace\` for workspace services + adapters

This allows the extension to work without requiring the CLI to be installed.

## Telemetry

The extension uses a hybrid telemetry approach:
1. If \`contractspec.api.baseUrl\` is configured → send to API \`/api/telemetry/ingest\`
2. Otherwise → send directly to PostHog (if project key configured)

Telemetry respects VS Code's telemetry settings. No file paths, source code, or PII is collected.
`,
  },
  {
    id: 'docs.tech.vscode.snippets',
    title: 'ContractSpec Snippets',
    summary: 'Code snippets for common ContractSpec patterns in VS Code.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/vscode/snippets',
    tags: ['vscode', 'snippets', 'dx'],
    body: `# ContractSpec Snippets

The VS Code extension includes snippets for common ContractSpec patterns.

## Available Snippets

| Prefix | Description |
|--------|-------------|
| \`contractspec-command\` | Create a new command (write operation) |
| \`contractspec-query\` | Create a new query (read-only operation) |
| \`contractspec-event\` | Create a new event |
| \`contractspec-docblock\` | Create a new DocBlock |
| \`contractspec-telemetry\` | Create a new TelemetrySpec |
| \`contractspec-presentation\` | Create a new Presentation |

## Usage

Type the prefix in a TypeScript file and press Tab to expand the snippet. Tab through the placeholders to fill in your values.
`,
  },
];

registerDocBlocks(tech_vscode_extension_DocBlocks);




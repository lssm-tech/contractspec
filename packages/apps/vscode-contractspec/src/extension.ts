/**
 * ContractSpec VS Code Extension
 *
 * Provides spec validation, scaffolding, and MCP integration
 * for ContractSpec-powered projects.
 */

import * as vscode from 'vscode';
import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { FixCodeActionProvider } from './code-actions/fix-provider';
import { registerFixCommands } from './commands/fix';
import { registerCommands } from './commands/index';
import { registerIntegrityCommands } from './commands/integrity';
import { disposeWatchMode } from './commands/watch';
import { registerCompletionProviders } from './completion/index';
import {
	registerDiagnostics,
	registerIntegrityDiagnostics,
} from './diagnostics/index';
import { createTelemetryReporter, TelemetryReporter } from './telemetry/index';
import { createOutputChannel } from './ui/output-channel';
import {
	createWatchStatusBarItem,
	createWorkspaceStatusBarItem,
	updateWorkspaceStatus,
} from './ui/status-bar';
import { registerFeatureExplorer } from './views/feature-explorer';
import { registerViews } from './views/index';
import { registerIntegrityTree } from './views/integrity-tree';
import {
	formatWorkspaceInfoForDisplay,
	invalidateWorkspaceCache,
} from './workspace/adapters';

let telemetryReporter: TelemetryReporter | undefined;
let workspaceStatusBarItem: vscode.StatusBarItem | undefined;

export async function activate(
	context: vscode.ExtensionContext
): Promise<void> {
	const outputChannel = createOutputChannel();
	context.subscriptions.push(outputChannel);

	outputChannel.appendLine('ContractSpec extension activating...');

	// Initialize telemetry (respects VS Code telemetry settings)
	telemetryReporter = createTelemetryReporter(context);
	if (telemetryReporter) {
		context.subscriptions.push(telemetryReporter);
		telemetryReporter.sendTelemetryEvent('contractspec.vscode.activated', {
			version: context.extension.packageJSON.version ?? '0.0.0',
		});
	}

	// Create status bar items
	const statusBarItem = createWatchStatusBarItem(context);
	workspaceStatusBarItem = createWorkspaceStatusBarItem(context);

	// Register views
	registerViews(context, outputChannel);

	// Register integrity views
	registerIntegrityTree(context);
	registerFeatureExplorer(context);

	// Register diagnostics (validation on open/save)
	registerDiagnostics(context, outputChannel);

	// Register integrity diagnostics
	const integrityDiagnostics = registerIntegrityDiagnostics(context);

	// Register commands (including workspace info command)
	registerCommands(context, outputChannel, telemetryReporter, statusBarItem);

	// Register integrity commands
	registerIntegrityCommands(context, integrityDiagnostics);

	// Register completion providers for spec names
	registerCompletionProviders(context);

	// Register workspace info command
	context.subscriptions.push(
		vscode.commands.registerCommand('contractspec.workspaceInfo', () => {
			const info = formatWorkspaceInfoForDisplay();
			vscode.window.showInformationMessage('ContractSpec Workspace Info', {
				modal: true,
				detail: info,
			});
		})
	);

	// Register fix command
	registerFixCommands(context);

	// Register code action provider for fixes
	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(
			{ scheme: 'file', language: 'typescript' }, // Adjust selector as needed, or check isSpecFile
			new FixCodeActionProvider(),
			{
				providedCodeActionKinds: FixCodeActionProvider.providedCodeActionKinds,
			}
		)
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeWorkspaceFolders(() => {
			invalidateWorkspaceCache();
			if (workspaceStatusBarItem) {
				updateWorkspaceStatus(workspaceStatusBarItem);
			}
		})
	);

	outputChannel.appendLine('ContractSpec extension activated');
}

export function deactivate(): void {
	telemetryReporter?.dispose();
	disposeWatchMode();
}

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
- \`@contractspec/module.workspace\` for pure analysis + templates
- \`@contractspec/bundle.workspace\` for workspace services + adapters

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

/**
 * List specs command for ContractSpec extension.
 */

import { discoverSpecs, groupSpecsByType } from '@contractspec/bundle.workspace';
import * as vscode from 'vscode';
import { getWorkspaceAdapters } from '../workspace/adapters';

/**
 * List all discovered specs in the workspace.
 */
export async function listAllSpecs(
	outputChannel: vscode.OutputChannel
): Promise<void> {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		vscode.window.showWarningMessage('No workspace folder open');
		return;
	}

	outputChannel.appendLine('\n=== ContractSpec Specs ===');
	outputChannel.show(true);

	try {
		const adapters = getWorkspaceAdapters();
		const specs = await discoverSpecs(adapters);

		if (specs.length === 0) {
			vscode.window.showInformationMessage('No specs found in workspace');
			outputChannel.appendLine('No specs found');
			return;
		}

		// Group by type
		const grouped = groupSpecsByType(specs);

		outputChannel.appendLine(`Found ${specs.length} spec(s)\n`);

		for (const [specType, typeSpecs] of grouped) {
			outputChannel.appendLine(`\n📁 ${specType} (${typeSpecs.length})`);

			for (const spec of typeSpecs) {
				const name = spec.key ?? getFileName(spec.filePath);
				const stability = spec.stability ? ` [${spec.stability}]` : '';
				const version = spec.version ? ` v${spec.version}` : '';
				const declaration = spec.declarationLine
					? `:${spec.declarationLine}`
					: '';

				outputChannel.appendLine(`   • ${name}${version}${stability}`);
				outputChannel.appendLine(`     ${spec.filePath}${declaration}`);

				if (spec.description) {
					outputChannel.appendLine(`     ${spec.description}`);
				}
			}
		}

		// Show quick pick for navigation
		const items = specs.map((spec) => ({
			label: spec.key ?? getFileName(spec.filePath),
			description: spec.specType,
			detail: spec.declarationLine
				? `${spec.filePath}:${spec.declarationLine}`
				: spec.filePath,
			spec,
		}));

		const selected = await vscode.window.showQuickPick(items, {
			placeHolder: 'Select a spec to open',
			matchOnDescription: true,
			matchOnDetail: true,
		});

		if (selected) {
			const document = await vscode.workspace.openTextDocument(
				selected.spec.filePath
			);
			const editor = await vscode.window.showTextDocument(document);
			if (selected.spec.declarationLine) {
				const line = Math.max(selected.spec.declarationLine - 1, 0);
				const range = new vscode.Range(line, 0, line, 0);
				editor.selection = new vscode.Selection(range.start, range.end);
				editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
			}
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		vscode.window.showErrorMessage(`Error listing specs: ${message}`);
		outputChannel.appendLine(`\n❌ Error: ${message}`);
	}
}

/**
 * Get just the file name from a path.
 */
function getFileName(filePath: string): string {
	return filePath.split(/[/\\]/).pop() ?? filePath;
}

/**
 * Setup command for ContractSpec extension.
 *
 * Provides an interactive wizard to set up ContractSpec in a project.
 * Supports monorepos with package-level or workspace-level configuration.
 */

import {
	runSetup,
	type SetupPromptCallbacks,
} from '@contractspec/bundle.workspace';
import * as vscode from 'vscode';
import { getWorkspaceAdapters } from '../workspace/adapters';

/**
 * Create VS Code prompt callbacks.
 *
 * For scope selection (single choice), uses single-select quick pick.
 */
function createVscodePrompts(): SetupPromptCallbacks {
	return {
		confirm: async (message: string) => {
			const result = await vscode.window.showQuickPick(['Yes', 'No'], {
				placeHolder: message,
			});
			return result === 'Yes';
		},
		select: async <T extends string>(
			message: string,
			options: {
				value: T;
				label: string;
				description?: string;
				selected?: boolean;
			}[]
		): Promise<T> => {
			const items = options.map((o) => ({
				label: o.label,
				description: o.description,
				value: o.value,
			}));

			const selected = await vscode.window.showQuickPick(items, {
				placeHolder: message,
			});

			return (
				selected?.value ??
				options.find((o) => o.selected)?.value ??
				options[0]?.value ??
				('' as T)
			);
		},
		multiSelect: async <T extends string>(
			message: string,
			options: { value: T; label: string; selected?: boolean }[]
		): Promise<T[]> => {
			const items = options.map((o) => ({
				label: o.label,
				picked: o.selected !== false,
				value: o.value,
			}));

			const selected = await vscode.window.showQuickPick(items, {
				placeHolder: message,
				canPickMany: true,
			});

			if (!selected) {
				return [];
			}

			return selected.map((s) => s.value);
		},
		input: async (message: string, defaultValue?: string) => {
			const result = await vscode.window.showInputBox({
				prompt: message,
				value: defaultValue,
			});
			return result ?? defaultValue ?? '';
		},
	};
}

/**
 * Run the ContractSpec setup wizard.
 */
export async function runSetupWizard(
	outputChannel: vscode.OutputChannel
): Promise<void> {
	outputChannel.appendLine('\n=== ContractSpec Setup ===');
	outputChannel.show(true);

	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		vscode.window.showErrorMessage('No workspace folder open');
		return;
	}

	const cwd = workspaceFolders[0].uri.fsPath;

	try {
		await vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title: 'Setting up ContractSpec...',
				cancellable: false,
			},
			async (progress) => {
				progress.report({ message: 'Configuring...' });

				const adapters = getWorkspaceAdapters();
				const prompts = createVscodePrompts();

				const result = await runSetup(
					adapters.fs,
					{
						workspaceRoot: cwd,
						interactive: true,
						targets: [],
					},
					prompts
				);

				// Log results
				outputChannel.appendLine('\n--- Results ---');
				for (const file of result.files) {
					const icon =
						file.action === 'created'
							? '✓'
							: file.action === 'merged'
								? '↔'
								: file.action === 'skipped'
									? '○'
									: '✗';
					outputChannel.appendLine(`${icon} ${file.filePath}`);
					outputChannel.appendLine(`  ${file.action}: ${file.message}`);
				}

				// Show summary
				const created = result.files.filter(
					(f) => f.action === 'created'
				).length;
				const merged = result.files.filter((f) => f.action === 'merged').length;
				const skipped = result.files.filter(
					(f) => f.action === 'skipped'
				).length;
				const errors = result.files.filter((f) => f.action === 'error').length;

				outputChannel.appendLine('\n--- Summary ---');
				outputChannel.appendLine(
					`Preset: ${result.preset}; Created: ${created}, Merged: ${merged}, Skipped: ${skipped}, Errors: ${errors}`
				);
				outputChannel.appendLine('\n--- Next Steps ---');
				for (const step of result.nextSteps) {
					outputChannel.appendLine(`• ${step}`);
				}

				if (result.success) {
					const action = await vscode.window.showInformationMessage(
						`ContractSpec setup complete! ${created + merged} files configured.`,
						'Create First Spec',
						'View Output'
					);

					if (action === 'Create First Spec') {
						await vscode.commands.executeCommand('contractspec.create');
					} else if (action === 'View Output') {
						outputChannel.show();
					}
				} else {
					vscode.window.showErrorMessage(
						`ContractSpec setup completed with ${errors} errors. Check output for details.`
					);
					outputChannel.show();
				}
			}
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		vscode.window.showErrorMessage(`Setup failed: ${message}`);
		outputChannel.appendLine(`\n❌ Error: ${message}`);
	}
}

/**
 * Quick setup with defaults (no prompts).
 *
 * In monorepo, defaults to package level if in a subpackage.
 */
export async function runQuickSetup(
	outputChannel: vscode.OutputChannel
): Promise<void> {
	outputChannel.appendLine('\n=== ContractSpec Quick Setup ===');
	outputChannel.show(true);

	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		vscode.window.showErrorMessage('No workspace folder open');
		return;
	}

	const cwd = workspaceFolders[0].uri.fsPath;

	try {
		await vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title: 'Setting up ContractSpec with defaults...',
				cancellable: false,
			},
			async () => {
				const adapters = getWorkspaceAdapters();

				const result = await runSetup(adapters.fs, {
					workspaceRoot: cwd,
					interactive: false,
					targets: [],
					preset: 'core',
				});

				// Log results
				for (const file of result.files) {
					outputChannel.appendLine(`${file.action}: ${file.filePath}`);
				}
				for (const step of result.nextSteps) {
					outputChannel.appendLine(`next: ${step}`);
				}

				const created = result.files.filter(
					(f) => f.action === 'created'
				).length;
				const merged = result.files.filter((f) => f.action === 'merged').length;

				if (result.success) {
					vscode.window.showInformationMessage(
						`ContractSpec configured! ${created + merged} files ready.`
					);
				} else {
					const errors = result.files.filter(
						(f) => f.action === 'error'
					).length;
					vscode.window.showWarningMessage(
						`Setup completed with ${errors} issues. Check output.`
					);
					outputChannel.show();
				}
			}
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		vscode.window.showErrorMessage(`Setup failed: ${message}`);
		outputChannel.appendLine(`\n❌ Error: ${message}`);
	}
}

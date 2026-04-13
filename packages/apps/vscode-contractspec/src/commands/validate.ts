/**
 * Validation commands for ContractSpec extension.
 */

import {
	discoverSpecs,
	validateDiscoveredSpecs,
} from '@contractspec/bundle.workspace';
import { inferSpecTypeFromFilePath } from '@contractspec/module.workspace';
import * as vscode from 'vscode';
import { getWorkspaceAdapters } from '../workspace/adapters';

/**
 * Validate the currently active spec file.
 */
export async function validateCurrentSpec(
	outputChannel: vscode.OutputChannel
): Promise<void> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage('No active editor');
		return;
	}

	const document = editor.document;
	const filePath = document.uri.fsPath;

	if (!isSpecFile(filePath)) {
		vscode.window.showWarningMessage(
			'Current file is not a ContractSpec file. Expected extensions: .contracts.ts, .event.ts, .presentation.ts, etc.'
		);
		return;
	}

	outputChannel.appendLine(`\nValidating: ${filePath}`);
	outputChannel.show(true);

	try {
		const adapters = getWorkspaceAdapters();
		const specs = await discoverSpecs(adapters, { pattern: filePath });
		const results = await validateDiscoveredSpecs(specs);
		const failed = results.filter((result) => !result.valid);
		const warnings = results.flatMap((result) => result.warnings);

		if (failed.length === 0) {
			vscode.window.showInformationMessage(
				`✅ Spec validation passed: ${getFileName(filePath)} (${results.length} spec(s))`
			);
			outputChannel.appendLine('✅ Validation passed');

			if (warnings.length > 0) {
				outputChannel.appendLine(`\nWarnings (${warnings.length}):`);
				for (const warning of warnings) {
					outputChannel.appendLine(`  ⚠️  ${warning}`);
				}
			}
		} else {
			vscode.window.showErrorMessage(
				`❌ Spec validation failed: ${failed.length} spec(s) with errors`
			);
			outputChannel.appendLine(`\n❌ Validation failed`);
			for (const result of failed) {
				const target = result.spec.exportName
					? `${result.spec.exportName} (${result.spec.filePath}:${result.spec.declarationLine ?? 1})`
					: result.spec.filePath;
				outputChannel.appendLine(`\n${target}`);
				for (const error of result.errors) {
					outputChannel.appendLine(`  ❌ ${error}`);
				}
				for (const warning of result.warnings) {
					outputChannel.appendLine(`  ⚠️  ${warning}`);
				}
			}
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		vscode.window.showErrorMessage(`Validation error: ${message}`);
		outputChannel.appendLine(`\n❌ Error: ${message}`);
	}
}

/**
 * Validate all spec files in the workspace.
 */
export async function validateWorkspace(
	outputChannel: vscode.OutputChannel
): Promise<void> {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		vscode.window.showWarningMessage('No workspace folder open');
		return;
	}

	outputChannel.appendLine('\n=== Validating all specs in workspace ===');
	outputChannel.show(true);

	try {
		const adapters = getWorkspaceAdapters();

		// Find all spec files
		const specs = await discoverSpecs(adapters);

		if (specs.length === 0) {
			vscode.window.showInformationMessage('No specs found in workspace');
			outputChannel.appendLine('No specs found');
			return;
		}

		outputChannel.appendLine(`Found ${specs.length} spec(s)\n`);

		// Validate all specs
		const results = await validateDiscoveredSpecs(specs);

		let passedCount = 0;
		let failedCount = 0;
		let totalWarnings = 0;

		for (const result of results) {
			const fileName = result.spec.exportName
				? `${result.spec.exportName} (${getFileName(result.spec.filePath)})`
				: getFileName(result.spec.filePath);

			if (result.valid) {
				passedCount++;
				outputChannel.appendLine(`✅ ${fileName}`);
				if (result.warnings.length > 0) {
					totalWarnings += result.warnings.length;
					for (const warning of result.warnings) {
						outputChannel.appendLine(`   ⚠️  ${warning}`);
					}
				}
			} else {
				failedCount++;
				outputChannel.appendLine(`❌ ${fileName}`);
				for (const error of result.errors) {
					outputChannel.appendLine(`   ❌ ${error}`);
				}
				if (result.warnings.length > 0) {
					totalWarnings += result.warnings.length;
					for (const warning of result.warnings) {
						outputChannel.appendLine(`   ⚠️  ${warning}`);
					}
				}
			}
		}

		outputChannel.appendLine('\n=== Summary ===');
		outputChannel.appendLine(`Passed: ${passedCount}`);
		outputChannel.appendLine(`Failed: ${failedCount}`);
		outputChannel.appendLine(`Warnings: ${totalWarnings}`);

		if (failedCount === 0) {
			vscode.window.showInformationMessage(
				`✅ All ${passedCount} spec(s) passed validation`
			);
		} else {
			vscode.window.showErrorMessage(
				`❌ ${failedCount} of ${results.length} spec(s) failed validation`
			);
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		vscode.window.showErrorMessage(`Validation error: ${message}`);
		outputChannel.appendLine(`\n❌ Error: ${message}`);
	}
}

/**
 * Check if a file is a ContractSpec file.
 */
function isSpecFile(filePath: string): boolean {
	return inferSpecTypeFromFilePath(filePath) !== 'unknown';
}

/**
 * Get just the file name from a path.
 */
function getFileName(filePath: string): string {
	return filePath.split(/[/\\]/).pop() ?? filePath;
}

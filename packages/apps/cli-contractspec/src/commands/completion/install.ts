import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { confirm } from '@inquirer/prompts';
import { writeFileSafe } from '../../utils/fs';
import {
	type CompletionShell,
	MANAGED_BLOCK_END,
	MANAGED_BLOCK_START,
} from './constants';

interface InstallCompletionOptions {
	shell: CompletionShell;
	script: string;
	writeProfile?: boolean;
}

interface InstallCompletionResult {
	profilePath?: string;
	profileUpdated: boolean;
	scriptPath: string;
	sourceCommand: string;
}

export async function installCompletionScript(
	options: InstallCompletionOptions
): Promise<InstallCompletionResult> {
	const scriptPath = resolveCompletionScriptPath(options.shell);
	await writeFileSafe(scriptPath, options.script);

	const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY);
	const shouldWriteProfile =
		options.writeProfile ??
		(interactive
			? await confirm({
					message: `Append a source block to ${resolveProfilePath(options.shell)}?`,
					default: false,
				})
			: false);

	if (!shouldWriteProfile) {
		return {
			profileUpdated: false,
			scriptPath,
			sourceCommand: buildSourceCommand(options.shell, scriptPath),
		};
	}

	const profilePath = resolveProfilePath(options.shell);
	await upsertManagedBlock(
		profilePath,
		buildManagedProfileBlock(options.shell, scriptPath)
	);

	return {
		profilePath,
		profileUpdated: true,
		scriptPath,
		sourceCommand: buildSourceCommand(options.shell, scriptPath),
	};
}

export function resolveCompletionScriptPath(
	shell: CompletionShell,
	platform: NodeJS.Platform = process.platform
): string {
	const extension = shell === 'fish' ? 'fish' : shell;
	return join(
		resolveXdgConfigDir(platform),
		'contractspec',
		'completions',
		`contractspec.${extension}`
	);
}

export function resolveProfilePath(
	shell: CompletionShell,
	platform: NodeJS.Platform = process.platform
): string {
	const home = homedir();
	switch (shell) {
		case 'bash':
			return join(home, '.bashrc');
		case 'zsh':
			return join(home, '.zshrc');
		case 'fish':
			return join(home, '.config', 'fish', 'config.fish');
	}
}

export function buildSourceCommand(
	_shell: CompletionShell,
	scriptPath: string
): string {
	return `source ${quotePath(scriptPath)}`;
}

async function upsertManagedBlock(
	filePath: string,
	block: string
): Promise<void> {
	const currentContent = existsSync(filePath)
		? await readFile(filePath, 'utf8')
		: '';
	const nextContent = mergeManagedBlock(currentContent, block);
	await writeFileSafe(filePath, nextContent);
}

export function mergeManagedBlock(
	currentContent: string,
	block: string
): string {
	const blockPattern = new RegExp(
		`${escapeRegExp(MANAGED_BLOCK_START)}[\\s\\S]*?${escapeRegExp(MANAGED_BLOCK_END)}\\n?`,
		'm'
	);

	if (blockPattern.test(currentContent)) {
		return currentContent.replace(blockPattern, `${block}\n`);
	}

	if (currentContent.trim().length === 0) {
		return `${block}\n`;
	}

	const separator = currentContent.endsWith('\n') ? '\n' : '\n\n';
	return `${currentContent}${separator}${block}\n`;
}

function buildManagedProfileBlock(
	shell: CompletionShell,
	scriptPath: string
): string {
	const sourceLine = buildSourceCommand(shell, scriptPath);
	return `${MANAGED_BLOCK_START}
${sourceLine}
${MANAGED_BLOCK_END}`;
}

function resolveXdgConfigDir(
	platform: NodeJS.Platform,
	env: NodeJS.ProcessEnv = process.env
): string {
	const home = homedir();
	if (env.XDG_CONFIG_HOME) {
		return resolve(env.XDG_CONFIG_HOME);
	}
	if (platform === 'darwin') {
		return resolve(join(home, 'Library', 'Application Support'));
	}
	if (platform === 'win32') {
		return resolve(env.APPDATA ?? join(home, 'AppData', 'Roaming'));
	}
	return resolve(join(home, '.config'));
}

function quotePath(path: string): string {
	return JSON.stringify(path);
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

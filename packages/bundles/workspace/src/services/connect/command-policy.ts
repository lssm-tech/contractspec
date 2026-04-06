import { isAllowedCommand, isDeniedCommand, isReviewCommand } from './config';
import type { ConnectResolvedWorkspace } from './shared';

export type ConnectCommandState =
	| 'none'
	| 'allow'
	| 'review'
	| 'deny'
	| 'destructive'
	| 'unknown';

export function classifyCommands(
	workspace: ConnectResolvedWorkspace,
	commands: string[]
): {
	state: ConnectCommandState;
	commandMatch?: string;
} {
	if (commands.length === 0) {
		return { state: 'none' };
	}

	for (const command of commands) {
		if (isDeniedCommand(workspace, command)) {
			return { commandMatch: command, state: 'deny' };
		}
	}

	for (const command of commands) {
		if (isReviewCommand(workspace, command)) {
			return { commandMatch: command, state: 'review' };
		}
	}

	if (commands.every((command) => isAllowedCommand(workspace, command))) {
		return { state: 'allow' };
	}

	const destructiveCommand = commands.find(isDestructiveCommand);
	if (destructiveCommand) {
		return { commandMatch: destructiveCommand, state: 'destructive' };
	}

	return {
		commandMatch: commands.find(
			(command) => !isAllowedCommand(workspace, command)
		),
		state: 'unknown',
	};
}

function isDestructiveCommand(command: string): boolean {
	const normalized = command.trim().toLowerCase();

	if (normalized.startsWith('rm ')) {
		return (
			hasAllFlags(normalized, ['-r', '-f']) ||
			(normalized.includes('--recursive') && normalized.includes('--force'))
		);
	}

	if (normalized.startsWith('git reset ')) {
		return normalized.includes('--hard');
	}

	if (normalized.startsWith('git clean ')) {
		return hasAllFlags(normalized, ['-f', '-d']);
	}

	if (normalized.startsWith('git push ')) {
		return normalized.includes('--force') || /\s-f(\s|$)/.test(normalized);
	}

	return false;
}

function hasAllFlags(command: string, flags: string[]): boolean {
	return flags.every(
		(flag) => command.includes(flag) || command.includes(flag.replace('-', ''))
	);
}

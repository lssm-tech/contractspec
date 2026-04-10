import type { ConnectCommandContext } from './artifacts';
import type { ConnectActorRef } from './io';
import { requireNonEmptyString } from './io';

interface VerifyCommandOptions {
	task: string;
	baseline?: string;
	paths?: string[];
	tool: 'acp.fs.access' | 'acp.terminal.exec';
}

export function normalizeVerifyInput(
	parsed: string | Record<string, unknown>,
	options: VerifyCommandOptions,
	ctx: ConnectCommandContext,
	actor: ConnectActorRef
) {
	if (options.tool === 'acp.fs.access') {
		if (typeof parsed === 'string') {
			throw new Error('acp.fs.access verify expects JSON input on stdin.');
		}
		return {
			cwd: ctx.cwd,
			config: ctx.config,
			workspaceRoot: ctx.config.workspaceRoot,
			packageRoot: ctx.config.packageRoot,
			taskId: options.task,
			actor,
			baseline: options.baseline,
			tool: options.tool,
			operation: String(parsed['operation'] ?? 'edit'),
			path: requireNonEmptyString(
				String(parsed['path'] ?? ''),
				'acp.fs.access path'
			),
			content:
				typeof parsed['content'] === 'string' ? parsed['content'] : undefined,
			options:
				typeof parsed['options'] === 'object'
					? (parsed['options'] as Record<string, unknown>)
					: undefined,
		};
	}

	if (typeof parsed === 'string') {
		return {
			cwd: ctx.cwd,
			config: ctx.config,
			workspaceRoot: ctx.config.workspaceRoot,
			packageRoot: ctx.config.packageRoot,
			taskId: options.task,
			actor,
			baseline: options.baseline,
			tool: options.tool,
			command: requireNonEmptyString(parsed, 'Command'),
			touchedPaths: options.paths,
		};
	}

	return {
		cwd: typeof parsed['cwd'] === 'string' ? parsed['cwd'] : ctx.cwd,
		config: ctx.config,
		workspaceRoot: ctx.config.workspaceRoot,
		packageRoot: ctx.config.packageRoot,
		taskId: options.task,
		actor,
		baseline: options.baseline,
		tool: options.tool,
		command: requireNonEmptyString(String(parsed['command'] ?? ''), 'Command'),
		touchedPaths: Array.isArray(parsed['touchedPaths'])
			? (parsed['touchedPaths'] as string[])
			: options.paths,
	};
}

import { connect } from '@contractspec/bundle.workspace';
import { confirm } from '@inquirer/prompts';
import { persistLatestArtifacts, printConnectResult } from './artifacts';
import {
	buildActor,
	parseJsonOrText,
	readRequiredStdin,
	requireNonEmptyString,
} from './io';
import { autoSyncConnectReviewDecision } from './review-sync';
import {
	createConnectCommandContext,
	runShellCommand,
	tryCreateConnectControlPlaneRuntime,
} from './runtime';
import { normalizeVerifyInput } from './verify-input';

interface SharedOptions {
	json?: boolean;
	task?: string;
	baseline?: string;
	paths?: string[];
	actorId?: string;
	actorType?: 'human' | 'agent' | 'service' | 'tool';
	sessionId?: string;
	traceId?: string;
}

export async function runConnectInitCommand(options: {
	gitignore?: boolean;
	json?: boolean;
	scope?: 'workspace' | 'package';
}) {
	const { adapters, cwd, config } = await createConnectCommandContext(options);
	const interactive = Boolean(
		!options.json && process.stdin.isTTY && process.stdout.isTTY
	);
	const result = await connect.initConnectWorkspace(adapters.fs, {
		cwd,
		config,
		gitignoreBehavior: parseGitignoreBehavior(options.gitignore),
		interactive,
		prompts: interactive
			? {
					confirm: (message, defaultValue) =>
						confirm({ default: defaultValue, message }),
				}
			: undefined,
		scope: options.scope,
	});
	printConnectResult(options.json, result, formatConnectInitSummary(result));
	return 0;
}

function parseGitignoreBehavior(gitignore: boolean | undefined) {
	if (gitignore === true) {
		return 'force';
	}
	if (gitignore === false) {
		return 'skip';
	}
	return undefined;
}

function formatConnectInitSummary(result: connect.ConnectInitResult): string {
	if (result.gitignore.action === 'skipped') {
		return `${result.action}: ${result.configPath}`;
	}

	return `${result.action}: ${result.configPath}\n${result.gitignore.action}: ${result.gitignore.filePath}`;
}

export async function runConnectContextCommand(
	options: SharedOptions & { task: string }
) {
	const ctx = await createConnectCommandContext(options);
	const actor = buildActor(options.task, options);
	const contextPack = await connect.buildConnectContextPack(ctx.adapters, {
		cwd: ctx.cwd,
		config: ctx.config,
		workspaceRoot: ctx.config.workspaceRoot,
		packageRoot: ctx.config.packageRoot,
		taskId: options.task,
		actor,
		baseline: options.baseline,
		paths: options.paths,
	});
	await persistLatestArtifacts(ctx, { contextPack });
	printConnectResult(
		options.json,
		contextPack,
		`ContextPack: ${contextPack.id}`
	);
	return 0;
}

export async function runConnectPlanCommand(
	options: SharedOptions & { task: string }
) {
	const ctx = await createConnectCommandContext(options);
	const actor = buildActor(options.task, options);
	const parsed = parseJsonOrText(await readRequiredStdin());
	const candidate =
		typeof parsed === 'string'
			? {
					objective: requireNonEmptyString(parsed, 'Plan objective'),
					touchedPaths: options.paths,
				}
			: {
					objective: requireNonEmptyString(
						String(parsed['objective'] ?? ''),
						'Plan objective'
					),
					steps: Array.isArray(parsed['steps'])
						? (parsed['steps'] as Array<
								| string
								| {
										summary: string;
										paths?: string[];
										commands?: string[];
										contractRefs?: string[];
								  }
							>)
						: undefined,
					touchedPaths: Array.isArray(parsed['touchedPaths'])
						? (parsed['touchedPaths'] as string[])
						: options.paths,
					commands: Array.isArray(parsed['commands'])
						? (parsed['commands'] as string[])
						: undefined,
				};
	const result = await connect.compileConnectPlanPacket(ctx.adapters, {
		cwd: ctx.cwd,
		config: ctx.config,
		workspaceRoot: ctx.config.workspaceRoot,
		packageRoot: ctx.config.packageRoot,
		taskId: options.task,
		actor,
		baseline: options.baseline,
		paths: options.paths,
		candidate,
	});
	await persistLatestArtifacts(ctx, result);
	printConnectResult(
		options.json,
		result.planPacket,
		`PlanPacket: ${result.planPacket.id}`
	);
	return 0;
}

export async function runConnectVerifyCommand(
	options: SharedOptions & {
		task: string;
		tool: 'acp.fs.access' | 'acp.terminal.exec';
	}
) {
	const ctx = await createConnectCommandContext(options);
	const actor = buildActor(options.task, options);
	const parsed = parseJsonOrText(await readRequiredStdin());
	const controlPlane = await tryCreateConnectControlPlaneRuntime();
	try {
		const result = await connect.verifyConnectMutation(
			ctx.adapters,
			normalizeVerifyInput(parsed, options, ctx, actor),
			{
				controlPlane: controlPlane.controlPlane,
				runCommand: runShellCommand,
			}
		);
		if (result.reviewPacket) {
			await autoSyncConnectReviewDecision(ctx, result.patchVerdict.decisionId);
		}
		printConnectResult(
			options.json,
			result.patchVerdict,
			`PatchVerdict: ${result.patchVerdict.decisionId} -> ${result.patchVerdict.verdict}`
		);
		return result.patchVerdict.verdict;
	} finally {
		await controlPlane.dispose();
	}
}

import { connect } from '@contractspec/bundle.workspace';
import { createConnectEvaluationRuntime } from './registry';
import {
	buildActor,
	parseJsonOrText,
	readRequiredStdin,
	requireExactlyOne,
	requireNonEmptyString,
} from './io';
import {
	createConnectCommandContext,
	runShellCommand,
	tryCreateConnectControlPlaneRuntime,
} from './runtime';

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

type LatestArtifacts = Parameters<typeof connect.persistLatestArtifacts>[2];

export async function runConnectInitCommand(options: {
	json?: boolean;
	scope?: 'workspace' | 'package';
}) {
	const { adapters, cwd, config } = await createConnectCommandContext(options);
	const result = await connect.initConnectWorkspace(adapters.fs, {
		cwd,
		config,
		scope: options.scope,
	});
	printResult(options.json, result, `${result.action}: ${result.configPath}`);
	return 0;
}

export async function runConnectContextCommand(options: SharedOptions & { task: string }) {
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
	printResult(options.json, contextPack, `ContextPack: ${contextPack.id}`);
	return 0;
}

export async function runConnectPlanCommand(options: SharedOptions & { task: string }) {
	const ctx = await createConnectCommandContext(options);
	const actor = buildActor(options.task, options);
	const parsed = parseJsonOrText(await readRequiredStdin());
	const candidate =
		typeof parsed === 'string'
			? { objective: requireNonEmptyString(parsed, 'Plan objective'), touchedPaths: options.paths }
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
					touchedPaths: Array.isArray(parsed['touchedPaths']) ? (parsed['touchedPaths'] as string[]) : options.paths,
					commands: Array.isArray(parsed['commands']) ? (parsed['commands'] as string[]) : undefined,
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
	printResult(options.json, result.planPacket, `PlanPacket: ${result.planPacket.id}`);
	return 0;
}

export async function runConnectVerifyCommand(
	options: SharedOptions & { task: string; tool: 'acp.fs.access' | 'acp.terminal.exec' }
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
		printResult(
			options.json,
			result.patchVerdict,
			`PatchVerdict: ${result.patchVerdict.decisionId} -> ${result.patchVerdict.verdict}`
		);
		return result.patchVerdict.verdict;
	} finally {
		await controlPlane.dispose();
	}
}

export async function runConnectReviewListCommand(options: { json?: boolean }) {
	const ctx = await createConnectCommandContext(options);
	const items = await connect.listConnectReviewPackets(ctx.adapters, {
		cwd: ctx.cwd,
		config: ctx.config,
		workspaceRoot: ctx.config.workspaceRoot,
		packageRoot: ctx.config.packageRoot,
	});
	printResult(options.json, items, items.length === 0 ? 'No pending review packets.' : items.map((item) => `${item.packet.id}: ${item.packet.reason}`).join('\n'));
	return 0;
}

export async function runConnectReplayCommand(
	decisionId: string,
	options: { json?: boolean }
) {
	const ctx = await createConnectCommandContext(options);
	const controlPlane = await tryCreateConnectControlPlaneRuntime();
	try {
		const result = await connect.replayConnectDecision(
			ctx.adapters,
			{
				cwd: ctx.cwd,
				config: ctx.config,
				workspaceRoot: ctx.config.workspaceRoot,
				packageRoot: ctx.config.packageRoot,
				decisionId,
			},
			controlPlane.controlPlane
		);
		if (!result.patchVerdict && !result.contextPack && !result.planPacket) {
			throw new Error(`No stored Connect decision ${decisionId}.`);
		}
		printResult(options.json, result, `Replay: ${result.source}`);
		return 0;
	} finally {
		await controlPlane.dispose();
	}
}

export async function runConnectEvalCommand(
	decisionId: string,
	options: { json?: boolean; registry: string; scenario?: string; suite?: string; version?: string }
) {
	const ctx = await createConnectCommandContext(options);
	requireExactlyOne(
		{ label: '--scenario', value: options.scenario },
		{ label: '--suite', value: options.suite }
	);
	const runtime = await createConnectEvaluationRuntime({
		registryPath: options.registry,
		config: ctx.config,
		packageRoot: ctx.config.packageRoot,
		decisionId,
	});
	const result = await connect.evaluateConnectDecision(
		ctx.adapters,
		{
			cwd: ctx.cwd,
			config: ctx.config,
			workspaceRoot: ctx.config.workspaceRoot,
			packageRoot: ctx.config.packageRoot,
			decisionId,
			scenarioKey: options.scenario,
			suiteKey: options.suite,
			version: options.version,
		},
		runtime
	);
	printResult(options.json, result.evaluation, `Evaluation stored in ${result.historyDir}`);
	return 0;
}

function normalizeVerifyInput(
	parsed: string | Record<string, unknown>,
	options: SharedOptions & { task: string; tool: 'acp.fs.access' | 'acp.terminal.exec' },
	ctx: Awaited<ReturnType<typeof createConnectCommandContext>>,
	actor: ReturnType<typeof buildActor>
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
			path: requireNonEmptyString(String(parsed['path'] ?? ''), 'acp.fs.access path'),
			content: typeof parsed['content'] === 'string' ? parsed['content'] : undefined,
			options: typeof parsed['options'] === 'object' ? (parsed['options'] as Record<string, unknown>) : undefined,
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
		touchedPaths: Array.isArray(parsed['touchedPaths']) ? (parsed['touchedPaths'] as string[]) : options.paths,
	};
}

async function persistLatestArtifacts(
	ctx: Awaited<ReturnType<typeof createConnectCommandContext>>,
	artifacts: LatestArtifacts
) {
	const workspace = connect.withBranch(
		connect.resolveWorkspace({
			cwd: ctx.cwd,
			config: ctx.config,
			workspaceRoot: ctx.config.workspaceRoot,
			packageRoot: ctx.config.packageRoot,
		}),
		await ctx.adapters.git.currentBranch()
	);
	const storage = connect.resolveStoragePaths(workspace);
	await connect.ensureStorage(ctx.adapters.fs, storage);
	await connect.persistLatestArtifacts(ctx.adapters.fs, storage, artifacts);
}

function printResult(json: boolean | undefined, value: unknown, text: string) {
	console.log(json ? JSON.stringify(value, null, 2) : text);
}

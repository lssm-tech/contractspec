import { relative, resolve } from 'node:path';
import { connect } from '@contractspec/bundle.workspace';
import { buildActor, exitCodeForVerdict, parseJsonOrText, readRequiredStdin } from './io';
import {
	createConnectCommandContext,
	tryCreateConnectControlPlaneRuntime,
} from './runtime';

type HookPayload = string | Record<string, unknown>;
type ContractsSpecHookEvent =
	| 'before-file-edit'
	| 'before-shell-execution'
	| 'after-file-edit';

const CONTRACTS_SPEC_PATH_PREFIX = 'packages/libs/contracts-spec/';
const CONTRACTS_SPEC_COMMAND_PATTERN =
	/(packages\/libs\/contracts-spec|@contractspec\/lib\.contracts-spec|contractspec\s+(impact|validate|connect)|turbo\s+run\s+(typecheck|test).*(contracts-spec)|changeset|git\s+push)/i;

export async function runConnectContractsSpecHookCommand(options: {
	event: ContractsSpecHookEvent;
	json?: boolean;
}) {
	const ctx = await createConnectCommandContext(options);
	const payload = parseJsonOrText(await readRequiredStdin());
	const actor = buildActor(`contracts-spec:${options.event}`, {
		actorId: 'hook:contracts-spec',
		actorType: 'tool',
		sessionId: 'contracts-spec-hook',
	});

	switch (options.event) {
		case 'before-file-edit':
			return runBeforeFileEditHook(ctx, actor, payload, options.json);
		case 'before-shell-execution':
			return runBeforeShellHook(ctx, actor, payload, options.json);
		case 'after-file-edit':
			return runAfterFileEditHook(ctx, actor, payload, options.json);
	}
}

async function runBeforeFileEditHook(
	ctx: Awaited<ReturnType<typeof createConnectCommandContext>>,
	actor: ReturnType<typeof buildActor>,
	payload: HookPayload,
	json: boolean | undefined
) {
	const path = extractFilePath(payload, ctx.cwd);
	if (!path || !isContractsSpecPath(path)) {
		printHookResult(json, { skipped: true }, `Skipped file-edit hook.`);
		return 0;
	}

	const taskId = `contracts-spec:file:${slug(path)}`;
	const contextPack = await connect.buildConnectContextPack(ctx.adapters, {
		cwd: ctx.cwd,
		config: ctx.config,
		workspaceRoot: ctx.config.workspaceRoot,
		packageRoot: ctx.config.packageRoot,
		taskId,
		actor,
		paths: [path],
	});
	const planResult = await connect.compileConnectPlanPacket(ctx.adapters, {
		cwd: ctx.cwd,
		config: ctx.config,
		workspaceRoot: ctx.config.workspaceRoot,
		packageRoot: ctx.config.packageRoot,
		taskId,
		actor,
		candidate: {
			objective: `Edit contracts-spec file ${path}`,
			touchedPaths: [path],
		},
	});
	await persistLatestArtifacts(ctx, {
		contextPack,
		planPacket: planResult.planPacket,
	});

	const controlPlane = await tryCreateConnectControlPlaneRuntime();
	try {
		const result = await connect.verifyConnectMutation(
			ctx.adapters,
			{
				cwd: ctx.cwd,
				config: ctx.config,
				workspaceRoot: ctx.config.workspaceRoot,
				packageRoot: ctx.config.packageRoot,
				taskId,
				actor,
				tool: 'acp.fs.access',
				operation: 'edit',
				path,
			},
			{
				controlPlane: controlPlane.controlPlane,
			}
		);
		printHookResult(
			json,
			result.patchVerdict,
			`Contracts-spec file edit ${result.patchVerdict.verdict}: ${path}`
		);
		return exitCodeForVerdict(result.patchVerdict.verdict);
	} finally {
		await controlPlane.dispose();
	}
}

async function runBeforeShellHook(
	ctx: Awaited<ReturnType<typeof createConnectCommandContext>>,
	actor: ReturnType<typeof buildActor>,
	payload: HookPayload,
	json: boolean | undefined
) {
	const command = extractCommand(payload);
	const touchedPaths = extractPaths(payload, ctx.cwd);
	if (
		!command ||
		(!commandTargetsContractsSpec(command) &&
			!touchedPaths.some((path) => isContractsSpecPath(path)))
	) {
		printHookResult(json, { skipped: true }, `Skipped shell hook.`);
		return 0;
	}

	const taskId = `contracts-spec:shell:${slug(command)}`;
	const relevantPaths = touchedPaths.filter((path) => isContractsSpecPath(path));
	const contextPack = await connect.buildConnectContextPack(ctx.adapters, {
		cwd: ctx.cwd,
		config: ctx.config,
		workspaceRoot: ctx.config.workspaceRoot,
		packageRoot: ctx.config.packageRoot,
		taskId,
		actor,
		paths: relevantPaths,
	});
	const planResult = await connect.compileConnectPlanPacket(ctx.adapters, {
		cwd: ctx.cwd,
		config: ctx.config,
		workspaceRoot: ctx.config.workspaceRoot,
		packageRoot: ctx.config.packageRoot,
		taskId,
		actor,
		candidate: {
			objective: `Run contracts-spec command ${command}`,
			touchedPaths: relevantPaths,
			commands: [command],
		},
	});
	await persistLatestArtifacts(ctx, {
		contextPack,
		planPacket: planResult.planPacket,
	});

	const controlPlane = await tryCreateConnectControlPlaneRuntime();
	try {
		const result = await connect.verifyConnectMutation(
			ctx.adapters,
			{
				cwd: ctx.cwd,
				config: ctx.config,
				workspaceRoot: ctx.config.workspaceRoot,
				packageRoot: ctx.config.packageRoot,
				taskId,
				actor,
				tool: 'acp.terminal.exec',
				command,
				touchedPaths: relevantPaths,
			},
			{
				controlPlane: controlPlane.controlPlane,
			}
		);
		printHookResult(
			json,
			result.patchVerdict,
			`Contracts-spec shell command ${result.patchVerdict.verdict}: ${command}`
		);
		return exitCodeForVerdict(result.patchVerdict.verdict);
	} finally {
		await controlPlane.dispose();
	}
}

async function runAfterFileEditHook(
	ctx: Awaited<ReturnType<typeof createConnectCommandContext>>,
	actor: ReturnType<typeof buildActor>,
	payload: HookPayload,
	json: boolean | undefined
) {
	const path = extractFilePath(payload, ctx.cwd);
	if (!path || !isContractsSpecPath(path)) {
		printHookResult(json, { skipped: true }, `Skipped post-edit hook.`);
		return 0;
	}

	const taskId = `contracts-spec:post-edit:${slug(path)}`;
	const contextPack = await connect.buildConnectContextPack(ctx.adapters, {
		cwd: ctx.cwd,
		config: ctx.config,
		workspaceRoot: ctx.config.workspaceRoot,
		packageRoot: ctx.config.packageRoot,
		taskId,
		actor,
		paths: [path],
	});
	await persistLatestArtifacts(ctx, { contextPack });
	const reviews = await connect.listConnectReviewPackets(ctx.adapters, {
		cwd: ctx.cwd,
		config: ctx.config,
		workspaceRoot: ctx.config.workspaceRoot,
		packageRoot: ctx.config.packageRoot,
	});

	printHookResult(
		json,
		{
			contextPack,
			reviewCount: reviews.length,
			reviewPackets: reviews.map((item) => item.packet.id),
		},
		[
			`Contracts-spec edit recorded for ${path}.`,
			`Review packets: ${reviews.length}.`,
			`Inspect .contractspec/connect/* and use 'contractspec connect review list' or 'contractspec connect replay <decisionId>' as needed.`,
		].join(' ')
	);
	return 0;
}

async function persistLatestArtifacts(
	ctx: Awaited<ReturnType<typeof createConnectCommandContext>>,
	artifacts: Parameters<typeof connect.persistLatestArtifacts>[2]
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

function extractFilePath(payload: HookPayload, cwd: string) {
	const raw =
		typeof payload === 'string'
			? payload
			: firstString(
					payload.path,
					payload.filePath,
					payload.filepath,
					payload.target,
					lookup(payload, ['file', 'path']),
					lookup(payload, ['params', 'path']),
					lookup(payload, ['params', 'filePath']),
					lookup(payload, ['tool_input', 'file_path']),
					lookup(payload, ['tool_input', 'path']),
					lookup(payload, ['toolInput', 'file_path']),
					lookup(payload, ['toolInput', 'path'])
				);
	return normalizePath(raw, cwd);
}

function extractCommand(payload: HookPayload) {
	if (typeof payload === 'string') {
		return payload.trim();
	}

	return firstString(
		payload.command,
		payload.cmd,
		payload.shellCommand,
		lookup(payload, ['params', 'command']),
		lookup(payload, ['params', 'cmd']),
		lookup(payload, ['tool_input', 'command']),
		lookup(payload, ['toolInput', 'command'])
	);
}

function extractPaths(payload: HookPayload, cwd: string) {
	if (typeof payload === 'string') {
		return [];
	}

	const values = [
		...stringArray(payload.paths),
		...stringArray(payload.touchedPaths),
		...stringArray(payload.files),
	];
	const filePath = extractFilePath(payload, cwd);
	if (filePath) {
		values.push(filePath);
	}

	return [...new Set(values.map((value) => normalizePath(value, cwd)).filter(Boolean) as string[])];
}

function commandTargetsContractsSpec(command: string) {
	return CONTRACTS_SPEC_COMMAND_PATTERN.test(command);
}

function isContractsSpecPath(path: string) {
	return path.startsWith(CONTRACTS_SPEC_PATH_PREFIX);
}

function normalizePath(value: string | undefined, cwd: string) {
	if (!value) {
		return undefined;
	}
	if (!value.startsWith('/')) {
		return value.replaceAll('\\', '/');
	}

	const absolute = resolve(value);
	const relativePath = relative(cwd, absolute).replaceAll('\\', '/');
	return relativePath.startsWith('..') ? undefined : relativePath;
}

function lookup(
	value: Record<string, unknown>,
	path: string[]
): string | undefined {
	let current: unknown = value;
	for (const key of path) {
		if (!current || typeof current !== 'object' || !(key in current)) {
			return undefined;
		}
		current = (current as Record<string, unknown>)[key];
	}
	return typeof current === 'string' ? current : undefined;
}

function stringArray(value: unknown) {
	return Array.isArray(value)
		? value.filter((entry): entry is string => typeof entry === 'string')
		: [];
}

function firstString(...values: unknown[]) {
	for (const value of values) {
		if (typeof value === 'string' && value.trim().length > 0) {
			return value.trim();
		}
	}
	return undefined;
}

function slug(value: string) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function printHookResult(json: boolean | undefined, value: unknown, text: string) {
	console.log(json ? JSON.stringify(value, null, 2) : text);
}

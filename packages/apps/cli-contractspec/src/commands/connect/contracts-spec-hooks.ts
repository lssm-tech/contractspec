import { connect } from '@contractspec/bundle.workspace';
import {
	type ConnectCommandContext,
	persistLatestArtifacts,
	printConnectResult,
} from './artifacts';
import {
	buildHookContextPack,
	persistHookPlanArtifacts,
} from './contracts-spec-hook-artifacts';
import {
	type ContractsSpecHookEvent,
	commandTargetsContractsSpec,
	extractCommand,
	extractFilePath,
	extractPaths,
	type HookPayload,
	isContractsSpecPath,
	slug,
} from './hook-payload';
import { type ConnectActorRef, exitCodeForVerdict } from './io';
import { autoSyncConnectReviewDecision } from './review-sync';
import { tryCreateConnectControlPlaneRuntime } from './runtime';

interface ContractsSpecHookInput {
	actor: ConnectActorRef;
	ctx: ConnectCommandContext;
	event: ContractsSpecHookEvent;
	json?: boolean;
	payload: HookPayload;
}

export async function runContractsSpecHook(
	input: ContractsSpecHookInput
): Promise<number> {
	switch (input.event) {
		case 'before-file-edit':
			return runBeforeFileEditHook(input);
		case 'before-shell-execution':
			return runBeforeShellHook(input);
		case 'after-file-edit':
			return runAfterFileEditHook(input);
	}
}

async function runBeforeFileEditHook(
	input: ContractsSpecHookInput
): Promise<number> {
	const path = extractFilePath(input.payload, input.ctx.cwd);
	if (!path || !isContractsSpecPath(path)) {
		printConnectResult(
			input.json,
			{ skipped: true },
			'Skipped file-edit hook.'
		);
		return 0;
	}

	const taskId = `contracts-spec:file:${slug(path)}`;
	await persistHookPlanArtifacts({
		actor: input.actor,
		ctx: input.ctx,
		taskId,
		objective: `Edit contracts-spec file ${path}`,
		paths: [path],
	});

	return verifyContractsSpecMutation({
		actor: input.actor,
		ctx: input.ctx,
		json: input.json,
		taskId,
		text: (verdict) => `Contracts-spec file edit ${verdict}: ${path}`,
		mutation: {
			tool: 'acp.fs.access',
			operation: 'edit',
			path,
		},
	});
}

async function runBeforeShellHook(
	input: ContractsSpecHookInput
): Promise<number> {
	const command = extractCommand(input.payload);
	const touchedPaths = extractPaths(input.payload, input.ctx.cwd);
	if (
		!command ||
		(!commandTargetsContractsSpec(command) &&
			!touchedPaths.some((path) => isContractsSpecPath(path)))
	) {
		printConnectResult(input.json, { skipped: true }, 'Skipped shell hook.');
		return 0;
	}

	const taskId = `contracts-spec:shell:${slug(command)}`;
	const relevantPaths = touchedPaths.filter((path) =>
		isContractsSpecPath(path)
	);
	await persistHookPlanArtifacts({
		actor: input.actor,
		ctx: input.ctx,
		taskId,
		objective: `Run contracts-spec command ${command}`,
		paths: relevantPaths,
		commands: [command],
	});

	return verifyContractsSpecMutation({
		actor: input.actor,
		ctx: input.ctx,
		json: input.json,
		taskId,
		text: (verdict) => `Contracts-spec shell command ${verdict}: ${command}`,
		mutation: {
			tool: 'acp.terminal.exec',
			command,
			touchedPaths: relevantPaths,
		},
	});
}

async function runAfterFileEditHook(
	input: ContractsSpecHookInput
): Promise<number> {
	const path = extractFilePath(input.payload, input.ctx.cwd);
	if (!path || !isContractsSpecPath(path)) {
		printConnectResult(
			input.json,
			{ skipped: true },
			'Skipped post-edit hook.'
		);
		return 0;
	}

	const taskId = `contracts-spec:post-edit:${slug(path)}`;
	const contextPack = await buildHookContextPack({
		actor: input.actor,
		ctx: input.ctx,
		taskId,
		paths: [path],
	});
	await persistLatestArtifacts(input.ctx, { contextPack });
	const reviews = await connect.listConnectReviewPackets(input.ctx.adapters, {
		cwd: input.ctx.cwd,
		config: input.ctx.config,
		workspaceRoot: input.ctx.config.workspaceRoot,
		packageRoot: input.ctx.config.packageRoot,
	});

	printConnectResult(
		input.json,
		{
			contextPack,
			reviewCount: reviews.length,
			reviewPackets: reviews.map((item) => item.packet.id),
		},
		[
			`Contracts-spec edit recorded for ${path}.`,
			`Review packets: ${reviews.length}.`,
			"Inspect .contractspec/connect/* and use 'contractspec connect review list' or 'contractspec connect replay <decisionId>' as needed.",
		].join(' ')
	);
	return 0;
}

async function verifyContractsSpecMutation(input: {
	actor: ConnectActorRef;
	ctx: ConnectCommandContext;
	json?: boolean;
	taskId: string;
	text: (verdict: string) => string;
	mutation:
		| {
				tool: 'acp.fs.access';
				operation: 'edit';
				path: string;
		  }
		| {
				tool: 'acp.terminal.exec';
				command: string;
				touchedPaths: string[];
		  };
}) {
	const controlPlane = await tryCreateConnectControlPlaneRuntime();
	try {
		const result = await connect.verifyConnectMutation(
			input.ctx.adapters,
			{
				cwd: input.ctx.cwd,
				config: input.ctx.config,
				workspaceRoot: input.ctx.config.workspaceRoot,
				packageRoot: input.ctx.config.packageRoot,
				taskId: input.taskId,
				actor: input.actor,
				...input.mutation,
			},
			{
				controlPlane: controlPlane.controlPlane,
			}
		);
		if (result.reviewPacket) {
			await autoSyncConnectReviewDecision(
				input.ctx,
				result.patchVerdict.decisionId
			);
		}
		printConnectResult(
			input.json,
			result.patchVerdict,
			input.text(result.patchVerdict.verdict)
		);
		return exitCodeForVerdict(result.patchVerdict.verdict);
	} finally {
		await controlPlane.dispose();
	}
}

import { adoption, connect } from '@contractspec/bundle.workspace';
import {
	type ConnectCommandContext,
	persistLatestArtifacts,
	printConnectResult,
} from './artifacts';
import {
	extractCommand,
	extractFilePath,
	extractPaths,
	type HookPayload,
	slug,
} from './hook-payload';
import { type ConnectActorRef, exitCodeForVerdict } from './io';
import { autoSyncConnectReviewDecision } from './review-sync';
import { tryCreateConnectControlPlaneRuntime } from './runtime';

type AdoptionHookEvent =
	| 'before-file-edit'
	| 'before-shell-execution'
	| 'after-file-edit';

export async function runAdoptionHook(input: {
	actor: ConnectActorRef;
	ctx: ConnectCommandContext;
	event: AdoptionHookEvent;
	json?: boolean;
	payload: HookPayload;
}) {
	switch (input.event) {
		case 'before-file-edit':
			return runBeforeFileEdit(input);
		case 'before-shell-execution':
			return runBeforeShellExecution(input);
		case 'after-file-edit':
			return runAfterFileEdit(input);
	}
}

async function runBeforeFileEdit(input: HookInput) {
	const path = extractFilePath(input.payload, input.ctx.cwd);
	if (!path || !targetsAdoption(path))
		return skip(input.json, 'Skipped adoption file hook.');
	return verify(input, `adoption:file:${slug(path)}`, {
		operation: 'edit',
		path,
		tool: 'acp.fs.access',
	});
}

async function runBeforeShellExecution(input: HookInput) {
	const command = extractCommand(input.payload);
	const touchedPaths = extractPaths(input.payload, input.ctx.cwd);
	if (
		!command ||
		(!targetsAdoption(command) && !touchedPaths.some(targetsAdoption))
	) {
		return skip(input.json, 'Skipped adoption shell hook.');
	}
	return verify(input, `adoption:shell:${slug(command)}`, {
		command,
		tool: 'acp.terminal.exec',
		touchedPaths,
	});
}

async function runAfterFileEdit(input: HookInput) {
	const path = extractFilePath(input.payload, input.ctx.cwd);
	if (!path || !targetsAdoption(path))
		return skip(input.json, 'Skipped adoption post-edit hook.');
	const syncResult = await adoption.syncAdoptionCatalog(
		{ fs: input.ctx.adapters.fs },
		{
			config: input.ctx.config,
			cwd: input.ctx.cwd,
			packageRoot: input.ctx.config.packageRoot,
			workspaceRoot: input.ctx.config.workspaceRoot,
		}
	);
	const contextPack = await connect.buildConnectContextPack(
		input.ctx.adapters,
		{
			cwd: input.ctx.cwd,
			config: input.ctx.config,
			packageRoot: input.ctx.config.packageRoot,
			paths: [path],
			taskId: `adoption:post-edit:${slug(path)}`,
			workspaceRoot: input.ctx.config.workspaceRoot,
			actor: input.actor,
		}
	);
	await persistLatestArtifacts(input.ctx, { contextPack });
	printConnectResult(
		input.json,
		syncResult,
		`Adoption catalog synced: ${syncResult.catalogPath}`
	);
	return 0;
}

type HookInput = {
	actor: ConnectActorRef;
	ctx: ConnectCommandContext;
	json?: boolean;
	payload: HookPayload;
};

async function verify(
	input: HookInput,
	taskId: string,
	mutation:
		| { operation: 'edit'; path: string; tool: 'acp.fs.access' }
		| { command: string; tool: 'acp.terminal.exec'; touchedPaths: string[] }
) {
	const controlPlane = await tryCreateConnectControlPlaneRuntime();
	try {
		const result = await connect.verifyConnectMutation(
			input.ctx.adapters,
			{
				config: input.ctx.config,
				cwd: input.ctx.cwd,
				packageRoot: input.ctx.config.packageRoot,
				taskId,
				workspaceRoot: input.ctx.config.workspaceRoot,
				actor: input.actor,
				...mutation,
			},
			{ controlPlane: controlPlane.controlPlane }
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
			`Adoption hook ${result.patchVerdict.verdict}: ${result.patchVerdict.summary}`
		);
		return exitCodeForVerdict(result.patchVerdict.verdict);
	} finally {
		await controlPlane.dispose();
	}
}

function skip(json: boolean | undefined, text: string) {
	printConnectResult(json, { skipped: true }, text);
	return 0;
}

function targetsAdoption(value: string) {
	return /\b(component|ui|contract|spec|integration|provider|adapter|runtime|mcp|shared|lib|bundle|module|example|tsx|jsx)\b/i.test(
		value
	);
}

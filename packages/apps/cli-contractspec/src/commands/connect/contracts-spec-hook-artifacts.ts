import { connect } from '@contractspec/bundle.workspace';
import {
	type ConnectCommandContext,
	persistLatestArtifacts,
} from './artifacts';
import type { ConnectActorRef } from './io';

export async function persistHookPlanArtifacts(input: {
	actor: ConnectActorRef;
	ctx: ConnectCommandContext;
	taskId: string;
	objective: string;
	paths: string[];
	commands?: string[];
}) {
	const contextPack = await buildHookContextPack(input);
	const planResult = await connect.compileConnectPlanPacket(
		input.ctx.adapters,
		{
			cwd: input.ctx.cwd,
			config: input.ctx.config,
			workspaceRoot: input.ctx.config.workspaceRoot,
			packageRoot: input.ctx.config.packageRoot,
			taskId: input.taskId,
			actor: input.actor,
			candidate: {
				objective: input.objective,
				touchedPaths: input.paths,
				commands: input.commands,
			},
		}
	);
	await persistLatestArtifacts(input.ctx, {
		contextPack,
		planPacket: planResult.planPacket,
	});
}

export async function buildHookContextPack(input: {
	actor: ConnectActorRef;
	ctx: ConnectCommandContext;
	taskId: string;
	paths: string[];
}) {
	return connect.buildConnectContextPack(input.ctx.adapters, {
		cwd: input.ctx.cwd,
		config: input.ctx.config,
		workspaceRoot: input.ctx.config.workspaceRoot,
		packageRoot: input.ctx.config.packageRoot,
		taskId: input.taskId,
		actor: input.actor,
		paths: input.paths,
	});
}

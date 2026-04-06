import { connect } from '@contractspec/bundle.workspace';
import type { createConnectCommandContext } from './runtime';

export type ConnectCommandContext = Awaited<
	ReturnType<typeof createConnectCommandContext>
>;
export type LatestConnectArtifacts = Parameters<
	typeof connect.persistLatestArtifacts
>[2];

export async function persistLatestArtifacts(
	ctx: ConnectCommandContext,
	artifacts: LatestConnectArtifacts
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

export function printConnectResult(
	json: boolean | undefined,
	value: unknown,
	text: string
) {
	console.log(json ? JSON.stringify(value, null, 2) : text);
}

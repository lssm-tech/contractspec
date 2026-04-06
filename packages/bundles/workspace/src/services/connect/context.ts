import { randomUUID } from 'crypto';
import { assertConnectEnabled } from './config';
import type { ConnectContextPack, ConnectTaskInput } from './types';
import { analyzeConnectImpact } from './impact-analysis';
import { inferSurfaces, resolveWorkspace, withBranch, defaultActor } from './shared';
import type { WorkspaceAdapters } from '../../ports/logger';

export async function buildConnectContextPack(
	adapters: Pick<WorkspaceAdapters, 'fs' | 'git'>,
	input: ConnectTaskInput
): Promise<ConnectContextPack> {
	let workspace = resolveWorkspace(input);
	assertConnectEnabled(workspace);
	workspace = withBranch(workspace, await adapters.git.currentBranch());

	const actor = defaultActor(input.taskId, input.actor);
	const targetPaths = await resolveTargetPaths(adapters, workspace.workspaceRoot, input);
	const impact = await analyzeConnectImpact(adapters, {
		baseline: input.baseline,
		touchedPaths: targetPaths,
		workspace,
	});
	const canonPacks = workspace.config.connect?.canonPacks ?? [];

	return {
		id: `connect.ctx_${randomUUID()}`,
		taskId: input.taskId,
		repoId: workspace.repoId,
		branch: workspace.branch,
		actor,
		knowledge: canonPacks.map((pack) => ({
			spaceKey: pack.ref,
			category: 'canonical' as const,
			trustLevel: pack.readOnly === false ? 'medium' : 'high',
			source: 'connect.canonPacks',
		})),
		impactedContracts: impact.impactedContracts,
		affectedSurfaces:
			impact.pathImpacts.length > 0
				? [...new Set(impact.pathImpacts.flatMap((entry) => entry.surfaces))].sort()
				: inferSurfaces(targetPaths),
		policyBindings: [
			{
				key: 'connect.policy',
				version: '1.0.0',
				source: 'workspace-config' as const,
				authority: 'operational' as const,
			},
			...canonPacks.map((pack) => ({
				key: pack.ref,
				version: '1.0.0',
				source: 'canon-pack' as const,
				authority: 'canonical' as const,
			})),
		],
		configRefs: [
			{
				kind: 'contractsrc' as const,
				ref: '.contractsrc.json#connect',
			},
			...canonPacks.map((pack) => ({
				kind: 'canon-pack' as const,
				ref: pack.ref,
			})),
		],
		acceptanceChecks: workspace.config.connect?.policy?.smokeChecks ?? [],
	};
}

async function resolveTargetPaths(
	adapters: Pick<WorkspaceAdapters, 'fs' | 'git'>,
	workspaceRoot: string,
	input: ConnectTaskInput
): Promise<string[]> {
	const explicitPaths = input.paths ?? [];
	if (explicitPaths.length > 0) {
		return explicitPaths.map((path) => normalizePath(adapters.fs, workspaceRoot, path));
	}

	if (!input.baseline) {
		return [];
	}

	const changedFiles = await adapters.git.diffFiles(input.baseline);
	return changedFiles.map((path) => normalizePath(adapters.fs, workspaceRoot, path));
}

function normalizePath(
	fs: WorkspaceAdapters['fs'],
	workspaceRoot: string,
	path: string
): string {
	const absolute = fs.resolve(workspaceRoot, path);
	return fs.relative(workspaceRoot, absolute).replaceAll('\\', '/');
}

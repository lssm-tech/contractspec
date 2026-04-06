import { randomUUID } from 'crypto';
import type { WorkspaceAdapters } from '../../ports/logger';
import { assessConnectPolicy } from './assessment';
import { buildConnectAuditRecord } from './audit-record';
import { assertConnectEnabled } from './config';
import { buildConnectContextPack } from './context';
import { analyzeConnectImpact } from './impact-analysis';
import { compileConnectPlanPacket } from './plan';
import type {
	ConnectControlPlaneRuntime,
	ConnectDecisionEnvelope,
} from './runtime-types';
import { resolveWorkspace, withBranch } from './shared';
import {
	appendAuditRecord,
	artifactRef,
	decisionArtifactRefs,
	ensureStorage,
	persistDecisionArtifacts,
	persistLatestArtifacts,
	resolveStoragePaths,
	writeDecisionEnvelope,
	writeReviewPacket,
} from './storage';
import type {
	ConnectPatchVerdict,
	ConnectReviewPacket,
	ConnectVerifyInput,
	ConnectVerifyRuntime,
} from './types';
import {
	buildPatchVerdict,
	buildReviewPacket,
	checkForCommandPolicy,
	checkForImpact,
	checkForPathBoundary,
} from './verify-helpers';

export async function verifyConnectMutation(
	adapters: Pick<WorkspaceAdapters, 'fs' | 'git' | 'logger'>,
	input: ConnectVerifyInput,
	runtime: ConnectVerifyRuntime & {
		controlPlane?: ConnectControlPlaneRuntime;
		now?: () => Date;
	} = {}
): Promise<{
	contextPack: Awaited<ReturnType<typeof buildConnectContextPack>>;
	planPacket: Awaited<
		ReturnType<typeof compileConnectPlanPacket>
	>['planPacket'];
	patchVerdict: ConnectPatchVerdict;
	reviewPacket?: ConnectReviewPacket;
	historyDir: string;
}> {
	let workspace = resolveWorkspace(input);
	assertConnectEnabled(workspace);
	workspace = withBranch(workspace, await adapters.git.currentBranch());

	const decisionId = `connect.dec_${randomUUID()}`;
	const createdAt = (runtime.now ?? (() => new Date()))().toISOString();
	const storage = resolveStoragePaths(workspace);
	await ensureStorage(adapters.fs, storage);

	const { contextPack, planPacket } = await compileConnectPlanPacket(adapters, {
		...input,
		candidate: toPlanCandidate(input),
	});
	const touchedPaths = resolveTouchedPaths(input);
	const impactAnalysis = await analyzeConnectImpact(adapters, {
		baseline: input.baseline,
		touchedPaths,
		workspace,
	});
	const smokeChecks = await runSmokeChecks(
		runtime,
		workspace.config.connect?.policy?.smokeChecks ?? [],
		workspace.workspaceRoot
	);
	const smokeFailed = smokeChecks.some(
		(check) => check.id.startsWith('smoke:') && check.status === 'fail'
	);
	const assessment = assessConnectPolicy(workspace, {
		commands: input.tool === 'acp.terminal.exec' ? [input.command] : [],
		impactAnalysis,
		smokeFailed,
		touchedPaths,
	});
	const checks = [
		checkForPathBoundary(
			assessment.immutablePath,
			assessment.protectedPath,
			assessment.generatedPath
		),
		checkForCommandPolicy(assessment.commandState, assessment.commandMatch),
		checkForImpact(
			impactAnalysis.breakingChange,
			impactAnalysis.driftFiles.length > 0,
			impactAnalysis.unknownPaths.length > 0
		),
		...smokeChecks,
	];
	const historyRefs = decisionArtifactRefs(
		adapters.fs,
		workspace,
		storage,
		decisionId,
		{
			contextPack: true,
			patchVerdict: true,
			planPacket: true,
		}
	);
	const impactedFiles =
		impactAnalysis.pathImpacts.length > 0
			? impactAnalysis.pathImpacts.map((entry) => ({
					file: entry.path,
					contracts: entry.contracts,
					policies: entry.policies,
					surfaces: entry.surfaces,
				}))
			: touchedPaths.map((file) => ({
					file,
					contracts: contextPack.impactedContracts,
					policies: [
						{
							key: 'connect.policy',
							version: '1.0.0',
							kind: 'policy' as const,
						},
					],
					surfaces: contextPack.affectedSurfaces,
				}));
	const runtimePatchVerdict = buildPatchVerdict(
		decisionId,
		input,
		contextPack,
		planPacket,
		impactedFiles,
		checks,
		assessment.verdict,
		undefined
	);
	const runtimeLink = runtime.controlPlane
		? await runtime.controlPlane.linkDecision({
				connectDecisionId: decisionId,
				createdAt,
				input,
				patchVerdict: runtimePatchVerdict,
				planPacket,
				workspace,
			})
		: null;
	const linkedPlanPacket = runtimeLink
		? {
				...planPacket,
				controlPlane: {
					...planPacket.controlPlane,
					decisionId: runtimeLink.decisionId,
					traceId: runtimeLink.traceId ?? planPacket.controlPlane.traceId,
				},
			}
		: planPacket;
	const reviewPacket =
		assessment.verdict === 'require_review'
			? buildReviewPacket(
					workspace,
					decisionId,
					contextPack,
					linkedPlanPacket,
					touchedPaths,
					{
						artifactRefs: historyRefs,
						reason:
							assessment.reviewReason ??
							'Connect policy requires human review before continuing.',
						runtimeLink,
					}
				)
			: undefined;
	const patchVerdict = buildPatchVerdict(
		decisionId,
		input,
		contextPack,
		linkedPlanPacket,
		impactedFiles,
		checks,
		assessment.verdict,
		reviewPacket
			? artifactRef(
					adapters.fs,
					workspace,
					adapters.fs.join(storage.reviewPacketsDir, `${reviewPacket.id}.json`)
				)
			: undefined,
		runtimeLink
	);

	await persistLatestArtifacts(adapters.fs, storage, {
		contextPack,
		planPacket: linkedPlanPacket,
		patchVerdict,
	});
	if (reviewPacket) {
		await writeReviewPacket(adapters.fs, storage, reviewPacket);
	}
	const historyDir = await persistDecisionArtifacts(
		adapters.fs,
		storage,
		decisionId,
		{
			contextPack,
			planPacket: linkedPlanPacket,
			patchVerdict,
			reviewPacket,
		}
	);
	const envelope: ConnectDecisionEnvelope = {
		artifacts: decisionArtifactRefs(
			adapters.fs,
			workspace,
			storage,
			decisionId,
			{
				contextPack: true,
				patchVerdict: true,
				planPacket: true,
				reviewPacket: Boolean(reviewPacket),
			}
		),
		connectDecisionId: decisionId,
		createdAt,
		runtimeLink: runtimeLink ?? undefined,
		taskId: input.taskId,
		verdict: assessment.verdict,
	};
	await writeDecisionEnvelope(adapters.fs, storage, decisionId, envelope);
	await appendAuditRecord(
		adapters.fs,
		storage,
		buildConnectAuditRecord({
			contextPack,
			createdAt,
			envelope,
			reviewPacket,
			verifyInput: input,
			workspace,
		})
	);

	return {
		contextPack,
		planPacket: linkedPlanPacket,
		patchVerdict,
		reviewPacket,
		historyDir,
	};
}

function toPlanCandidate(input: ConnectVerifyInput) {
	if (input.tool === 'acp.fs.access') {
		return {
			objective: `${input.operation} ${input.path}`,
			touchedPaths: [input.path],
		};
	}

	return {
		objective: `Run ${input.command}`,
		touchedPaths: input.touchedPaths,
		commands: [input.command],
	};
}

function resolveTouchedPaths(input: ConnectVerifyInput): string[] {
	return input.tool === 'acp.fs.access'
		? [input.path]
		: (input.touchedPaths ?? []);
}

async function runSmokeChecks(
	runtime: ConnectVerifyRuntime,
	smokeChecks: string[],
	cwd: string
) {
	if (!runtime.runCommand) return [];
	const results = [];
	for (const command of smokeChecks) {
		const result = await runtime.runCommand(command, { cwd });
		results.push({
			id: `smoke:${command}`,
			status: result.exitCode === 0 ? 'pass' : 'fail',
			detail:
				result.exitCode === 0
					? `Passed: ${command}`
					: `Failed (${result.exitCode}): ${command}`,
		} as const);
	}
	return results;
}

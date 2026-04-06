import { assertConnectEnabled } from './config';
import { resolveWorkspace } from './shared';
import {
	decisionArtifactRefs,
	loadStoredDecision,
	persistDecisionArtifacts,
	resolveStoragePaths,
	writeDecisionEnvelope,
} from './storage';
import type { WorkspaceAdapters } from '../../ports/logger';
import type {
	ConnectEvalInput,
	ConnectEvaluationRuntime,
	ConnectWorkspaceInput,
} from './types';
import type { ConnectDecisionEnvelope } from './runtime-types';

export async function evaluateConnectDecision(
	adapters: Pick<WorkspaceAdapters, 'fs'>,
	input: ConnectEvalInput,
	runtime: ConnectEvaluationRuntime
): Promise<{
	historyDir: string;
	evaluation: unknown;
	context: Record<string, unknown>;
}> {
	const workspace = resolveWorkspace(input);
	assertConnectEnabled(workspace);

	if ((!input.scenarioKey && !input.suiteKey) || (input.scenarioKey && input.suiteKey)) {
		throw new Error('Provide exactly one of scenarioKey or suiteKey.');
	}

	const storage = resolveStoragePaths(workspace);
	const stored = await loadStoredDecision(adapters.fs, storage, input.decisionId);
	const evaluationContext = buildEvaluationContext(workspace, stored);
	const evaluation = input.scenarioKey
		? await runtime.runScenarioEvaluation({
				scenarioKey: input.scenarioKey,
				version: input.version,
				context: evaluationContext,
			})
		: await runtime.runSuiteEvaluation({
				suiteKey: input.suiteKey ?? '',
				version: input.version,
				context: evaluationContext,
			});

	const historyDir = await persistDecisionArtifacts(
		adapters.fs,
		storage,
		input.decisionId,
		{
			evaluationResult: evaluation,
		}
	);
	const hasReplayBundle = await adapters.fs.exists(
		adapters.fs.join(historyDir, 'replay-bundle.json')
	);
	const envelope: ConnectDecisionEnvelope = {
		artifacts: decisionArtifactRefs(adapters.fs, workspace, storage, input.decisionId, {
			contextPack: true,
			evaluationResult: true,
			patchVerdict: true,
			planPacket: true,
			replayBundle: hasReplayBundle,
			reviewPacket: Boolean(stored.reviewPacket),
		}),
		connectDecisionId: input.decisionId,
		createdAt: stored.envelope?.createdAt ?? new Date().toISOString(),
		runtimeLink: stored.envelope?.runtimeLink,
		taskId: stored.contextPack?.taskId ?? input.decisionId,
		verdict: stored.patchVerdict?.verdict ?? 'permit',
	};
	await writeDecisionEnvelope(adapters.fs, storage, input.decisionId, envelope);

	return {
		historyDir,
		evaluation,
		context: evaluationContext,
	};
}

function buildEvaluationContext(
	workspace: ReturnType<typeof resolveWorkspace>,
	stored: Awaited<ReturnType<typeof loadStoredDecision>>
): Record<string, unknown> {
	return {
		traceId:
			stored.envelope?.runtimeLink?.traceId ??
			stored.patchVerdict?.controlPlane.traceId ??
			stored.contextPack?.actor.traceId,
		actorId: stored.contextPack?.actor.id,
		workspaceId: workspace.repoId,
		controlPlaneExecutionId: stored.envelope?.runtimeLink?.decisionId,
		controlPlanePlanId:
			stored.envelope?.runtimeLink?.planId ?? stored.planPacket?.id,
		metadata: {
			approvalStatus: stored.envelope?.runtimeLink?.approvalStatus,
			decisionId: stored.patchVerdict?.decisionId,
			taskId: stored.contextPack?.taskId,
			branch: stored.contextPack?.branch ?? workspace.branch,
		},
	};
}

export function normalizeEvalInput(
	input: ConnectWorkspaceInput & {
		decisionId: string;
		scenarioKey?: string;
		suiteKey?: string;
		version?: string;
	}
): ConnectEvalInput {
	return input;
}

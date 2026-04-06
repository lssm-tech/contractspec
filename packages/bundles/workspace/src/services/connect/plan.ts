import { randomUUID } from 'crypto';
import type { WorkspaceAdapters } from '../../ports/logger';
import { assessConnectPolicy } from './assessment';
import { assertConnectEnabled } from './config';
import { buildConnectContextPack } from './context';
import {
	CONTROL_PLANE_INTENT_SUBMIT_REF,
	CONTROL_PLANE_PLAN_COMPILE_REF,
	CONTROL_PLANE_PLAN_VERIFY_REF,
} from './contract-refs';
import { analyzeConnectImpact } from './impact-analysis';
import { defaultActor, resolveWorkspace, withBranch } from './shared';
import type {
	ConnectContextPack,
	ConnectPlanInput,
	ConnectPlanPacket,
	ConnectPlanStep,
} from './types';

export async function compileConnectPlanPacket(
	adapters: Pick<WorkspaceAdapters, 'fs' | 'git'>,
	input: ConnectPlanInput
): Promise<{
	contextPack: ConnectContextPack;
	planPacket: ConnectPlanPacket;
}> {
	let workspace = resolveWorkspace(input);
	assertConnectEnabled(workspace);
	workspace = withBranch(workspace, await adapters.git.currentBranch());

	const { commands, touchedPaths } = collectPlanCandidates(input.candidate);
	const contextPack = await buildConnectContextPack(adapters, {
		...input,
		paths: touchedPaths,
	});
	const actor = defaultActor(input.taskId, input.actor);
	const steps = normalizeSteps(input.candidate.steps, input.candidate);
	const impactAnalysis = await analyzeConnectImpact(adapters, {
		baseline: input.baseline,
		touchedPaths,
		workspace,
	});
	const assessment = assessConnectPolicy(workspace, {
		commands,
		impactAnalysis,
		touchedPaths,
	});

	const planPacket: ConnectPlanPacket = {
		id: `connect.plan_${randomUUID()}`,
		taskId: input.taskId,
		repoId: workspace.repoId,
		branch: workspace.branch,
		actor,
		objective: input.candidate.objective,
		steps,
		impactedContracts: contextPack.impactedContracts,
		affectedSurfaces: contextPack.affectedSurfaces,
		requiredChecks: workspace.config.connect?.policy?.smokeChecks ?? [],
		requiredApprovals: assessment.requiredApprovals,
		riskScore: computeRiskScore(touchedPaths.length, commands.length),
		verificationStatus: assessment.verificationStatus,
		controlPlane: {
			intentSubmit: CONTROL_PLANE_INTENT_SUBMIT_REF,
			planCompile: CONTROL_PLANE_PLAN_COMPILE_REF,
			planVerify: CONTROL_PLANE_PLAN_VERIFY_REF,
			traceId: actor.traceId,
		},
		acpActions: [
			...(touchedPaths.length > 0 ? (['acp.fs.access'] as const) : []),
			...(commands.length > 0 ? (['acp.terminal.exec'] as const) : []),
		],
	};

	return { contextPack, planPacket };
}

function collectPlanCandidates(candidate: ConnectPlanInput['candidate']) {
	const touchedPaths = new Set(candidate.touchedPaths ?? []);
	const commands = new Set(candidate.commands ?? []);

	for (const step of candidate.steps ?? []) {
		if (typeof step === 'string') {
			continue;
		}
		for (const path of step.paths ?? []) {
			touchedPaths.add(path);
		}
		for (const command of step.commands ?? []) {
			commands.add(command);
		}
	}

	return {
		commands: [...commands],
		touchedPaths: [...touchedPaths],
	};
}

function normalizeSteps(
	candidateSteps: ConnectPlanInput['candidate']['steps'],
	candidate: ConnectPlanInput['candidate']
): ConnectPlanStep[] {
	if (!candidateSteps || candidateSteps.length === 0) {
		return [
			{
				id: `step_${randomUUID()}`,
				summary: candidate.objective,
				paths: candidate.touchedPaths,
				commands: candidate.commands,
			},
		];
	}

	return candidateSteps.map((step) =>
		typeof step === 'string'
			? {
					id: `step_${randomUUID()}`,
					summary: step,
				}
			: {
					id: `step_${randomUUID()}`,
					summary: step.summary,
					paths: step.paths,
					commands: step.commands,
					contractRefs: step.contractRefs,
				}
	);
}

function computeRiskScore(pathCount: number, commandCount: number): number {
	return Math.min(1, pathCount * 0.1 + commandCount * 0.15 + 0.1);
}

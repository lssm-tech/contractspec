import { type ConnectCommandState, classifyCommands } from './command-policy';
import { configuredThreshold, matchConfiguredPath } from './config';
import { CONTROL_PLANE_EXECUTION_APPROVE_REF } from './contract-refs';
import type { ConnectImpactAnalysis } from './impact-analysis';
import type { ConnectResolvedWorkspace } from './shared';
import type { ConnectVerdict } from './types';

export interface ConnectPolicyAssessment {
	verdict: ConnectVerdict;
	verificationStatus: 'approved' | 'revise' | 'review' | 'denied';
	controlPlaneVerdict: 'autonomous' | 'assist' | 'blocked';
	requiresApproval: boolean;
	requiredApprovals: Array<{ capability: string; reason: string }>;
	commandState: ConnectCommandState;
	commandMatch?: string;
	immutablePath?: string;
	protectedPath?: string;
	generatedPath?: string;
	reviewReason?: string;
}

export function assessConnectPolicy(
	workspace: ConnectResolvedWorkspace,
	input: {
		commands?: string[];
		impactAnalysis: ConnectImpactAnalysis;
		smokeFailed?: boolean;
		touchedPaths: string[];
	}
): ConnectPolicyAssessment {
	const immutablePath = input.touchedPaths.find((path) =>
		matchConfiguredPath(
			workspace,
			path,
			workspace.config.connect?.policy?.immutablePaths
		)
	);
	const protectedPath = input.touchedPaths.find((path) =>
		matchConfiguredPath(
			workspace,
			path,
			workspace.config.connect?.policy?.protectedPaths
		)
	);
	const generatedPath = input.touchedPaths.find((path) =>
		matchConfiguredPath(
			workspace,
			path,
			workspace.config.connect?.policy?.generatedPaths
		)
	);
	const { commandMatch, state: commandState } = classifyCommands(
		workspace,
		input.commands ?? []
	);
	const unknownImpact = input.impactAnalysis.unknownPaths.length > 0;
	const contractDrift = input.impactAnalysis.driftFiles.length > 0;
	const verdict = resolveVerdict({
		breakingChange: input.impactAnalysis.breakingChange,
		destructiveCommand: commandState === 'destructive',
		commandState,
		contractDrift,
		generatedPath: Boolean(generatedPath),
		immutable: Boolean(immutablePath),
		protectedPath: Boolean(protectedPath),
		smokeFailed: input.smokeFailed === true,
		unknownImpact,
		workspace,
	});
	const reviewReason = describeReviewReason({
		breakingChange: input.impactAnalysis.breakingChange,
		commandMatch,
		commandState,
		contractDrift,
		protectedPath,
		unknownPaths: input.impactAnalysis.unknownPaths,
	});
	const policy = connectVerdictToPolicy(verdict);

	return {
		commandMatch,
		commandState,
		controlPlaneVerdict: policy.controlPlaneVerdict,
		generatedPath,
		immutablePath,
		protectedPath,
		requiredApprovals: policy.requiresApproval
			? [
					{
						capability: CONTROL_PLANE_EXECUTION_APPROVE_REF.key,
						reason:
							reviewReason ??
							'Connect policy requires human review before continuing.',
					},
				]
			: [],
		requiresApproval: policy.requiresApproval,
		reviewReason,
		verificationStatus: policy.verificationStatus,
		verdict,
	};
}

export function connectVerdictToPolicy(verdict: ConnectVerdict): {
	verificationStatus: 'approved' | 'revise' | 'review' | 'denied';
	controlPlaneVerdict: 'autonomous' | 'assist' | 'blocked';
	requiresApproval: boolean;
} {
	switch (verdict) {
		case 'rewrite':
			return {
				controlPlaneVerdict: 'assist',
				requiresApproval: false,
				verificationStatus: 'revise',
			};
		case 'require_review':
			return {
				controlPlaneVerdict: 'assist',
				requiresApproval: true,
				verificationStatus: 'review',
			};
		case 'deny':
			return {
				controlPlaneVerdict: 'blocked',
				requiresApproval: false,
				verificationStatus: 'denied',
			};
		case 'permit':
		default:
			return {
				controlPlaneVerdict: 'autonomous',
				requiresApproval: false,
				verificationStatus: 'approved',
			};
	}
}

function resolveVerdict(input: {
	breakingChange: boolean;
	destructiveCommand: boolean;
	commandState: ConnectCommandState;
	contractDrift: boolean;
	generatedPath: boolean;
	immutable: boolean;
	protectedPath: boolean;
	smokeFailed: boolean;
	unknownImpact: boolean;
	workspace: ConnectResolvedWorkspace;
}): ConnectVerdict {
	if (input.immutable || input.commandState === 'deny') {
		return 'deny';
	}

	const verdicts: ConnectVerdict[] = [];
	if (input.protectedPath) {
		verdicts.push(
			configuredThreshold(
				input.workspace,
				'protectedPathWrite',
				'require_review'
			)
		);
	}
	if (input.breakingChange) {
		verdicts.push(
			configuredThreshold(input.workspace, 'breakingChange', 'require_review')
		);
	}
	if (input.contractDrift) {
		verdicts.push(
			configuredThreshold(input.workspace, 'contractDrift', 'require_review')
		);
	}
	if (input.unknownImpact) {
		verdicts.push(
			configuredThreshold(input.workspace, 'unknownImpact', 'require_review')
		);
	}
	if (input.commandState === 'review') {
		verdicts.push('require_review');
	}
	if (input.destructiveCommand) {
		verdicts.push(
			configuredThreshold(input.workspace, 'destructiveCommand', 'deny')
		);
	}
	if (input.generatedPath || input.smokeFailed) {
		verdicts.push('rewrite');
	}

	return verdicts.sort(compareVerdicts)[0] ?? 'permit';
}

function describeReviewReason(input: {
	breakingChange: boolean;
	commandMatch?: string;
	commandState: ConnectCommandState;
	contractDrift: boolean;
	protectedPath?: string;
	unknownPaths: string[];
}) {
	if (input.protectedPath) {
		return `Protected path ${input.protectedPath} requires human review.`;
	}
	if (input.breakingChange) {
		return 'Breaking contract impact requires human review.';
	}
	if (input.contractDrift) {
		return 'Generated-path drift requires human review before continuing.';
	}
	if (input.commandState === 'review' && input.commandMatch) {
		return `Command "${input.commandMatch}" requires human review.`;
	}
	if (input.commandState === 'destructive' && input.commandMatch) {
		return `Destructive command "${input.commandMatch}" requires human review.`;
	}
	if (input.unknownPaths.length > 0) {
		return `Impact could not be resolved for ${input.unknownPaths[0]}.`;
	}
	return undefined;
}

function compareVerdicts(left: ConnectVerdict, right: ConnectVerdict) {
	return severity(left) - severity(right);
}

function severity(verdict: ConnectVerdict) {
	return { deny: 0, require_review: 1, rewrite: 2, permit: 3 }[verdict];
}

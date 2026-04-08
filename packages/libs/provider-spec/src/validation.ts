import type {
	ExternalExecutionReceipt,
	ExternalPatchProposal,
	ProviderRoutingPolicy,
	RuntimeTarget,
} from './types';

export interface ProviderSpecValidationIssue {
	path: string;
	message: string;
}

function pushIssue(
	issues: ProviderSpecValidationIssue[],
	path: string,
	message: string
) {
	issues.push({ path, message });
}

export function validateRuntimeTarget(
	target: RuntimeTarget
): ProviderSpecValidationIssue[] {
	const issues: ProviderSpecValidationIssue[] = [];
	if (!target.id.trim()) {
		pushIssue(issues, 'id', 'Runtime target id is required.');
	}
	if (!target.displayName.trim()) {
		pushIssue(
			issues,
			'displayName',
			'Runtime target display name is required.'
		);
	}
	if (target.capabilityProfile.availableProviders.length === 0) {
		pushIssue(
			issues,
			'capabilityProfile.availableProviders',
			'Runtime target must expose at least one provider.'
		);
	}
	return issues;
}

export function validateProviderRoutingPolicy(
	policy: ProviderRoutingPolicy
): ProviderSpecValidationIssue[] {
	const issues: ProviderSpecValidationIssue[] = [];
	if (!policy.id.trim()) {
		pushIssue(issues, 'id', 'Routing policy id is required.');
	}
	if (policy.taskRules.length === 0) {
		pushIssue(issues, 'taskRules', 'Routing policy must define task rules.');
	}
	for (const [index, rule] of policy.taskRules.entries()) {
		if (rule.preferredProviders.length === 0) {
			pushIssue(
				issues,
				`taskRules.${index}.preferredProviders`,
				'Each task rule must declare at least one preferred provider.'
			);
		}
	}
	for (const [index, rule] of policy.riskRules.entries()) {
		const hasProviderSelector =
			(rule.preferredProviders?.length ?? 0) > 0 ||
			(rule.blockedProviderIds?.length ?? 0) > 0;
		const hasKindSelector =
			(rule.requiredProviderKinds?.length ?? 0) > 0 ||
			(rule.blockedProviderKinds?.length ?? 0) > 0;
		if (!hasProviderSelector && !hasKindSelector && !rule.requireComparison) {
			pushIssue(
				issues,
				`riskRules.${index}`,
				'Each risk rule must constrain providers or require comparison.'
			);
		}
	}
	return issues;
}

export function validateExternalExecutionReceipt(
	receipt: ExternalExecutionReceipt
): ProviderSpecValidationIssue[] {
	const issues: ProviderSpecValidationIssue[] = [];
	if (!receipt.runId.trim()) {
		pushIssue(issues, 'runId', 'Receipt run id is required.');
	}
	if (!receipt.providerId.trim()) {
		pushIssue(issues, 'providerId', 'Receipt provider id is required.');
	}
	if (!receipt.taskType) {
		pushIssue(issues, 'taskType', 'Receipt task type is required.');
	}
	if (!receipt.runtimeMode) {
		pushIssue(issues, 'runtimeMode', 'Receipt runtime mode is required.');
	}
	if (!receipt.contextBundleId.trim()) {
		pushIssue(
			issues,
			'contextBundleId',
			'Receipt context bundle id is required.'
		);
	}
	if (!receipt.contextHash.trim()) {
		pushIssue(issues, 'contextHash', 'Receipt context hash is required.');
	}
	if (receipt.outputArtifactHashes.length === 0) {
		pushIssue(
			issues,
			'outputArtifactHashes',
			'Receipt must record output artifact hashes.'
		);
	}
	if (!receipt.startedAt.trim()) {
		pushIssue(issues, 'startedAt', 'Receipt start timestamp is required.');
	}
	if (!receipt.completedAt?.trim()) {
		pushIssue(
			issues,
			'completedAt',
			'Receipt completion timestamp is required.'
		);
	}
	if (receipt.verificationRefs.length === 0) {
		pushIssue(
			issues,
			'verificationRefs',
			'Receipt must record at least one verification reference.'
		);
	}
	return issues;
}

export function validateExternalPatchProposal(
	proposal: ExternalPatchProposal
): ProviderSpecValidationIssue[] {
	const issues: ProviderSpecValidationIssue[] = [];
	if (!proposal.diffHash.trim()) {
		pushIssue(issues, 'diffHash', 'Patch proposal diff hash is required.');
	}
	if (proposal.changedAreas.length === 0) {
		pushIssue(
			issues,
			'changedAreas',
			'Patch proposal must declare at least one changed area.'
		);
	}
	if (proposal.outputArtifactRefs.length === 0) {
		pushIssue(
			issues,
			'outputArtifactRefs',
			'Patch proposal must record output artifact references.'
		);
	}
	if (proposal.allowedWriteScopes.length === 0) {
		pushIssue(
			issues,
			'allowedWriteScopes',
			'Patch proposal must declare allowed write scopes.'
		);
	}
	if (proposal.verificationRequirements.length === 0) {
		pushIssue(
			issues,
			'verificationRequirements',
			'Patch proposal must declare verification requirements.'
		);
	}
	return issues;
}

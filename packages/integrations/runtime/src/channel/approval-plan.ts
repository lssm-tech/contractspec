import type { ResolveDecisionApprovalInput } from './store';
import type { ChannelCompiledPlan } from './types';

export function applyResolvedApprovalStatus(
	plan: ChannelCompiledPlan,
	status: Extract<
		ResolveDecisionApprovalInput['approvalStatus'],
		'approved' | 'rejected' | 'expired'
	>
): ChannelCompiledPlan {
	return {
		...plan,
		approval: {
			...plan.approval,
			status,
		},
		steps: plan.steps.map((step) =>
			step.contractKey === 'controlPlane.execution.start' &&
			status === 'approved'
				? { ...step, status: 'completed' }
				: step
		),
	};
}

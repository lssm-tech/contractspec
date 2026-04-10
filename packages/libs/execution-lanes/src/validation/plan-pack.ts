import type { ExecutionPlanPack } from '../types';
import { type ExecutionLanesValidationIssue, pushIssue } from './issues';

export function validateExecutionPlanPack(
	plan: ExecutionPlanPack
): ExecutionLanesValidationIssue[] {
	const issues: ExecutionLanesValidationIssue[] = [];
	if (!plan.meta.id.trim()) {
		pushIssue(issues, 'meta.id', 'Plan id is required.');
	}
	if (!plan.objective.trim()) {
		pushIssue(issues, 'objective', 'Objective is required.');
	}
	if (plan.planSteps.length === 0) {
		pushIssue(issues, 'planSteps', 'At least one plan step is required.');
	}
	for (const step of plan.planSteps) {
		if (!step.id.trim()) {
			pushIssue(issues, 'planSteps[].id', 'Plan step id is required.');
		}
		if (step.acceptanceCriteria.length === 0) {
			pushIssue(
				issues,
				`planSteps.${step.id}.acceptanceCriteria`,
				'Each plan step requires at least one acceptance criterion.'
			);
		}
	}
	if (plan.authorityContext.policyRefs.length === 0) {
		pushIssue(
			issues,
			'authorityContext.policyRefs',
			'At least one policy ref is required.'
		);
	}
	if (plan.authorityContext.ruleContextRefs.length === 0) {
		pushIssue(
			issues,
			'authorityContext.ruleContextRefs',
			'At least one rule-context ref is required.'
		);
	}
	if (!plan.staffing.handoffRecommendation.nextLane) {
		pushIssue(
			issues,
			'staffing.handoffRecommendation.nextLane',
			'Next lane is required.'
		);
	}
	if (
		!plan.staffing.recommendedLanes.some(
			(entry) => entry.lane === plan.staffing.handoffRecommendation.nextLane
		)
	) {
		pushIssue(
			issues,
			'staffing.recommendedLanes',
			'Handoff lane must be represented in the recommended lane set.'
		);
	}
	if (plan.meta.scopeClass === 'high-risk') {
		if (
			!plan.constraints.some((constraint) =>
				constraint.toLowerCase().includes('rollback')
			) &&
			!plan.assumptions.some((assumption) =>
				assumption.toLowerCase().includes('rollback')
			)
		) {
			pushIssue(
				issues,
				'constraints',
				'High-risk plans must describe rollback expectations.'
			);
		}
		if (plan.verification.requiredApprovals.length < 2) {
			pushIssue(
				issues,
				'verification.requiredApprovals',
				'High-risk plans require expanded approval coverage.'
			);
		}
		if (plan.verification.blockingRisks.length === 0) {
			pushIssue(
				issues,
				'verification.blockingRisks',
				'High-risk plans must name blocking risks explicitly.'
			);
		}
	}
	return issues;
}

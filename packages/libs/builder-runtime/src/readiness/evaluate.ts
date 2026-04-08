import { createEvidenceBundle } from '@contractspec/lib.execution-lanes';
import { createBuilderId } from '../utils/id';
import { createSuiteArtifact } from './helpers';
import { createBuilderReadinessSuites } from './suites';
import type {
	EvaluateBuilderReadinessInput,
	EvaluateBuilderReadinessResult,
} from './types';

export type {
	BuilderReadinessSuiteResult,
	EvaluateBuilderReadinessInput,
} from './types';

export function evaluateBuilderReadiness(
	input: EvaluateBuilderReadinessInput
): EvaluateBuilderReadinessResult {
	const {
		suites,
		mobileParityStatus,
		hasManaged,
		hasLocal,
		hasHybrid,
		supportedRuntimeModes,
		openApprovalTickets,
	} = createBuilderReadinessSuites(input);
	const blockingIssues = suites.flatMap((suite) => suite.blockers);
	const warnings = suites.flatMap((suite) => suite.warnings);
	const requiredApprovals = openApprovalTickets.map((ticket) => ({
		ticketId: ticket.id,
		reason: ticket.reason,
		requiredStrength: ticket.requiredStrength,
	}));
	const score = Math.max(
		0,
		100 - blockingIssues.length * 15 - warnings.length * 5
	);
	const evidence = createEvidenceBundle({
		runId: createBuilderId('readiness_run'),
		classes: ['builder-readiness', 'builder-replay'],
		artifacts: suites.map((suite) =>
			createSuiteArtifact(
				suite.key,
				[
					...suite.blockers.map((issue) => issue.message),
					...suite.warnings.map((issue) => issue.message),
				].join(' ') || suite.status
			)
		),
		summary: 'Builder readiness evaluation',
	});

	return {
		suites,
		report: {
			id: createBuilderId('readiness'),
			workspaceId: input.workspace.id,
			overallStatus:
				blockingIssues.length > 0
					? 'blocked'
					: warnings.length > 0
						? 'needs_review'
						: 'export_ready',
			score,
			supportedRuntimeModes,
			managedReady: hasManaged,
			localReady: hasLocal,
			hybridReady: hasHybrid,
			mobileParityStatus,
			blockingIssues,
			warnings,
			sourceCoverage: input.blueprint.coverageReport,
			policySummary: input.blueprint.policies,
			channelSummary: input.blueprint.channelSurfaces.map((surface) => ({
				channel: surface.channel,
				ready: input.bindings.some(
					(binding) =>
						binding.channelType === surface.channel && !binding.revokedAt
				),
				blockers: input.bindings.some(
					(binding) =>
						binding.channelType === surface.channel && !binding.revokedAt
				)
					? []
					: ['No active participant binding is configured for this channel.'],
			})),
			providerSummary: {
				runs: input.executionReceipts.length,
				verifiedRuns: input.executionReceipts.filter(
					(receipt) => receipt.verificationRefs.length > 0
				).length,
				comparisonRuns: input.comparisonRuns.length,
				activeProviderIds: [
					...new Set(
						input.executionReceipts.map((receipt) => receipt.providerId)
					),
				],
			},
			runtimeSummary: {
				selectedDefault: input.workspace.defaultRuntimeMode,
				registeredTargets: input.runtimeTargets.map((target) => target.id),
				healthyTargetIds: input.runtimeTargets
					.filter((target) => target.registrationState === 'registered')
					.map((target) => target.id),
			},
			requiredApprovals,
			harnessRunRefs: [evidence],
			evidenceBundleRef: evidence,
			recommendedNextAction:
				blockingIssues.length > 0
					? openApprovalTickets.length > 0
						? 'Capture the required approvals, then rerun readiness.'
						: 'Resolve blocking readiness issues before preview or export.'
					: warnings.length > 0
						? 'Review the warnings, then rerun readiness.'
						: 'Select a ready runtime mode and proceed to export.',
			assumptionsSummary: `${input.blueprint.assumptions.length} assumptions remain in the blueprint.`,
		},
	};
}

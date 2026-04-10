import { createIssue } from './helpers';
import type {
	BuilderReadinessSuiteResult,
	EvaluateBuilderReadinessInput,
} from './types';

export function createFoundationSuites(input: {
	readinessInput: EvaluateBuilderReadinessInput;
	invalidReceipts: EvaluateBuilderReadinessInput['executionReceipts'];
	invalidPatchProposals: EvaluateBuilderReadinessInput['patchProposals'];
	highRiskOpenConflicts: EvaluateBuilderReadinessInput['conflicts'];
	nonBlockingOpenConflicts: EvaluateBuilderReadinessInput['conflicts'];
}) {
	const { readinessInput, invalidReceipts, invalidPatchProposals } = input;
	const suites: BuilderReadinessSuiteResult[] = [
		{
			key: 'blueprint_consistency',
			status: readinessInput.blueprint.appBrief ? 'passed' : 'blocked',
			blockers: readinessInput.blueprint.appBrief
				? []
				: [createIssue('BLUEPRINT_BRIEF_EMPTY', 'Blueprint brief is empty.')],
			warnings:
				readinessInput.blueprint.surfaces.length > 0
					? []
					: [
							createIssue(
								'SURFACES_UNSPECIFIED',
								'No explicit UI surfaces are described.'
							),
						],
		},
		{
			key: 'source_coverage',
			status:
				readinessInput.blueprint.coverageReport.explicitCount > 0
					? 'passed'
					: 'blocked',
			blockers:
				readinessInput.blueprint.coverageReport.explicitCount > 0
					? []
					: [
							createIssue(
								'SOURCE_COVERAGE_EMPTY',
								'No explicit source coverage is available.'
							),
						],
			warnings:
				readinessInput.blueprint.coverageReport.missingCount > 0
					? [
							createIssue(
								'SOURCE_COVERAGE_GAPS',
								'Some blueprint fields still lack evidence coverage.'
							),
						]
					: [],
		},
		{
			key: 'provider_receipt_integrity',
			status:
				invalidReceipts.length > 0
					? 'blocked'
					: readinessInput.executionReceipts.length > 0
						? 'passed'
						: 'warning',
			blockers: invalidReceipts.map((receipt) =>
				createIssue(
					'PROVIDER_RECEIPT_INVALID',
					`Receipt ${receipt.id} is missing required provider or artifact metadata.`
				)
			),
			warnings:
				readinessInput.executionReceipts.length > 0
					? []
					: [
							createIssue(
								'PROVIDER_RECEIPTS_MISSING',
								'No provider receipts have been recorded yet.'
							),
						],
		},
		{
			key: 'patch_proposal_verification',
			status:
				invalidPatchProposals.length > 0
					? 'blocked'
					: readinessInput.patchProposals.length > 0
						? 'passed'
						: 'warning',
			blockers: invalidPatchProposals.map((proposal) =>
				createIssue(
					'PATCH_PROPOSAL_INVALID',
					`Patch proposal ${proposal.id} is missing write scopes or verification requirements.`
				)
			),
			warnings:
				readinessInput.patchProposals.length > 0
					? []
					: [
							createIssue(
								'PATCH_PROPOSALS_MISSING',
								'No normalized patch proposals are available yet.'
							),
						],
		},
		{
			key: 'decision_conflicts',
			status:
				input.highRiskOpenConflicts.length > 0
					? 'blocked'
					: readinessInput.conflicts.length > 0
						? 'warning'
						: 'passed',
			blockers: input.highRiskOpenConflicts.map((conflict) =>
				createIssue(
					'OPEN_HIGH_RISK_CONFLICT',
					`Conflict ${conflict.id} is still unresolved at ${conflict.severity} risk.`
				)
			),
			warnings:
				input.nonBlockingOpenConflicts.length > 0
					? [
							createIssue(
								'OPEN_FUSION_CONFLICTS',
								'Open source-fusion conflicts still require resolution.'
							),
						]
					: [],
		},
	];
	return suites;
}

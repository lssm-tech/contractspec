import type {
	BuilderBlueprint,
	BuilderMobileReviewCard,
	BuilderPreview,
} from '@contractspec/lib.builder-spec';
import type {
	ExecutionComparisonRun,
	ExternalPatchProposal,
	RuntimeMode,
} from '@contractspec/lib.provider-spec';
import { createBuilderId } from '../utils/id';

export function createBuilderPreview(input: {
	workspaceId: string;
	blueprint: BuilderBlueprint;
	runtimeMode: RuntimeMode;
	runtimeTargetId?: string;
	patchProposals?: ExternalPatchProposal[];
	comparisonRuns?: ExecutionComparisonRun[];
	mobileReviewCards?: BuilderMobileReviewCard[];
	existing?: BuilderPreview | null;
}) {
	return {
		id: input.existing?.id ?? createBuilderId('preview'),
		workspaceId: input.workspaceId,
		previewUrl: `builder://preview/${input.workspaceId}/${input.runtimeMode}/${input.blueprint.version}`,
		generatedWorkspaceRef: `builder://workspace/${input.workspaceId}/generated`,
		dataMode:
			input.blueprint.integrations.length > 0 ? 'connector_sandbox' : 'mock',
		runtimeMode: input.runtimeMode,
		runtimeTargetId: input.runtimeTargetId,
		buildStatus: 'ready',
		readinessSummary: `${input.blueprint.coverageReport.explicitCount} explicit blueprint fields backed by evidence.`,
		providerActivitySummary:
			input.patchProposals && input.patchProposals.length > 0
				? `${input.patchProposals.length} provider proposal(s) normalized for review.`
				: 'No provider proposals recorded yet.',
		diffSummary: input.existing
			? `Blueprint version ${input.existing.id} -> ${input.blueprint.version}`
			: 'Initial preview generated.',
		comparisonRunIds: (input.comparisonRuns ?? []).map((run) => run.id),
		mobileReviewCardIds: (input.mobileReviewCards ?? []).map((card) => card.id),
		createdAt: input.existing?.createdAt ?? new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	} satisfies BuilderPreview;
}

export function createBuilderExportBundle(input: {
	workspaceId: string;
	targetType: 'oss_workspace' | 'repo_pr' | 'studio_project' | 'package_bundle';
	runtimeMode: RuntimeMode;
	runtimeTargetRef?: string;
	verificationRef: string;
	artifactRefs: string[];
	receiptIds: string[];
	auditPackageRefs?: string[];
	existingId?: string;
}) {
	return {
		id: input.existingId ?? createBuilderId('export'),
		workspaceId: input.workspaceId,
		targetType: input.targetType,
		runtimeMode: input.runtimeMode,
		runtimeTargetRef: input.runtimeTargetRef,
		artifactRefs: input.artifactRefs,
		verificationRef: input.verificationRef,
		receiptIds: input.receiptIds,
		auditPackageRefs: input.auditPackageRefs ?? [],
	} as const;
}

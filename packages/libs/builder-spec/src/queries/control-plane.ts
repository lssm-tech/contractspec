import { createBuilderQuery } from './shared';

export const BuilderRuntimeTargetGetQuery = createBuilderQuery(
	'builder.runtimeTarget.get',
	'Get Runtime Target',
	'Fetch one Builder runtime target.',
	{ key: 'builder.runtime.targets', version: '1.0.0' }
);
export const BuilderRuntimeTargetListQuery = createBuilderQuery(
	'builder.runtimeTarget.list',
	'List Runtime Targets',
	'List runtime targets registered for a Builder workspace.',
	{ key: 'builder.runtime.targets', version: '1.0.0' }
);
export const BuilderProviderGetQuery = createBuilderQuery(
	'builder.provider.get',
	'Get External Provider',
	'Fetch one external execution provider registered for Builder.',
	{ key: 'builder.provider.routing', version: '1.0.0' }
);
export const BuilderProviderListQuery = createBuilderQuery(
	'builder.provider.list',
	'List External Providers',
	'List Builder external execution providers.',
	{ key: 'builder.provider.routing', version: '1.0.0' }
);
export const BuilderProviderRoutingPolicyGetQuery = createBuilderQuery(
	'builder.providerRoutingPolicy.get',
	'Get Provider Routing Policy',
	'Fetch the Builder provider routing policy.',
	{ key: 'builder.provider.routing', version: '1.0.0' }
);
export const BuilderExecutionContextGetQuery = createBuilderQuery(
	'builder.executionContext.get',
	'Get Execution Context Bundle',
	'Fetch one Builder external execution context bundle.',
	{ key: 'builder.provider.execution', version: '1.0.0' }
);
export const BuilderExecutionContextListQuery = createBuilderQuery(
	'builder.executionContext.list',
	'List Execution Context Bundles',
	'List Builder execution context bundles.',
	{ key: 'builder.provider.execution', version: '1.0.0' }
);
export const BuilderExecutionReceiptGetQuery = createBuilderQuery(
	'builder.executionReceipt.get',
	'Get Execution Receipt',
	'Fetch one Builder execution receipt.',
	{ key: 'builder.provider.execution', version: '1.0.0' }
);
export const BuilderExecutionReceiptListQuery = createBuilderQuery(
	'builder.executionReceipt.list',
	'List Execution Receipts',
	'List Builder execution receipts.',
	{ key: 'builder.provider.execution', version: '1.0.0' }
);
export const BuilderPatchProposalGetQuery = createBuilderQuery(
	'builder.patchProposal.get',
	'Get Patch Proposal',
	'Fetch one Builder patch proposal.',
	{ key: 'builder.provider.execution', version: '1.0.0' }
);
export const BuilderPatchProposalListQuery = createBuilderQuery(
	'builder.patchProposal.list',
	'List Patch Proposals',
	'List Builder patch proposals.',
	{ key: 'builder.provider.execution', version: '1.0.0' }
);
export const BuilderComparisonGetQuery = createBuilderQuery(
	'builder.comparison.get',
	'Get Comparison Run',
	'Fetch one Builder provider comparison run.',
	{ key: 'builder.provider.execution', version: '1.0.0' }
);
export const BuilderComparisonListQuery = createBuilderQuery(
	'builder.comparison.list',
	'List Comparison Runs',
	'List Builder provider comparison runs.',
	{ key: 'builder.provider.execution', version: '1.0.0' }
);
export const BuilderMobileReviewCardGetQuery = createBuilderQuery(
	'builder.mobileReviewCard.get',
	'Get Mobile Review Card',
	'Fetch one Builder mobile review card.',
	{ key: 'builder.mobile.review', version: '1.0.0' }
);
export const BuilderMobileReviewCardListQuery = createBuilderQuery(
	'builder.mobileReviewCard.list',
	'List Mobile Review Cards',
	'List Builder mobile review cards.',
	{ key: 'builder.mobile.review', version: '1.0.0' }
);

export const BUILDER_CONTROL_PLANE_QUERIES = [
	BuilderRuntimeTargetGetQuery,
	BuilderRuntimeTargetListQuery,
	BuilderProviderGetQuery,
	BuilderProviderListQuery,
	BuilderProviderRoutingPolicyGetQuery,
	BuilderExecutionContextGetQuery,
	BuilderExecutionContextListQuery,
	BuilderExecutionReceiptGetQuery,
	BuilderExecutionReceiptListQuery,
	BuilderPatchProposalGetQuery,
	BuilderPatchProposalListQuery,
	BuilderComparisonGetQuery,
	BuilderComparisonListQuery,
	BuilderMobileReviewCardGetQuery,
	BuilderMobileReviewCardListQuery,
] as const;

import { createBuilderCommand } from './shared';

export const BuilderRuntimeTargetRegisterCommand = createBuilderCommand(
	'builder.runtimeTarget.register',
	'Register Runtime Target',
	'Register or heartbeat a Builder runtime target.',
	{ key: 'builder.runtime.targets', version: '1.0.0' }
);
export const BuilderRuntimeTargetRegisterLocalDaemonCommand =
	createBuilderCommand(
		'builder.runtimeTarget.registerLocalDaemon',
		'Register Local Daemon Runtime Target',
		'Register a local-daemon Builder runtime target with handshake, trust, and lease defaults.',
		{ key: 'builder.runtime.targets', version: '1.0.0' }
	);
export const BuilderRuntimeTargetUpdateCommand = createBuilderCommand(
	'builder.runtimeTarget.update',
	'Update Runtime Target',
	'Update Builder runtime target capabilities or trust metadata.',
	{ key: 'builder.runtime.targets', version: '1.0.0' }
);
export const BuilderRuntimeTargetQuarantineCommand = createBuilderCommand(
	'builder.runtimeTarget.quarantine',
	'Quarantine Runtime Target',
	'Quarantine a Builder runtime target after suspicious or degraded behavior.',
	{ key: 'builder.runtime.targets', version: '1.0.0' }
);
export const BuilderProviderRegisterCommand = createBuilderCommand(
	'builder.provider.register',
	'Register External Provider',
	'Register an external execution provider for one Builder workspace.',
	{ key: 'builder.provider.routing', version: '1.0.0' }
);
export const BuilderProviderUpdateCommand = createBuilderCommand(
	'builder.provider.update',
	'Update External Provider',
	'Update external execution provider availability, risk policy, or capabilities.',
	{ key: 'builder.provider.routing', version: '1.0.0' }
);
export const BuilderProviderRoutingPolicyUpsertCommand = createBuilderCommand(
	'builder.providerRoutingPolicy.upsert',
	'Upsert Provider Routing Policy',
	'Create or update the Builder provider routing policy.',
	{ key: 'builder.provider.routing', version: '1.0.0' }
);
export const BuilderProviderExecutionPrepareContextCommand =
	createBuilderCommand(
		'builder.providerExecution.prepareContext',
		'Prepare Provider Execution Context',
		'Build a scoped provider execution context bundle.',
		{ key: 'builder.provider.execution', version: '1.0.0' }
	);
export const BuilderProviderExecutionIngestOutputCommand = createBuilderCommand(
	'builder.providerExecution.ingestOutput',
	'Ingest Provider Execution Output',
	'Normalize a provider execution receipt, output, and optional patch proposal.',
	{ key: 'builder.provider.execution', version: '1.0.0' }
);
export const BuilderPatchProposalAcceptCommand = createBuilderCommand(
	'builder.patchProposal.accept',
	'Accept Patch Proposal',
	'Accept a normalized Builder patch proposal for preview.',
	{ key: 'builder.provider.execution', version: '1.0.0' }
);
export const BuilderPatchProposalRejectCommand = createBuilderCommand(
	'builder.patchProposal.reject',
	'Reject Patch Proposal',
	'Reject a normalized Builder patch proposal.',
	{ key: 'builder.provider.execution', version: '1.0.0' }
);
export const BuilderPatchProposalSupersedeCommand = createBuilderCommand(
	'builder.patchProposal.supersede',
	'Supersede Patch Proposal',
	'Mark a Builder patch proposal as superseded by a newer attempt.',
	{ key: 'builder.provider.execution', version: '1.0.0' }
);
export const BuilderComparisonRecordCommand = createBuilderCommand(
	'builder.comparison.record',
	'Record Comparison Run',
	'Record a Builder provider comparison run and verdict.',
	{ key: 'builder.provider.execution', version: '1.0.0' }
);
export const BuilderMobileReviewCardCreateCommand = createBuilderCommand(
	'builder.mobileReviewCard.create',
	'Create Mobile Review Card',
	'Create a mobile review artifact for Telegram, WhatsApp, or mobile web.',
	{ key: 'builder.mobile.review', version: '1.0.0' }
);
export const BuilderMobileReviewCardResolveCommand = createBuilderCommand(
	'builder.mobileReviewCard.resolve',
	'Resolve Mobile Review Card',
	'Resolve or acknowledge a Builder mobile review card after an operator action.',
	{ key: 'builder.mobile.review', version: '1.0.0' }
);

export const BUILDER_CONTROL_PLANE_COMMANDS = [
	BuilderRuntimeTargetRegisterCommand,
	BuilderRuntimeTargetRegisterLocalDaemonCommand,
	BuilderRuntimeTargetUpdateCommand,
	BuilderRuntimeTargetQuarantineCommand,
	BuilderProviderRegisterCommand,
	BuilderProviderUpdateCommand,
	BuilderProviderRoutingPolicyUpsertCommand,
	BuilderProviderExecutionPrepareContextCommand,
	BuilderProviderExecutionIngestOutputCommand,
	BuilderPatchProposalAcceptCommand,
	BuilderPatchProposalRejectCommand,
	BuilderPatchProposalSupersedeCommand,
	BuilderComparisonRecordCommand,
	BuilderMobileReviewCardCreateCommand,
	BuilderMobileReviewCardResolveCommand,
] as const;

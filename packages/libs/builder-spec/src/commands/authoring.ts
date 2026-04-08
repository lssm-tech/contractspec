import { createBuilderCommand } from './shared';

export const BuilderBriefGenerateCommand = createBuilderCommand(
	'builder.brief.generate',
	'Generate Builder Brief',
	'Compile Builder sources into an application brief.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderBriefUpdateCommand = createBuilderCommand(
	'builder.brief.update',
	'Update Builder Brief',
	'Patch the Builder brief using reviewed directives.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderDirectiveAcceptCommand = createBuilderCommand(
	'builder.directive.accept',
	'Accept Builder Directive',
	'Accept a Builder directive candidate.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderDirectiveRejectCommand = createBuilderCommand(
	'builder.directive.reject',
	'Reject Builder Directive',
	'Reject a Builder directive candidate.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderFusionResolveConflictCommand = createBuilderCommand(
	'builder.fusion.resolveConflict',
	'Resolve Builder Conflict',
	'Resolve a Builder fusion conflict with a recorded receipt.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderAssumptionConfirmCommand = createBuilderCommand(
	'builder.assumption.confirm',
	'Confirm Builder Assumption',
	'Confirm a provisional Builder assumption.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderAssumptionRejectCommand = createBuilderCommand(
	'builder.assumption.reject',
	'Reject Builder Assumption',
	'Reject a provisional Builder assumption.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderBlueprintGenerateCommand = createBuilderCommand(
	'builder.blueprint.generate',
	'Generate Builder Blueprint',
	'Generate or regenerate the Builder blueprint from reviewed evidence.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderBlueprintPatchCommand = createBuilderCommand(
	'builder.blueprint.patch',
	'Patch Builder Blueprint',
	'Patch the Builder blueprint with a reviewed change.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderBlueprintLockSectionCommand = createBuilderCommand(
	'builder.blueprint.lockSection',
	'Lock Blueprint Section',
	'Lock a Builder blueprint section against automatic overwrite.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderBlueprintUnlockSectionCommand = createBuilderCommand(
	'builder.blueprint.unlockSection',
	'Unlock Blueprint Section',
	'Unlock a Builder blueprint section for Builder regeneration.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);

export const BUILDER_AUTHORING_COMMANDS = [
	BuilderBriefGenerateCommand,
	BuilderBriefUpdateCommand,
	BuilderDirectiveAcceptCommand,
	BuilderDirectiveRejectCommand,
	BuilderFusionResolveConflictCommand,
	BuilderAssumptionConfirmCommand,
	BuilderAssumptionRejectCommand,
	BuilderBlueprintGenerateCommand,
	BuilderBlueprintPatchCommand,
	BuilderBlueprintLockSectionCommand,
	BuilderBlueprintUnlockSectionCommand,
] as const;

import { createBuilderCommand } from './shared';

export const BuilderPlanCompileCommand = createBuilderCommand(
	'builder.plan.compile',
	'Compile Builder Plan',
	'Compile a Builder blueprint into an execution-lane plan.',
	{ key: 'builder.plan.compile', version: '1.0.0' }
);
export const BuilderPlanApproveCommand = createBuilderCommand(
	'builder.plan.approve',
	'Approve Builder Plan',
	'Approve a compiled Builder execution plan.',
	{ key: 'builder.plan.execute', version: '1.0.0' }
);
export const BuilderPlanExecuteCommand = createBuilderCommand(
	'builder.plan.execute',
	'Execute Builder Plan',
	'Execute an approved Builder plan.',
	{ key: 'builder.plan.execute', version: '1.0.0' }
);
export const BuilderPlanPauseCommand = createBuilderCommand(
	'builder.plan.pause',
	'Pause Builder Plan',
	'Pause Builder plan execution.',
	{ key: 'builder.plan.execute', version: '1.0.0' }
);
export const BuilderPlanResumeCommand = createBuilderCommand(
	'builder.plan.resume',
	'Resume Builder Plan',
	'Resume Builder plan execution.',
	{ key: 'builder.plan.execute', version: '1.0.0' }
);
export const BuilderPlanCancelCommand = createBuilderCommand(
	'builder.plan.cancel',
	'Cancel Builder Plan',
	'Cancel Builder plan execution.',
	{ key: 'builder.plan.execute', version: '1.0.0' }
);
export const BuilderApprovalRequestCommand = createBuilderCommand(
	'builder.approval.request',
	'Request Builder Approval',
	'Request a Builder approval ticket.',
	{ key: 'builder.export.prepare', version: '1.0.0' }
);
export const BuilderApprovalCaptureCommand = createBuilderCommand(
	'builder.approval.capture',
	'Capture Builder Approval',
	'Capture a Builder approval decision.',
	{ key: 'builder.export.prepare', version: '1.0.0' }
);
export const BuilderApprovalInvalidateCommand = createBuilderCommand(
	'builder.approval.invalidate',
	'Invalidate Builder Approval',
	'Invalidate a stale or revoked Builder approval.',
	{ key: 'builder.export.prepare', version: '1.0.0' }
);
export const BuilderPreviewCreateCommand = createBuilderCommand(
	'builder.preview.create',
	'Create Builder Preview',
	'Create a new Builder preview.',
	{ key: 'builder.preview.generate', version: '1.0.0' }
);
export const BuilderPreviewRefreshCommand = createBuilderCommand(
	'builder.preview.refresh',
	'Refresh Builder Preview',
	'Refresh an existing Builder preview.',
	{ key: 'builder.preview.generate', version: '1.0.0' }
);
export const BuilderPreviewRunHarnessCommand = createBuilderCommand(
	'builder.preview.runHarness',
	'Run Builder Harness',
	'Run Builder readiness suites for a preview.',
	{ key: 'builder.harness.run', version: '1.0.0' }
);
export const BuilderExportPrepareCommand = createBuilderCommand(
	'builder.export.prepare',
	'Prepare Builder Export',
	'Prepare a governed Builder export bundle.',
	{ key: 'builder.export.prepare', version: '1.0.0' }
);
export const BuilderExportApproveCommand = createBuilderCommand(
	'builder.export.approve',
	'Approve Builder Export',
	'Approve a Builder export bundle.',
	{ key: 'builder.export.prepare', version: '1.0.0' }
);
export const BuilderExportExecuteCommand = createBuilderCommand(
	'builder.export.execute',
	'Execute Builder Export',
	'Execute a governed Builder export.',
	{ key: 'builder.export.prepare', version: '1.0.0' }
);

export const BUILDER_LIFECYCLE_COMMANDS = [
	BuilderPlanCompileCommand,
	BuilderPlanApproveCommand,
	BuilderPlanExecuteCommand,
	BuilderPlanPauseCommand,
	BuilderPlanResumeCommand,
	BuilderPlanCancelCommand,
	BuilderApprovalRequestCommand,
	BuilderApprovalCaptureCommand,
	BuilderApprovalInvalidateCommand,
	BuilderPreviewCreateCommand,
	BuilderPreviewRefreshCommand,
	BuilderPreviewRunHarnessCommand,
	BuilderExportPrepareCommand,
	BuilderExportApproveCommand,
	BuilderExportExecuteCommand,
] as const;

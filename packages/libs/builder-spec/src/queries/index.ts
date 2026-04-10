import { BUILDER_CONTROL_PLANE_QUERIES } from './control-plane';
import { createBuilderQuery } from './shared';
import { BUILDER_WORKBENCH_QUERIES } from './workbench';

export * from './control-plane';
export * from './shared';
export * from './workbench';

export const BuilderWorkspaceGetQuery = createBuilderQuery(
	'builder.workspace.get',
	'Get Builder Workspace',
	'Fetch one Builder workspace.',
	{ key: 'builder.chat.web', version: '1.0.0' }
);
export const BuilderWorkspaceListQuery = createBuilderQuery(
	'builder.workspace.list',
	'List Builder Workspaces',
	'List Builder workspaces.',
	{ key: 'builder.chat.web', version: '1.0.0' }
);
export const BuilderConversationGetQuery = createBuilderQuery(
	'builder.conversation.get',
	'Get Builder Conversation',
	'Fetch one Builder conversation.',
	{ key: 'builder.chat.web', version: '1.0.0' }
);
export const BuilderSourceListQuery = createBuilderQuery(
	'builder.source.list',
	'List Builder Sources',
	'List Builder sources.',
	{ key: 'builder.ingest.files', version: '1.0.0' }
);
export const BuilderSourceGetQuery = createBuilderQuery(
	'builder.source.get',
	'Get Builder Source',
	'Fetch one Builder source.',
	{ key: 'builder.ingest.files', version: '1.0.0' }
);
export const BuilderChannelThreadQuery = createBuilderQuery(
	'builder.channel.thread',
	'Get Builder Channel Thread',
	'Fetch a Builder channel thread timeline.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);
export const BuilderDirectiveListQuery = createBuilderQuery(
	'builder.directive.list',
	'List Builder Directives',
	'List Builder directive candidates.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderConflictListQuery = createBuilderQuery(
	'builder.conflict.list',
	'List Builder Conflicts',
	'List Builder conflicts.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderAssumptionListQuery = createBuilderQuery(
	'builder.assumption.list',
	'List Builder Assumptions',
	'List Builder assumptions.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderBlueprintGetQuery = createBuilderQuery(
	'builder.blueprint.get',
	'Get Builder Blueprint',
	'Fetch the current Builder blueprint.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderPlanGetQuery = createBuilderQuery(
	'builder.plan.get',
	'Get Builder Plan',
	'Fetch the current Builder plan.',
	{ key: 'builder.plan.compile', version: '1.0.0' }
);
export const BuilderPreviewGetQuery = createBuilderQuery(
	'builder.preview.get',
	'Get Builder Preview',
	'Fetch the current Builder preview.',
	{ key: 'builder.preview.generate', version: '1.0.0' }
);
export const BuilderReadinessReportQuery = createBuilderQuery(
	'builder.readiness.report',
	'Get Builder Readiness Report',
	'Fetch the current Builder readiness report.',
	{ key: 'builder.harness.run', version: '1.0.0' }
);
export const BuilderExportGetQuery = createBuilderQuery(
	'builder.export.get',
	'Get Builder Export Bundle',
	'Fetch the current Builder export bundle.',
	{ key: 'builder.export.prepare', version: '1.0.0' }
);

export const BUILDER_QUERIES = [
	BuilderWorkspaceGetQuery,
	BuilderWorkspaceListQuery,
	BuilderConversationGetQuery,
	BuilderSourceListQuery,
	BuilderSourceGetQuery,
	BuilderChannelThreadQuery,
	BuilderDirectiveListQuery,
	BuilderConflictListQuery,
	BuilderAssumptionListQuery,
	BuilderBlueprintGetQuery,
	BuilderPlanGetQuery,
	BuilderPreviewGetQuery,
	BuilderReadinessReportQuery,
	BuilderExportGetQuery,
	...BUILDER_CONTROL_PLANE_QUERIES,
	...BUILDER_WORKBENCH_QUERIES,
] as const;

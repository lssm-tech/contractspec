import { createBuilderQuery } from './shared';

export const BuilderWorkspaceSnapshotQuery = createBuilderQuery(
	'builder.workspace.snapshot',
	'Get Builder Workspace Snapshot',
	'Fetch the Builder workbench snapshot for one workspace.',
	{ key: 'builder.chat.web', version: '1.0.0' }
);
export const BuilderParticipantBindingListQuery = createBuilderQuery(
	'builder.participantBinding.list',
	'List Builder Participant Bindings',
	'List Builder participant bindings for a workspace.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);
export const BuilderParticipantBindingGetQuery = createBuilderQuery(
	'builder.participantBinding.get',
	'Get Builder Participant Binding',
	'Fetch one Builder participant binding.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);
export const BuilderTranscriptListQuery = createBuilderQuery(
	'builder.transcript.list',
	'List Builder Transcript Segments',
	'List Builder transcript segments for a workspace or source.',
	{ key: 'builder.stt', version: '1.0.0' }
);
export const BuilderExtractedPartListQuery = createBuilderQuery(
	'builder.source.parts.list',
	'List Builder Extracted Parts',
	'List extracted Builder source parts for a workspace or source.',
	{ key: 'builder.ingest.files', version: '1.0.0' }
);
export const BuilderEvidenceListQuery = createBuilderQuery(
	'builder.evidence.list',
	'List Builder Evidence References',
	'List Builder evidence references.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderApprovalTicketListQuery = createBuilderQuery(
	'builder.approval.list',
	'List Builder Approval Tickets',
	'List Builder approval tickets for a workspace.',
	{ key: 'builder.export.prepare', version: '1.0.0' }
);
export const BuilderDecisionReceiptListQuery = createBuilderQuery(
	'builder.decision.list',
	'List Builder Decision Receipts',
	'List Builder decision receipts for a workspace.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderFusionGraphListQuery = createBuilderQuery(
	'builder.fusionGraph.list',
	'List Builder Fusion Graph Edges',
	'List Builder fusion graph edges for a workspace.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderWorkbenchSnapshotQuery = createBuilderQuery(
	'builder.workbench.snapshot',
	'Get Builder Workbench Snapshot',
	'Fetch the aggregate Builder workspace snapshot used by the workbench.',
	{ key: 'builder.chat.web', version: '1.0.0' }
);

export const BUILDER_WORKBENCH_QUERIES = [
	BuilderWorkspaceSnapshotQuery,
	BuilderParticipantBindingListQuery,
	BuilderParticipantBindingGetQuery,
	BuilderTranscriptListQuery,
	BuilderExtractedPartListQuery,
	BuilderEvidenceListQuery,
	BuilderApprovalTicketListQuery,
	BuilderDecisionReceiptListQuery,
	BuilderFusionGraphListQuery,
	BuilderWorkbenchSnapshotQuery,
] as const;

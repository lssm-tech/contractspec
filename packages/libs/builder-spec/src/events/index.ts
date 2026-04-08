import { createBuilderEvent } from './shared';

export * from './shared';

export const BuilderWorkspaceCreatedEvent = createBuilderEvent(
	'builder.workspace.created',
	'Emitted when a Builder workspace is created.',
	{ key: 'builder.chat.web', version: '1.0.0' }
);
export const BuilderConversationStartedEvent = createBuilderEvent(
	'builder.conversation.started',
	'Emitted when a Builder conversation starts.',
	{ key: 'builder.chat.web', version: '1.0.0' }
);
export const BuilderParticipantBindingUpdatedEvent = createBuilderEvent(
	'builder.participantBinding.updated',
	'Emitted when Builder binds, updates, or revokes a participant channel binding.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);
export const BuilderChannelMessageReceivedEvent = createBuilderEvent(
	'builder.channel.message.received',
	'Emitted when Builder receives a control-channel message.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);
export const BuilderChannelMessageEditedEvent = createBuilderEvent(
	'builder.channel.message.edited',
	'Emitted when Builder records a control-channel edit.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);
export const BuilderChannelMessageDeletedEvent = createBuilderEvent(
	'builder.channel.message.deleted',
	'Emitted when Builder records a control-channel delete.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);
export const BuilderVoiceTranscriptionCompletedEvent = createBuilderEvent(
	'builder.voice.transcription.completed',
	'Emitted when Builder completes voice transcription.',
	{ key: 'builder.stt', version: '1.0.0' }
);
export const BuilderVoiceTranscriptionFlaggedEvent = createBuilderEvent(
	'builder.voice.transcription.flagged',
	'Emitted when Builder flags a voice transcript for confirmation.',
	{ key: 'builder.stt', version: '1.0.0' }
);
export const BuilderSourceIngestedEvent = createBuilderEvent(
	'builder.source.ingested',
	'Emitted when Builder ingests a source.',
	{ key: 'builder.ingest.files', version: '1.0.0' }
);
export const BuilderConflictDetectedEvent = createBuilderEvent(
	'builder.conflict.detected',
	'Emitted when Builder detects a source conflict.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderAssumptionCreatedEvent = createBuilderEvent(
	'builder.assumption.created',
	'Emitted when Builder creates an assumption.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderAssumptionResolvedEvent = createBuilderEvent(
	'builder.assumption.resolved',
	'Emitted when Builder resolves an assumption.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderBriefGeneratedEvent = createBuilderEvent(
	'builder.brief.generated',
	'Emitted when Builder generates a brief.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderPlanCompiledEvent = createBuilderEvent(
	'builder.plan.compiled',
	'Emitted when Builder compiles a plan.',
	{ key: 'builder.plan.compile', version: '1.0.0' }
);
export const BuilderPlanExecutionStartedEvent = createBuilderEvent(
	'builder.plan.execution.started',
	'Emitted when Builder plan execution starts.',
	{ key: 'builder.plan.execute', version: '1.0.0' }
);
export const BuilderPlanExecutionCompletedEvent = createBuilderEvent(
	'builder.plan.execution.completed',
	'Emitted when Builder plan execution completes.',
	{ key: 'builder.plan.execute', version: '1.0.0' }
);
export const BuilderBlueprintUpdatedEvent = createBuilderEvent(
	'builder.blueprint.updated',
	'Emitted when Builder updates its blueprint.',
	{ key: 'builder.fusion.resolve', version: '1.0.0' }
);
export const BuilderPreviewUpdatedEvent = createBuilderEvent(
	'builder.preview.updated',
	'Emitted when Builder updates a preview.',
	{ key: 'builder.preview.generate', version: '1.0.0' }
);
export const BuilderHarnessCompletedEvent = createBuilderEvent(
	'builder.harness.completed',
	'Emitted when Builder completes readiness verification.',
	{ key: 'builder.harness.run', version: '1.0.0' }
);
export const BuilderApprovalRequestedEvent = createBuilderEvent(
	'builder.approval.requested',
	'Emitted when Builder requests approval.',
	{ key: 'builder.export.prepare', version: '1.0.0' }
);
export const BuilderApprovalResolvedEvent = createBuilderEvent(
	'builder.approval.resolved',
	'Emitted when Builder resolves an approval ticket.',
	{ key: 'builder.export.prepare', version: '1.0.0' }
);
export const BuilderExportPreparedEvent = createBuilderEvent(
	'builder.export.prepared',
	'Emitted when Builder prepares an export.',
	{ key: 'builder.export.prepare', version: '1.0.0' }
);
export const BuilderExportCompletedEvent = createBuilderEvent(
	'builder.export.completed',
	'Emitted when Builder completes an export.',
	{ key: 'builder.export.prepare', version: '1.0.0' }
);

export const BUILDER_EVENTS = [
	BuilderWorkspaceCreatedEvent,
	BuilderConversationStartedEvent,
	BuilderParticipantBindingUpdatedEvent,
	BuilderChannelMessageReceivedEvent,
	BuilderChannelMessageEditedEvent,
	BuilderChannelMessageDeletedEvent,
	BuilderVoiceTranscriptionCompletedEvent,
	BuilderVoiceTranscriptionFlaggedEvent,
	BuilderSourceIngestedEvent,
	BuilderConflictDetectedEvent,
	BuilderAssumptionCreatedEvent,
	BuilderAssumptionResolvedEvent,
	BuilderBriefGeneratedEvent,
	BuilderPlanCompiledEvent,
	BuilderPlanExecutionStartedEvent,
	BuilderPlanExecutionCompletedEvent,
	BuilderBlueprintUpdatedEvent,
	BuilderPreviewUpdatedEvent,
	BuilderHarnessCompletedEvent,
	BuilderApprovalRequestedEvent,
	BuilderApprovalResolvedEvent,
	BuilderExportPreparedEvent,
	BuilderExportCompletedEvent,
] as const;

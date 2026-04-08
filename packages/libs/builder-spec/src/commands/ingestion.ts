import { createBuilderCommand } from './shared';

export const BuilderChannelReceiveInboundCommand = createBuilderCommand(
	'builder.channel.receiveInbound',
	'Receive Inbound Builder Message',
	'Receive an inbound Builder control-channel event.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);
export const BuilderChannelRecordEditCommand = createBuilderCommand(
	'builder.channel.recordEdit',
	'Record Builder Channel Edit',
	'Record a channel edit as a superseding Builder message.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);
export const BuilderChannelRecordDeleteCommand = createBuilderCommand(
	'builder.channel.recordDelete',
	'Record Builder Channel Delete',
	'Record a channel delete as a Builder retraction signal.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);
export const BuilderChannelSendOutboundCommand = createBuilderCommand(
	'builder.channel.sendOutbound',
	'Send Builder Outbound Message',
	'Queue an outbound Builder change card or escalation message.',
	{ key: 'builder.channels.interactive', version: '1.0.0' }
);
export const BuilderChannelCaptureInteractiveSelectionCommand =
	createBuilderCommand(
		'builder.channel.captureInteractiveSelection',
		'Capture Interactive Selection',
		'Capture a structured interactive reply from a Builder messaging channel.',
		{ key: 'builder.channels.interactive', version: '1.0.0' }
	);
export const BuilderVoiceUploadUtteranceCommand = createBuilderCommand(
	'builder.voice.uploadUtterance',
	'Upload Voice Utterance',
	'Upload a Builder voice utterance for transcription.',
	{ key: 'builder.voice.web', version: '1.0.0' }
);
export const BuilderVoiceTranscribeCommand = createBuilderCommand(
	'builder.voice.transcribe',
	'Transcribe Builder Voice',
	'Transcribe Builder voice input into timestamped transcript segments.',
	{ key: 'builder.stt', version: '1.0.0' }
);
export const BuilderVoiceConfirmTranscriptCommand = createBuilderCommand(
	'builder.voice.confirmTranscript',
	'Confirm Transcript',
	'Confirm a provisional Builder transcript segment or utterance.',
	{ key: 'builder.voice.web', version: '1.0.0' }
);
export const BuilderVoiceRejectTranscriptCommand = createBuilderCommand(
	'builder.voice.rejectTranscript',
	'Reject Transcript',
	'Reject a provisional Builder transcript segment or utterance.',
	{ key: 'builder.voice.web', version: '1.0.0' }
);
export const BuilderSourceUploadAssetCommand = createBuilderCommand(
	'builder.source.uploadAsset',
	'Upload Builder Asset',
	'Upload a file or document into a Builder workspace.',
	{ key: 'builder.ingest.files', version: '1.0.0' }
);
export const BuilderSourceAttachStudioSnapshotCommand = createBuilderCommand(
	'builder.source.attachStudioSnapshot',
	'Attach Studio Snapshot',
	'Attach a Studio snapshot as a Builder source.',
	{ key: 'builder.import.studio', version: '1.0.0' }
);
export const BuilderSourceReprocessCommand = createBuilderCommand(
	'builder.source.reprocess',
	'Reprocess Builder Source',
	'Re-run Builder extraction and directive compilation for a source.',
	{ key: 'builder.ingest.files', version: '1.0.0' }
);
export const BuilderSourceRemoveCommand = createBuilderCommand(
	'builder.source.remove',
	'Remove Builder Source',
	'Mark a Builder source as removed or superseded.',
	{ key: 'builder.ingest.files', version: '1.0.0' }
);

export const BUILDER_INGESTION_COMMANDS = [
	BuilderChannelReceiveInboundCommand,
	BuilderChannelRecordEditCommand,
	BuilderChannelRecordDeleteCommand,
	BuilderChannelSendOutboundCommand,
	BuilderChannelCaptureInteractiveSelectionCommand,
	BuilderVoiceUploadUtteranceCommand,
	BuilderVoiceTranscribeCommand,
	BuilderVoiceConfirmTranscriptCommand,
	BuilderVoiceRejectTranscriptCommand,
	BuilderSourceUploadAssetCommand,
	BuilderSourceAttachStudioSnapshotCommand,
	BuilderSourceReprocessCommand,
	BuilderSourceRemoveCommand,
] as const;

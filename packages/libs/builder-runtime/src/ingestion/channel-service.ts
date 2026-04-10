import type { BuilderStore } from '../stores/store';
import { compileDirectiveCandidates } from './directives';
import { createSourceRecord } from './extractor';
import {
	createChannelMessage,
	createMessageEvidence,
	deriveTrustProfile,
	OUTBOUND_LOOP_PREFIX,
	resolveReplayState,
	resolveSourceType,
} from './helpers';
import type {
	BuilderAssetIngestionResult,
	BuilderIngestionServiceOptions,
} from './service-types';
import type {
	BuilderChannelInboundEnvelope,
	BuilderVoiceTranscriptionInput,
} from './types';

export async function ingestBuilderChannelMessage(input: {
	store: BuilderStore;
	options: BuilderIngestionServiceOptions;
	ingestAsset: (
		assetInput: import('./types').BuilderAssetUploadInput
	) => Promise<BuilderAssetIngestionResult>;
	transcribeVoice: (
		transcriptionInput: BuilderVoiceTranscriptionInput
	) => Promise<{
		segments: import('@contractspec/lib.builder-spec').BuilderTranscriptSegment[];
		directives: ReturnType<typeof compileDirectiveCandidates>;
	}>;
	envelope: BuilderChannelInboundEnvelope;
}) {
	const binding = input.envelope.participantBindingId
		? await input.store.getParticipantBinding(
				input.envelope.participantBindingId
			)
		: null;
	const trustProfile = deriveTrustProfile({
		binding,
		override: input.envelope.trustProfile,
	});
	const replayState = await resolveReplayState({
		store: input.store,
		envelope: input.envelope,
	});
	const replaySource = replayState.exactSource ?? replayState.latestSource;
	if (replayState.exactMessage && replaySource) {
		return {
			source: replaySource,
			message: replayState.exactMessage,
			directives: [],
			parts: [],
			transcripts: [],
			attachmentSources: [],
		};
	}
	const source = createSourceRecord({
		workspaceId: input.envelope.workspaceId,
		conversationId: input.envelope.conversationId,
		title:
			input.envelope.text ??
			input.envelope.interactiveSelection?.label ??
			input.envelope.file?.title ??
			`${input.envelope.channelType} ${input.envelope.messageKind}`,
		sourceType: resolveSourceType(input.envelope),
		channelType: input.envelope.channelType,
		parentSourceId: input.envelope.file?.parentSourceId,
		derivedFromSourceId: input.envelope.file?.derivedFromSourceId,
		channelEventType: input.envelope.eventType,
		externalEventId: input.envelope.externalEventId,
		externalConversationId: input.envelope.externalConversationId,
		externalChannelId: input.envelope.externalChannelId,
		externalUserId: input.envelope.externalUserId,
		externalMessageId: input.envelope.externalMessageId,
		replyToExternalMessageId: input.envelope.replyToExternalMessageId,
		editVersion: input.envelope.messageRevision,
		filename: input.envelope.file?.filename,
		language: input.envelope.file?.language,
		policyClassification: input.envelope.file?.policyClassification,
		approvalState: 'draft',
		supersedesSourceId: replayState.shouldSupersede
			? replayState.latestSource?.id
			: undefined,
	});
	source.provenance.sourceId = source.id;
	source.trustProfile = trustProfile;
	await input.store.saveSource(source);

	const message = createChannelMessage({
		envelope: input.envelope,
		sourceId: source.id,
		trustProfile,
		now: input.options.now,
		fallbackSupersedesMessageId: replayState.shouldSupersede
			? replayState.latestMessage?.id
			: undefined,
	});
	await input.store.saveChannelMessage(message);
	await input.store.saveEvidenceReference(
		createMessageEvidence(message, source.id)
	);

	if (input.envelope.outboundTag?.startsWith(OUTBOUND_LOOP_PREFIX)) {
		return { source, message, directives: [], parts: [], transcripts: [] };
	}

	const directiveText = [
		input.envelope.text,
		input.envelope.interactiveSelection?.label,
		typeof input.envelope.metadata?.operationSummary === 'string'
			? input.envelope.metadata.operationSummary
			: undefined,
	]
		.filter((value): value is string => Boolean(value?.trim()))
		.join('. ');
	const directives = directiveText
		? compileDirectiveCandidates({
				workspaceId: input.envelope.workspaceId,
				sourceIds: [source.id],
				text: directiveText,
				confidence:
					message.messageKind === 'button' ||
					message.messageKind === 'list_selection'
						? 0.96
						: 0.84,
				proposedByMessageId: message.id,
				trustProfile,
			})
		: [];
	for (const directive of directives) {
		await input.store.saveDirective(directive);
	}

	const attachmentResults = input.envelope.file
		? [
				await input.ingestAsset({
					...input.envelope.file,
					workspaceId: input.envelope.workspaceId,
					conversationId: input.envelope.conversationId,
					parentSourceId: source.id,
					derivedFromSourceId: source.id,
					trustProfile,
				}),
			]
		: [];
	const transcripts =
		input.envelope.messageKind === 'voice' && input.envelope.audioContentBase64
			? (
					await input.transcribeVoice({
						workspaceId: input.envelope.workspaceId,
						sourceId: source.id,
						conversationId: input.envelope.conversationId,
						channelType: input.envelope.channelType,
						participantBindingId: input.envelope.participantBindingId,
						audioContentBase64: input.envelope.audioContentBase64,
						language: input.envelope.language,
						model: input.envelope.model,
						sttProvider: input.envelope.sttProvider,
						retainAudio: input.envelope.metadata?.retainAudio === true,
					})
				).segments
			: [];

	return {
		source,
		message,
		directives,
		transcripts,
		parts: attachmentResults.flatMap((result) => result.parts),
		attachmentSources: attachmentResults.map((result) => result.source),
	};
}

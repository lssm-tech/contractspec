import type {
	BuilderChannelType,
	BuilderDirectiveCandidate,
	BuilderDirectiveType,
	BuilderSourceType,
	BuilderTargetArea,
	BuilderTranscriptSegment,
	BuilderTrustProfile,
	EvidenceReference,
	ExtractedAssetPart,
	RawAsset,
} from '@contractspec/lib.builder-spec';
import type { STTProvider } from '@contractspec/lib.voice';

export interface BuilderAssetUploadInput {
	workspaceId: string;
	conversationId?: string;
	sourceType: BuilderSourceType;
	channelType?: BuilderChannelType;
	title: string;
	filename?: string;
	mimeType: string;
	content: string;
	language?: string;
	policyClassification?: 'public' | 'internal' | 'confidential' | 'restricted';
	approvalState?: 'draft' | 'approved' | 'rejected' | 'superseded';
	originStudioArtifactId?: string;
	parentSourceId?: string;
	derivedFromSourceId?: string;
	storeRawAsset?: boolean;
	trustProfile?: BuilderTrustProfile;
	sourceMetadata?: Record<string, unknown>;
}

export interface BuilderChannelInboundEnvelope {
	workspaceId: string;
	conversationId: string;
	channelType: BuilderChannelType;
	eventType?: string;
	externalEventId?: string;
	externalConversationId: string;
	externalChannelId?: string;
	externalMessageId: string;
	participantBindingId?: string;
	externalIdentityRef?: string;
	externalUserId?: string;
	messageKind:
		| 'text'
		| 'voice'
		| 'button'
		| 'list_selection'
		| 'file'
		| 'system';
	text?: string;
	audioContentBase64?: string;
	language?: string;
	model?: string;
	sttProvider?: STTProvider;
	replyToExternalMessageId?: string;
	messageRevision?: number;
	supersedesMessageId?: string;
	interactiveSelection?: {
		selectionType: 'button' | 'list_selection' | 'callback' | 'status';
		selectionId: string;
		label?: string;
		payload?: Record<string, unknown>;
	};
	statusEvent?: {
		status: string;
		providerMessageId?: string;
		details?: Record<string, unknown>;
	};
	file?: Omit<
		BuilderAssetUploadInput,
		'workspaceId' | 'conversationId' | 'title'
	> & {
		title: string;
	};
	deletedAt?: string;
	editedAt?: string;
	outboundTag?: string;
	trustProfile?: BuilderTrustProfile;
	metadata?: Record<string, unknown>;
}

export interface BuilderVoiceTranscriptionInput {
	workspaceId: string;
	sourceId: string;
	audioContentBase64: string;
	retainAudio?: boolean;
	approvedLocales?: string[];
	participantBindingId?: string;
	filename?: string;
	mimeType?: string;
	policyClassification?: 'public' | 'internal' | 'confidential' | 'restricted';
	conversationId?: string;
	channelType?: BuilderChannelType;
	language?: string;
	model?: string;
	sttProvider?: STTProvider;
}

export interface BuilderDirectiveHeuristic {
	directiveType: BuilderDirectiveType;
	targetArea: BuilderTargetArea;
}

export interface BuilderExtractionResult {
	rawAsset?: RawAsset;
	parts: ExtractedAssetPart[];
	evidenceReferences: EvidenceReference[];
	transcripts: BuilderTranscriptSegment[];
	directives: BuilderDirectiveCandidate[];
}

export interface BuilderPdfExtractor {
	extract(
		buffer: Uint8Array
	): Promise<Array<{ content: string; page?: number; confidence: number }>>;
}

export interface BuilderImageOcrExtractor {
	extract(
		buffer: Uint8Array,
		language?: string
	): Promise<{ content: string; confidence: number }>;
}

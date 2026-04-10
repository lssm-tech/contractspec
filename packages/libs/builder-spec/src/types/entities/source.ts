import type {
	ProviderKind,
	RiskLevel,
	RuntimeMode,
} from '@contractspec/lib.provider-spec';
import type {
	BuilderChannelType,
	BuilderDirectiveStatus,
	BuilderDirectiveType,
	BuilderMessageDirection,
	BuilderMessageKind,
	BuilderPolicyClassification,
	BuilderSourceApprovalState,
	BuilderSourceType,
	BuilderTargetArea,
	BuilderTranscriptStatus,
} from '../enums';
import type { BuilderTrustProfile } from './workspace';

export interface BuilderSourceProvenance {
	sourceId: string;
	sourceType: BuilderSourceType;
	channelType?: BuilderChannelType;
	channelEventType?: string;
	externalEventId?: string;
	externalConversationId?: string;
	externalChannelId?: string;
	externalUserId?: string;
	externalMessageId?: string;
	replyToExternalMessageId?: string;
	editVersion?: number;
	originWorkspaceId?: string;
	originStudioArtifactId?: string;
	parentSourceId?: string;
	derivedFromSourceId?: string;
	filename?: string;
	page?: number;
	sectionPath?: string[];
	zipPath?: string;
	speakerRole?: string;
	language?: string;
	providerId?: string;
	providerKind?: ProviderKind;
	modelId?: string;
	runtimeTargetRef?: string;
	contextHash?: string;
	outputArtifactHashes?: string[];
	capturedAt: string;
	extractorType: string;
	transcriptionModel?: string;
	confidence: number;
	hash: string;
	policyClassification: BuilderPolicyClassification;
}

export interface BuilderSourceRecord {
	id: string;
	workspaceId: string;
	conversationId?: string;
	sourceType: BuilderSourceType;
	channelType?: BuilderChannelType;
	title: string;
	provenance: BuilderSourceProvenance;
	policyClassification: BuilderPolicyClassification;
	approvalState: BuilderSourceApprovalState;
	hash: string;
	runtimeScope?: RuntimeMode;
	parentSourceId?: string;
	derivedFromSourceId?: string;
	supersedesSourceId?: string;
	rawAssetId?: string;
	evidenceReferenceIds?: string[];
	trustProfile?: BuilderTrustProfile;
	deletedAt?: string;
	createdAt: string;
	updatedAt: string;
}

export interface RawAsset {
	id: string;
	workspaceId: string;
	sourceId: string;
	filename?: string;
	mimeType: string;
	sizeBytes: number;
	contentBase64?: string;
	storageRef?: string;
	policyClassification: BuilderPolicyClassification;
	createdAt: string;
}

export interface ExtractedAssetPart {
	id: string;
	workspaceId: string;
	sourceId: string;
	rawAssetId?: string;
	partType: 'text' | 'table' | 'image' | 'ocr' | 'metadata';
	content: string;
	confidence: number;
	location: {
		page?: number;
		sectionPath?: string[];
		zipPath?: string;
		bounds?: { x: number; y: number; width: number; height: number };
	};
	extractorType: string;
	createdAt: string;
}

export interface EvidenceReference {
	id: string;
	workspaceId: string;
	sourceId: string;
	partId?: string;
	kind: 'source' | 'part' | 'transcript' | 'message' | 'decision' | 'harness';
	label: string;
	uri?: string;
	confidence: number;
}

export interface BuilderChannelMessage {
	id: string;
	workspaceId: string;
	conversationId: string;
	channelType: BuilderChannelType;
	direction: BuilderMessageDirection;
	eventType?: string;
	externalEventId?: string;
	externalConversationId: string;
	externalChannelId?: string;
	externalMessageId: string;
	externalUserId?: string;
	participantBindingId?: string;
	messageKind: BuilderMessageKind;
	contentRef: string;
	directiveCandidates: string[];
	attachmentSourceIds?: string[];
	replyToExternalMessageId?: string;
	messageRevision?: number;
	supersedesMessageId?: string;
	interactiveSelection?: {
		selectionType: 'button' | 'list_selection' | 'callback' | 'status';
		selectionId: string;
		label?: string;
		payload?: Record<string, unknown>;
	};
	outboundTag?: string;
	trustProfile?: BuilderTrustProfile;
	receivedAt: string;
	editedAt?: string;
	deletedAt?: string;
}

export interface BuilderTranscriptSegment {
	id: string;
	workspaceId: string;
	sourceId: string;
	conversationId?: string;
	channelType?: BuilderChannelType;
	speakerRef?: string;
	startMs: number;
	endMs: number;
	language: string;
	text: string;
	confidence: number;
	transcriptionModel: string;
	requiresConfirmation: boolean;
	status: BuilderTranscriptStatus;
	trustProfile?: BuilderTrustProfile;
}

export interface BuilderDirectiveCandidate {
	id: string;
	workspaceId: string;
	sourceIds: string[];
	directiveType: BuilderDirectiveType;
	statement: string;
	targetArea: BuilderTargetArea;
	confidence: number;
	requiresReview: boolean;
	status: BuilderDirectiveStatus;
	supportingEvidenceRefs?: string[];
	conflictingSourceIds?: string[];
	proposedByMessageId?: string;
	riskLevel?: RiskLevel;
	approvalTicketId?: string;
	trustProfile?: BuilderTrustProfile;
	createdAt: string;
	updatedAt: string;
}

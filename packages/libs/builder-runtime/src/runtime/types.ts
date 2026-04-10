import type {
	BuilderChannelType,
	BuilderMobileReviewCard,
} from '@contractspec/lib.builder-spec';
import type { BuilderIngestionService } from '../ingestion';
import type { BuilderStore } from '../stores/store';

export interface BuilderOutboundBridge {
	send(input: {
		workspaceId: string;
		channelType: 'telegram' | 'whatsapp' | 'web_chat';
		text: string;
		externalThreadId: string;
		externalChannelId?: string;
	}): Promise<{ status: 'queued'; dispatchId?: string }>;
}

export interface BuilderReviewUrlInput {
	workspaceId: string;
	cardId: string;
	channelType: BuilderChannelType;
	subjectType: BuilderMobileReviewCard['subjectType'];
	subjectId: string;
}

export interface BuilderRuntimeServiceOptions {
	now?: () => Date;
	outboundBridge?: BuilderOutboundBridge;
	createReviewUrl?: (input: BuilderReviewUrlInput) => string | undefined;
	approvedVoiceLocales?: string[];
	retainRawAudioPolicy?: 'disabled' | 'tenant-configurable' | 'always';
}

export interface BuilderOperationInput {
	workspaceId?: string;
	entityId?: string;
	conversationId?: string;
	payload?: Record<string, unknown>;
}

export interface BuilderRuntimeDependencies {
	store: BuilderStore;
	ingestion: BuilderIngestionService;
	now: () => Date;
	options: BuilderRuntimeServiceOptions;
}

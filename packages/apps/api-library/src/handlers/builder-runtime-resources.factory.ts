import { PostgresBuilderStore } from '@contractspec/integration.runtime';
import type { ChannelOutboxActionRecord } from '@contractspec/integration.runtime/channel';
import {
	type BuilderOutboundBridge,
	BuilderRuntimeService,
	type BuilderStore,
	InMemoryBuilderStore,
} from '@contractspec/lib.builder-runtime';
import { Pool } from 'pg';
import { resolveMessagingSender } from './channel-sender-resolver';

function createBuilderId(prefix: string): string {
	return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function getBuilderReviewBaseUrl(): string | null {
	return (
		process.env.CONTRACTSPEC_WEB_BASE_URL ??
		process.env.NEXT_PUBLIC_CONTRACTSPEC_WEB_BASE_URL ??
		process.env.CONTRACTSPEC_PUBLIC_BASE_URL ??
		null
	);
}

export interface BuilderRuntimeResources {
	store: BuilderStore;
	service: BuilderRuntimeService;
	initializePromise: Promise<void>;
}

function resolveProviderKey(
	channelType: 'telegram' | 'whatsapp' | 'web_chat'
): string {
	switch (channelType) {
		case 'telegram':
			return 'messaging.telegram';
		case 'whatsapp':
			return process.env.BUILDER_WHATSAPP_PROVIDER === 'twilio'
				? 'messaging.whatsapp.twilio'
				: 'messaging.whatsapp.meta';
		default:
			throw new Error(
				'Web chat outbound dispatch is not supported by the messaging transport bridge.'
			);
	}
}

function createOutboundBridge(): BuilderOutboundBridge {
	return {
		async send(input: {
			workspaceId: string;
			channelType: 'telegram' | 'whatsapp' | 'web_chat';
			text: string;
			externalThreadId: string;
			externalChannelId?: string;
		}) {
			const providerKey = resolveProviderKey(input.channelType);
			const sender = await resolveMessagingSender(providerKey);
			if (!sender) {
				throw new Error(
					`No messaging sender is configured for ${providerKey}.`
				);
			}
			const action: ChannelOutboxActionRecord = {
				id: createBuilderId('builder_dispatch'),
				workspaceId: input.workspaceId,
				providerKey,
				decisionId: createBuilderId('builder_decision'),
				threadId: input.externalThreadId,
				actionType: 'builder.change_card',
				idempotencyKey: createBuilderId('builder_outbox'),
				target: {
					externalThreadId: input.externalThreadId,
					externalChannelId: input.externalChannelId,
				},
				payload: {
					text: input.text,
				},
				status: 'pending',
				attemptCount: 0,
				nextAttemptAt: new Date(),
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			const result = await sender.send(action);
			return {
				status: 'queued',
				dispatchId: result.providerMessageId ?? action.id,
			};
		},
	};
}

export async function createBuilderRuntimeResources(): Promise<BuilderRuntimeResources> {
	const storageMode =
		process.env.BUILDER_RUNTIME_STORAGE === 'memory' ? 'memory' : 'postgres';
	const databaseUrl =
		process.env.BUILDER_RUNTIME_DATABASE_URL ??
		process.env.CHANNEL_RUNTIME_DATABASE_URL ??
		process.env.DATABASE_URL;
	if (storageMode !== 'memory' && !databaseUrl) {
		throw new Error(
			'BUILDER_RUNTIME_DATABASE_URL (or CHANNEL_RUNTIME_DATABASE_URL / DATABASE_URL) must be set for Builder runtime.'
		);
	}

	const store =
		storageMode === 'memory'
			? new InMemoryBuilderStore()
			: new PostgresBuilderStore(
					new Pool({
						connectionString: databaseUrl,
						max: 5,
					})
				);

	const initializePromise =
		store instanceof PostgresBuilderStore
			? store.initializeSchema()
			: Promise.resolve();

	const service = new BuilderRuntimeService(store, {
		outboundBridge: createOutboundBridge(),
		createReviewUrl(input) {
			const baseUrl = getBuilderReviewBaseUrl();
			if (!baseUrl) {
				return `/operate/builder/workspaces/${encodeURIComponent(input.workspaceId)}/mobile-review/${encodeURIComponent(input.cardId)}`;
			}
			const reviewUrl = new URL(
				`/operate/builder/workspaces/${encodeURIComponent(input.workspaceId)}/mobile-review/${encodeURIComponent(input.cardId)}`,
				baseUrl
			);
			return reviewUrl.toString();
		},
	});

	await initializePromise;
	return {
		store,
		service,
		initializePromise,
	};
}

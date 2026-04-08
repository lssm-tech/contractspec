import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';

const mockSend = mock(async () => ({
	providerMessageId: 'provider-message-1',
}));

mock.module('./channel-sender-resolver', () => ({
	resolveMessagingSender: mock(async () => ({
		send: mockSend,
	})),
}));

import { Elysia } from 'elysia';
import { builderControlPlaneHandler } from './builder-control-plane-handler';
import {
	getBuilderRuntimeStoreForTests,
	resetBuilderRuntimeResourcesForTests,
} from './builder-runtime-resources';

const app = new Elysia().use(builderControlPlaneHandler);

const TEST_ENV_KEYS = [
	'BUILDER_RUNTIME_STORAGE',
	'CONTROL_PLANE_API_TOKEN',
	'CONTROL_PLANE_API_CAPABILITY_GRANTS',
	'CONTRACTSPEC_WEB_BASE_URL',
] as const;

beforeEach(() => {
	resetBuilderRuntimeResourcesForTests();
	mockSend.mockClear();
	for (const key of TEST_ENV_KEYS) {
		Reflect.deleteProperty(process.env, key);
	}
	process.env.BUILDER_RUNTIME_STORAGE = 'memory';
	process.env.CONTROL_PLANE_API_TOKEN = 'builder-token';
	process.env.CONTROL_PLANE_API_CAPABILITY_GRANTS = 'builder.export.prepare';
	process.env.CONTRACTSPEC_WEB_BASE_URL = 'https://studio.contractspec.test';
});

afterEach(() => {
	resetBuilderRuntimeResourcesForTests();
	for (const key of TEST_ENV_KEYS) {
		Reflect.deleteProperty(process.env, key);
	}
});

describe('builder review card handler', () => {
	it('dispatches Builder review cards through the API runtime outbound bridge', async () => {
		await app.handle(
			new Request(
				'http://localhost/internal/builder/commands/builder.workspace.create',
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer builder-token',
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						workspaceId: 'builder_ws_review',
						payload: {
							tenantId: 'tenant_1',
							name: 'Review Workspace',
						},
					}),
				}
			)
		);
		await app.handle(
			new Request(
				'http://localhost/internal/builder/commands/builder.conversation.start',
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer builder-token',
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						workspaceId: 'builder_ws_review',
						entityId: 'conversation_1',
						payload: {
							mode: 'mixed',
							boundChannelIds: ['telegram'],
						},
					}),
				}
			)
		);
		await app.handle(
			new Request(
				'http://localhost/internal/builder/commands/builder.channel.receiveInbound',
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer builder-token',
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						workspaceId: 'builder_ws_review',
						conversationId: 'conversation_1',
						payload: {
							workspaceId: 'builder_ws_review',
							conversationId: 'conversation_1',
							channelType: 'telegram',
							externalConversationId: 'telegram-thread-1',
							externalChannelId: 'telegram-chat-1',
							externalMessageId: 'message_1',
							messageKind: 'text',
							text: 'Open the review lane.',
						},
					}),
				}
			)
		);

		const response = await app.handle(
			new Request(
				'http://localhost/internal/builder/commands/builder.mobileReviewCard.create',
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer builder-token',
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						workspaceId: 'builder_ws_review',
						entityId: 'card_1',
						payload: {
							channelType: 'telegram',
							subjectType: 'patch_proposal',
							subjectId: 'proposal_1',
							summary: 'Review the provider patch.',
							riskLevel: 'high',
						},
					}),
				}
			)
		);

		expect(response.status).toBe(200);
		expect(mockSend).toHaveBeenCalledTimes(1);
		const store = getBuilderRuntimeStoreForTests();
		const cards = await store?.listMobileReviewCards('builder_ws_review');
		const messages = await store?.listChannelMessages('conversation_1');

		expect(
			cards?.[0]?.actions.find((action) => action.id === 'open_details')
				?.deepLinkHref
		).toBe(
			'https://studio.contractspec.test/operate/builder/workspaces/builder_ws_review/mobile-review/card_1'
		);
		expect(
			messages?.some(
				(message) =>
					message.direction === 'outbound' &&
					message.contentRef.includes('https://studio.contractspec.test')
			)
		).toBe(true);
	});

	it('falls back to the dedicated mobile review route when no public web base url is configured', async () => {
		Reflect.deleteProperty(process.env, 'CONTRACTSPEC_WEB_BASE_URL');

		await app.handle(
			new Request(
				'http://localhost/internal/builder/commands/builder.workspace.create',
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer builder-token',
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						workspaceId: 'builder_ws_review_relative',
						payload: {
							tenantId: 'tenant_1',
							name: 'Review Workspace Relative',
						},
					}),
				}
			)
		);

		const response = await app.handle(
			new Request(
				'http://localhost/internal/builder/commands/builder.mobileReviewCard.create',
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer builder-token',
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						workspaceId: 'builder_ws_review_relative',
						entityId: 'card_relative',
						payload: {
							channelType: 'mobile_web',
							subjectType: 'patch_proposal',
							subjectId: 'proposal_relative',
							summary: 'Review the route fallback.',
							riskLevel: 'medium',
						},
					}),
				}
			)
		);

		expect(response.status).toBe(200);
		const store = getBuilderRuntimeStoreForTests();
		const cards = await store?.listMobileReviewCards(
			'builder_ws_review_relative'
		);

		expect(
			cards?.[0]?.actions.find((action) => action.id === 'open_details')
				?.deepLinkHref
		).toBe(
			'/operate/builder/workspaces/builder_ws_review_relative/mobile-review/card_relative'
		);
	});
});

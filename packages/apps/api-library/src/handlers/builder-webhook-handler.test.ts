import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import {
	getBuilderRuntimeResources,
	getBuilderRuntimeStoreForTests,
	resetBuilderRuntimeResourcesForTests,
} from './builder-runtime-resources';
import { telegramWebhookHandler } from './telegram-webhook-handler';

const app = new Elysia().use(telegramWebhookHandler);

const TEST_ENV_KEYS = [
	'BUILDER_RUNTIME_STORAGE',
	'BUILDER_WORKSPACE_MAP_TELEGRAM',
	'TELEGRAM_WEBHOOK_SECRET_TOKEN',
] as const;

beforeEach(() => {
	resetBuilderRuntimeResourcesForTests();
	for (const key of TEST_ENV_KEYS) {
		Reflect.deleteProperty(process.env, key);
	}
	process.env.BUILDER_RUNTIME_STORAGE = 'memory';
	process.env.BUILDER_WORKSPACE_MAP_TELEGRAM = JSON.stringify({
		'123': 'builder_ws_tg',
	});
	process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN = 'telegram-secret';
});

afterEach(() => {
	resetBuilderRuntimeResourcesForTests();
	for (const key of TEST_ENV_KEYS) {
		Reflect.deleteProperty(process.env, key);
	}
});

describe('builder telegram webhook routing', () => {
	it('routes mapped Builder Telegram events into Builder ingestion', async () => {
		const runtime = await getBuilderRuntimeResources();
		await runtime.service.executeCommand('builder.workspace.create', {
			workspaceId: 'builder_ws_tg',
			payload: {
				tenantId: 'tenant_1',
				name: 'Builder Telegram Workspace',
				ownerIds: ['owner_1'],
			},
		});
		await runtime.service.executeCommand('builder.participantBinding.bind', {
			workspaceId: 'builder_ws_tg',
			entityId: 'binding_1',
			payload: {
				participantId: 'owner_1',
				workspaceRole: 'owner',
				channelType: 'telegram',
				externalIdentityRef: '123',
				identityAssurance: 'high',
				channelBindingStrength: 'high',
				messageAuthenticity: 'high',
				approvalStrength: 'admin_signed',
				allowedActions: ['builder.blueprint.patch'],
			},
		});

		const response = await app.handle(
			new Request('http://localhost/webhooks/telegram/events', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					'x-telegram-bot-api-secret-token': 'telegram-secret',
				},
				body: JSON.stringify({
					update_id: 1,
					message: {
						message_id: 2,
						text: 'Add a manager approval screen',
						chat: { id: 123 },
					},
				}),
			})
		);

		expect(response.status).toBe(200);
		const json = (await response.json()) as { ok: boolean; status: string };
		expect(json.ok).toBe(true);
		expect(json.status).toBe('accepted');

		const store = getBuilderRuntimeStoreForTests();
		const messages = await store?.listChannelMessages('builder_tg_123');
		expect(messages?.length).toBe(1);
		expect(messages?.[0]?.channelType).toBe('telegram');
		expect(messages?.[0]?.participantBindingId).toBe('binding_1');
	});
});

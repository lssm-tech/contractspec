import { appLogger } from '@contractspec/bundle.library/infrastructure/elysia/logger';

import {
	normalizeTelegramInboundEvent,
	parseTelegramWebhookPayload,
	type TelegramWebhookPayload,
	verifyTelegramWebhookSecret,
} from '@contractspec/integration.runtime/channel';
import { Elysia } from 'elysia';
import { getChannelRuntimeResources } from './channel-runtime-resources';
import { resolveTelegramWorkspaceId } from './channel-workspace-resolver';

export const telegramWebhookHandler = new Elysia().post(
	'/webhooks/telegram/events',
	async ({ request, set }) => {
		const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN;
		if (!secretToken) {
			set.status = 503;
			return {
				ok: false,
				error: 'telegram_webhook_not_configured',
			};
		}

		const rawBody = await request.text();
		const verificationResult = verifyTelegramWebhookSecret({
			expectedSecretToken: secretToken,
			secretTokenHeader: request.headers.get('x-telegram-bot-api-secret-token'),
		});

		if (!verificationResult.valid) {
			set.status = 401;
			return {
				ok: false,
				error: 'invalid_signature',
				reason: verificationResult.reason,
			};
		}

		let payload: TelegramWebhookPayload;
		try {
			payload = parseTelegramWebhookPayload(rawBody);
		} catch (error) {
			set.status = 400;
			return {
				ok: false,
				error: 'invalid_payload',
				message: error instanceof Error ? error.message : String(error),
			};
		}

		const workspaceId = resolveTelegramWorkspaceId([
			String(
				payload.message?.chat?.id ??
					payload.edited_message?.chat?.id ??
					payload.channel_post?.chat?.id ??
					payload.edited_channel_post?.chat?.id ??
					''
			),
			payload.message?.chat?.username ??
				payload.edited_message?.chat?.username ??
				payload.channel_post?.chat?.username ??
				payload.edited_channel_post?.chat?.username ??
				'',
		]);
		if (!workspaceId) {
			set.status = 403;
			return {
				ok: false,
				error: 'workspace_not_mapped',
			};
		}

		const event = normalizeTelegramInboundEvent({
			workspaceId,
			payload,
			signatureValid: true,
			traceId: request.headers.get('x-request-id') ?? undefined,
			rawBody,
		});

		if (!event) {
			return {
				ok: true,
				ignored: true,
			};
		}

		try {
			const runtime = await getChannelRuntimeResources();
			const result = await runtime.service.ingest(event);
			return {
				ok: true,
				status: result.status,
				receiptId: result.receiptId,
			};
		} catch (error) {
			appLogger.error('Telegram webhook processing failed', {
				error: error instanceof Error ? error.message : String(error),
				eventId: event.externalEventId,
			});
			set.status = 500;
			return {
				ok: false,
				error: 'webhook_processing_failed',
			};
		}
	}
);

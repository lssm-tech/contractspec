import { describe, expect, it } from "bun:test";

import {
	normalizeTelegramInboundEvent,
	parseTelegramWebhookPayload,
	verifyTelegramWebhookSecret,
} from "./telegram";

describe("telegram channel helpers", () => {
	it("verifies the webhook secret header", () => {
		expect(
			verifyTelegramWebhookSecret({
				expectedSecretToken: "telegram-secret",
				secretTokenHeader: "telegram-secret",
			})
		).toEqual({ valid: true });

		expect(
			verifyTelegramWebhookSecret({
				expectedSecretToken: "telegram-secret",
				secretTokenHeader: "wrong-secret",
			})
		).toEqual({
			valid: false,
			reason: "secret_length_mismatch",
		});
	});

	it("parses and normalizes inbound text messages", () => {
		const rawBody = JSON.stringify({
			update_id: 1001,
			message: {
				message_id: 55,
				date: 1_742_000_000,
				text: "status messaging",
				chat: {
					id: -1001234567890,
					type: "supergroup",
					username: "contractspec_demo",
				},
				from: {
					id: 123456,
					username: "tboutron",
				},
			},
		});
		const payload = parseTelegramWebhookPayload(rawBody);
		const event = normalizeTelegramInboundEvent({
			workspaceId: "workspace-telegram",
			payload,
			signatureValid: true,
			traceId: "trace-telegram",
			rawBody,
		});

		expect(event?.providerKey).toBe("messaging.telegram");
		expect(event?.thread.externalChannelId).toBe("-1001234567890");
		expect(event?.thread.externalThreadId).toBe("-1001234567890");
		expect(event?.message?.text).toBe("status messaging");
		expect(event?.metadata?.chatUsername).toBe("contractspec_demo");
	});
});

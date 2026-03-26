import { describe, expect, it } from 'bun:test';

import {
	normalizeGithubInboundEvent,
	parseGithubWebhookPayload,
} from './github';
import { normalizeSlackInboundEvent, parseSlackWebhookPayload } from './slack';
import type { ChannelInboundEvent } from './types';
import {
	normalizeMetaWhatsappInboundEvents,
	parseMetaWebhookPayload,
} from './whatsapp-meta';
import {
	normalizeTwilioWhatsappInboundEvent,
	parseTwilioFormPayload,
} from './whatsapp-twilio';

describe('channel adapter conformance', () => {
	it('normalizes supported channel events into a common runtime shape', () => {
		const slack = normalizeSlackInboundEvent({
			workspaceId: 'workspace-1',
			payload: parseSlackWebhookPayload(
				JSON.stringify({
					type: 'event_callback',
					event_id: 'Ev123',
					event_time: 1730000100,
					event: {
						type: 'message',
						user: 'U123',
						text: 'hello',
						ts: '1730000100.000001',
						channel: 'C123',
					},
				})
			),
			signatureValid: true,
			traceId: 'trace-slack',
			rawBody: 'slack-raw',
		});
		const github = normalizeGithubInboundEvent({
			workspaceId: 'workspace-1',
			payload: parseGithubWebhookPayload(
				JSON.stringify({
					action: 'created',
					repository: { name: 'contractspec', owner: { login: 'lssm-tech' } },
					issue: { number: 42 },
					comment: {
						id: 2001,
						body: 'Please review this update',
						created_at: '2026-03-22T10:00:00.000Z',
					},
					sender: { login: 'tboutron' },
				})
			),
			deliveryId: 'delivery-1',
			eventName: 'issue_comment',
			signatureValid: true,
			traceId: 'trace-github',
			rawBody: 'github-raw',
		});
		const meta = normalizeMetaWhatsappInboundEvents({
			workspaceId: 'workspace-1',
			payload: parseMetaWebhookPayload(
				JSON.stringify({
					entry: [
						{
							changes: [
								{
									value: {
										metadata: { phone_number_id: 'phone-1' },
										messages: [
											{
												id: 'wamid.1',
												from: '15551234567',
												timestamp: '1730000200',
												type: 'text',
												text: { body: 'Hello there' },
											},
										],
									},
								},
							],
						},
					],
				})
			),
			signatureValid: true,
			traceId: 'trace-meta',
			rawBody: 'meta-raw',
		})[0];
		const twilio = normalizeTwilioWhatsappInboundEvent({
			workspaceId: 'workspace-1',
			formBody: parseTwilioFormPayload(
				'MessageSid=SM123&From=whatsapp%3A%2B15550001&To=whatsapp%3A%2B15550002&Body=Need+help&AccountSid=AC123&Timestamp=1730000300'
			),
			signatureValid: true,
			traceId: 'trace-twilio',
			rawBody: 'twilio-raw',
		});

		for (const event of [slack, github, meta, twilio]) {
			assertConformantEvent(event);
		}
	});

	it('rejects malformed payloads across adapters', () => {
		expect(
			normalizeGithubInboundEvent({
				workspaceId: 'workspace-1',
				payload: parseGithubWebhookPayload(
					JSON.stringify({ action: 'created' })
				),
				deliveryId: 'delivery-1',
				eventName: 'issue_comment',
				signatureValid: true,
			})
		).toBeNull();

		expect(
			normalizeSlackInboundEvent({
				workspaceId: 'workspace-1',
				payload: parseSlackWebhookPayload(
					JSON.stringify({
						type: 'event_callback',
						event_id: 'Ev-invalid',
						event_time: 'bad',
						event: {
							type: 'message',
							user: 'U123',
							text: 'hello',
							ts: '1730000100.000001',
							channel: 'C123',
						},
					})
				),
				signatureValid: true,
			})
		).toBeNull();

		expect(
			normalizeTwilioWhatsappInboundEvent({
				workspaceId: 'workspace-1',
				formBody: parseTwilioFormPayload(
					'MessageSid=SM123&From=whatsapp%3A%2B15550001'
				),
				signatureValid: true,
			})
		).toBeNull();

		expect(
			normalizeGithubInboundEvent({
				workspaceId: 'workspace-1',
				payload: parseGithubWebhookPayload(
					JSON.stringify({
						action: 'created',
						repository: { name: 'contractspec', owner: { login: 'lssm-tech' } },
						issue: { number: 42 },
						comment: {
							id: 2001,
							body: 'Please review',
							created_at: 'invalid-date',
						},
						sender: { login: 'tboutron' },
					})
				),
				deliveryId: 'delivery-1',
				eventName: 'issue_comment',
				signatureValid: true,
			})
		).toBeNull();

		expect(
			normalizeTwilioWhatsappInboundEvent({
				workspaceId: 'workspace-1',
				formBody: parseTwilioFormPayload(
					'MessageSid=SM123&From=whatsapp%3A%2B15550001&Body=Need+help&Timestamp=bad'
				),
				signatureValid: true,
			})
		).toBeNull();

		expect(
			normalizeMetaWhatsappInboundEvents({
				workspaceId: 'workspace-1',
				payload: parseMetaWebhookPayload(
					JSON.stringify({
						entry: [
							{
								changes: [
									{
										value: {
											messages: [
												{
													id: 'wamid.1',
													from: '15551234567',
													timestamp: 'bad',
													text: { body: 'hello' },
												},
											],
										},
									},
								],
							},
						],
					})
				),
				signatureValid: true,
			})
		).toHaveLength(0);
	});
});

function assertConformantEvent(
	event: ChannelInboundEvent | null | undefined
): void {
	expect(event).not.toBeNull();
	expect(event?.workspaceId).toBe('workspace-1');
	expect(event?.providerKey).toMatch(/^messaging\./);
	expect(event?.eventType.length).toBeGreaterThan(0);
	expect(event?.externalEventId.length).toBeGreaterThan(0);
	expect(event?.signatureValid).toBe(true);
	expect(event?.traceId?.startsWith('trace-')).toBe(true);
	expect(event?.thread.externalThreadId.length).toBeGreaterThan(0);
	expect(event?.thread.externalUserId?.length).toBeGreaterThan(0);
	expect(Number.isNaN(event?.occurredAt.getTime() ?? Number.NaN)).toBe(false);
	expect(event?.message?.text.length).toBeGreaterThan(0);
	expect(event?.rawPayload?.length).toBeGreaterThan(0);
	for (const value of Object.values(event?.metadata ?? {})) {
		expect(typeof value).toBe('string');
	}
}

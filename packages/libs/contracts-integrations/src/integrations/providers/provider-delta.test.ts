import { describe, expect, it } from 'bun:test';
import {
	isProviderDeltaTombstoned,
	type ProviderDeltaSyncState,
} from './provider-delta';

describe('provider delta contracts', () => {
	it('models lease, cursor, webhook, replay, dedupe, idempotency, and tombstone state', () => {
		const delta = {
			lease: {
				holder: 'worker-a',
				acquiredAt: '2026-04-30T12:00:00.000Z',
				expiresAt: '2026-04-30T12:05:00.000Z',
				renewalWindowMs: 60_000,
			},
			cursor: {
				cursorId: 'gmail-history',
				cursor: 'history-123',
				watermark: '2026-04-30T12:00:00.000Z',
				watermarkVersion: 'history-v1',
			},
			webhookChannel: {
				channelId: 'channel-1',
				resourceId: 'resource-1',
				resourceUri: 'gmail/users/me/watch',
				expiresAt: '2026-04-30T13:00:00.000Z',
			},
			providerEventId: 'event-1',
			dedupeKey: 'gmail:event-1',
			idempotencyKey: 'tenant:gmail:event-1',
			replayCheckpoint: {
				checkpointId: 'checkpoint-1',
				sequence: '42',
				createdAt: '2026-04-30T12:00:00.000Z',
			},
			tombstone: {
				deletedAt: '2026-04-30T12:01:00.000Z',
				reason: 'provider_delete',
				providerRevision: 'rev-2',
			},
		} satisfies ProviderDeltaSyncState;

		expect(delta.lease.holder).toBe('worker-a');
		expect(delta.cursor.watermarkVersion).toBe('history-v1');
		expect(delta.webhookChannel.channelId).toBe('channel-1');
		expect(delta.providerEventId).toBe('event-1');
		expect(delta.dedupeKey).toBe('gmail:event-1');
		expect(delta.idempotencyKey).toBe('tenant:gmail:event-1');
		expect(delta.replayCheckpoint.checkpointId).toBe('checkpoint-1');
		expect(isProviderDeltaTombstoned(delta)).toBe(true);
	});
});

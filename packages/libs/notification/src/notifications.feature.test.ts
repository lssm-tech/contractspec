import { describe, expect, it } from 'bun:test';
import { NotificationsFeature } from './notifications.feature';

describe('NotificationsFeature', () => {
	it('re-exports the canonical library-first feature metadata', () => {
		expect(NotificationsFeature.meta.key).toBe('libs.notifications');
	});
});

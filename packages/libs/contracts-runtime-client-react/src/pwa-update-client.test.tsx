import { describe, expect, it } from 'bun:test';
import {
	isPwaUpdateBlocking,
	shouldPromptForPwaUpdate,
} from './pwa-update-client';

describe('PWA update client helpers', () => {
	it('identifies blocking update state', () => {
		expect(
			isPwaUpdateBlocking({
				appId: 'portal',
				currentVersion: '1.0.0',
				latestVersion: '1.2.0',
				updateAvailable: true,
				update: 'required',
				blocking: true,
				policy: { mode: 'required' },
				checkedAt: '2026-04-29T00:00:00.000Z',
			})
		).toBe(true);
	});

	it('does not prompt when offline checks return no update state', () => {
		expect(shouldPromptForPwaUpdate(null)).toBe(false);
		expect(
			shouldPromptForPwaUpdate({
				appId: 'portal',
				currentVersion: '1.2.0',
				latestVersion: '1.2.0',
				updateAvailable: false,
				update: 'none',
				blocking: false,
				policy: { mode: 'optional' },
				checkedAt: '2026-04-29T00:00:00.000Z',
			})
		).toBe(false);
	});
});
